from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    path("auth/", include("app.users.urls", namespace="users")),
    path("api/", include("app.api.urls", namespace="api")),
]
