
import { formatCurrency } from '@/helpers/formatCurrency'
import styles from './Note.module.css'

export function Note(props) {

const {note} = props

  return (
    
    <>
    
      <div className={styles.note}>  
        <h1>{note.type_service}</h1>
        <h1>{note.concept}</h1>
        {
          note.price ? (
            <h1>${formatCurrency(note.price)}</h1>
          ) : (
            ''
          )
        }
        <h1>{note.qty}</h1>
        {
          note.price ? (
            <h1>${formatCurrency(note.price * note.qty)}</h1>
          ) : (
            ''
          )
        }
      </div>
    
    </>

  )
}
