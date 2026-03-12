from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Organization


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ['username', 'email', 'role', 'plan', 'organization', 'is_active']
    list_filter = ['role', 'plan', 'is_active', 'organization']
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Platform', {'fields': ('role', 'plan', 'avatar', 'bio', 'organization')}),
    )


@admin.register(Organization)
class OrganizationAdmin(admin.ModelAdmin):
    list_display = ['name', 'plan', 'max_seats', 'created_at']
