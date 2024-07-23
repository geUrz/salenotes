import { map } from 'lodash'
import styles from './ConceptosBox.module.css'
import { formatCurrency } from '@/helpers/formatCurrency'

export function ConceptosBox(props) {

  const { conceptos } = props


  return (

    <div className={styles.section}>
      <div className={styles.rowConcept}>
        <h1>Titulo</h1>
        <h1>Descripcion</h1>
        <h1>Precio</h1>
        <h1>Qty</h1>
        <h1>Total</h1>
      </div>
      {map(conceptos, (concepto) => (
        <div key={concepto.id} className={styles.rowMapConcept}>
          <h1>{concepto.titulo}</h1>
          <h1>{concepto.descripcion}</h1>
          <h1>${formatCurrency(concepto.precio * 1)}</h1>
          <h1>{concepto.cantidad}</h1>
          <h1>${formatCurrency(concepto.cantidad * concepto.precio)}</h1>
        </div>
      ))}

      <div className={styles.sectionTotal}>
        <div>
        <h1>Subtotal:</h1>
        <h1>IVA:</h1>
        <h1>Total:</h1>
        </div>
        <div>
        <h1>$
          {!conceptos[0] ? (
            '0'
          ) : (
            formatCurrency(conceptos[0].precio * 1)
          )}
        </h1>
        <h1>$
          {!conceptos[0] ? (
            '0'
          ) : (
            formatCurrency((conceptos[0].precio / 100) * 16)
          )
          }
        </h1>
        <h1>$
          {!conceptos[0] ? (
            '0'
          ) : (
            formatCurrency(conceptos[0].precio * 1 + conceptos[0].precio / 100 * 16)
          )
          }</h1>
        </div>
      </div>

    </div>

  )
}
