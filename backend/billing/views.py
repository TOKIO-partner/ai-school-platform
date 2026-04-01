from rest_framework import generics
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Sum, Count, Q, F
from django.db.models.functions import TruncMonth
from django.utils import timezone
from datetime import timedelta

from core.permissions import IsAdmin
from .models import Subscription, Payment, RefundRequest
from .serializers import PaymentSerializer, RefundRequestSerializer


class BillingOverviewView(APIView):
    """GET /admin/billing/overview/ - Billing KPIs."""
    permission_classes = [IsAdmin]

    def get(self, request):
        now = timezone.now()
        month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)

        active_subs = Subscription.objects.filter(status='active')
        total_active = active_subs.count() or 1

        # MRR
        monthly_revenue = Payment.objects.filter(
            status='success', created_at__gte=month_start
        ).aggregate(total=Sum('amount'))['total'] or 0

        # Churn rate (canceled this month / total active at start)
        canceled_this_month = Subscription.objects.filter(
            status='canceled', updated_at__gte=month_start
        ).count()
        churn_rate = round((canceled_this_month / total_active) * 100, 1)

        # ARPU
        total_revenue = Payment.objects.filter(status='success').aggregate(
            total=Sum('amount')
        )['total'] or 0
        total_users = Subscription.objects.count() or 1
        arpu = round(total_revenue / total_users)

        # Monthly revenue chart (last 6 months)
        six_months_ago = now - timedelta(days=180)
        monthly_chart = list(
            Payment.objects.filter(
                status='success', created_at__gte=six_months_ago
            ).annotate(
                month=TruncMonth('created_at')
            ).values('month').annotate(
                revenue=Sum('amount')
            ).order_by('month')
        )

        # Plan breakdown
        plan_breakdown = list(
            Subscription.objects.filter(status='active').values('plan').annotate(
                count=Count('id')
            ).order_by('plan')
        )

        return Response({
            'monthly_revenue': monthly_revenue,
            'mrr': monthly_revenue,
            'churn_rate': churn_rate,
            'arpu': arpu,
            'monthly_chart': [
                {'month': item['month'].strftime('%Y-%m'), 'revenue': item['revenue']}
                for item in monthly_chart
            ],
            'plan_breakdown': plan_breakdown,
        })


class PaymentListView(generics.ListAPIView):
    """GET /admin/billing/payments/ - Payment history."""
    serializer_class = PaymentSerializer
    permission_classes = [IsAdmin]
    filterset_fields = ['status', 'plan', 'method']
    search_fields = ['user__username', 'user__email']

    def get_queryset(self):
        return Payment.objects.select_related('user').all()


class RefundRequestListView(generics.ListAPIView):
    """GET /admin/billing/refunds/ - Refund requests."""
    serializer_class = RefundRequestSerializer
    permission_classes = [IsAdmin]
    filterset_fields = ['status']

    def get_queryset(self):
        return RefundRequest.objects.select_related('payment__user').all()
