import { BounceLoader } from 'react-spinners'
import styles from './Loading.module.css'

export function Loading() {
  return (
    
    <div className={styles.loading}>
      <BounceLoader
        color='darkslategray'
        speedMultiplier={1.5}
      />
    </div>

  )
}
