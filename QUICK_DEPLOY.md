# 🚀 Быстрое развертывание MotoRents

## 1. Подготовка репозитория

```bash
# Инициализация git (если еще не сделано)
git init
git add .
git commit -m "Initial commit"

# Добавление удаленного репозитория
git remote add origin https://github.com/yourusername/motorents.git
git push -u origin main
```

## 2. Развертывание Backend (Railway)

1. Перейдите на [Railway.app](https://railway.app)
2. Войдите через GitHub
3. Нажмите "New Project" → "Deploy from GitHub repo"
4. Выберите ваш репозиторий
5. Выберите папку `backend`
6. Railway автоматически определит Django проект
7. Добавьте переменные окружения:
   ```
   DJANGO_SETTINGS_MODULE=backend.settings_production
   SECRET_KEY=your-secret-key-here
   ```
8. Дождитесь развертывания и скопируйте URL

## 3. Развертывание Frontend (Netlify)

1. Перейдите на [Netlify.com](https://netlify.com)
2. Войдите через GitHub
3. Нажмите "New site from Git"
4. Выберите ваш репозиторий
5. Настройки сборки:
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`
   - **Base directory**: `frontend`
6. Добавьте переменную окружения:
   ```
   VITE_SERVER_URL=https://your-railway-app.railway.app
   ```
7. Нажмите "Deploy site"

## 4. Настройка CORS

В Railway добавьте переменную окружения:
```
CORS_ALLOWED_ORIGINS=https://your-netlify-app.netlify.app
```

## 5. Инициализация базы данных

В Railway выполните команды:
```bash
python manage.py migrate
python init_db.py
```

## 6. Проверка

1. Откройте ваш Netlify URL
2. Попробуйте зарегистрироваться
3. Проверьте загрузку мотоциклов
4. Проверьте создание бронирований

## 🔧 Troubleshooting

### CORS ошибки
- Убедитесь, что в Railway добавлен ваш Netlify домен в `CORS_ALLOWED_ORIGINS`

### 404 ошибки
- Проверьте, что в Netlify правильно настроен `Publish directory`

### API ошибки
- Проверьте, что `VITE_SERVER_URL` указывает на правильный Railway URL

### База данных
- Убедитесь, что выполнены миграции: `python manage.py migrate`

## 📱 Тестовые аккаунты

После выполнения `python init_db.py`:
- **Админ**: admin@motorents.com / admin123
- **Арендодатель**: landlord@motorents.com / landlord123

## 🎉 Готово!

Ваше приложение MotoRents теперь доступно в интернете!
