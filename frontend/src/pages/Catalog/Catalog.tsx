// pages/CatalogPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import styles from './catalog.module.scss';

function CatalogPage() {
  const [motorcycles, setMotorcycles] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();
  
  // Заглушка для данных мотоциклов
  const mockMotorcycles = [
    {
      id: 1,
      name: "KAYO TT124",
      power: "9 л.с.",
      engine: "154FMI",
      price: "2500 ₽/день",
      image: "https://z-cdn-media.chatglm.cn/files/315f36f2-1b9b-476c-aa65-25561030c5e5_pasted_image_1757102204561.png?auth_key=1788649079-b0eaca9d20e649ccb9d985e35fd56150-0-b3c7258c9e12107598900716d6247275"
    },
    {
      id: 2,
      name: "Honda CBR300R",
      power: "28 л.с.",
      engine: "286cc",
      price: "3500 ₽/день",
      image: "https://z-cdn-media.chatglm.cn/files/0f63f5d8-7125-4ec3-aa42-ef98d534b9e5_pasted_image_1757102906958.png?auth_key=1788649079-a7a2179e703d4f86a5b1cdde4a7490a3-0-8b2f585a7ff0ede8901b676aa2dd6d28"
    },
    {
      id: 3,
      name: "Yamaha YZF-R3",
      power: "42 л.с.",
      engine: "321cc",
      price: "4500 ₽/день",
      image: "https://z-cdn-media.chatglm.cn/files/315f36f2-1b9b-476c-aa65-25561030c5e5_pasted_image_1757102204561.png?auth_key=1788649079-b0eaca9d20e649ccb9d985e35fd56150-0-b3c7258c9e12107598900716d6247275"
    },
    {
      id: 4,
      name: "Kawasaki Ninja 400",
      power: "49 л.с.",
      engine: "399cc",
      price: "5000 ₽/день",
      image: "https://z-cdn-media.chatglm.cn/files/0f63f5d8-7125-4ec3-aa42-ef98d534b9e5_pasted_image_1757102906958.png?auth_key=1788649079-a7a2179e703d4f86a5b1cdde4a7490a3-0-8b2f585a7ff0ede8901b676aa2dd6d28"
    },
    {
      id: 5,
      name: "Suzuki GSX-S750",
      power: "114 л.с.",
      engine: "749cc",
      price: "6500 ₽/день",
      image: "https://z-cdn-media.chatglm.cn/files/315f36f2-1b9b-476c-aa65-25561030c5e5_pasted_image_1757102204561.png?auth_key=1788649079-b0eaca9d20e649ccb9d985e35fd56150-0-b3c7258c9e12107598900716d6247275"
    },
    {
      id: 6,
      name: "Ducati Monster 821",
      power: "112 л.с.",
      engine: "821cc",
      price: "7500 ₽/день",
      image: "https://z-cdn-media.chatglm.cn/files/0f63f5d8-7125-4ec3-aa42-ef98d534b9e5_pasted_image_1757102906958.png?auth_key=1788649079-a7a2179e703d4f86a5b1cdde4a7490a3-0-8b2f585a7ff0ede8901b676aa2dd6d28"
    },
  ];

  // Имитация загрузки данных с сервера
  const fetchMotorcycles = () => {
    setLoading(true);
    
    // Имитация задержки запроса
    setTimeout(() => {
      // Добавляем новые мотоциклы (в реальном приложении здесь будет запрос к API)
      const newMotorcycles = [...mockMotorcycles, ...mockMotorcycles].map((bike, index) => ({
        ...bike,
        id: bike.id + (page - 1) * mockMotorcycles.length
      }));
      
      setMotorcycles(prev => [...prev, ...newMotorcycles]);
      setLoading(false);
      
      // Имитация окончания данных (после 3 страниц)
      if (page >= 3) {
        setHasMore(false);
      }
    }, 800);
  };

  // Загрузка первой страницы
  useEffect(() => {
    fetchMotorcycles();
  }, []);

  // Настройка Intersection Observer для бесконечной прокрутки
  const lastMotorcycleRef = useRef();
  
  useEffect(() => {
    if (loading) return;
    
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prev => prev + 1);
      }
    });
    
    if (lastMotorcycleRef.current) {
      observer.current.observe(lastMotorcycleRef.current);
    }
    
    return () => {
      if (observer.current) observer.current.disconnect();
    };
  }, [loading, hasMore]);

  // Загрузка данных при изменении страницы
  useEffect(() => {
    if (page > 1) {
      fetchMotorcycles();
    }
  }, [page]);

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
                ref={lastMotorcycleRef} 
                key={motorcycle.id} 
                className={styles.motorcycleCard}
              >
                <Link to={`/motorcycle/${motorcycle.id}`}>
                  <div className={styles.motorcycleImage}>
                    <img src={motorcycle.image} alt={motorcycle.name} />
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
                  <div className={styles.motorcycleImage}>
                    <img src={motorcycle.image} alt={motorcycle.name} />
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
      
      {loading && (
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p>Загрузка мотоциклов...</p>
        </div>
      )}
      
      {!hasMore && (
        <div className={styles.endMessage}>
          <p>Вы просмотрели все доступные мотоциклы</p>
        </div>
      )}
    </div>
  );
}

export default CatalogPage;