from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.contrib.auth import get_user_model

from .serializers import UserRegistrationSerializer, UserProfileSerializer, UserAdminSerializer
from core.permissions import IsAdmin

User = get_user_model()


class RegisterView(generics.CreateAPIView):
    """User registration endpoint."""
    serializer_class = UserRegistrationSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': UserProfileSerializer(user).data,
            'tokens': {
                'access': str(refresh.access_token),
                'refresh': str(refresh),
            }
        }, status=status.HTTP_201_CREATED)


class LoginView(TokenObtainPairView):
    """JWT login endpoint — sets refresh token as HTTP-only cookie."""
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == 200:
            from django.conf import settings
            jwt_cfg = getattr(settings, 'SIMPLE_JWT', {})
            refresh = response.data.get('refresh', '')
            response.set_cookie(
                key=jwt_cfg.get('AUTH_COOKIE', 'refresh_token'),
                value=refresh,
                httponly=jwt_cfg.get('AUTH_COOKIE_HTTP_ONLY', True),
                samesite=jwt_cfg.get('AUTH_COOKIE_SAMESITE', 'Lax'),
                secure=jwt_cfg.get('AUTH_COOKIE_SECURE', False),
                max_age=int(jwt_cfg.get('REFRESH_TOKEN_LIFETIME', __import__('datetime').timedelta(days=7)).total_seconds()),
            )
        return response


class CookieTokenRefreshView(TokenRefreshView):
    """Read refresh token from HTTP-only cookie if not in body."""

    def post(self, request, *args, **kwargs):
        from django.conf import settings
        jwt_cfg = getattr(settings, 'SIMPLE_JWT', {})
        cookie_name = jwt_cfg.get('AUTH_COOKIE', 'refresh_token')

        if not request.data.get('refresh'):
            refresh = request.COOKIES.get(cookie_name)
            if refresh:
                request.data._mutable = True  # type: ignore[union-attr]
                request.data['refresh'] = refresh
                request.data._mutable = False  # type: ignore[union-attr]

        response = super().post(request, *args, **kwargs)
        return response


class LogoutView(APIView):
    """Blacklist refresh token on logout."""

    def post(self, request):
        from django.conf import settings
        jwt_cfg = getattr(settings, 'SIMPLE_JWT', {})
        cookie_name = jwt_cfg.get('AUTH_COOKIE', 'refresh_token')

        refresh_token = request.data.get('refresh') or request.COOKIES.get(cookie_name, '')
        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
        except Exception:
            pass
        response = Response(status=status.HTTP_205_RESET_CONTENT)
        response.delete_cookie(cookie_name)
        return response


class ProfileView(generics.RetrieveUpdateAPIView):
    """Get/update current user profile."""
    serializer_class = UserProfileSerializer

    def get_object(self):
        return self.request.user


class AdminUserListView(generics.ListCreateAPIView):
    """Admin: list and create users."""
    queryset = User.objects.all()
    serializer_class = UserAdminSerializer
    permission_classes = [IsAdmin]
    filterset_fields = ['role', 'plan', 'is_active']
    search_fields = ['username', 'email', 'first_name', 'last_name']
    ordering_fields = ['date_joined', 'last_login', 'username']


class AdminUserDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Admin: manage individual user."""
    queryset = User.objects.all()
    serializer_class = UserAdminSerializer
    permission_classes = [IsAdmin]
