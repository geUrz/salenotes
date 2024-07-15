import { FaStore } from 'react-icons/fa'
import styles from './ProductNotes.module.css'

export function ProductNotes() {
  return (
    
    <div className={styles.section}>
      <div className={styles.icon}>
        <FaStore />
      </div>
      <div className={styles.count}>
        <h1>20</h1>
        <h2>Productos</h2>
      </div>
    </div>

  )
}
