from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("courses", "0002_add_transcript_to_lesson"),
    ]

    operations = [
        migrations.AddField(
            model_name="lesson",
            name="thumbnail",
            field=models.URLField(blank=True, default=""),
        ),
    ]
