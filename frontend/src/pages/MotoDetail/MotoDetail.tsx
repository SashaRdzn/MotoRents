import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import styles from './motoDetail.module.scss';
import { useGetMotorcycleByIdQuery } from '@/app/api/api';
import type { Motorcycle } from '@/pages/Catalog/catalogApi';
import BookingModal from '@/components/BookingModal/BookingModal';
import { useCreateBookingMutation } from '@/app/api/api';
import { useToast } from '@/components/Toast/ToastProvider';

const serverUrl = import.meta.env.VITE_SERVER_URL || '';

function MotoDetail() {
  const { id } = useParams();
  const { data, isLoading } = useGetMotorcycleByIdQuery(String(id));
  const [createBooking, { isLoading: isBooking }] = useCreateBookingMutation();
  const [isOpen, setIsOpen] = React.useState(false);
  const { show } = useToast();

  const mc = useMemo(() => {
    if (!data) return null;
    const m = data as Motorcycle;
    const images = (m.photos ?? []).map((p) => p.image.startsWith('http') ? p.image : `${serverUrl}${p.image}`);
    return {
      id: m.id,
      name: `${m.brand} ${m.model}`,
      power: `${m.power} л.с.`,
      engine: `${m.engine_volume} cc`,
      price: `${m.daily_price} ₽/день`,
      description: m.description,
      images: images.length ? images : ['/mainFon.jpg']
    };
  }, [data]);

  if (isLoading) {
    return (
      <div className={styles.detailLoading}>
        <div className={styles.loadingSpinner}></div>
        <p>Загрузка информации о мотоцикле...</p>
      </div>
    );
  }

  if (!mc) {
    return (
      <div className={styles.notFound}>
        <h2>Мотоцикл не найден</h2>
        <Link to="/catalog" className={styles.backButton}>Вернуться в каталог</Link>
      </div>
    );
  }

  return (
    <div className={styles.detailPage}>
      <div className={styles.detailContainer}>
        <div className={styles.detailHeader}>
          <Link to="/catalog" className={styles.backLink}>
            ← Назад в каталог
          </Link>
          <h1>{mc.name}</h1>
        </div>
        
        <div className={styles.detailContent}>
          <div
            className={styles.detailImage}
            onMouseEnter={(e) => {
              const container = e.currentTarget as any;
              container._images = mc.images;
              if (!container._images || container._images.length < 2) return;
              container._idx = 0;
              container._dir = 1;
              const base = container.querySelector('img[data-role="base"]') as HTMLImageElement;
              const overlay = container.querySelector('img[data-role="overlay"]') as HTMLImageElement;
              container._interval = setInterval(() => {
                const len = container._images.length;
                container._idx = (container._idx + container._dir + len) % len;
                const nextSrc = container._images[container._idx];
                overlay.src = nextSrc;
                overlay.style.opacity = '1';
                setTimeout(() => {
                  base.src = nextSrc;
                  overlay.style.opacity = '0';
                }, 400);
              }, 1600);
            }}
            onMouseMove={(e) => {
              const container = e.currentTarget as any;
              if (!container._images) return;
              const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
              const x = e.clientX - rect.left;
              container._dir = x < rect.width / 2 ? -1 : 1;
            }}
            onMouseLeave={(e) => {
              const container = e.currentTarget as any;
              if (container._interval) clearInterval(container._interval);
              const base = container.querySelector('img[data-role="base"]') as HTMLImageElement;
              const overlay = container.querySelector('img[data-role="overlay"]') as HTMLImageElement;
              base.src = mc.images[0];
              overlay.style.opacity = '0';
            }}
          >
            <img data-role="base" className={styles.imgBase} src={mc.images[0]} alt={mc.name} />
            <img data-role="overlay" className={styles.imgOverlay} src={mc.images[0]} alt="overlay" />
          </div>
          
          <div className={styles.detailInfo}>
            <div className={styles.detailPrice}>
              {mc.price}
            </div>
            
            <div className={styles.detailDescription}>
              <h3>Описание</h3>
              <p>{mc.description}</p>
            </div>

            <div className={styles.detailSpecs}>
              <h3>Характеристики</h3>
              <div className={styles.specsGrid}>
                <div className={styles.specItem}>
                  <span className={styles.specLabel}>Бренд</span>
                  <span className={styles.specValue}>{(data as Motorcycle).brand}</span>
                </div>
                <div className={styles.specItem}>
                  <span className={styles.specLabel}>Модель</span>
                  <span className={styles.specValue}>{(data as Motorcycle).model}</span>
                </div>
                <div className={styles.specItem}>
                  <span className={styles.specLabel}>Год</span>
                  <span className={styles.specValue}>{(data as Motorcycle).year}</span>
                </div>
                <div className={styles.specItem}>
                  <span className={styles.specLabel}>Категория</span>
                  <span className={styles.specValue}>{(data as Motorcycle).category}</span>
                </div>
                <div className={styles.specItem}>
                  <span className={styles.specLabel}>Объем двигателя</span>
                  <span className={styles.specValue}>{(data as Motorcycle).engine_volume} cc</span>
                </div>
                <div className={styles.specItem}>
                  <span className={styles.specLabel}>Мощность</span>
                  <span className={styles.specValue}>{(data as Motorcycle).power} л.с.</span>
                </div>
                <div className={styles.specItem}>
                  <span className={styles.specLabel}>Тип топлива</span>
                  <span className={styles.specValue}>{(data as Motorcycle).fuel_type}</span>
                </div>
                <div className={styles.specItem}>
                  <span className={styles.specLabel}>Трансмиссия</span>
                  <span className={styles.specValue}>{(data as Motorcycle).transmission}</span>
                </div>
                <div className={styles.specItem}>
                  <span className={styles.specLabel}>Вес</span>
                  <span className={styles.specValue}>{(data as Motorcycle).weight} кг</span>
                </div>
                <div className={styles.specItem}>
                  <span className={styles.specLabel}>Мин. аренда (часы)</span>
                  <span className={styles.specValue}>{(data as Motorcycle).min_rental_hours}</span>
                </div>
                <div className={styles.specItem}>
                  <span className={styles.specLabel}>Мин. аренда (дни)</span>
                  <span className={styles.specValue}>{(data as Motorcycle).min_rental_days}</span>
                </div>
                <div className={styles.specItem}>
                  <span className={styles.specLabel}>Доступность</span>
                  <span className={styles.specValue}>{(data as Motorcycle).is_available ? 'доступен' : 'недоступен'}</span>
                </div>
              </div>
            </div>

            <div className={styles.detailFeatures}>
              <h3>Особенности</h3>
              <ul>
                <li>Категория: {(data as Motorcycle).category}</li>
                <li>Топливо: {(data as Motorcycle).fuel_type}</li>
                <li>Трансмиссия: {(data as Motorcycle).transmission}</li>
                <li>Мин. аренда: {(data as Motorcycle).min_rental_hours} ч / {(data as Motorcycle).min_rental_days} дн</li>
                {/* TODO сделать норм переход на старницу профиля */}
                {(data as Motorcycle).owner_email && (
                  <li>Владелец: <Link to={`/users/${(data as Motorcycle).owner_email}`}>{(data as Motorcycle).owner_email}</Link></li>
                )}
              </ul>
            </div>

            <div className={styles.detailActions}>
              <button className={styles.rentButton} onClick={()=>setIsOpen(true)} disabled={isBooking}>Арендовать</button>
              <button className={styles.favoritesButton}>В избранное</button>
            </div>
          </div>
        </div>
      </div>
      <BookingModal
        isOpen={isOpen}
        onClose={()=>setIsOpen(false)}
        motorcycleId={mc.id}
        dailyPrice={Number((data as Motorcycle).daily_price)}
        onSubmit={async ({ booking_type, start_time, end_time }) => {
          try {
            await createBooking({
              motorcycle: mc.id,
              booking_type,
              rental_period: { start_time, end_time },
            }).unwrap()
            setIsOpen(false)
            show('Бронирование создано', 'success')
          } catch (e: any) {
            // Ошибки валидации бэка будут отображены отдельной модалкой/тостом при доработке
            console.error(e)
            show('Не удалось создать бронирование', 'error')
          }
        }}
      />
    </div>
  );
}

export default MotoDetail;