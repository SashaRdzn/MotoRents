from rest_framework import serializers
from rest_framework.authentication import authenticate
from rest_framework.views import exceptions

from .models import EmailConfirmation, User, Profile

from django.core.mail import send_mail
from django.conf import settings
import random


class EmailSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError(
                "Пользователь с таким email уже существует"
            )
        return value

    def create(self, validated_data):
        email = validated_data["email"]
        code = str(random.randint(1000, 9999))

        send_mail(
            subject="Код подтверждения регистрации",
            message=f"Ваш код подтверждения: {code}\nКод действителен 15 минут.",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[email],
            fail_silently=False,
        )

        obj, _ = EmailConfirmation.objects.update_or_create(
            email=email, defaults={"code": code, "is_verified": False, "attempts": 0}
        )
        return obj


class CodeVerificationSerializer(serializers.Serializer):
    email = serializers.EmailField()
    code = serializers.CharField(max_length=4)

    def validate(self, data):
        try:
            confirmation = EmailConfirmation.objects.get(email=data["email"])

            if confirmation.is_expired():
                raise serializers.ValidationError("Срок действия кода истек")

            if confirmation.attempts >= 3:
                raise serializers.ValidationError("Превышено количество попыток")

            if confirmation.code != data["code"]:
                confirmation.attempts += 1
                confirmation.save()
                raise serializers.ValidationError("Неверный код подтверждения")

        except EmailConfirmation.DoesNotExist:
            raise serializers.ValidationError("Email не найден")

        return data


class UserRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["email", "password", "first_name", "last_name"]
        extra_kwargs = {"password": {"write_only": True}}

    def validate_email(self, value):
        if not EmailConfirmation.objects.filter(email=value, is_verified=True).exists():
            raise serializers.ValidationError("Email не подтвержден")
        return value

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data["email"],
            password=validated_data["password"],
            first_name=validated_data.get("first_name", ""),
            last_name=validated_data.get("last_name", ""),
            is_active=True,
        )
        return user

# обычная рега
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

    def create(self, validated_data):
        password = validated_data.pop("password", None)
        user = User.objects.create_user(**validated_data)
        if password:
            user.set_password(password)
            user.save()

        return user


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
    avatar_url = serializers.SerializerMethodField()

    class Meta:
        model = Profile
        fields = ["user", "role", "avatar", "avatar_url", "theme"]
    
    def get_avatar_url(self, obj):
        if obj.avatar:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.avatar.url)
            return obj.avatar.url
        return None


class ProfileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ["role", "avatar", "theme"]
    
    def validate_role(self, value):
        # Проверяем, что только суперпользователи могут назначать админские роли
        if value in Profile.ADMIN_ROLES and not self.context['request'].user.is_superuser:
            raise serializers.ValidationError("Только суперпользователи могут назначать административные роли")
        
        # Разрешаем клиентам выбирать роль арендодателя
        current_user = self.context['request'].user
        if current_user.profile.role == 'client' and value == 'landlord':
            return value
        
        # Разрешаем арендодателям возвращаться к роли клиента
        if current_user.profile.role == 'landlord' and value == 'client':
            return value
            
        return value


class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["first_name", "last_name", "phone", "driving_experience"]


class AvatarUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ["avatar"]


class ThemeUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ["theme"]
