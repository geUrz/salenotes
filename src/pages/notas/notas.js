import { BasicLayout, BasicModal } from '@/layouts'
import { NotaForm, NotasLista, NotasRowHeadMain } from '@/components/Notas'
import { useEffect, useState } from 'react'
import { Add, CountBox, ToastSuccess, ToastWarning } from '@/components/Layouts'
import axios from 'axios'
import { FaFileAlt } from 'react-icons/fa'
import { size } from 'lodash'
import styles from './notas.module.css'
import ProtectedRoute from '@/components/Layouts/ProtectedRoute/ProtectedRoute'

export default function Notas(props) {

  const { rowMain = true } = props

  const [reload, setReload] = useState()

  const onReload = () => setReload((prevState) => !prevState)

  const [show, setShow] = useState(false)

  const onOpenClose = () => setShow((prevState) => !prevState)

  const [toastSuccess, setToastSuccess] = useState(false)
  const [toastCountNotas, setToastCountNotas] = useState(false)

  const [notas, setNotas] = useState([])

  const countAll = size(notas)

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
    (async () => {
      try {
        const response = await axios.get('/api/notas')
        setNotas(response.data)
      } catch (error) {
        console.error(error)
      }
    })()
  }, [reload])

  return (

    <ProtectedRoute>

      <BasicLayout title='Notas' categorie='notas' onReload={onReload}>

        {toastSuccess && <ToastSuccess contain='Nota creado exitosamente' onClose={() => setToastSuccess(false)} />}

        {toastCountNotas && <ToastWarning onClose={() => setToastCountNotas(false)} />}
 
        <CountBox
          title='Notas'
          icon={<FaFileAlt />}
          count={{ countAll }}
        />

        <div className={styles.main}>
          <div className={styles.section}>
            <NotasRowHeadMain rowMain />
            <NotasLista reload={reload} onReload={onReload} notas={notas} />
          </div>
        </div>


          <Add onOpenClose={(countAll) >= 3 ? (
            onOpenToastCountNotas
          ) : (
            onOpenClose
          )} />
    

        <BasicModal title='Crear nota' show={show} onClose={onOpenClose}>
          <NotaForm reload={reload} onReload={onReload} onOpenClose={onOpenClose} onToastSuccess={onToastSuccess} />
        </BasicModal>

      </BasicLayout>

    </ProtectedRoute>

  )
}
