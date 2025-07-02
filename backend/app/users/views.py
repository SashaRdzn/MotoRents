from rest_framework.response import Response
from rest_framework import status
from rest_framework.generics import CreateAPIView, ListAPIView, RetrieveAPIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import exceptions
from rest_framework.permissions import IsAuthenticated


from .serializers import UserSerializers, UserLoginSerializer, ProfileUserSerializer
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
