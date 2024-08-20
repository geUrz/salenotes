import { BasicLayout } from '@/layouts'
import { useEffect, useState } from 'react'
import { BiTrendingUp } from 'react-icons/bi'
import { formatCurrency } from '@/helpers'
import axios from 'axios'
import { size, sumBy } from 'lodash'
import { Loading } from '@/components/Layouts'
import ProtectedRoute from '@/components/Layouts/ProtectedRoute/ProtectedRoute'
import styles from './cuentas.module.css'

export default function Cuentas() {

  const [reload, setReload] = useState()

  const onReload = () => setReload((prevState) => !prevState)

  const [countTotal, setCountTotal] = useState()
  const [countIVA, setCountIVA] = useState()

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get('/api/conceptos')
        setCountTotal(response.data)
      } catch (error) {
        console.error(error)
      }
    })()
  }, [reload])

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get('/api/notas')
        setCountIVA(response.data)
      } catch (error) {
        console.error(error)
      }
    })()
  }, [reload])

  const iva = sumBy(countIVA, count => count.iva)
  const subtotal = sumBy(countTotal, count => count.precio * count.cantidad)
  const total = subtotal + iva 

  return (

    <ProtectedRoute>

      <BasicLayout title='Ingresos totales' categorie='cuentas' onReload={onReload} relative>

        <div className={styles.main}>
          <div className={styles.section}>
            <BiTrendingUp />
            {!countIVA && !countTotal ? (
              <Loading size={40} loading={2} />
            ) : (
              <>

                <h2>IVA</h2>
                <h1>
                  {!size(countIVA) ?
                    '0' :
                    formatCurrency(iva)
                  }
                </h1>

                <h2>SUBTOTAL</h2>
                <h1>
                  {!size(countIVA) ?
                    '0' :
                    formatCurrency(subtotal)
                  }
                </h1>

                <h2>TOTAL</h2>
                <h1>
                  {!size(countTotal) ?
                    '0' :
                    formatCurrency(total)
                  }
                </h1>

              </>
            )}
          </div>
        </div>

      </BasicLayout>

    </ProtectedRoute>

  )
}
