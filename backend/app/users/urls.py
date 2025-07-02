from django.urls import path
from .views import (
    UserRegisterViews,
    UserLoginView,
    ProfileUserMe,
    LogoutView,
    UpdateUserProfileView,
    UpdateUserRoleView,
)


app_name = "users"


urlpatterns = [
    path("register", UserRegisterViews.as_view()),
    path("login", UserLoginView.as_view()),
    path("logout", LogoutView.as_view(), name="logout"),
    path(
        "profile/<int:pk>/update-role", UpdateUserRoleView.as_view(), name="update-role"
    ),
    path("me/update", UpdateUserProfileView.as_view(), name="update-profile"),
    path("me", ProfileUserMe.as_view()),
]
