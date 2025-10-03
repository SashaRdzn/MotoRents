# Роли суперпользователей в MotoRents

## Обзор

Система теперь поддерживает две административные роли для суперпользователей:
- **admin** - Администратор
- **superuser** - Суперпользователь

## Создание суперпользователя с ролью

### Через Django команду

```bash
# Создать суперпользователя с ролью администратора
python3 manage.py createsuperuser_with_role \
  --email admin@example.com \
  --password admin123 \
  --first-name Admin \
  --last-name User \
  --role admin

# Создать суперпользователя с ролью суперпользователя
python3 manage.py createsuperuser_with_role \
  --email super@example.com \
  --password super123 \
  --first-name Super \
  --last-name User \
  --role superuser
```

### Через Django shell

```python
from app.users.models import User, Profile

# Создать суперпользователя
user = User.objects.create_superuser(
    email='admin@example.com',
    password='admin123',
    first_name='Admin',
    last_name='User'
)

# Назначить роль администратора
user.profile.role = 'admin'
user.profile.save()

# Или назначить роль суперпользователя
user.profile.role = 'superuser'
user.profile.save()
```

## Изменение роли существующего суперпользователя

```python
from app.users.models import User

# Найти пользователя
user = User.objects.get(email='admin@example.com')

# Изменить роль
user.profile.role = 'admin'  # или 'superuser'
user.profile.save()
```

## Ограничения безопасности

1. **Только суперпользователи** могут иметь административные роли (`admin`, `superuser`)
2. **Обычные пользователи** не могут получить административные роли
3. При назначении административной роли автоматически устанавливается `is_staff = True`

## Доступные роли в системе

- `client` - Клиент (по умолчанию для обычных пользователей)
- `manager` - Менеджер
- `landlord` - Арендодатель
- `admin` - Администратор (только для суперпользователей)
- `superuser` - Суперпользователь (только для суперпользователей)

## API Endpoints

- `PUT /api/users/profile/{id}/` - Обновление роли пользователя (только для администраторов)
- `GET /api/users/profile/me/` - Получение информации о своем профиле

## Миграции

Все изменения применены через миграцию `users.0002_alter_profile_role`.
