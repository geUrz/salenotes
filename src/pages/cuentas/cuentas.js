import { BasicLayout } from '@/layouts'
import { useEffect, useState } from 'react'
import { BiToggleLeft, BiToggleRight, BiTrendingUp } from 'react-icons/bi'
import { formatCurrency } from '@/helpers'
import axios from 'axios'
import { sumBy } from 'lodash'
import styles from './cuentas.module.css'
import { MoonLoader } from 'react-spinners'

export default function Cuentas() {

  const [reload, setReload] = useState()

  const onReload = () => setReload((prevState) => !prevState)

  const [counts, setCounts] = useState()

  const [toggleIVA, setToggleIVA] = useState(false)
 
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

  const subtotal = sumBy(counts, count => count.precio * count.cantidad)
  const iva = subtotal * 0.16
  const total = subtotal + iva

  useEffect(() => {
    const savedToggleIVA = localStorage.getItem('toggleIVA');
    if (savedToggleIVA !== null && savedToggleIVA !== undefined) {
      setToggleIVA(JSON.parse(savedToggleIVA));
    }
  }, [])

  const toggleIVAState = () => {
    setToggleIVA((prevState) => {
      const newState = !prevState;
      localStorage.setItem('toggleIVA', JSON.stringify(newState))
      return newState
    })
  }

  return (
    
    <BasicLayout title='Ingresos totales' categorie='cuentas' onReload={onReload}>

      <div className={styles.section}>
        <div className={styles.container}>


        {toggleIVA ? (
          <div className={styles.toggleOff}>
            <h1>IVA</h1>
            <BiToggleLeft onClick={toggleIVAState} />
          </div>
          ) : (
            <div className={styles.toggleOn}>
              <h1>IVA</h1>
              <BiToggleRight onClick={toggleIVAState} />
            </div>  
          )}

          <BiTrendingUp />
          {!counts ? (
            <div className={styles.loading}>
              <MoonLoader
                color='cyan'
                size={25}
                speedMultiplier={.8}
              />
            </div>
          ) : (
            <>
              
              {toggleIVA ? (
                ''
              ) : (
                <>
                  <h2>Subtotal</h2>
                  <h1>${!counts.length ? '0' : formatCurrency(subtotal)}</h1>
                  <h2>IVA</h2>
                  <h1>${!counts.length ? '0' : formatCurrency(iva)}</h1>
                
                </>
              )}

              <h2>Total</h2>
              
              {!toggleIVA ? (
                <h1>$
                  {!counts.length ? 
                  '0' : 
                  formatCurrency(total)
                  }</h1>
              ) : (
                <h1>$
                  {!counts.length ? 
                  '0' : 
                  formatCurrency(subtotal)
                  }</h1>
              )}

            </>
          )}
        </div>
      </div>

    </BasicLayout>

  )
}
