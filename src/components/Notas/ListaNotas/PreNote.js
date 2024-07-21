import { useEffect, useState } from 'react'
import Modal from 'react-modal'
import styles from './PreNote.module.css'
import { FaCog } from 'react-icons/fa'


export function PreNote(props) {

  const {note} = props

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [notaSeleccionada, setNotaSeleccionada] = useState(null);

  const openModal = (note) => {
    setNotaSeleccionada(note);
    setModalIsOpen(true);
};

const closeModal = () => {
    setNotaSeleccionada(null);
    setModalIsOpen(false);
};

  return (
    
    <>
    
      <div className={styles.note} /* onClick={onOpenClose} */>
        <h1>{note.client_id}</h1>
        <h1>{note.description}</h1>
        <h1 onClick={() => openModal(note)}><FaCog /></h1>
      </div>

      <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Detalles de la Nota"
            >
                <h2>{notaSeleccionada?.client_id}</h2>
                <p>{notaSeleccionada?.description}</p>

                {/* Aquí puedes mostrar los conceptos asociados a la nota */}
                <h3>Conceptos:</h3>
                <ul>
                    {notaSeleccionada?.concepts.map((concepto, index) => (
                        <li key={index}>
                            <p>{concepto.concept}</p>
                            <p>Cantidad: {concepto.qty}</p>
                            <p>Precio: ${concepto.price}</p>
                        </li>
                    ))}
                </ul>

                <button onClick={closeModal}>Cerrar</button>
            </Modal>

    </>

  )
}
