from rest_framework import viewsets, status, serializers
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import action
from django.utils import timezone
from .models import Motocycles, Booking, Review
from .serializers import (
    MotocycleSerializer,
    MotocycleCreateSerializer,
    BookingCreateSerializer,
    BookingDetailSerializer,
    ReviewSerializer,
)


class MotorcycleViewSet(viewsets.ModelViewSet):
    queryset = Motocycles.objects.filter(is_available=True).prefetch_related("photos")
    serializer_class = MotocycleSerializer
    http_method_names = ["get", "post", "put", "patch"]
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.action == 'create':
            return MotocycleCreateSerializer
        return MotocycleSerializer

    def get_queryset(self):
        """Фильтруем мотоциклы в зависимости от роли пользователя"""
        user = self.request.user
        
        # Если это запрос на каталог (публичные мотоциклы)
        if self.action == 'list' and not self.request.path.endswith('/my-motorcycles/'):
            return Motocycles.objects.filter(is_available=True, is_public=True).prefetch_related("photos")
        
        # Если пользователь - арендодатель, показываем его мотоциклы
        if hasattr(user, 'profile') and user.profile.role == 'landlord':
            return Motocycles.objects.filter(owner=user).prefetch_related("photos")
        
        # Если пользователь - админ, показываем все мотоциклы
        if hasattr(user, 'profile') and user.profile.role in ['admin', 'superuser']:
            return Motocycles.objects.all().prefetch_related("photos")
        
        # Для обычных клиентов показываем только публичные мотоциклы
        return Motocycles.objects.filter(is_available=True, is_public=True).prefetch_related("photos")

    def perform_create(self, serializer):
        """Проверяем права на создание мотоцикла"""
        user = self.request.user
        
        # Только арендодатели и админы могут создавать мотоциклы
        if not hasattr(user, 'profile') or user.profile.role not in ['landlord', 'admin', 'superuser']:
            raise serializers.ValidationError("Только арендодатели и администраторы могут создавать мотоциклы")
        
        serializer.save()

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

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def publish(self, request, pk=None):
        """Опубликовать мотоцикл в общем каталоге (только для админов)"""
        user = request.user
        
        # Проверяем права администратора
        if not hasattr(user, 'profile') or user.profile.role not in ['admin', 'superuser']:
            return Response(
                {"error": "Только администраторы могут публиковать мотоциклы"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        motorcycle = self.get_object()
        motorcycle.is_public = True
        motorcycle.save()
        
        return Response(
            {"message": "Мотоцикл опубликован в общем каталоге"},
            status=status.HTTP_200_OK
        )

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def unpublish(self, request, pk=None):
        """Убрать мотоцикл из общего каталога (только для админов)"""
        user = request.user
        
        # Проверяем права администратора
        if not hasattr(user, 'profile') or user.profile.role not in ['admin', 'superuser']:
            return Response(
                {"error": "Только администраторы могут управлять публикацией мотоциклов"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        motorcycle = self.get_object()
        motorcycle.is_public = False
        motorcycle.save()
        
        return Response(
            {"message": "Мотоцикл убран из общего каталога"},
            status=status.HTTP_200_OK
        )


class MyMotorcyclesViewSet(viewsets.ModelViewSet):
    """ViewSet для управления мотоциклами арендодателя"""
    serializer_class = MotocycleSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ["get", "post", "put", "patch", "delete"]

    def get_serializer_class(self):
        if self.action == 'create':
            return MotocycleCreateSerializer
        return MotocycleSerializer

    def get_queryset(self):
        """Показываем только мотоциклы текущего пользователя"""
        user = self.request.user
        
        # Проверяем, что пользователь - арендодатель или админ
        if not hasattr(user, 'profile') or user.profile.role not in ['landlord', 'admin', 'superuser']:
            return Motocycles.objects.none()
        
        # Если админ - показываем все мотоциклы
        if user.profile.role in ['admin', 'superuser']:
            return Motocycles.objects.all().prefetch_related("photos")
        
        # Если арендодатель - показываем только его мотоциклы
        return Motocycles.objects.filter(owner=user).prefetch_related("photos")

    def perform_create(self, serializer):
        """Проверяем права на создание мотоцикла"""
        user = self.request.user
        
        # Только арендодатели и админы могут создавать мотоциклы
        if not hasattr(user, 'profile') or user.profile.role not in ['landlord', 'admin', 'superuser']:
            raise serializers.ValidationError("Только арендодатели и администраторы могут создавать мотоциклы")
        
        serializer.save()

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def toggle_public(self, request, pk=None):
        """Переключить публичность мотоцикла"""
        user = request.user
        
        # Проверяем права
        if not hasattr(user, 'profile') or user.profile.role not in ['landlord', 'admin', 'superuser']:
            return Response(
                {"error": "Только арендодатели и администраторы могут управлять публикацией"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        motorcycle = self.get_object()
        
        # Арендодатель может управлять только своими мотоциклами
        if user.profile.role == 'landlord' and motorcycle.owner != user:
            return Response(
                {"error": "Вы можете управлять только своими мотоциклами"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        motorcycle.is_public = not motorcycle.is_public
        motorcycle.save()
        
        return Response(
            {
                "message": f"Мотоцикл {'опубликован' if motorcycle.is_public else 'убран из публикации'}",
                "is_public": motorcycle.is_public
            },
            status=status.HTTP_200_OK
        )


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
