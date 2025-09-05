import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './home.module.scss';

function HomePage() {
  const [activeFaq, setActiveFaq] = useState(null);
  const faqRefs = useRef([]);

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  // Функция для получения элементов под текущим
  const getElementsBelow = (index) => {
    if (!faqRefs.current[index]) return [];
    
    const currentElement = faqRefs.current[index];
    const currentRect = currentElement.getBoundingClientRect();
    const elementsBelow = [];
    
    faqRefs.current.forEach((ref, i) => {
      if (ref && i !== index) {
        const rect = ref.getBoundingClientRect();
        // Проверяем, находится ли элемент ниже и в той же колонке
        if (rect.top > currentRect.bottom && 
            Math.abs(rect.left - currentRect.left) < 50) {
          elementsBelow.push(ref);
        }
      }
    });
    
    return elementsBelow;
  };

  // Эффект для применения трансформации к элементам ниже
  useEffect(() => {
    if (activeFaq !== null) {
      const elementsBelow = getElementsBelow(activeFaq);
      const currentElement = faqRefs.current[activeFaq];
      const expandedHeight = currentElement?.scrollHeight || 0;
      
      // Применяем трансформацию к элементам ниже
      elementsBelow.forEach(element => {
        element.style.transform = `translateY(${expandedHeight}px)`;
        element.style.transition = 'transform 0.3s ease';
      });
      
      // Очищаем трансформацию при закрытии
      return () => {
        elementsBelow.forEach(element => {
          element.style.transform = 'translateY(0)';
        });
      };
    }
  }, [activeFaq]);

  // Преимущества
  const advantages = [
    {
      title: "Лучший выбор",
      description: "Большой парк мотоциклов разных классов и мощностей",
      icon: "🏍️"
    },
    {
      title: "Гибкие условия",
      description: "Аренда от нескольких часов до нескольких месяцев",
      icon: "📅"
    },
    {
      title: "Полная безопасность",
      description: "Все мотоциклы проходят регулярное техническое обслуживание",
      icon: "🛡️"
    },
    {
      title: "Простая бронь",
      description: "Удобная система онлайн-бронирования без скрытых платежей",
      icon: "✓"
    }
  ];

  // Популярные мотоциклы для карусели
  const carouselMotorcycles = [
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
    }
  ];

  // Отзывы для карусели
  const testimonials = [
    {
      name: "Александр",
      text: "Отличный сервис! Мотоцикл был в идеальном состоянии, персонал очень вежливый. Обязательно вернусь снова!",
      rating: 5
    },
    {
      name: "Мария",
      text: "Брала мотоцикл впервые для поездки за город. Все прошло гладко, дали все необходимые инструкции. Очень понравилось!",
      rating: 5
    },
    {
      name: "Дмитрий",
      text: "Арендовал мотоцикл на выходные. Цены адекватные, техника в порядке. Рекомендую!",
      rating: 4
    },
    {
      name: "Екатерина",
      text: "Отличный опыт аренды! Мотоцикл был новым, процесс бронирования простым. Обязательно воспользуюсь снова.",
      rating: 5
    },
    {
      name: "Игорь",
      text: "Профессиональный подход и отличная техника. Арендовал уже несколько раз и всегда доволен результатом.",
      rating: 5
    }
  ];

  // Шаги аренды
  const rentalSteps = [
    {
      step: 1,
      title: "Выберите мотоцикл",
      description: "Изучите наш каталог и выберите подходящий мотоцикл"
    },
    {
      step: 2,
      title: "Оформите заявку",
      description: "Заполните короткую форму и выберите удобные даты"
    },
    {
      step: 3,
      title: "Получите мотоцикл",
      description: "Приезжайте в указанное время и забирайте мотоцикл"
    },
    {
      step: 4,
      title: "Наслаждайтесь поездкой",
      description: "Получайте удовольствие от езды и возвращайте мотоцикл в срок"
    }
  ];

  // Наши достижения
  const achievements = [
    {
      number: "500+",
      title: "Мотоциклов в парке"
    },
    {
      number: "10 000+",
      title: "Довольных клиентов"
    },
    {
      number: "5",
      title: "Лет на рынке"
    },
    {
      number: "24/7",
      title: "Поддержка клиентов"
    }
  ];

  // Часто задаваемые вопросы
  const faqs = [
    {
      question: "Какие документы нужны для аренды мотоцикла?",
      answer: "Для аренды мотоцикла вам понадобятся: паспорт гражданина РФ, водительское удостоверение категории А (или открытое подкатегорию А1 для мотоциклов с объемом двигателя до 125 куб.см), действующая не менее 2 лет. Также требуется предоставить банковскую карту для удержания залоговой суммы, которая составляет от 10 000 до 50 000 рублей в зависимости от модели мотоцикла."
    },
    {
      question: "Можно ли арендовать мотоцикл без опыта езды?",
      answer: "Да, у нас есть специальные предложения для новичков! Мы предлагаем мотоциклы с небольшим объемом двигателя (до 125 куб.см), которые легко управляются. Кроме того, вы можете заказать услугу инструктора, который проведет для вас вводный инструктаж и будет сопровождать вас в течение первой поездки. Также у нас есть теоретический курс по основам безопасной езды."
    },
    {
      question: "Что входит в стоимость аренды мотоцикла?",
      answer: "Базовая стоимость аренды включает: использование мотоцикла на согласованный срок, обязательную страховку ОСАГО и КАСКО, шлем (один размер), топливо для первой поездки (полный бак). Дополнительно вы можете заказать: экипировку (куртка, штаны, перчатки, защита), дополнительную страховку от несчастных случаев, навигатор, багажные крепления, а также услуги доставки и возврата мотоцикла по указанному адресу."
    },
    {
      question: "Можно ли выехать за пределы города на арендованном мотоцикле?",
      answer: "Да, большинство мотоциклов можно выезжать за пределы города, но с некоторыми ограничениями. Для мотоциклов класса до 400 куб.см разрешены поездки в радиусе 200 км от города. Для более мощных мотоциклов (свыше 400 куб.см) возможны поездки по всей территории РФ, за исключением труднодоступных регионов и зон с особыми режимами. Обязательно предупредите менеджера о планируемом маршруте при бронировании."
    },
    {
      question: "Что делать в случае поломки мотоцикла во время аренды?",
      answer: "В случае любой поломки или неисправности мотоцикла немедленно свяжитесь с нашей службой поддержки по круглосуточному телефону. Мы организуем эвакуацию мотоцикла и предоставим замену в кратчайшие сроки (в течение 4 часов в черте города и 12 часов за его пределами). Все расходы на ремонт и эвакуацию покрываются нашей страховой компанией, за исключением случаев повреждения мотоцикла по вине арендатора."
    },
    {
      question: "Какие ограничения по пробегу существуют?",
      answer: "Для аренды на срок до 3 дней установлен лимит пробега 200 км в сутки. При аренде на срок от 4 до 7 дней - 150 км в сутки. При аренде на срок более 7 дней - 120 км в сутки. Превышение лимита пробега оплачивается дополнительно из расчета 5 рублей за каждый лишний километр. Для любителей дальних поездок мы предлагаем специальные тарифы с неограниченным пробегом."
    },
    {
      question: "Можно ли арендовать мотоцикл для участия в мотопробегах или соревнованиях?",
      answer: "Нет, использование арендованных мотоциклов для участия в любых спортивных мероприятиях, гонках, мотопробегах или экстремальном вождении строго запрещено. Нарушение этого условия влечет за собой немедленное расторжение договора аренды без возврата денежных средств и полное возмещение ущерба в случае повреждения мотоцикла."
    },
    {
      question: "Какие способы оплаты аренды вы принимаете?",
      answer: "Мы принимаем различные способы оплаты: наличными в наших офисах, банковскими картами (Visa, MasterCard, Мир) онлайн или при получении мотоцикла, безналичным расчетом для юридических лиц, а также через системы электронных платежей (ЮMoney, WebMoney, Qiwi). Для постоянных клиентов доступна оплата по счету с отсрочкой платежа до 5 дней."
    }
  ];

  return (
    <div className={styles.homePage}>
      {/* Герой-секция */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            АРЕНДА И ПРОКАТ<br />
            <span>МОТОЦИКЛОВ</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Откройте для себя свободу передвижения с нашим парком современных мотоциклов
          </p>
          <div className={styles.heroButtons}>
            <Link to="/catalog" className={styles.primaryButton}>Каталог мотоциклов</Link>
            <Link to="/contacts" className={styles.secondaryButton}>Связаться с нами</Link>
          </div>
        </div>
      </section>

      {/* Преимущества */}
      <section className={styles.advantages}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>ПОЧЕМУ ВЫБИРАЮТ НАС</h2>
          <div className={styles.advantagesGrid}>
            {advantages.map((advantage, index) => (
              <div key={index} className={styles.advantageCard}>
                <div className={styles.advantageIcon}>
                  <div className={styles.iconGradient}>
                    <span className={styles.iconEmoji}>{advantage.icon}</span>
                  </div>
                </div>
                <h3>{advantage.title}</h3>
                <p>{advantage.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Наши достижения */}
      <section className={styles.achievements}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>НАШИ ДОСТИЖЕНИЯ</h2>
          <div className={styles.achievementsGrid}>
            {achievements.map((achievement, index) => (
              <div key={index} className={styles.achievementCard}>
                <div className={styles.achievementNumber}>{achievement.number}</div>
                <div className={styles.achievementTitle}>{achievement.title}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Карусель мотоциклов */}
      <section className={styles.motorcycleCarousel}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>НАШИ МОТОЦИКЛЫ</h2>
          <div className={styles.carouselContainer}>
            <div className={styles.carouselTrack}>
              {/* Дублируем элементы для бесконечной прокрутки */}
              {[...carouselMotorcycles, ...carouselMotorcycles].map((bike, index) => (
                <div key={`${bike.id}-${index}`} className={styles.carouselItem}>
                  <div className={styles.carouselItemImage}>
                    <img src={bike.image} alt={bike.name} />
                  </div>
                  <div className={styles.carouselItemInfo}>
                    <h3>{bike.name}</h3>
                    <div className={styles.carouselItemSpecs}>
                      <span>{bike.power}</span>
                      <span>{bike.engine}</span>
                    </div>
                    <div className={styles.carouselItemPrice}>
                      {bike.price}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Как это работает */}
      <section className={styles.howItWorks}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>КАК ЭТО РАБОТАЕТ</h2>
          <div className={styles.stepsGrid}>
            {rentalSteps.map((step) => (
              <div key={step.step} className={styles.stepCard}>
                <div className={styles.stepNumber}>
                  <div className={styles.stepNumberGradient}>{step.step}</div>
                </div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Часто задаваемые вопросы */}
      <section className={styles.faq}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>ЧАСТО ЗАДАВАЕМЫЕ ВОПРОСЫ</h2>
          <div className={styles.faqGrid}>
            {faqs.map((faq, index) => (
              <div 
                key={index}
                ref={el => faqRefs.current[index] = el}
                className={`${styles.faqItem} ${activeFaq === index ? styles.active : ''}`}
                onClick={() => toggleFaq(index)}
              >
                <div className={styles.faqQuestion}>
                  <h3>{faq.question}</h3>
                  <div className={styles.faqToggle}>{activeFaq === index ? '−' : '+'}</div>
                </div>
                <div className={styles.faqAnswer}>
                  <p>{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Карусель отзывов */}
      <section className={styles.testimonialsCarousel}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>ОТЗЫВЫ НАШИХ КЛИЕНТОВ</h2>
          <div className={styles.carouselContainer}>
            <div className={styles.carouselTrackReverse}>
              {/* Дублируем элементы для бесконечной прокрутки */}
              {[...testimonials, ...testimonials].map((testimonial, index) => (
                <div key={`${testimonial.name}-${index}`} className={styles.testimonialCard}>
                  <div className={styles.testimonialRating}>
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={i < testimonial.rating ? styles.starFilled : styles.starEmpty}>★</span>
                    ))}
                  </div>
                  <p className={styles.testimonialText}>"{testimonial.text}"</p>
                  <p className={styles.testimonialAuthor}>{testimonial.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Призыв к действию */}
      <section className={styles.cta}>
        <div className={styles.container}>
          <div className={styles.ctaContent}>
            <h2>ГОТОВЫ К ПРИКЛЮЧЕНИЮ?</h2>
            <p>Забронируйте мотоцикл прямо сейчас и получите скидку 10% на первую аренду</p>
            <Link to="/catalog" className={styles.ctaButton}>Выбрать мотоцикл</Link>
          </div>
        </div>
      </section>

      {/* Футер */}
      <footer className={styles.footer}>
        <div className={styles.container}>
          <div className={styles.footerContent}>
            <div className={styles.footerLogo}>
              <div className={styles.logoPlaceholder}></div>
              <h3>MOTO RENT</h3>
            </div>
            <div className={styles.footerLinks}>
              <div className={styles.footerColumn}>
                <h4>Навигация</h4>
                <ul>
                  <li><Link to="/">Главная</Link></li>
                  <li><Link to="/catalog">Каталог</Link></li>
                  <li><Link to="/about">О нас</Link></li>
                  <li><Link to="/contacts">Контакты</Link></li>
                </ul>
              </div>
              <div className={styles.footerColumn}>
                <h4>Услуги</h4>
                <ul>
                  <li><Link to="/services/rent">Аренда</Link></li>
                  <li><Link to="/services/tours">Туры</Link></li>
                  <li><Link to="/services/training">Обучение</Link></li>
                  <li><Link to="/services/maintenance">Обслуживание</Link></li>
                </ul>
              </div>
              <div className={styles.footerColumn}>
                <h4>Контакты</h4>
                <ul>
                  <li>Телефон: +7980 987-64-3</li>
                  <li>Email: moto.go@gmail.com</li>
                  <li>Адрес: г. Москва, ул. Мотоциклетная, д. 15</li>
                </ul>
              </div>
            </div>
          </div>
          <div className={styles.footerBottom}>
            <p>© 2023 MOTO RENT. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;