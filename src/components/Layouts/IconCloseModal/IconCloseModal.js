import { FaTimes } from 'react-icons/fa'
import styles from './IconCloseModal.module.css'

export function IconCloseModal(props) {

  const {onOpenClose} = props

  return (
    
    <div className={styles.iconClose} onClick={onOpenClose}>
        <FaTimes />
      </div>

  )
}
