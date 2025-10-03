from rest_framework.response import Response
from rest_framework import status
from rest_framework.generics import (
    CreateAPIView,
    RetrieveAPIView,
    UpdateAPIView,
)
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import exceptions, APIView
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import (
    EmailSerializer,
    UserSerializers,
    UserLoginSerializer,
    ProfileUserSerializer,
    ProfileUpdateSerializer,
    UserUpdateSerializer,
    EmailSerializer,
    CodeVerificationSerializer,
    UserRegistrationSerializer,
    AvatarUploadSerializer,
)

from .models import EmailConfirmation, User, Profile


class UserRegisterViews(CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializers
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        if not serializer.is_valid():
            return Response(
                {"error": "Invalid data", "details": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            user = serializer.save()
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
                status=status.HTTP_201_CREATED,
                headers=self.get_success_headers(serializer.data),
            )
        except Exception as e:
            return Response(
                {"error": "Registration failed", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class SendConfirmationCodeView(APIView):
    def post(self, request):
        serializer = EmailSerializer(data=request.data)
        if serializer.is_valid():
            try:
                serializer.save()
                return Response(
                    {"message": "Код подтверждения отправлен на email"},
                    status=status.HTTP_200_OK,
                )
            except Exception as e:
                return Response(
                    {"error": f"Ошибка отправки email: {str(e)}"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class VerifyCodeView(APIView):
    def post(self, request):
        serializer = CodeVerificationSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data["email"]
            confirmation = EmailConfirmation.objects.get(email=email)
            confirmation.is_verified = True
            confirmation.save()
            return Response(
                {"message": "Email успешно подтвержден"}, status=status.HTTP_200_OK
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CompleteRegistrationView(APIView):
    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()

            refresh = RefreshToken.for_user(user)
            return Response(
                {
                    "data": {
                        "user_token": {
                            "refresh": str(refresh),
                            "access": str(refresh.access_token),
                        },
                        "user": {"user_email": user.email},
                        "message": "success",
                    }
                },
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


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


class AvatarUploadView(UpdateAPIView):
    serializer_class = AvatarUploadSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user.profile


class UpdateMyRoleView(UpdateAPIView):
    serializer_class = ProfileUpdateSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user.profile
