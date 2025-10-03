import { useState } from 'react'
import { 
  useGetMyMotorcyclesQuery, 
  useToggleMotorcyclePublicMutation 
} from '@/app/api/api'
import styles from './myMotorcycles.module.scss'
import { useToast } from '@/components/Toast/ToastProvider'
import AddMotorcycleModal from './AddMotorcycleModal'

const MyMotorcycles = () => {
  const { data: motorcycles, isLoading, refetch } = useGetMyMotorcyclesQuery()
  const [togglePublic] = useToggleMotorcyclePublicMutation()
  const { show } = useToast()
  const [showAddModal, setShowAddModal] = useState(false)

  const handleTogglePublic = async (id: number) => {
    try {
      const result = await togglePublic(id).unwrap()
      show(result.message, 'success')
    } catch (e: any) {
      show(e.data?.error || 'Ошибка изменения публикации', 'error')
    }
  }

  if (isLoading) {
    return (
      <section className={styles.page}>
        <div className={styles.loading}>Загрузка...</div>
      </section>
    )
  }

  return (
    <section className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Мои мотоциклы</h1>
        <button 
          className={styles.addButton}
          onClick={() => setShowAddModal(true)}
        >
          + Добавить мотоцикл
        </button>
      </div>

      {motorcycles && motorcycles.length > 0 ? (
        <div className={styles.motorcyclesGrid}>
          {motorcycles.map((motorcycle: any) => (
            <div key={motorcycle.id} className={styles.motorcycleCard}>
              <div className={styles.motorcycleImage}>
                {motorcycle.photos && motorcycle.photos.length > 0 ? (
                  <img 
                    src={motorcycle.photos[0].image} 
                    alt={motorcycle.brand}
                    className={styles.image}
                  />
                ) : (
                  <div className={styles.placeholderImage}>
                    <span>Фото</span>
                  </div>
                )}
                <div className={styles.statusBadge}>
                  {motorcycle.is_public ? 'Публичный' : 'Приватный'}
                </div>
              </div>
              
              <div className={styles.motorcycleInfo}>
                <h3 className={styles.motorcycleTitle}>
                  {motorcycle.brand} {motorcycle.model}
                </h3>
                <p className={styles.motorcycleYear}>{motorcycle.year} год</p>
                <p className={styles.motorcyclePrice}>
                  {motorcycle.daily_price} ₽/день
                </p>
                <p className={styles.motorcycleDescription}>
                  {motorcycle.description}
                </p>
                
                <div className={styles.motorcycleActions}>
                  <button 
                    className={motorcycle.is_public ? styles.unpublishButton : styles.publishButton}
                    onClick={() => handleTogglePublic(motorcycle.id)}
                  >
                    {motorcycle.is_public ? 'Убрать из каталога' : 'Опубликовать'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <h3>У вас пока нет мотоциклов</h3>
          <p>Добавьте свой первый мотоцикл для аренды</p>
          <button 
            className={styles.addFirstButton}
            onClick={() => setShowAddModal(true)}
          >
            Добавить мотоцикл
          </button>
        </div>
      )}

      {showAddModal && (
        <AddMotorcycleModal 
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false)
            refetch()
            show('Мотоцикл добавлен', 'success')
          }}
        />
      )}
    </section>
  )
}

export default MyMotorcycles
