import { BasicLayout } from '@/layouts'
import { useEffect, useState } from 'react'
import { formatCurrency } from '@/helpers'
import axios from 'axios'
import { sumBy } from 'lodash'
import { Loading } from '@/components/Layouts'
import ProtectedRoute from '@/components/Layouts/ProtectedRoute/ProtectedRoute'
import styles from './cuentas.module.css'
import { FaSearchDollar } from 'react-icons/fa'
import { useAuth } from '@/context/AuthContext'

export default function Cuentas() {
  const { user, loading } = useAuth()

  const [reload, setReload] = useState(false)
  const onReload = () => setReload(prevState => !prevState)

  const [countTotal, setCountTotal] = useState([])
  const [countIVA, setCountIVA] = useState([])
  const [notaIds, setNotaIds] = useState([]) // Para guardar los nota_id
  
  useEffect(() => {
    if (user && user.id) {
      (async () => {
        try {
          // Obtener notas del usuario para filtrar los conceptos
          const responseNotas = await axios.get(`/api/notas?usuario_id=${user.id}`)
          setCountIVA(responseNotas.data)
          
          // Obtener los nota_id de las notas del usuario
          const ids = responseNotas.data.map(nota => nota.id)
          setNotaIds(ids)
        } catch (error) {
          console.error(error)
        }
      })()
    }
  }, [user, reload])

  useEffect(() => {
    if (notaIds.length > 0) {
      (async () => {
        try {
          // Obtener conceptos filtrados por nota_id
          const responseConceptos = await axios.get(`/api/conceptos?nota_ids=${notaIds.join(',')}`)
          setCountTotal(responseConceptos.data)
        } catch (error) {
          console.error(error)
        }
      })()
    }
  }, [notaIds, reload])

  const iva = sumBy(countIVA, count => count.iva || 0)
  const subtotal = sumBy(countTotal, count => (count.precio || 0) * (count.cantidad || 0))
  const total = subtotal + iva

  if (loading) {
    return <Loading size={45} loading={0} />
  }

  return (
    <ProtectedRoute>
      <BasicLayout title='Ingresos totales' categorie='cuentas' onReload={onReload} relative>
        <div className={styles.main}>
          <div className={styles.section}>
            <FaSearchDollar />
            {!countIVA || !countTotal ? (
              <Loading size={40} loading={2} />
            ) : (
              <>
                <h2>IVA</h2>
                <h1>${formatCurrency(iva)}</h1>

                <h2>SUBTOTAL</h2>
                <h1>${formatCurrency(subtotal)}</h1>

                <h2>TOTAL</h2>
                <h1>${formatCurrency(total)}</h1>
              </>
            )}
          </div>
        </div>
      </BasicLayout>
    </ProtectedRoute>
  )
}
