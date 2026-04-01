from django.urls import path
from . import views

urlpatterns = [
    path('admin/billing/overview/', views.BillingOverviewView.as_view(), name='billing-overview'),
    path('admin/billing/payments/', views.PaymentListView.as_view(), name='billing-payments'),
    path('admin/billing/refunds/', views.RefundRequestListView.as_view(), name='billing-refunds'),
]
