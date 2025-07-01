from rest_framework.response import Response
from rest_framework import status
from rest_framework.generics import CreateAPIView
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import UserSerializers
from .models import User


class UserRegisterViews(CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializers

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
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
