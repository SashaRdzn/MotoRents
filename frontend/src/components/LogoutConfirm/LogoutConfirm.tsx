import styles from './logoutConfirm.module.scss'

type Props = {
  isOpen: boolean
  email?: string
  onConfirm: () => void
  onCancel: () => void
}

const LogoutConfirm = ({ isOpen, email, onConfirm, onCancel }: Props) => {
  if (!isOpen) return null
  return (
    <div className={styles.backdrop} onClick={onCancel}>
      <div className={styles.card} onClick={e=>e.stopPropagation()}>
        <h3 className={styles.title}>Выйти из аккаунта?</h3>
        {email && <p className={styles.email}>{email}</p>}
        <div className={styles.actions}>
          <button className={styles.primary} onClick={onConfirm}>Выйти</button>
          <button className={styles.secondary} onClick={onCancel}>Отмена</button>
        </div>
      </div>
    </div>
  )
}

export default LogoutConfirm


