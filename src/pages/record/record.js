import { BasicLayout } from '@/layouts'
import styles from './record.module.css'
import { useEffect, useState } from 'react'
import { map } from 'lodash'
import { ListNotes } from '@/components/Record/Notes'
import { ProductNotes, ServiceNotes } from '@/components/Record/CountNotes'

export default function Record() {

  const [show, setShow] = useState(false)

  const onOpenClose = () => setShow((prevState) => !prevState)

  return (
    
    <BasicLayout title='Lista de Notas'>

      <div className={styles.section}>
        <div className={styles.container}>
          <div className={styles.countNotes}>
            <ServiceNotes />
            <ProductNotes />
          </div>
          <div className={styles.rows}>
            
            <div className={styles.row}>
              <h1>Tipo</h1>
              <h1>Concepto</h1>
              <h1>Precio</h1>
              <h1>Qty</h1>
              <h1>Total</h1>
            </div>
            
            <ListNotes />
            
          </div>
        </div>
      </div>

    </BasicLayout>

  )
}
