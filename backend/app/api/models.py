from django.db import models
from django.db.models import Q
from ..users.models import User


# Модель обьявления
class Motocycles(models.Model):
    brand = models.CharField(max_length=128, verbose_name="Название мотоцикла")
    model = models.CharField(max_length=128, verbose_name="Модель")
    year = models.PositiveIntegerField()
    category = models.CharField(
        max_length=50,
        choices=[
            ("sport", "Спортивный"),
            ("naked", "Классический"),
            ("touring", "Туристический"),
            ("cruiser", "Круизер"),
            ("enduro", "Эндуро"),
        ],
    )
    engine_volume = models.PositiveIntegerField(default="50")  # обьeм
    power = models.PositiveIntegerField(default="10")  # можность лошадей
    fuel_type = models.CharField(
        max_length=20,
        choices=[("petrol", "Бензин"), ("electric", "Электро")],
        default="petrol",
    )
    transmission = models.CharField(
        max_length=20,
        choices=[("manual", "Механика"), ("automatic", "Автомат")],
        default="manual",
    )
    weight = models.PositiveIntegerField()
    daily_price = models.DecimalField(
        max_digits=8, decimal_places=2, verbose_name="Цена в день"
    )
    is_available = models.BooleanField(default=True)
    description = models.TextField()
    min_rental_hours = models.PositiveIntegerField(default=4)
    min_rental_days = models.PositiveIntegerField(default=1)

    def is_available_for_period(self, start_time, end_time):
        """Проверяет доступность мотоцикла в указанный период"""
        return not self.rental_periods.filter(
            start_time__lt=end_time, end_time__gt=start_time
        ).exists()

    def __str__(self):
        return f"{self.brand}-{self.model}--{self.min_rental_hours}--{self.min_rental_days}"


# Картинки
class Photo(models.Model):
    motorcycle = models.ForeignKey(Motocycles, on_delete=models.CASCADE, related_name="photos")
    image = models.ImageField(upload_to="motorcycles/")
    is_primary = models.BooleanField(default=False)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["motorcycle"],
                condition=Q(is_primary=True),
                name="unique_primary_photo_per_motorcycle",
            )
        ]
        ordering = ["-is_primary", "id"]

    def __str__(self):
        return f"{self.motorcycle.brand}----{self.image}"


# Коменты
class Review(models.Model):
    motorcycle = models.ForeignKey(Motocycles, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    rating = models.PositiveIntegerField(
        choices=[
            (1, 1),
            (2, 2),
            (3, 3),
            (4, 4),
            (5, 5),
        ],
        default=1,
    )
    comment = models.TextField(max_length=300)

    def __str__(self):
        return f"{self.motorcycle.brand}-{self.user.email}"


class RentalPeriod(models.Model):
    motorcycle = models.ForeignKey(
        Motocycles, on_delete=models.CASCADE, related_name="rental_periods"
    )
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()

    class Meta:
        indexes = [models.Index(fields=["start_time", "end_time"])]

    def __str__(self):
        return f"{self.motorcycle.brand}-{self.start_time}-{self.end_time}"


class Booking(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    motorcycle = models.ForeignKey(Motocycles, on_delete=models.CASCADE)
    rental_period = models.OneToOneField(RentalPeriod, on_delete=models.CASCADE)

    BOOKING_TYPE = [
        ("hourly", "Почасовая"),
        ("daily", "Посуточная"),
    ]

    booking_type = models.CharField(max_length=10, choices=BOOKING_TYPE)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

    STATUS_CHOICES = [
        ("pending", "Ожидает"),
        ("confirmed", "Подтверждено"),
        ("active", "Активно"),
        ("completed", "Завершено"),
        ("cancelled", "Отменено"),
    ]
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")

    def __str__(self):
        return f"{self.motorcycle.brand}-{self.user.email}-{self.total_price}-{self.status}"
