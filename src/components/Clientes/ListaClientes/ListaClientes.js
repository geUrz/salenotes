import { useEffect, useState } from 'react'
import { ListEmpty, Loading } from '@/components/Layouts'
import { size } from 'lodash'
import axios from 'axios'
import { formatClientId } from '@/helpers'
import styles from './ListaClientes.module.css'
import { FaInfoCircle } from 'react-icons/fa'
import { BasicModal } from '@/layouts'
import { DetallesBox } from '../DetallesBox'

export function ListaClientes(props) {

  const {reload, onReload} = props

  const [show, setShow] = useState(false)
  const [clientes, setClientes] = useState()
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null)

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await axios.get('/api/clientes')
        setClientes(response.data)
        onReload()
      } catch (error) {
        console.error('Error al obtener los clientes:', error)
      }
    }

    fetchClientes()
  }, [clientes])

  const onOpenClose = async (cliente) => {
    try {
      const response = await axios.get(`/api/clientes?id=${cliente.id}`)
      setClienteSeleccionado(response.data)
      setShow(true)
      onReload()
    } catch (error) {
      console.error('Error al obtener el cliente:', error)
      if (error.response) {
        console.error('Error response:', error.response.data)
      }
    }
  }

  const handleCloseModal = () => {
    setShow(false)
    setClienteSeleccionado(null)
  }

  const handleDelete = async (clienteId) => {
    try {
      await axios.delete(`/api/clientes?id=${clienteId}`);
      setClientes(clientes.filter(cliente => cliente.id !== clienteId));
      handleCloseModal();
    } catch (error) {
      console.error('Error al eliminar el cliente:', error);
    }
  };

  return (

    <>

      {!clientes ? (
        <Loading size={45} loading={1} />
      ) : (
        size(clientes) === 0 ? (
          <ListEmpty />
        ) : (
          <div className={styles.section}>
            {clientes.map((cliente) => (
              <div key={cliente.id} className={styles.rowCliente} onClick={() => onOpenClose(cliente)}>
                <h1>{formatClientId(cliente.id)}</h1>
                <h1>{cliente.cliente}</h1>
                <h1>{cliente.contacto}</h1>
                <h1><FaInfoCircle /></h1>
              </div>
            ))}
          </div>
        )
      )}

      <BasicModal title='Información del cliente ' show={show} onClose={handleCloseModal}>
        <DetallesBox reload={reload} onReload={onReload} cliente={clienteSeleccionado} onOpenClose={handleCloseModal} onDelete={() => handleDelete(clienteSeleccionado.id)} />
      </BasicModal>

    </>

  )
}
