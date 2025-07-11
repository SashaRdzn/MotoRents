from .views import MotorcycleViewSet, BookingViewSet
from rest_framework.routers import DefaultRouter

app_name = "api"


router = DefaultRouter(trailing_slash=False)


router.register(r"motorcycles", MotorcycleViewSet)
router.register(r"bookings", BookingViewSet, basename="booking")

urlpatterns = router.urls
