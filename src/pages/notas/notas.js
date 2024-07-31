import { BasicLayout, BasicModal } from '@/layouts'
import { ListaNotas, NotaForm } from '@/components/Notas'
import { FaCog, FaFileAlt } from 'react-icons/fa'
import { useEffect, useState } from 'react'
import { Add, CountBox, ToastSuccess } from '@/components/Layouts'
import { size } from 'lodash'
import axios from 'axios'
import styles from './notas.module.css'

export default function Notas() {

  const [reload, setReload] = useState()

  const onReload = () => setReload((prevState) => !prevState)

  const [show, setShow] = useState(false)

  const onOpenClose = () => setShow((prevState) => !prevState)

  const [notas, setNotas] = useState([])

  const countAll = size(notas)

  const[toastSuccess, setToastSuccess] = useState(false)

  const onToastSuccess = () => {
    setToastSuccess(true)
    setTimeout(() => {
      setToastSuccess(false)
    }, 3000)
  }

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get('/api/notes')
        setNotas(response.data)
      } catch (error) {
          console.error(error)
      }
    })()
  }, [notas])

  return (
    
    <BasicLayout title='Lista de Notas' categorie='notas' onReload={onReload}>

      {toastSuccess && <ToastSuccess contain='Nota creada exitosamente' onClose={() => setToast(false)} />}

      <div className={styles.section}>
        <div className={styles.container}>
          <div className={styles.countNotes}>
            <CountBox
              title='notas'
              icon={<FaFileAlt/>}
              count={{countAll}}
            />
          </div>
          <div className={styles.rows}>
            
            <div className={styles.row}>
              <h1>Folio</h1>
              <h1>Cliente</h1>
              <h1>Descripción</h1>
              <h1><FaCog /></h1>
            </div>
            
            <ListaNotas reload={reload} onReload={onReload} />
            
          </div>
        </div>
      </div>

      <Add onOpenClose={onOpenClose} />

      <BasicModal title='Crear Nota' show={show} onClose={onOpenClose}>
        <NotaForm onToastSuccess={onToastSuccess} reload={reload} onReload={onReload} onOpenClose={onOpenClose} />
      </BasicModal>

    </BasicLayout>

  )
}
