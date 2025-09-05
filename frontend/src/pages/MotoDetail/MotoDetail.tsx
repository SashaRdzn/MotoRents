// pages/MotorcycleDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import styles from './motoDetail.module.scss';

function MotoDetail() {
  const { id } = useParams();
  const [motorcycle, setMotorcycle] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Заглушка для данных мотоцикла
  const mockMotorcycle = {
    id: parseInt(id),
    name: "KAYO TT124",
    power: "9 л.с.",
    engine: "154FMI",
    price: "2500 ₽/день",
    image: "https://z-cdn-media.chatglm.cn/files/315f36f2-1b9b-476c-aa65-25561030c5e5_pasted_image_1757102204561.png?auth_key=1788649079-b0eaca9d20e649ccb9d985e35fd56150-0-b3c7258c9e12107598900716d6247275",
    description: "Компактный и маневренный мотоцикл, идеальный для городских поездок и обучения езде. Обладает отличной управляемостью и экономичным расходом топлива.",
    specs: {
      type: "Спорт",
      weight: "110 кг",
      fuelTank: "10 л",
      topSpeed: "90 км/ч",
      transmission: "4-ступенчатая",
      brakes: "Дисковые тормоза"
    },
    features: [
      "Экономичный расход топлива",
      "Компактные габариты",
      "Легкий вес",
      "Надежная конструкция",
      "Простота в обслуживании"
    ]
  };

  useEffect(() => {
    // Имитация загрузки данных с сервера
    setLoading(true);
    
    setTimeout(() => {
      setMotorcycle(mockMotorcycle);
      setLoading(false);
    }, 500);
  }, [id]);

  if (loading) {
    return (
      <div className={styles.detailLoading}>
        <div className={styles.loadingSpinner}></div>
        <p>Загрузка информации о мотоцикле...</p>
      </div>
    );
  }

  if (!motorcycle) {
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
          <h1>{motorcycle.name}</h1>
        </div>
        
        <div className={styles.detailContent}>
          <div className={styles.detailImage}>
            <img src={motorcycle.image} alt={motorcycle.name} />
          </div>
          
          <div className={styles.detailInfo}>
            <div className={styles.detailPrice}>
              {motorcycle.price}
            </div>
            
            <div className={styles.detailDescription}>
              <h3>Описание</h3>
              <p>{motorcycle.description}</p>
            </div>
            
            <div className={styles.detailSpecs}>
              <h3>Характеристики</h3>
              <div className={styles.specsGrid}>
                {Object.entries(motorcycle.specs).map(([key, value]) => (
                  <div key={key} className={styles.specItem}>
                    <span className={styles.specLabel}>
                      {key === 'type' ? 'Тип' : 
                       key === 'weight' ? 'Вес' :
                       key === 'fuelTank' ? 'Топливный бак' :
                       key === 'topSpeed' ? 'Макс. скорость' :
                       key === 'transmission' ? 'Трансмиссия' :
                       key === 'brakes' ? 'Тормоза' : key}
                    </span>
                    <span className={styles.specValue}>{value}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className={styles.detailFeatures}>
              <h3>Особенности</h3>
              <ul>
                {motorcycle.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
            
            <div className={styles.detailActions}>
              <button className={styles.rentButton}>Арендовать</button>
              <button className={styles.favoritesButton}>В избранное</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MotoDetail;