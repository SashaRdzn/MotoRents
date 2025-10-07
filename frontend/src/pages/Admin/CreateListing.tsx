import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import AddMotorcycleModal from '@/components/AddMotorcycleModal/AddMotorcycleModal'
import styles from './createListing.module.scss'
import type { RootState } from '@/app/store/store'

const CreateListing = () => {
  const navigate = useNavigate()
  const role = useSelector((state: RootState) => state.auth.user?.role)
  const [showAddModal, setShowAddModal] = useState(false)

  // Проверяем права администратора
  if (role !== 'admin') {
    navigate('/')
    return null
  }

  return (
    <section className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Создание объявления</h1>
        <p className={styles.subtitle}>
          Добавьте новый мотоцикл в систему аренды
        </p>
      </div>

      <div className={styles.content}>
        <div className={styles.infoCard}>
          <h2>Информация о создании объявления</h2>
          <ul>
            <li>Все поля обязательны для заполнения</li>
            <li>Можно загрузить несколько фотографий мотоцикла</li>
            <li>Первая загруженная фотография станет главной</li>
            <li>Мотоцикл будет автоматически опубликован в общем каталоге</li>
            <li>Вы можете изменить статус публикации позже</li>
          </ul>
        </div>

        <div className={styles.actions}>
          <button 
            className={styles.createButton}
            onClick={() => setShowAddModal(true)}
          >
            Создать объявление
          </button>
          
          <button 
            className={styles.backButton}
            onClick={() => navigate('/my-motorcycles')}
          >
            Вернуться к управлению
          </button>
        </div>
      </div>

      {showAddModal && (
        <AddMotorcycleModal 
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false)
            navigate('/my-motorcycles')
          }}
          userRole="admin"
        />
      )}
    </section>
  )
}

export default CreateListing
