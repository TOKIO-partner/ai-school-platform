from django.contrib.auth.models import AbstractUser
from django.db import models
from core.models import TimestampedModel


class Organization(TimestampedModel):
    """Corporate organization."""
    PLAN_CHOICES = [
        ('business', 'Business'),
        ('enterprise', 'Enterprise'),
    ]

    name = models.CharField(max_length=255)
    plan = models.CharField(max_length=20, choices=PLAN_CHOICES, default='business')
    max_seats = models.PositiveIntegerField(default=10)

    def __str__(self):
        return self.name


class User(AbstractUser):
    """Custom user model with role-based access."""
    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('corp_admin', 'Corp Admin'),
        ('instructor', 'Instructor'),
        ('student', 'Student'),
    ]
    PLAN_CHOICES = [
        ('free', 'Free'),
        ('pro', 'Pro'),
        ('business', 'Business'),
    ]

    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='student')
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)
    organization = models.ForeignKey(
        Organization,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='members',
    )
    plan = models.CharField(max_length=20, choices=PLAN_CHOICES, default='free')
    bio = models.TextField(blank=True, default='')

    def __str__(self):
        return f'{self.get_full_name() or self.username} ({self.role})'

    @property
    def is_admin_user(self):
        return self.role == 'admin'

    @property
    def is_corp_admin(self):
        return self.role in ('admin', 'corp_admin')
