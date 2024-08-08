import { BasicLayout, BasicModal } from '@/layouts'
import { NotaForm, NotasLista, NotasRowHeadMain } from '@/components/Notas'
import { useEffect, useState } from 'react'
import { Add, CountBox, Title, ToastSuccess } from '@/components/Layouts'
import axios from 'axios'
import styles from './notas.module.css'

export default function Notas(props) {

  const {rowMain=true} = props

  const [reload, setReload] = useState()

  const onReload = () => setReload((prevState) => !prevState)

  const [show, setShow] = useState(false)

  const onOpenClose = () => setShow((prevState) => !prevState)

  const[toastSuccess, setToastSuccess] = useState(false)

  const onToastSuccess = () => {
    setToastSuccess(true)
    setTimeout(() => {
      setToastSuccess(false)
    }, 3000)
  }

  /* useEffect(() => {
    (async () => {
      try {
        const response = await axios.get('/api/notas')
        setNotas(response.data)
      } catch (error) {
          console.error(error)
      }
    })()
  }, [notas]) */

  return (
    
    <BasicLayout relative categorie='notas' onReload={onReload}>

      <Title title='Notas' />

      {toastSuccess && <ToastSuccess contain='Nota creado exitosamente' onClose={() => setToast(false)} />}

      <NotasRowHeadMain rowMain={rowMain} />

      <NotasLista reload={reload} onReload={onReload} />

      <Add onOpenClose={onOpenClose} />

      <BasicModal title='Crear nota' show={show} onClose={onOpenClose}>
        <NotaForm reload={reload} onReload={onReload} onOpenClose={onOpenClose} onToastSuccess={onToastSuccess} />
      </BasicModal>

    </BasicLayout>

  )
}
