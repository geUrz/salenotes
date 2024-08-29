import { BasicLayout, BasicModal } from '@/layouts'
import { NotaForm, NotasLista, NotasRowHeadMain } from '@/components/Notas'
import { useEffect, useState } from 'react'
import { Add, CountBox, Loading, ToastSuccess, ToastWarning } from '@/components/Layouts'
import axios from 'axios'
import { FaFileAlt } from 'react-icons/fa'
import { size } from 'lodash'
import styles from './notas.module.css'
import ProtectedRoute from '@/components/Layouts/ProtectedRoute/ProtectedRoute'
import { useAuth } from '@/context/AuthContext'

export default function Notas(props) {

  const { rowMain = true } = props

  const {user, loading} = useAuth()
  
  const [reload, setReload] = useState(null)

  const onReload = () => setReload((prevState) => !prevState)

  const [show, setShow] = useState(false)

  const onOpenClose = () => setShow((prevState) => !prevState)

  const [toastSuccess, setToastSuccess] = useState(false)
  const [toastCountNotas, setToastCountNotas] = useState(false)

  const [notas, setNotas] = useState([])

  const onToastSuccess = () => {
    setToastSuccess(true)
    setTimeout(() => {
      setToastSuccess(false)
    }, 3000)
  }
  
  const onOpenToastCountNotas = () => {
    setToastCountNotas(true)    
  }

  useEffect(() => {
    if (user && user.id) {
      (async () => {
        try {
          const response = await axios.get(`/api/notas?usuario_id=${user.id}`)
          setNotas(response.data)
        } catch (error) {
          console.error(error)
        }
      })()
    }
  }, [reload, user])

  const countAll = notas.length

  if (loading) {
    <Loading size={45} loading={1} />
  }

  const handleOpenClose = () => {
    if (user && user.folioCount !== null && user.folioCount !== undefined) {
      if (countAll >= user.folioCount) {
        onOpenToastCountNotas()
      } else {
        onOpenClose()
      }
    } else {
      console.warn('folioCount no está definido en el objeto user.')
    }
  }

  return (

    <ProtectedRoute>

      <BasicLayout title='Notas' categorie='notas' onReload={onReload}>

        {toastSuccess && <ToastSuccess contain='Nota creada exitosamente' onClose={() => setToastSuccess(false)} />}

        {toastCountNotas && <ToastWarning onClose={() => setToastCountNotas(false)} />}
 
        <CountBox
          title='Notas'
          icon={<FaFileAlt />}
          count={{ countAll }}
          user={user}
        />

        <div className={styles.main}>
          <div className={styles.section}>
            <NotasRowHeadMain rowMain />
            <NotasLista reload={reload} onReload={onReload} notas={notas} />
          </div>
        </div>


        <Add onOpenClose={handleOpenClose} />
    

        <BasicModal title='Crear nota' show={show} onClose={onOpenClose}>
          <NotaForm reload={reload} onReload={onReload} onOpenClose={onOpenClose} onToastSuccess={onToastSuccess} />
        </BasicModal>

      </BasicLayout>

    </ProtectedRoute>

  )
}
