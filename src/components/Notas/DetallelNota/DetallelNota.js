import { formatCurrency } from '@/helpers/formatCurrency'
import styles from './DetailNote.module.css'
import { IconCloseModal } from '@/components/Layouts'

export function DetallelNota(props) {

  const { onOpenClose } = props

  return (

    <>

      <IconCloseModal onOpenClose={onOpenClose} />

      <div>

      </div>

    </>

  )
}
