# Развертывание MotoRents на Netlify

## Подготовка к развертыванию

### 1. Frontend (Netlify)

#### Настройка переменных окружения
В панели управления Netlify добавьте следующие переменные окружения:

```
VITE_SERVER_URL=https://your-backend-url.railway.app
```

#### Автоматическое развертывание
1. Подключите ваш GitHub репозиторий к Netlify
2. Настройки сборки:
   - Build command: `npm run build`
   - Publish directory: `frontend/dist`
   - Base directory: `frontend`

### 2. Backend (Railway/Render)

#### Для Railway:
1. Создайте аккаунт на [Railway.app](https://railway.app)
2. Подключите GitHub репозиторий
3. Выберите папку `backend`
4. Railway автоматически определит Django проект
5. Добавьте переменные окружения:
   ```
   DEBUG=False
   ALLOWED_HOSTS=your-app.railway.app,your-netlify-app.netlify.app
   ```

#### Для Render:
1. Создайте аккаунт на [Render.com](https://render.com)
2. Создайте новый Web Service
3. Подключите GitHub репозиторий
4. Настройки:
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `python manage.py runserver 0.0.0.0:$PORT`
   - Environment: Python 3

### 3. База данных

#### Для Railway:
- Railway автоматически предоставит PostgreSQL
- Обновите настройки в `settings.py`

#### Для Render:
- Создайте PostgreSQL базу данных в Render
- Обновите настройки подключения

### 4. Медиа файлы

Для хранения медиа файлов (аватары, фото мотоциклов) рекомендуется использовать:
- AWS S3
- Cloudinary
- Railway/Render volume storage

## Пошаговая инструкция

### Шаг 1: Подготовка backend
1. Обновите `settings.py` для production
2. Добавьте CORS настройки для Netlify домена
3. Настройте статические файлы

### Шаг 2: Развертывание backend
1. Загрузите код на Railway/Render
2. Настройте переменные окружения
3. Запустите миграции: `python manage.py migrate`
4. Создайте суперпользователя: `python manage.py createsuperuser`

### Шаг 3: Развертывание frontend
1. Обновите `VITE_SERVER_URL` в Netlify
2. Запустите сборку
3. Проверьте работу приложения

## Проверка развертывания

1. Откройте ваш Netlify URL
2. Проверьте авторизацию
3. Проверьте загрузку мотоциклов
4. Проверьте создание бронирований

## Troubleshooting

### CORS ошибки
Убедитесь, что в backend `settings.py` добавлен ваш Netlify домен в `CORS_ALLOWED_ORIGINS`

### 404 ошибки
Проверьте, что в `netlify.toml` настроены правильные redirects

### API ошибки
Проверьте, что `VITE_SERVER_URL` указывает на правильный backend URL
