import styles from './notFound.module.scss'
import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <section className={styles.page}>
      <div className={styles.center}>
        <div className={styles.art}>
          <div className={styles.bike}>
            <div className={styles.fork}></div>
            <div className={styles.swingarm}></div>
            <div className={styles.handlebar}></div>
            <div className={styles.bikeBody}></div>
            <div className={styles.rider}></div>
            <div className={`${styles.wheel} ${styles.front}`}></div>
            <div className={`${styles.wheel} ${styles.back}`}></div>
          </div>
          <div className={styles.smoke}></div>
          <div className={styles.track}></div>
        </div>
        <h1 className={styles.title}>404</h1>
        <p className={styles.subtitle}>Похоже, вы завернули не туда</p>
        <Link to="/home" className={styles.btn}>На главную</Link>
      </div>
    </section>
  )
}

export default NotFound


