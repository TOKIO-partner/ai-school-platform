from rest_framework import serializers
from .models import Subscription, Payment, RefundRequest


class SubscriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subscription
        fields = ['id', 'plan', 'status', 'current_period_end', 'created_at']


class PaymentSerializer(serializers.ModelSerializer):
    user_name = serializers.SerializerMethodField()
    user_email = serializers.EmailField(source='user.email', read_only=True)

    class Meta:
        model = Payment
        fields = ['id', 'user', 'user_name', 'user_email', 'amount', 'plan',
                  'method', 'status', 'created_at']

    def get_user_name(self, obj):
        return obj.user.get_full_name() or obj.user.username


class RefundRequestSerializer(serializers.ModelSerializer):
    payment = PaymentSerializer(read_only=True)

    class Meta:
        model = RefundRequest
        fields = ['id', 'payment', 'reason', 'status', 'created_at']
