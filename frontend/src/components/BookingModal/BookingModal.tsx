import { useEffect, useMemo, useState } from 'react'
import styles from './bookingModal.module.scss'

type Props = {
  isOpen: boolean
  onClose: () => void
  motorcycleId: number
  dailyPrice: number
  onSubmit: (payload: { booking_type: 'hourly' | 'daily'; start_time: string; end_time: string }) => void
}

export const BookingModal = ({ isOpen, onClose, motorcycleId, dailyPrice, onSubmit }: Props) => {
  const [type, setType] = useState<'hourly' | 'daily'>('daily')
  const [start, setStart] = useState<string>('')
  const [end, setEnd] = useState<string>('')
  const [error, setError] = useState<string>('')

  useEffect(() => {
    if (!isOpen) {
      setType('daily')
      setStart('')
      setEnd('')
      setError('')
    }
  }, [isOpen])

  const total = useMemo(() => {
    if (!start || !end) return 0
    const s = new Date(start).getTime()
    const e = new Date(end).getTime()
    if (isNaN(s) || isNaN(e) || e <= s) return 0
    const ms = e - s
    if (type === 'hourly') {
      const hours = ms / (1000 * 60 * 60)
      return +(hours * (dailyPrice / 24)).toFixed(2)
    }
    const days = Math.ceil(ms / (1000 * 60 * 60 * 24))
    return +(days * dailyPrice).toFixed(2)
  }, [start, end, type, dailyPrice])

  const submit = () => {
    setError('')
    if (!start || !end) return setError('Укажите период аренды')
    if (new Date(end) <= new Date(start)) return setError('Конец должен быть позже начала')
    onSubmit({ booking_type: type, start_time: new Date(start).toISOString(), end_time: new Date(end).toISOString() })
  }

  if (!isOpen) return null

  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <div className={styles.modalCard} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3>Арендовать мотоцикл {motorcycleId}</h3>
          <button className={styles.modalClose} onClick={onClose}>✕</button>
        </div>
        <div className={styles.modalBody}>
          <div className={styles.formRow}>
            <label>Тип аренды</label>
            <div className={styles.segmented}>
              <button className={type==='hourly'?styles.active:''} onClick={() => setType('hourly')}>Почасовая</button>
              <button className={type==='daily'?styles.active:''} onClick={() => setType('daily')}>Посуточная</button>
            </div>
          </div>
          <div className={styles.formRow}>
            <label>Начало</label>
            <input type="datetime-local" value={start} onChange={e=>setStart(e.target.value)} />
          </div>
          <div className={styles.formRow}>
            <label>Окончание</label>
            <input type="datetime-local" value={end} onChange={e=>setEnd(e.target.value)} />
          </div>
          <div className={styles.formRow}>
            <label>Ориентировочная стоимость</label>
            <div className={styles.totalPrice}>{total ? `${total} ₽` : '—'}</div>
          </div>
          {error && <div className={styles.errorMsg}>{error}</div>}
        </div>
        <div className={styles.modalFooter}>
          <button className={styles.modalPrimary} onClick={submit}>Подтвердить</button>
          <button className={styles.modalSecondary} onClick={onClose}>Отмена</button>
        </div>
      </div>
    </div>
  )
}

export default BookingModal
