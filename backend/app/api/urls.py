from .views import MotorcycleViewSet, BookingViewSet, ReviewViewSet
from rest_framework.routers import DefaultRouter

app_name = "api"


router = DefaultRouter(trailing_slash=False)


router.register(r"motorcycles", MotorcycleViewSet)
router.register(r"bookings", BookingViewSet, basename="booking")
router.register(r"reviews", ReviewViewSet, basename="review")

urlpatterns = router.urls
