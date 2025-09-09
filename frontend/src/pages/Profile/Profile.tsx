import { useEffect, useState } from 'react'
import { useGetMeQuery, useUpdateMeMutation } from '@/app/api/api'
import styles from './profile.module.scss'
import { useToast } from '@/components/Toast/ToastProvider'

const Profile = () => {
  const { data } = useGetMeQuery()
  const [updateMe, { isLoading }] = useUpdateMeMutation()
  const { show } = useToast()
  const [form, setForm] = useState({ first_name: '', last_name: '', phone: '', driving_experience: 0 })

  useEffect(()=>{
    const user = (data as any)?.user
    if (user) {
      setForm({
        first_name: user.first_name ?? '',
        last_name: user.last_name ?? '',
        phone: user.phone ?? '',
        driving_experience: user.driving_experience ?? 0,
      })
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

  return (
    <section className={styles.page}>
      <h1 className={styles.title}>Профиль</h1>
      <form className={styles.form} onSubmit={submit}>
        <label>Имя<input value={form.first_name} onChange={e=>setForm({...form, first_name: e.target.value})} /></label>
        <label>Фамилия<input value={form.last_name} onChange={e=>setForm({...form, last_name: e.target.value})} /></label>
        <label>Телефон<input value={form.phone} onChange={e=>setForm({...form, phone: e.target.value})} /></label>
        <label>Стаж вождения (лет)<input type="number" value={form.driving_experience} onChange={e=>setForm({...form, driving_experience: Number(e.target.value)})} /></label>
        <button disabled={isLoading}>Сохранить</button>
      </form>
    </section>
  )
}

export default Profile


