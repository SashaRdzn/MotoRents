from rest_framework.response import Response
from rest_framework import status
from rest_framework.generics import (
    CreateAPIView,
    ListAPIView,
    RetrieveAPIView,
    UpdateAPIView,
)
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import exceptions, APIView
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError

# from drf_simple_jwt_blacklist.serializers import BlacklistSerializer


from .serializers import (
    UserSerializers,
    UserLoginSerializer,
    ProfileUserSerializer,
    ProfileUpdateSerializer,
    UserUpdateSerializer,
)
from .models import User, Profile


class UserRegisterViews(CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializers

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        try:
            if serializer.is_valid():
                user = serializer.save()  # сохраняем users
                refresh = RefreshToken.for_user(user)  # создаем токен
                headers = self.get_success_headers(serializer.data)
                return Response(
                    {
                        "data": {
                            "user_token": {
                                "refresh": str(refresh),
                                "access": str(refresh.access_token),
                            },
                            "message": "success",
                        }
                    },
                    status=status.HTTP_201_CREATED,
                    headers=headers,
                )
            else:
                raise exceptions.AuthenticationFailed(
                    status=status.HTTP_401_UNAUTHORIZED
                )
        except er:
            raise exceptions.NotAuthenticated(status=status.HTTP_401_UNAUTHORIZED)


class UserLoginView(CreateAPIView):
    serializer_class = UserLoginSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        try:
            serializer.is_valid(raise_exception=True)
            user = serializer.validated_data["user"]

            refresh = RefreshToken.for_user(user)

            return Response(
                {
                    "data": {
                        "user_token": {
                            "refresh": str(refresh),
                            "access": str(refresh.access_token),
                        },
                        "message": "success",
                    }
                },
                status=status.HTTP_200_OK,
            )

        except exceptions.AuthenticationFailed:
            return Response(
                {
                    "data": None,
                    "message": "Не верный пароль или почта",
                    "errors": "Authentication failed",
                },
                status=status.HTTP_401_UNAUTHORIZED,
            )
        except Exception as e:
            return Response(
                {
                    "data": None,
                    "message": "Login failed",
                    "errors": str(e),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )


class ProfileUserMe(RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ProfileUserSerializer

    def get_object(self):
        return Profile.objects.get(user=self.request.user)


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get("refresh")

            if not refresh_token:
                return Response(
                    {"error": "Refresh token is required"},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(
                {"success": "Successfully logged out"},
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class UpdateUserRoleView(UpdateAPIView):
    serializer_class = ProfileUpdateSerializer
    permission_classes = [IsAdminUser]

    queryset = Profile.objects.all()

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop("partial", False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        if getattr(instance, "_prefetched_objects_cache", None):
            instance._prefetched_objects_cache = {}

        return Response(serializer.data)


class UpdateUserProfileView(UpdateAPIView):
    serializer_class = UserUpdateSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user
