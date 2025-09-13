import styles from './notFound.module.scss'
import { Link } from 'react-router-dom'
import notFound from '../../../public/NotFound.png'
const NotFound = () => {
  return (
    <section className={styles.page}>
      <h2 className={styles.title2}>404</h2>
      <h2 className={styles.title}>Женщина делает оборт, что видит ребёнок:</h2>
      <img src={notFound}></img>
      <Link to="/" className={styles.btn}>На главную</Link>
    </section>
  )
}

export default NotFound


