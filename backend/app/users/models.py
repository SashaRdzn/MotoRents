from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.core.exceptions import ValidationError
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.hashers import make_password


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
    username = None
    driving_experience = models.PositiveSmallIntegerField(
        default=0, verbose_name="Стаж вождения (лет)"
    )

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    objects = UserManager()

    def __str__(self):
        return self.email

    def save(self, *args, **kwargs):
        if self.is_superuser:
            self.is_staff = True
        return super().save(*args, **kwargs)


class Profile(models.Model):
    ROLE_USER = (
        ("manager", "Менеджер"),
        ("client", "Клиент"),
        ("landlord", "Арендодатель"),
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

    def __str__(self):
        return f"{self.user.email} ({self.get_role_display()})"

    def clean(self):
        if self.role in self.ADMIN_ROLES and not self.user.is_superuser:
            raise ValidationError("Вы не можете назначать административные роли")

    def save(self, *args, **kwargs):
        if self.role in self.ADMIN_ROLES and not self.user.is_superuser:
            raise ValidationError("Нет прав для назначения административных ролей")

        self.user._profile_saving = True
        try:
            self.user.is_staff = self.role in self.ADMIN_ROLES
            self.user.save(update_fields=["is_staff"])
        finally:
            delattr(self.user, "_profile_saving")

        super().save(*args, **kwargs)


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created and not hasattr(instance, "profile"):
        Profile.objects.create(user=instance)
