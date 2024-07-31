import { BasicLayout } from '@/layouts'
import styles from './usuario.module.css'
import { useState } from 'react'

export default function Usuario() {

  const [reload, setReload] = useState()

  const onReload = () => setReload((prevState) => !prevState)

  return (
    
    <BasicLayout title='Usuario' categorie='usuario' onReload={onReload}>

      <div className={styles.section}></div>

    </BasicLayout>

  )
}
