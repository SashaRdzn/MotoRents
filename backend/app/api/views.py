from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import action
from django.utils import timezone
from .models import Motocycles, Booking, Review
from .serializers import (
    MotocycleSerializer,
    BookingCreateSerializer,
    BookingDetailSerializer,
    ReviewSerializer,
)


class MotorcycleViewSet(viewsets.ModelViewSet):
    queryset = Motocycles.objects.filter(is_available=True).prefetch_related("photos")
    serializer_class = MotocycleSerializer
    http_method_names = ["get", "post", "put", "patch"]

    @action(detail=True, methods=['get'])
    def reviews(self, request, pk=None):
        """Получить все отзывы для мотоцикла"""
        motorcycle = self.get_object()
        reviews = Review.objects.filter(motorcycle=motorcycle).select_related('user')
        serializer = ReviewSerializer(reviews, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def add_review(self, request, pk=None):
        """Добавить отзыв к мотоциклу"""
        motorcycle = self.get_object()
        serializer = ReviewSerializer(data=request.data, context={
            'request': request,
            'motorcycle_id': motorcycle.id
        })
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class BookingViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    http_method_names = ["get", "post", "delete"]  # Создание, просмотр, отмена

    def get_queryset(self):
        return Booking.objects.filter(user=self.request.user)

    def get_serializer_class(self):
        if self.action == "create":
            return BookingCreateSerializer
        return BookingDetailSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            self.perform_create(serializer)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        headers = self.get_success_headers(serializer.data)
        return Response(
            BookingDetailSerializer(instance=serializer.instance).data,
            status=status.HTTP_201_CREATED,
            headers=headers,
        )

    def perform_create(self, serializer):
        serializer.save()

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()

        if instance.rental_period.start_time < timezone.now():
            return Response(
                {"error": "Нельзя отменить начатое бронирование"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        instance.status = "cancelled"
        instance.save()

        return Response(status=status.HTTP_204_NO_CONTENT)


class ReviewViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = ReviewSerializer
    http_method_names = ["get", "post", "put", "patch", "delete"]

    def get_queryset(self):
        """Получить отзывы текущего пользователя"""
        return Review.objects.filter(user=self.request.user).select_related('motorcycle')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def perform_update(self, serializer):
        serializer.save()

    def perform_destroy(self, instance):
        instance.delete()
