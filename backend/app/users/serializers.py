from rest_framework import serializers
from .models import User


class UserSerializers(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "phone",
            "username",
            "last_name",
            "first_name",
            "phone",
            "driving_experience",
            "password",
        ]
        write_only_fields = ["password"]
