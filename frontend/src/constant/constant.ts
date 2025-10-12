export const NAVIGATION_PATHS = {
    LEFT: [
        { path: '/', label: 'Главная' },
        { path: '/catalog', label: 'Каталог' },
    ] as const,
    
    AUTHENTICATED: [
        { path: '/bookings', label: 'Мои брони' },
        { path: '/my-motorcycles', label: 'Мои мотоциклы', roles: ['landlord'] },
        { path: '/profile', label: 'Профиль' },
        { path: '/admin/create-listing', label: 'Создать объявление', roles: ['admin'] },
        { path: '/admin', label: 'Админ', roles: ['admin'] },
    ] as const,
    
    UNAUTHENTICATED: [
        { path: '/auth/login', label: 'Войти' },
    ] as const,
} as const