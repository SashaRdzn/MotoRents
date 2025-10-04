import { useState } from 'react'
import { useSelector } from 'react-redux'
import { 
  useGetMyMotorcyclesQuery, 
  useGetMotorcyclesQuery,
  useToggleMotorcyclePublicMutation 
} from '@/app/api/api'
import styles from './myMotorcycles.module.scss'
import { useToast } from '@/components/Toast/ToastProvider'
import AddMotorcycleModal from './AddMotorcycleModal'
import type { RootState } from '@/app/store/store'

const MyMotorcycles = () => {
  const role = useSelector((state: RootState) => state.auth.user?.role)
  const isLandlord = role === 'landlord'
  const isAdmin = role === 'admin'
  
  // Для арендодателей и админов - их мотоциклы, для клиентов - все мотоциклы
  const { data: myMotorcycles, isLoading: isLoadingMy, refetch: refetchMy } = useGetMyMotorcyclesQuery()
  const { data: allMotorcycles, isLoading: isLoadingAll, refetch: refetchAll } = useGetMotorcyclesQuery()
  
  const motorcycles = isLandlord || isAdmin ? myMotorcycles : allMotorcycles
  const isLoading = isLandlord || isAdmin ? isLoadingMy : isLoadingAll
  const refetch = isLandlord || isAdmin ? refetchMy : refetchAll
  
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

  const getPageTitle = () => {
    if (isLandlord) return 'Мои мотоциклы'
    if (isAdmin) return 'Управление мотоциклами'
    return 'Каталог мотоциклов'
  }

  const canAddMotorcycle = isLandlord || isAdmin

  return (
    <section className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>{getPageTitle()}</h1>
        {canAddMotorcycle && (
          <button 
            className={styles.addButton}
            onClick={() => setShowAddModal(true)}
          >
            + Добавить мотоцикл
          </button>
        )}
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
                
                {(isLandlord || isAdmin) && (
                  <div className={styles.motorcycleActions}>
                    <button 
                      className={motorcycle.is_public ? styles.unpublishButton : styles.publishButton}
                      onClick={() => handleTogglePublic(motorcycle.id)}
                    >
                      {motorcycle.is_public ? 'Убрать из каталога' : 'Опубликовать'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <h3>
            {isLandlord ? 'У вас пока нет мотоциклов' : 
             isAdmin ? 'Нет мотоциклов для управления' : 
             'Нет доступных мотоциклов'}
          </h3>
          <p>
            {isLandlord ? 'Добавьте свой первый мотоцикл для аренды' :
             isAdmin ? 'В системе пока нет мотоциклов' :
             'В каталоге пока нет мотоциклов'}
          </p>
          {canAddMotorcycle && (
            <button 
              className={styles.addFirstButton}
              onClick={() => setShowAddModal(true)}
            >
              Добавить мотоцикл
            </button>
          )}
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
