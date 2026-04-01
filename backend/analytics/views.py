from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Sum, Count, Avg
from django.db.models.functions import TruncMonth
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import timedelta

from core.permissions import IsAdmin
from billing.models import Payment
from enrollments.models import Enrollment

User = get_user_model()


class AdminDashboardView(APIView):
    """GET /admin/dashboard/ - Admin dashboard aggregations."""
    permission_classes = [IsAdmin]

    def get(self, request):
        now = timezone.now()
        month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)

        # KPIs
        total_users = User.objects.count()
        monthly_revenue = Payment.objects.filter(
            status='success', created_at__gte=month_start
        ).aggregate(total=Sum('amount'))['total'] or 0
        avg_completion = Enrollment.objects.aggregate(
            avg=Avg('progress_percent')
        )['avg'] or 0

        # Revenue chart (12 months)
        twelve_months_ago = now - timedelta(days=365)
        revenue_chart = list(
            Payment.objects.filter(
                status='success', created_at__gte=twelve_months_ago
            ).annotate(
                month=TruncMonth('created_at')
            ).values('month').annotate(
                revenue=Sum('amount')
            ).order_by('month')
        )

        # User growth (12 months)
        user_growth = list(
            User.objects.filter(
                date_joined__gte=twelve_months_ago
            ).annotate(
                month=TruncMonth('date_joined')
            ).values('month').annotate(
                count=Count('id')
            ).order_by('month')
        )

        # Recent activity (latest 10 enrollments)
        recent_enrollments = list(
            Enrollment.objects.select_related('user', 'course').order_by('-created_at')[:10].values(
                'user__first_name', 'user__last_name', 'user__username',
                'course__title', 'created_at',
            )
        )

        activities = []
        for e in recent_enrollments:
            name = f"{e['user__last_name']} {e['user__first_name']}".strip()
            if not name:
                name = e['user__username']
            activities.append({
                'name': name,
                'action': f"「{e['course__title']}」に受講登録",
                'time': e['created_at'].isoformat(),
            })

        return Response({
            'total_users': total_users,
            'monthly_revenue': monthly_revenue,
            'avg_completion_rate': round(float(avg_completion), 1),
            'ai_usage_count': 3200,  # placeholder
            'revenue_chart': [
                {'month': item['month'].strftime('%Y-%m'), 'revenue': item['revenue']}
                for item in revenue_chart
            ],
            'user_growth_chart': [
                {'month': item['month'].strftime('%Y-%m'), 'count': item['count']}
                for item in user_growth
            ],
            'recent_activities': activities,
        })
