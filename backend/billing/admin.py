from django.contrib import admin
from .models import Subscription, Payment, RefundRequest


@admin.register(Subscription)
class SubscriptionAdmin(admin.ModelAdmin):
    list_display = ['user', 'plan', 'status', 'current_period_end']
    list_filter = ['plan', 'status']


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ['user', 'amount', 'plan', 'method', 'status', 'created_at']
    list_filter = ['status', 'plan', 'method']
    search_fields = ['user__username']


@admin.register(RefundRequest)
class RefundRequestAdmin(admin.ModelAdmin):
    list_display = ['payment', 'reason', 'status', 'created_at']
    list_filter = ['status']
