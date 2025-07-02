from django.urls import path
from .views import UserRegisterViews, UserLoginView, ProfileUserMe


app_name = "users"


urlpatterns = [
    path("register", UserRegisterViews.as_view()),
    path("login", UserLoginView.as_view()),
    path("me", ProfileUserMe.as_view()),
]
