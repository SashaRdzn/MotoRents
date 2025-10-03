from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.core.exceptions import ValidationError
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils import timezone
from datetime import timedelta
import os

class UserManager(BaseUserManager):
    use_in_migrations = True

    def _create_user(self, email, password, **extra_fields):
        if not email:
            raise ValueError("The Email must be set")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email=None, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", False)
        extra_fields.setdefault("is_superuser", False)
        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")

        return self._create_user(email, password, **extra_fields)


class User(AbstractUser):
    email = models.EmailField(unique=True, verbose_name="Email")
    phone = models.CharField(max_length=20, blank=True, null=True, unique=True)
    username = models.CharField(max_length=50, unique=False, blank=True, null=True)
    driving_experience = models.PositiveSmallIntegerField(
        default=0, verbose_name="Стаж вождения (лет)"
    )

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["password"]

    objects = UserManager()

    def __str__(self):
        return self.email

    def save(self, *args, **kwargs):
        if self.is_superuser:
            self.is_staff = True
        return super().save(*args, **kwargs)


class EmailConfirmation(models.Model):
    email = models.EmailField(unique=True)
    code = models.CharField(max_length=4)
    created_at = models.DateTimeField(auto_now_add=True)
    is_verified = models.BooleanField(default=False)
    attempts = models.PositiveIntegerField(default=0)

    def is_expired(self):
        return timezone.now() > self.created_at + timedelta(minutes=15)

    def __str__(self):
        return f"{self.email} - {self.code}"


class Profile(models.Model):
    ROLE_USER = (
        ("manager", "Менеджер"),
        ("client", "Клиент"),
        ("landlord", "Арендодатель"),
        ("admin", "Администратор"),
        ("superuser", "Суперпользователь"),
    )

    ADMIN_ROLES = ["admin", "superuser"]

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="profile",
        verbose_name="Пользователь",
    )
    role = models.CharField(
        max_length=30, choices=ROLE_USER, default="client", verbose_name="Роль"
    )
    avatar = models.ImageField(
        upload_to='avatars/',
        blank=True,
        null=True,
        verbose_name="Аватар"
    )

    def __str__(self):
        return f"{self.user.email} ({self.get_role_display()})"

    def clean(self):
        # Разрешаем назначение админских ролей только суперпользователям
        if self.role in self.ADMIN_ROLES and not self.user.is_superuser:
            raise ValidationError("Только суперпользователи могут иметь административные роли")

    def save(self, *args, **kwargs):
        # Проверяем, что только суперпользователи могут иметь админские роли
        if self.role in self.ADMIN_ROLES and not self.user.is_superuser:
            raise ValidationError("Только суперпользователи могут иметь административные роли")

        # Автоматически устанавливаем is_staff для админских ролей
        if self.role in self.ADMIN_ROLES:
            self.user._profile_saving = True
            try:
                self.user.is_staff = True
                self.user.save(update_fields=["is_staff"])
            finally:
                delattr(self.user, "_profile_saving")

        super().save(*args, **kwargs)


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created and not hasattr(instance, "profile"):
        # Автоматически назначаем роль superuser для суперпользователей
        role = "superuser" if instance.is_superuser else "client"
        Profile.objects.create(user=instance, role=role)
