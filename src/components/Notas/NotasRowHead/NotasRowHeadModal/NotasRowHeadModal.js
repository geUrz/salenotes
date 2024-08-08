import styles from './NotasRowHeadModal.module.css'

export function NotasRowHeadModal(props) {

  const {rowMain=false} = props

  return (

    <>

      {rowMain ? (
        <div className={styles.main}>
          <h1>Tipo</h1>
          <h1>Concepto</h1>
          <h1>Precio</h1>
          <h1>Qty</h1>
          <h1>Total</h1>
        </div>
      ) : (
        <div className={styles.main}>
          <h1>Tipo</h1>
          <h1>Concepto</h1>
          <h1>Precio</h1>
          <h1>Qty</h1>
          
        </div>
      )}

    </>

  )
}
