import { useEffect, useState, useRef } from 'react'
import { useGetMeQuery, useUpdateMeMutation, useUpdateRoleMutation, useUploadAvatarMutation } from '@/app/api/api'
import styles from './profile.module.scss'
import { useToast } from '@/components/Toast/ToastProvider'

const Profile = () => {
  const { data } = useGetMeQuery()
  const [updateMe, { isLoading }] = useUpdateMeMutation()
  const [updateRole, { isLoading: isRoleLoading }] = useUpdateRoleMutation()
  const [uploadAvatar, { isLoading: isAvatarLoading }] = useUploadAvatarMutation()
  const { show } = useToast()
  const [form, setForm] = useState({ first_name: '', last_name: '', phone: '', driving_experience: 0 })
  const [selectedRole, setSelectedRole] = useState('')
  const [showRoleConfirm, setShowRoleConfirm] = useState(false)
  const [pendingRole, setPendingRole] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(()=>{
    const user = (data as any)?.user
    if (user) {
      setForm({
        first_name: user.first_name ?? '',
        last_name: user.last_name ?? '',
        phone: user.phone ?? '',
        driving_experience: user.driving_experience ?? 0,
      })
      setSelectedRole(user.role ?? 'client')
    }
  }, [data])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await updateMe(form as any).unwrap()
      show('Профиль обновлен', 'success')
    } catch (e) {
      show('Не удалось обновить профиль', 'error')
    }
  }

  const handleRoleChange = (newRole: string) => {
    setPendingRole(newRole)
    setShowRoleConfirm(true)
  }

  const confirmRoleChange = async () => {
    try {
      await updateRole({ role: pendingRole }).unwrap()
      setSelectedRole(pendingRole)
      show('Роль обновлена', 'success')
      setShowRoleConfirm(false)
    } catch (e) {
      show('Не удалось обновить роль', 'error')
    }
  }

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append('avatar', file)

    try {
      await uploadAvatar(formData).unwrap()
      show('Аватар обновлен', 'success')
    } catch (e: any) {
      show(e.data?.detail || 'Не удалось загрузить аватар', 'error')
    }
  }

  return (
    <section className={styles.page}>
      <h1 className={styles.title}>Профиль</h1>
      
      {/* Аватар */}
      <div className={styles.avatarSection}>
        <div className={styles.avatarContainer}>
          {(data as any)?.avatar_url ? (
            <img 
              src={(data as any).avatar_url} 
              alt="Аватар" 
              className={styles.avatar}
            />
          ) : (
            <div className={styles.avatarPlaceholder}>
              <span>Фото</span>
            </div>
          )}
          <button 
            className={styles.avatarButton}
            onClick={() => fileInputRef.current?.click()}
            disabled={isAvatarLoading}
          >
            {isAvatarLoading ? 'Загрузка...' : 'Изменить фото'}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarUpload}
            style={{ display: 'none' }}
          />
        </div>
      </div>
      
      {/* Выбор роли */}
      <div className={styles.roleSection}>
        <h3>Роль</h3>
        <div className={styles.roleButtons}>
          <button 
            type="button"
            className={`${styles.roleButton} ${selectedRole === 'client' ? styles.active : ''}`}
            onClick={() => handleRoleChange('client')}
            disabled={isRoleLoading}
          >
            Клиент
          </button>
          <button 
            type="button"
            className={`${styles.roleButton} ${selectedRole === 'landlord' ? styles.active : ''}`}
            onClick={() => handleRoleChange('landlord')}
            disabled={isRoleLoading}
          >
            Арендодатель
          </button>
        </div>
        <p className={styles.roleDescription}>
          {selectedRole === 'client' 
            ? 'Как клиент вы можете арендовать мотоциклы' 
            : 'Как арендодатель вы можете добавлять свои мотоциклы для аренды'
          }
        </p>
      </div>

      <form className={styles.form} onSubmit={submit}>
        <label>Имя<input value={form.first_name} onChange={e=>setForm({...form, first_name: e.target.value})} /></label>
        <label>Фамилия<input value={form.last_name} onChange={e=>setForm({...form, last_name: e.target.value})} /></label>
        <label>Телефон<input value={form.phone} onChange={e=>setForm({...form, phone: e.target.value})} /></label>
        <label>Стаж вождения (лет)<input type="number" value={form.driving_experience} onChange={e=>setForm({...form, driving_experience: Number(e.target.value)})} /></label>
        <button disabled={isLoading}>Сохранить</button>
      </form>

      {/* Модалка подтверждения смены роли */}
      {showRoleConfirm && (
        <div className={styles.confirmModal}>
          <div className={styles.confirmContent}>
            <h3>Подтверждение смены роли</h3>
            <p>
              Вы уверены, что хотите изменить роль на "{pendingRole === 'client' ? 'Клиент' : 'Арендодатель'}"?
            </p>
            <div className={styles.confirmButtons}>
              <button 
                className={styles.confirmButton}
                onClick={confirmRoleChange}
                disabled={isRoleLoading}
              >
                Подтвердить
              </button>
              <button 
                className={styles.cancelButton}
                onClick={() => setShowRoleConfirm(false)}
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default Profile


