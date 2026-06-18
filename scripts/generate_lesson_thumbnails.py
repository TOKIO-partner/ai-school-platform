#!/usr/bin/env python3
"""Generate lesson thumbnails and store them in Cloudflare R2.

For every lesson:
  - if `lesson_<id>.mp4` exists in the R2 videos bucket, extract a frame with
    ffmpeg (seek 8s, fallback 1s) straight from the public video URL (HTTP
    range, no full download);
  - otherwise, if the video_url is a Google Drive link, download Drive's
    auto-generated thumbnail.
The image is uploaded to the R2 media bucket as `thumbnails/lesson_<id>.jpg`
and `Lesson.thumbnail` is set to the public URL.

Requires: ffmpeg on PATH, `pip install boto3 psycopg2-binary`.
All config comes from environment variables (no secrets in source):

  DATABASE_URL              postgres connection string
  R2_ENDPOINT_URL           https://<account>.r2.cloudflarestorage.com
  R2_ACCESS_KEY_ID          R2 S3 access key
  R2_SECRET_ACCESS_KEY      R2 S3 secret
  R2_VIDEOS_BUCKET          bucket holding lesson_<id>.mp4  (default momocri-videos)
  R2_VIDEOS_PUBLIC_URL      public base URL of the videos bucket (pub-*.r2.dev)
  R2_MEDIA_BUCKET           bucket to store thumbnails       (default momocri-media)
  R2_MEDIA_PUBLIC_URL       public base URL of the media bucket (pub-*.r2.dev)

Usage:
  python scripts/generate_lesson_thumbnails.py [--force] [--dry-run]
"""
import argparse
import os
import re
import subprocess
import sys
import tempfile
import urllib.request

import boto3
import psycopg2
from botocore.config import Config

DRIVE_RE = re.compile(r"/d/([^/]+)/")


def env(key, default=None):
    v = os.environ.get(key, default)
    if v is None:
        sys.exit(f"missing env var: {key}")
    return v


def ffmpeg_frame(src_url, out, seek):
    r = subprocess.run(
        ["ffmpeg", "-y", "-ss", seek, "-i", src_url, "-frames:v", "1",
         "-vf", "scale=1280:-2", "-q:v", "3", out],
        capture_output=True, timeout=180)
    return r.returncode == 0 and os.path.exists(out) and os.path.getsize(out) > 0


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--force", action="store_true", help="overwrite existing thumbnails")
    ap.add_argument("--dry-run", action="store_true", help="don't write to R2/DB")
    args = ap.parse_args()

    videos_bucket = os.environ.get("R2_VIDEOS_BUCKET", "momocri-videos")
    media_bucket = os.environ.get("R2_MEDIA_BUCKET", "momocri-media")
    videos_pub = env("R2_VIDEOS_PUBLIC_URL").rstrip("/")
    media_pub = env("R2_MEDIA_PUBLIC_URL").rstrip("/")

    s3 = boto3.client(
        "s3", endpoint_url=env("R2_ENDPOINT_URL"),
        aws_access_key_id=env("R2_ACCESS_KEY_ID"),
        aws_secret_access_key=env("R2_SECRET_ACCESS_KEY"),
        config=Config(signature_version="s3v4"), region_name="auto")

    vids = set()
    for pg in s3.get_paginator("list_objects_v2").paginate(Bucket=videos_bucket):
        vids |= {o["Key"] for o in pg.get("Contents", [])}

    db = psycopg2.connect(env("DATABASE_URL"), connect_timeout=20)
    cur = db.cursor()
    cur.execute("SELECT id, title, video_url, thumbnail FROM courses_lesson ORDER BY id")
    rows = cur.fetchall()

    ok = fail = skip = 0
    for lid, title, vurl, thumb in rows:
        if thumb and not args.force:
            skip += 1
            continue
        out = os.path.join(tempfile.gettempdir(), f"thumb_{lid}.jpg")
        src = None
        if f"lesson_{lid}.mp4" in vids:
            url = f"{videos_pub}/lesson_{lid}.mp4"
            if ffmpeg_frame(url, out, "00:00:08") or ffmpeg_frame(url, out, "00:00:01"):
                src = "ffmpeg"
        if src is None:
            m = DRIVE_RE.search(vurl or "")
            if m:
                try:
                    urllib.request.urlretrieve(
                        f"https://drive.google.com/thumbnail?id={m.group(1)}&sz=w1280", out)
                    if os.path.getsize(out) > 0:
                        src = "drive"
                except Exception as e:
                    print(f"  lesson {lid} drive dl fail: {e}", flush=True)
        if src is None:
            print(f"FAIL lesson {lid} \"{title}\"", flush=True)
            fail += 1
            continue
        key = f"thumbnails/lesson_{lid}.jpg"
        pub = f"{media_pub}/{key}"
        print(f"OK [{src}] lesson {lid} \"{title}\" -> {pub}", flush=True)
        if not args.dry_run:
            with open(out, "rb") as fh:
                s3.put_object(Bucket=media_bucket, Key=key, Body=fh,
                              ContentType="image/jpeg",
                              CacheControl="public, max-age=31536000")
            cur.execute("UPDATE courses_lesson SET thumbnail=%s WHERE id=%s", (pub, lid))
            db.commit()
        ok += 1

    print(f"\nDONE: ok={ok} fail={fail} skip={skip} of {len(rows)}"
          + (" (dry-run)" if args.dry_run else ""), flush=True)
    db.close()


if __name__ == "__main__":
    main()
