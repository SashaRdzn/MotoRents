from rest_framework import serializers
from rest_framework.authentication import authenticate
from rest_framework.views import exceptions

from .models import User, Profile


class UserSerializers(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "phone",
            "username",
            "last_name",
            "first_name",
            "driving_experience",
            "password",
            "date_joined",
        ]
        extra_kwargs = {
            "password": {"write_only": True},
            "date_joined": {"read_only": True},
        }


class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        email = data.get("email")
        password = data.get("password")
        user = authenticate(username=email, password=password)
        if not user:
            raise exceptions.AuthenticationFailed("Invalid credentials")
        data["user"] = user
        return data


class ProfileUserSerializer(serializers.ModelSerializer):
    user = UserSerializers(read_only=True)

    class Meta:
        model = Profile
        fields = ["user", "role"]


class ProfileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ["role"]


class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["first_name", "last_name", "phone", "driving_experience"]
