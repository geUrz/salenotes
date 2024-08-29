import styles from './CountBox.module.css'
import { Loading } from '../Loading'
import { useAuth } from '@/context/AuthContext'

export function CountBox(props) {

  const { icon, count: { countAll }, title, user } = props
  
  return (

    <div className={styles.section}>
      <div className={
        (countAll) >= user.folioCount ? `${styles.isActive}` : `${styles.isDesactive}`}>
        <div className={styles.icon}>
          {icon}
        </div>
        <div className={styles.count}>
          <h1>{
          !countAll && countAll != 0 ? (
            <Loading size={25} loading={3} />
          ) : (
            countAll
          )
          }</h1>
          <h2>{title}</h2>
        </div>
      </div>
    </div>

  )
}
