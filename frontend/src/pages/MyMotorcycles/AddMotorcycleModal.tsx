import { useState } from 'react'
import { useCreateMotorcycleMutation } from '@/app/api/api'
import styles from './addMotorcycleModal.module.scss'
import { useToast } from '@/components/Toast/ToastProvider'

interface AddMotorcycleModalProps {
  onClose: () => void
  onSuccess: () => void
}

const AddMotorcycleModal = ({ onClose, onSuccess }: AddMotorcycleModalProps) => {
  const { show } = useToast()
  const [createMotorcycle, { isLoading }] = useCreateMotorcycleMutation()
  const [form, setForm] = useState({
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    category: 'sport',
    engine_volume: 600,
    power: 50,
    fuel_type: 'petrol',
    transmission: 'manual',
    weight: 200,
    daily_price: 0,
    description: '',
    min_rental_hours: 4,
    min_rental_days: 1,
    is_public: false
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await createMotorcycle(form).unwrap()
      onSuccess()
    } catch (e: any) {
      show(e.data?.detail || 'Не удалось добавить мотоцикл', 'error')
    }
  }

  return (
    <div className={styles.modal}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h2>Добавить мотоцикл</h2>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label>Марка *</label>
              <input
                type="text"
                value={form.brand}
                onChange={(e) => setForm({...form, brand: e.target.value})}
                required
                placeholder="Honda, Yamaha, Kawasaki..."
              />
            </div>

            <div className={styles.formGroup}>
              <label>Модель *</label>
              <input
                type="text"
                value={form.model}
                onChange={(e) => setForm({...form, model: e.target.value})}
                required
                placeholder="CBR600RR, R1, Ninja..."
              />
            </div>

            <div className={styles.formGroup}>
              <label>Год выпуска *</label>
              <input
                type="number"
                value={form.year}
                onChange={(e) => setForm({...form, year: Number(e.target.value)})}
                required
                min="1990"
                max={new Date().getFullYear() + 1}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Категория *</label>
              <select
                value={form.category}
                onChange={(e) => setForm({...form, category: e.target.value})}
                required
              >
                <option value="sport">Спортивный</option>
                <option value="naked">Классический</option>
                <option value="touring">Туристический</option>
                <option value="cruiser">Круизер</option>
                <option value="enduro">Эндуро</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Объем двигателя (см³) *</label>
              <input
                type="number"
                value={form.engine_volume}
                onChange={(e) => setForm({...form, engine_volume: Number(e.target.value)})}
                required
                min="50"
                max="2000"
              />
            </div>

            <div className={styles.formGroup}>
              <label>Мощность (л.с.) *</label>
              <input
                type="number"
                value={form.power}
                onChange={(e) => setForm({...form, power: Number(e.target.value)})}
                required
                min="1"
                max="300"
              />
            </div>

            <div className={styles.formGroup}>
              <label>Тип топлива *</label>
              <select
                value={form.fuel_type}
                onChange={(e) => setForm({...form, fuel_type: e.target.value})}
                required
              >
                <option value="petrol">Бензин</option>
                <option value="electric">Электро</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Коробка передач *</label>
              <select
                value={form.transmission}
                onChange={(e) => setForm({...form, transmission: e.target.value})}
                required
              >
                <option value="manual">Механика</option>
                <option value="automatic">Автомат</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Вес (кг) *</label>
              <input
                type="number"
                value={form.weight}
                onChange={(e) => setForm({...form, weight: Number(e.target.value)})}
                required
                min="50"
                max="500"
              />
            </div>

            <div className={styles.formGroup}>
              <label>Цена за день (₽) *</label>
              <input
                type="number"
                value={form.daily_price}
                onChange={(e) => setForm({...form, daily_price: Number(e.target.value)})}
                required
                min="100"
                step="100"
              />
            </div>

            <div className={styles.formGroup}>
              <label>Минимум часов аренды</label>
              <input
                type="number"
                value={form.min_rental_hours}
                onChange={(e) => setForm({...form, min_rental_hours: Number(e.target.value)})}
                min="1"
                max="24"
              />
            </div>

            <div className={styles.formGroup}>
              <label>Минимум дней аренды</label>
              <input
                type="number"
                value={form.min_rental_days}
                onChange={(e) => setForm({...form, min_rental_days: Number(e.target.value)})}
                min="1"
                max="30"
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Описание *</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({...form, description: e.target.value})}
              required
              placeholder="Опишите состояние мотоцикла, особенности, условия аренды..."
              rows={4}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={form.is_public}
                onChange={(e) => setForm({...form, is_public: e.target.checked})}
              />
              <span>Сделать публичным (видно в общем каталоге)</span>
            </label>
          </div>

          <div className={styles.actions}>
            <button type="button" className={styles.cancelButton} onClick={onClose}>
              Отмена
            </button>
            <button type="submit" className={styles.submitButton} disabled={isLoading}>
              {isLoading ? 'Добавление...' : 'Добавить мотоцикл'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddMotorcycleModal
