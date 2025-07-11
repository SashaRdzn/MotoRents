from rest_framework import serializers
from .models import Motocycles, Photo, Review, RentalPeriod, Booking
from django.utils import timezone
from datetime import timedelta


class PhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Photo
        fields = ["image"]


class MotocycleSerializer(serializers.ModelSerializer):
    photos = PhotoSerializer(many=True, read_only=True)

    class Meta:
        model = Motocycles
        fields = "__all__"


class RentalPeriodSerializer(serializers.ModelSerializer):
    class Meta:
        model = RentalPeriod
        fields = ["start_time", "end_time"]

    def validate(self, data):
        start_time = data["start_time"]
        end_time = data["end_time"]

        # Проверка корректности временного интервала
        if start_time >= end_time:
            raise serializers.ValidationError(
                "Конечное время должно быть позже начального"
            )

        # Минимальная продолжительность бронирования
        min_duration = timedelta(minutes=30)
        if (end_time - start_time) < min_duration:
            raise serializers.ValidationError(
                "Минимальное время бронирования - 30 минут"
            )

        # Запрет бронирования в прошлом
        if start_time < timezone.now():
            raise serializers.ValidationError("Нельзя бронировать в прошлом времени")

        return data


class BookingCreateSerializer(serializers.ModelSerializer):
    rental_period = RentalPeriodSerializer()

    class Meta:
        model = Booking
        fields = ["motorcycle", "rental_period", "booking_type"]

    def validate(self, data):
        motorcycle = data["motorcycle"]
        rental_period_data = data["rental_period"]
        booking_type = data["booking_type"]
        start_time = rental_period_data["start_time"]
        end_time = rental_period_data["end_time"]

        # Проверка минимального периода аренды
        if booking_type == "hourly":
            min_duration = timedelta(hours=motorcycle.min_rental_hours)
            if (end_time - start_time) < min_duration:
                raise serializers.ValidationError(
                    f"Минимальный период почасовой аренды: {motorcycle.min_rental_hours} часов"
                )

        elif booking_type == "daily":
            min_duration = timedelta(days=motorcycle.min_rental_days)
            if (end_time - start_time) < min_duration:
                raise serializers.ValidationError(
                    f"Минимальный период посуточной аренды: {motorcycle.min_rental_days} дней"
                )

        # Проверка доступности мотоцикла
        overlapping_bookings = RentalPeriod.objects.filter(
            motorcycle=motorcycle, start_time__lt=end_time, end_time__gt=start_time
        ).exists()

        if overlapping_bookings:
            raise serializers.ValidationError("Выбранный период уже занят")

        return data

    def create(self, validated_data):
        user = self.context["request"].user
        rental_period_data = validated_data.pop("rental_period")
        motorcycle = validated_data["motorcycle"]
        booking_type = validated_data["booking_type"]
        start_time = rental_period_data["start_time"]
        end_time = rental_period_data["end_time"]

        # Создаем период бронирования
        rental_period = RentalPeriod.objects.create(
            motorcycle=motorcycle, start_time=start_time, end_time=end_time
        )

        # Рассчитываем стоимость
        duration = end_time - start_time

        if booking_type == "hourly":
            hours = max(duration.total_seconds() / 3600, motorcycle.min_rental_hours)
            total_price = float(motorcycle.daily_price) / 24 * hours
        else:
            days = max(duration.days, motorcycle.min_rental_days)
            total_price = float(motorcycle.daily_price) * days

        # Создаем бронирование
        booking = Booking.objects.create(
            user=user,
            motorcycle=motorcycle,
            rental_period=rental_period,
            booking_type=booking_type,
            total_price=total_price,
        )

        return booking


class BookingDetailSerializer(serializers.ModelSerializer):
    rental_period = RentalPeriodSerializer(read_only=True)
    motorcycle = MotocycleSerializer(read_only=True)

    class Meta:
        model = Booking
        fields = "__all__"
