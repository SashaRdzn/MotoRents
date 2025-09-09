import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import styles from './catalog.module.scss';
import { useGetMotorcyclesQuery } from '@/app/api/api';
import type { Motorcycle } from './catalogApi';
const serverUrl = import.meta.env.VITE_SERVER_URL || '';

function CatalogPage() {
  const { data, isLoading, isFetching } = useGetMotorcyclesQuery();

  const motorcycles = useMemo(() => {
    const items = (data ?? []) as Motorcycle[];
    return items.map((m) => ({
      id: m.id,
      name: `${m.brand} ${m.model}`,
      power: `${m.power} л.с.`,
      engine: `${m.engine_volume} cc`,
      price: `${m.daily_price} ₽/день`,
      images: (m.photos ?? []).map((p) => p.image.startsWith('http') ? p.image : `${serverUrl}${p.image}`),
      image: (m.photos && m.photos.length > 0)
        ? (m.photos[0].image.startsWith('http') ? m.photos[0].image : `${serverUrl}${m.photos[0].image}`)
        : '/mainFon.jpg',
    }));
  }, [data]);

  return (
    <div className={styles.catalog}>
      <div className={styles.catalogHeader}>
        <h1>КАТАЛОГ МОТОЦИКЛОВ</h1>
        <p>Выберите идеальный мотоцикл для ваших приключений</p>
      </div>

      <div className={styles.catalogGrid}>
        {motorcycles.map((motorcycle, index) => {
          if (motorcycles.length === index + 1) {
            return (
              <div
                key={motorcycle.id}
                className={styles.motorcycleCard}
              >
                <Link to={`/motorcycle/${motorcycle.id}`}>
                  <div
                    className={styles.motorcycleImage}
                    onMouseEnter={(e) => {
                      const images = (motorcycle as any).images as string[] | undefined;
                      if (!images || images.length < 2) return;
                      const container = e.currentTarget as any;
                      container._images = images;
                      container._idx = 0;
                      container._dir = 1; // 1 вперед, -1 назад
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
                      const dir = x < rect.width / 2 ? -1 : 1;
                      container._dir = dir;
                    }}
                    onMouseLeave={(e) => {
                      const container = e.currentTarget as any;
                      if (container._interval) clearInterval(container._interval);
                      const base = container.querySelector('img[data-role="base"]') as HTMLImageElement;
                      const overlay = container.querySelector('img[data-role="overlay"]') as HTMLImageElement;
                      base.src = (motorcycle as any).image;
                      overlay.style.opacity = '0';
                    }}
                  >
                    <img data-role="base" className={styles.imgBase} src={motorcycle.image} alt={motorcycle.name} />
                    <img data-role="overlay" className={styles.imgOverlay} src={motorcycle.image} alt="overlay" />
                  </div>
                  <div className={styles.motorcycleInfo}>
                    <h3>{motorcycle.name}</h3>
                    <div className={styles.motorcycleSpecs}>
                      <span>Мощность: {motorcycle.power}</span>
                      <span>Двигатель: {motorcycle.engine}</span>
                    </div>
                    <div className={styles.motorcyclePrice}>
                      {motorcycle.price}
                    </div>
                  </div>
                </Link>
              </div>
            );
          } else {
            return (
              <div key={motorcycle.id} className={styles.motorcycleCard}>
                <Link to={`/motorcycle/${motorcycle.id}`}>
                  <div
                    className={styles.motorcycleImage}
                    onMouseEnter={(e) => {
                      const images = (motorcycle as any).images as string[] | undefined;
                      if (!images || images.length < 2) return;
                      const container = e.currentTarget as any;
                      container._images = images;
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
                      const dir = x < rect.width / 2 ? -1 : 1;
                      container._dir = dir;
                    }}
                    onMouseLeave={(e) => {
                      const container = e.currentTarget as any;
                      if (container._interval) clearInterval(container._interval);
                      const base = container.querySelector('img[data-role="base"]') as HTMLImageElement;
                      const overlay = container.querySelector('img[data-role="overlay"]') as HTMLImageElement;
                      base.src = (motorcycle as any).image;
                      overlay.style.opacity = '0';
                    }}
                  >
                    <img data-role="base" className={styles.imgBase} src={motorcycle.image} alt={motorcycle.name} />
                    <img data-role="overlay" className={styles.imgOverlay} src={motorcycle.image} alt="overlay" />
                  </div>
                  <div className={styles.motorcycleInfo}>
                    <h3>{motorcycle.name}</h3>
                    <div className={styles.motorcycleSpecs}>
                      <span>Мощность: {motorcycle.power}</span>
                      <span>Двигатель: {motorcycle.engine}</span>
                    </div>
                    <div className={styles.motorcyclePrice}>
                      {motorcycle.price}
                    </div>
                  </div>
                </Link>
              </div>
            );
          }
        })}
      </div>

      {(isLoading || isFetching) && (
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p>Загрузка мотоциклов...</p>
        </div>
      )}
    </div>
  );
}

export default CatalogPage;