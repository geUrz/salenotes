import { useEffect, useState } from 'react'
import Modal from 'react-modal'
import { IconCloseModal, ListEmpty, Loading } from '@/components/Layouts'
import { map, size } from 'lodash'
import styles from './ListaNotas.module.css'
import axios from 'axios'
import { FaCog } from 'react-icons/fa'
import { BasicModal } from '@/layouts'

Modal.setAppElement('#__next')

export function ListaNotas(props) {

  const { reload, onReload } = props

  const [notas, setNotas] = useState([])
  const [notaSeleccionada, setNotaSeleccionada] = useState(null)

  useEffect(() => {
    async function fetchNotas() {
      try {
        const response = await axios.get('/api/notes')
        setNotas(response.data);
      } catch (error) {
        console.error('Error al obtener las notas:', error)
      }
    }
    fetchNotas()
  }, [])

  const [show, setShow] = useState(false)

  //const onOpenClose = () => setShow((prevState) => !prevState)
  const onOpenClose = async (nota) => {
    try {
      const response = await axios.get(`/api/concepts?nota_id=${nota.id}`)
      nota.conceptos = response.data
      setNotaSeleccionada(nota)
      setShow((prevState) => !prevState)
    } catch (error) {
      console.error('Error al obtener los conceptos:', error)
    }
  }

  /* const openModal = async (nota) => {
    try {
      const response = await axios.get(`/api/concepts?nota_id=${nota.id}`)
      nota.conceptos = response.data
      setNotaSeleccionada(nota)
      setModalIsOpen(true)
    } catch (error) {
      console.error('Error al obtener los conceptos:', error)
    }
  };

  const closeModal = () => {
    setNotaSeleccionada(null)
    setModalIsOpen(false)
  } */

  return (

    <>

      {!notas ? (
        <Loading />
      ) : (
        size(notas) === 0 ? (
          <ListEmpty />
        ) : (
          <div className={styles.section}>
            {map(notas, (nota) => (
                <div key={nota.id} className={styles.rowNote}>
                  <h1>{nota.titulo}</h1>
                  <h1>{nota.descripcion}</h1>
                  <h1><FaCog onClick={() => onOpenClose(nota)} /></h1>
                </div>
            ))}
          </div>

        )
      )}

      <BasicModal
        show={show}
        onClose={onOpenClose}
        title="Detalles de la Nota"
      >
        <IconCloseModal onOpenClose={onOpenClose} />

        {notaSeleccionada && (
          <>
            <h2>{notaSeleccionada.titulo}</h2>
            <p>{notaSeleccionada.descripcion}</p>

            {notaSeleccionada.conceptos && notaSeleccionada.conceptos.length > 0 ? (
              <div>
                <ul>
                  {map(notaSeleccionada.conceptos, (concepto) => (
                    <li key={concepto.id}>
                      <p>{concepto.titulo}</p>
                      <p>{concepto.descripcion}</p>
                      <p>Cantidad: {concepto.cantidad}</p>
                      <p>Precio: ${concepto.precio}</p>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p>No hay conceptos asociados a esta nota.</p>
            )}

            {/* <button onClick={onOpenClose}>Cerrar</button> */}
          </>
        )}
      </BasicModal>

    </>

  )
}
