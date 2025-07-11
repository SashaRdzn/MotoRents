from django.contrib import admin

from .models import Booking, Motocycles, RentalPeriod, Review, Photo


admin.site.register(Booking)
admin.site.register(Motocycles)
admin.site.register(RentalPeriod)
admin.site.register(Review)
admin.site.register(Photo)
