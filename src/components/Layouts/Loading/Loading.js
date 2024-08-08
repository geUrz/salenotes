import { MoonLoader } from 'react-spinners'
import styles from './Loading.module.css'
import classNames from 'classnames'

export function Loading(props) {

  const {size, loading} = props

  const loadingClass = classNames({
    [styles.loadingLarge]: loading === 1, 
    [styles.loadingMiddle]: loading === 2, 
    [styles.loadingMini]: loading === 3 
  });

  return (
    
    <div className={loadingClass}>
      <MoonLoader
        color='azure'
        size={size}
        speedMultiplier={.8}
      />
    </div>

  )
}
