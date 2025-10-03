from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from app.users.models import Profile

User = get_user_model()

class Command(BaseCommand):
    help = 'Создает суперпользователя с возможностью выбора роли'

    def add_arguments(self, parser):
        parser.add_argument('--email', type=str, required=True, help='Email суперпользователя')
        parser.add_argument('--password', type=str, required=True, help='Пароль суперпользователя')
        parser.add_argument('--first-name', type=str, default='', help='Имя')
        parser.add_argument('--last-name', type=str, default='', help='Фамилия')
        parser.add_argument('--role', type=str, choices=['admin', 'superuser'], 
                          default='superuser', help='Роль суперпользователя')

    def handle(self, *args, **options):
        email = options.get('email')
        password = options.get('password')
        first_name = options.get('first_name', '')
        last_name = options.get('last_name', '')
        role = options.get('role')

        try:
            # Создаем суперпользователя
            user = User.objects.create_superuser(
                email=email,
                password=password,
                first_name=first_name,
                last_name=last_name
            )

            # Обновляем роль в профиле
            profile = user.profile
            profile.role = role
            profile.save()

            self.stdout.write(
                self.style.SUCCESS(
                    f'Суперпользователь {email} создан с ролью {role}'
                )
            )

        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Ошибка создания суперпользователя: {e}')
            )
