import { BasicLayout, BasicModal } from '@/layouts'
import { useEffect, useState } from 'react'
import { Add, CountBox } from '@/components/Layouts'
import { ClienteForm } from '@/components/Clientes'
import { ListaClientes } from '@/components/Clientes/ListaClientes'
import { FaCog, FaUsers } from 'react-icons/fa'
import axios from 'axios'
import { size } from 'lodash'
import styles from './clientes.module.css'


export default function Cliente() {

  const [show, setShow] = useState(false)

  const onOpenClose = () => setShow((prevState) => !prevState)

  const [reload, setReload] = useState()

  const onReload = () => setReload((prevState) => !prevState)

  const [clientes, setClientes] = useState([])

  const countAll = size(clientes)

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get('/api/clients')
        setClientes(response.data)
      } catch (error) {
        console.error(error)
      }
    })()
  }, [clientes])

  return (

    <BasicLayout title='Lista de Clientes' categorie='clientes' onReload={onReload}>

      <div className={styles.section}>
        <div className={styles.container}>
          <CountBox
            title='Clientes'
            icon={<FaUsers />}
            count={{ countAll }}
          />
          <div className={styles.rows}>

            <div className={styles.row}>
              <h1>Código</h1>
              <h1>Cliente</h1>
              <h1>Contacto</h1>
              <h1><FaCog /></h1>
            </div>

            <ListaClientes reload={reload} onReload={onReload} />

          </div>
        </div>
      </div>

      <Add title='Crear cliente' onOpenClose={onOpenClose} />

      <BasicModal title='Crear cliente' show={show} onClose={onOpenClose}>
        <ClienteForm reload={reload} onReload={onReload} onOpenClose={onOpenClose} />
      </BasicModal>

    </BasicLayout>

  )
}
