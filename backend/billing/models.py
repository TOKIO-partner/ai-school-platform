from django.db import models
from django.conf import settings
from core.models import TimestampedModel


class Subscription(TimestampedModel):
    """User subscription."""
    PLAN_CHOICES = [
        ('free', 'Free'),
        ('pro', 'Pro'),
        ('business', 'Business'),
    ]
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('canceled', 'Canceled'),
        ('past_due', 'Past Due'),
    ]

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='subscription',
    )
    plan = models.CharField(max_length=20, choices=PLAN_CHOICES, default='free')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    current_period_end = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.user.username} - {self.plan} ({self.status})'


class Payment(TimestampedModel):
    """Payment record."""
    STATUS_CHOICES = [
        ('success', 'Success'),
        ('failed', 'Failed'),
        ('refunded', 'Refunded'),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='payments',
    )
    amount = models.DecimalField(max_digits=10, decimal_places=0)
    plan = models.CharField(max_length=20)
    method = models.CharField(max_length=50, default='credit_card')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='success')

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.user.username} - ¥{self.amount} ({self.status})'


class RefundRequest(TimestampedModel):
    """Refund request for a payment."""
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]

    payment = models.ForeignKey(Payment, on_delete=models.CASCADE, related_name='refund_requests')
    reason = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'Refund for {self.payment} - {self.status}'
