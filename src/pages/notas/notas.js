import { BasicLayout, BasicModal } from '@/layouts'
import styles from './notas.module.css'
import { ListaNotas, ProductoNotas, ServicioNotas } from '@/components/Notas'
import { FaCog } from 'react-icons/fa'
import { useState } from 'react'

export default function Notas() {

  const [reload, setReload] = useState()

  const onReload = () => setReload((prevState) => !prevState)

  return (
    
    <BasicLayout title='Lista de Notas' categorie='notas' onReload={onReload}>

      <div className={styles.section}>
        <div className={styles.container}>
          <div className={styles.countNotes}>
            <ServicioNotas />
            <ProductoNotas />
          </div>
          <div className={styles.rows}>
            
            <div className={styles.row}>
              <h1>Cliente</h1>
              <h1>Descripción</h1>
              <h1><FaCog /></h1>
            </div>
            
            <ListaNotas />
            
          </div>
        </div>
      </div>

    </BasicLayout>

  )
}
