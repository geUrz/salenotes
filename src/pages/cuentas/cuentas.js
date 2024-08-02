import { BasicLayout } from '@/layouts'
import { useEffect, useState } from 'react'
import { BiToggleLeft, BiToggleRight, BiTrendingUp } from 'react-icons/bi'
import { formatCurrency } from '@/helpers'
import axios from 'axios'
import { sumBy } from 'lodash'
import styles from './cuentas.module.css'
import { MoonLoader } from 'react-spinners'
import { Loading } from '@/components/Layouts'

export default function Cuentas() {

  const [reload, setReload] = useState()

  const onReload = () => setReload((prevState) => !prevState)

  const [counts, setCounts] = useState()
 
  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get('/api/concepts')
        setCounts(response.data)
      } catch (error) {
          console.error(error)
      }
    })()
  }, [reload])

  const total = sumBy(counts, count => count.precio * count.cantidad)
  /* const iva = subtotal * 0.16
  const total = subtotal + iva */

  return (
    
    <BasicLayout title='Ingresos totales' categorie='cuentas' onReload={onReload}>

      <div className={styles.section}>
        <div className={styles.container}>
          <BiTrendingUp />
          {!counts ? (
            <Loading />
          ) : (
            <>

              <h2>Total</h2>
              <h1>$
                {!counts.length ? 
                  '0' : 
                  formatCurrency(total)
                }
              </h1>
            </>
          )}
        </div>
      </div>

    </BasicLayout>

  )
}
