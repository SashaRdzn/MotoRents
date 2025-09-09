from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    CompleteRegistrationView,
    SendConfirmationCodeView,
    UserRegisterViews,
    UserLoginView,
    ProfileUserMe,
    LogoutView,
    UpdateUserProfileView,
    UpdateUserRoleView,
    VerifyCodeView,
)


app_name = "users"


urlpatterns = [



    path("send-code", SendConfirmationCodeView.as_view(), name="send-code"),
    path("verify-code", VerifyCodeView.as_view(), name="verify-code"),
    path("register", CompleteRegistrationView.as_view(), name="complete-registration"),
    # path("register", UserRegisterViews.as_view()), обычная регистрация без повтверждения пароля





    path("login", UserLoginView.as_view()),
    path(
        "profile/<int:pk>/update-role", UpdateUserRoleView.as_view(), name="update-role"
    ),



    path("me/update", UpdateUserProfileView.as_view(), name="update-profile"),
    path("me", ProfileUserMe.as_view()),




    path("logout", LogoutView.as_view(), name="logout"),
    path("refresh", TokenRefreshView.as_view(), name="token_refresh"),
]
