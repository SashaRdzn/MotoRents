from django.urls import path
from .views import UserRegisterViews


app_name = "users"



urlpatterns = [path("register", UserRegisterViews.as_view())]
