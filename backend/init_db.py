#!/usr/bin/env python
"""
Script to initialize the database with sample data
"""
import os
import sys
import django

# Add the project directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings_production')
django.setup()

from django.contrib.auth import get_user_model
from app.api.models import Motocycles, Photo
from django.core.files.base import ContentFile
import io

User = get_user_model()

def create_superuser():
    """Create a superuser if it doesn't exist"""
    if not User.objects.filter(email='admin@motorents.com').exists():
        User.objects.create_superuser(
            email='admin@motorents.com',
            password='admin123',
            first_name='Admin',
            last_name='User'
        )
        print("Superuser created: admin@motorents.com / admin123")
    else:
        print("Superuser already exists")

def create_sample_motorcycles():
    """Create sample motorcycles"""
    if Motocycles.objects.count() > 0:
        print("Sample motorcycles already exist")
        return
    
    # Create a sample landlord user
    landlord, created = User.objects.get_or_create(
        email='landlord@motorents.com',
        defaults={
            'first_name': 'John',
            'last_name': 'Doe',
            'is_active': True
        }
    )
    if created:
        landlord.set_password('landlord123')
        landlord.save()
        print("Landlord user created: landlord@motorents.com / landlord123")
    
    # Create sample motorcycles
    motorcycles_data = [
        {
            'brand': 'Honda',
            'model': 'CBR600RR',
            'year': 2023,
            'category': 'sport',
            'engine_volume': 600,
            'power': 118,
            'fuel_type': 'petrol',
            'transmission': 'manual',
            'weight': 194,
            'daily_price': 5000,
            'description': 'Спортивный мотоцикл Honda CBR600RR с отличными характеристиками для трека и города.',
            'min_rental_hours': 4,
            'min_rental_days': 1,
            'is_available': True,
            'is_public': True,
            'owner': landlord
        },
        {
            'brand': 'Yamaha',
            'model': 'MT-07',
            'year': 2022,
            'category': 'naked',
            'engine_volume': 689,
            'power': 74,
            'fuel_type': 'petrol',
            'transmission': 'manual',
            'weight': 182,
            'daily_price': 3500,
            'description': 'Универсальный naked мотоцикл Yamaha MT-07 идеально подходит для городской езды.',
            'min_rental_hours': 4,
            'min_rental_days': 1,
            'is_available': True,
            'is_public': True,
            'owner': landlord
        },
        {
            'brand': 'Kawasaki',
            'model': 'Ninja 650',
            'year': 2023,
            'category': 'sport',
            'engine_volume': 649,
            'power': 68,
            'fuel_type': 'petrol',
            'transmission': 'manual',
            'weight': 193,
            'daily_price': 4000,
            'description': 'Спортивный турист Kawasaki Ninja 650 - идеальный баланс между комфортом и производительностью.',
            'min_rental_hours': 4,
            'min_rental_days': 1,
            'is_available': True,
            'is_public': True,
            'owner': landlord
        }
    ]
    
    for bike_data in motorcycles_data:
        motorcycle = Motocycles.objects.create(**bike_data)
        print(f"Created motorcycle: {motorcycle.brand} {motorcycle.model}")

if __name__ == '__main__':
    print("Initializing database...")
    create_superuser()
    create_sample_motorcycles()
    print("Database initialization completed!")
