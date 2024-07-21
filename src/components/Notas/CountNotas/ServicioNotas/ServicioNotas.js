import { FaTools } from 'react-icons/fa'
import styles from './ServicioNotas.module.css'

export function ServicioNotas() {
  return (

    <div className={styles.section}>
      <div className={styles.icon}>
        <FaTools />
      </div>
      <div className={styles.count}>
        <h1>20</h1>
        <h2>Servicios</h2>
      </div>
    </div>

  )
}
