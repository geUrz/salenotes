import { BasicLayout, BasicModal } from '@/layouts'
import { useEffect, useState } from 'react'
import { Add, CountBox, ToastSuccess } from '@/components/Layouts'
import { ClienteForm, ClientesLista, ClientesRowHeadMain } from '@/components/Clientes'
import { FaUsers } from 'react-icons/fa'
import axios from 'axios'
import { size } from 'lodash'
import ProtectedRoute from '@/components/Layouts/ProtectedRoute/ProtectedRoute'
import styles from './clientes.module.css'

export default function Cliente() {

  const [show, setShow] = useState(false)

  const onOpenClose = () => setShow((prevState) => !prevState)

  const [reload, setReload] = useState()

  const onReload = () => setReload((prevState) => !prevState)

  const [clientes, setClientes] = useState([])

  const [toastSuccess, setToastSuccess] = useState(false)

  const countAll = size(clientes)

  const onToastSuccess = () => {
    setToastSuccess(true)
    setTimeout(() => {
      setToastSuccess(false)
    }, 3000)
  }

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get('/api/clientes')
        setClientes(response.data)
      } catch (error) {
        console.error(error)
      }
    })()
  }, [clientes])

  return (

    <ProtectedRoute>

      <BasicLayout title='Clientes' categorie='clientes' onReload={onReload}>

        {toastSuccess && <ToastSuccess contain='Nota creado exitosamente' onClose={() => setToast(false)} />}

        <CountBox
          title='Clientes'
          icon={<FaUsers />}
          count={{ countAll }}
        />

        <div className={styles.main}>
          <div className={styles.section}>
            <ClientesRowHeadMain rowMain />
            <ClientesLista reload={reload} onReload={onReload} />
          </div>
        </div>

        <Add onOpenClose={onOpenClose} />

        <BasicModal title='Crear cliente' show={show} onClose={onOpenClose}>
          <ClienteForm reload={reload} onReload={onReload} onOpenClose={onOpenClose} onToastSuccess={onToastSuccess} />
        </BasicModal>

      </BasicLayout>

    </ProtectedRoute>

  )
}
