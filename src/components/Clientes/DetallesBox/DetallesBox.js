import { IconCloseModal } from '@/components/Layouts'
import styles from './DetallesBox.module.css'
import { formatClientId } from '@/helpers'
import { FaCheck, FaEdit, FaTimes, FaTrash } from 'react-icons/fa'
import { Confirm } from '@/components/Layouts/Confirm'
import { useEffect, useState } from 'react'
import { BasicModal } from '@/layouts'
import { ClienteModForm } from '../ClienteModForm'
import axios from 'axios'

export function DetallesBox(props) {

  const { reload, onReload, cliente, onOpenClose, onDelete } = props

  const [show, setShow] = useState(false)

  const [clienteSeleccionado, setClienteSeleccionado] = useState(null)

  //const onOpenConfirm = () => setShowConfirm((prevStatus) => !prevStatus)

  const onOpen = (cliente = null) => {
    setClienteSeleccionado(cliente)
    setShow(!show)
  }

  return (

    <>

      <IconCloseModal onOpenClose={onOpenClose} />

      <div className={styles.section}>
        <div className={styles.box1}>
          <div>
            <h1>Código</h1>
            <h2>{formatClientId(cliente.id)}</h2>
          </div>
          <div>
            <h1>Cliente</h1>
            <h2>{cliente.cliente}</h2>
          </div>
        </div>
        <div className={styles.box2}>
          <div>
            <h1>Contacto</h1>
            <h2>{cliente.contacto}</h2>
          </div>
          <div>
            <h1>Cel</h1>
            <h2>{cliente.cel}</h2>
          </div>
        </div>
        <div className={styles.box3}>
          <div>
            <h1>Dirección</h1>
            <h2>{cliente.direccion}</h2>
          </div>
          <div>
            <h1>Email</h1>
            <h2>{cliente.email}</h2>
          </div>
        </div>

        <div className={styles.iconEdit}>
          <div onClick={() => onOpen(cliente)}>
            <FaEdit />
          </div>
        </div>

      </div>

      <BasicModal title='Modificar cliente' show={show} onClose={() => onOpen(null)}>
        <ClienteModForm reload={reload} onReload={onReload} clienteSeleccionado={clienteSeleccionado} onOpenClose={() => {
            onOpen(null)
            //fetchClientes()
          }} />
      </BasicModal>

      {/* <Confirm
        open={showConfirm}
        cancelButton={
          <div className={styles.iconClose}>
            <FaTimes />
          </div>
        }
        confirmButton={
          <div className={styles.iconCheck}>
            <FaCheck />
          </div>
        }
        onConfirm={onDelete}
        onCancel={onOpenConfirm}
        content='¿ Estas seguro de eliminar el cliente ?'
      /> */}


    </>

  )
}
