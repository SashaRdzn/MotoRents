from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Motocycles, Booking
from .serializers import (
    MotocycleSerializer,
    BookingCreateSerializer,
    BookingDetailSerializer,
)


class MotorcycleViewSet(viewsets.ModelViewSet):
    queryset = Motocycles.objects.filter(is_available=True)
    serializer_class = MotocycleSerializer
    http_method_names = ["get", "post", "put", "patch"]


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
