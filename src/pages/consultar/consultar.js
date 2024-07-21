import { useEffect, useState } from 'react'
import axios from 'axios'
import Link from 'next/link'
import Modal from 'react-modal'

Modal.setAppElement('#__next')

export default function ConsultarNotas() {
    const [notas, setNotas] = useState([])
    const [modalIsOpen, setModalIsOpen] = useState(false)
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

    const openModal = async (nota) => {
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
    }

    return (

        <>

            <div>
                <h1>Consultar Notas</h1>

                <ul>
                    {notas.map(nota => (
                        <li key={nota.id}>
                            <h2>{nota.titulo}</h2>
                            <p>{nota.descripcion}</p>
                            <button onClick={() => openModal(nota)}>Ver Detalles</button>
                        </li>
                    ))}
                </ul>
            </div>

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Detalles de la Nota"
            >
                {notaSeleccionada && (
                    <>
                        <h2>{notaSeleccionada.titulo}</h2>
                        <p>{notaSeleccionada.descripcion}</p>

                        {/* Verificar si hay conceptos antes de hacer el map */}
                        {notaSeleccionada.conceptos && notaSeleccionada.conceptos.length > 0 ? (
                            <div>
                                <h3>Conceptos:</h3>
                                <ul>
                                    {notaSeleccionada.conceptos.map((concepto, index) => (
                                        <li key={index}>
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

                        <button onClick={closeModal}>Cerrar</button>
                    </>
                )}
            </Modal>

        </>

    )
}
