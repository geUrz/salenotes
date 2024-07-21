import { FaPlus, FaTimes } from 'react-icons/fa'
import { Button, Form, FormField, FormGroup, Input, Label, TextArea } from 'semantic-ui-react'
import { useEffect, useState } from 'react'
import styles from './NotaForm.module.css'
import axios from 'axios'
import { formatCurrency } from '@/helpers/formatCurrency'
import { IconCloseModal } from '@/components/Layouts'

export function NotaForm(props) {

  const { reload, onReload, onOpenClose } = props

  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [conceptos, setConceptos] = useState([]);
  const [nuevoConcepto, setNuevoConcepto] = useState({ descripcion: '', cantidad: '', precio: '' });

  const crearNota = async () => {
    try {
      const response = await axios.post('/api/notes', { titulo, descripcion })
      const notaId = response.data.id
      // Guardar conceptos asociados a la nota
      await Promise.all(conceptos.map(concepto =>
        axios.post('/api/concepts', { nota_id: notaId, ...concepto })
      ))
      alert('Nota creada exitosamente!')
      setTitulo('');
      setDescripcion('')
      setConceptos([])
    } catch (error) {
      console.error('Error al crear la nota:', error);
      alert('Hubo un error al crear la nota. Por favor, inténtalo de nuevo.')
    }
  }

  const añadirConcepto = () => {
    setConceptos([...conceptos, nuevoConcepto]);
    setNuevoConcepto({ descripcion: '', cantidad: '', precio: '' })
  }

  return (

    <>

      <IconCloseModal onOpenClose={onOpenClose} />

      <div className={styles.main}>

        <Form>
          <FormGroup widths='equal'>
            <FormField>
              <Label>
                Cliente
              </Label>
              <Input
                type="text"
                placeholder='Nombre del cliente'
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
              />




              {/* <select
                    value={selectedNotaId}
                    onChange={(e) => setSelectedNotaId(e.target.value)}
                >
                    <option value="">Selecciona un cliente</option>
                    {note.map(nota => (
                        <option key={nota.id} value={nota.id}>
                            {nota.type}
                        </option>
                    ))}
                </select> */}



              <Label>
                Descripción
              </Label>
              <TextArea
              placeholder='Descripción de la nota'
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
              />

            </FormField>
          </FormGroup>
        </Form>

        <Form>
          <Label>
            Descripción
          </Label>
          <Input
            type="text"
            placeholder="Descripción del concepto"
            value={nuevoConcepto.descripcion}
            onChange={(e) => setNuevoConcepto({ ...nuevoConcepto, descripcion: e.target.value })}
          />
          <Label>
            Cantidad
          </Label>
          <Input
            type="number"
            placeholder="Cantidad de servicio / producto"
            value={nuevoConcepto.cantidad}
            onChange={(e) => setNuevoConcepto({ ...nuevoConcepto, cantidad: parseInt(e.target.value) })}
          />
          <Label>
            Precio
          </Label>
          <Input
            type="number"
            placeholder="Precio unitario"
            value={nuevoConcepto.precio}
            onChange={(e) => setNuevoConcepto({ ...nuevoConcepto, precio: parseFloat(e.target.value) })}
          />
          <Button secondary onClick={añadirConcepto}>Añadir Concepto</Button>

          <div className={styles.section}>
            <div className={styles.rowConcept}>
              <h1>Titulo</h1>
              <h1>Descripcion</h1>
              <h1>Precio</h1>
              <h1>Qty</h1>
              <h1>Total</h1>
            </div>
            {conceptos.map((concepto, index) => (
              <div key={index} className={styles.rowMapConcept}>
                <h1>{concepto.type}</h1>
                <h1>{concepto.concept}</h1>
                <h1>${formatCurrency(concepto.price * 1)}</h1>
                <h1>{concepto.qty}</h1>
                <h1>${formatCurrency(concepto.qty * concepto.price)}</h1>
              </div>
            ))}

            <div className={styles.sectionTotal}>
              <h1>Subtotal: $
                {!conceptos[0] ? (
                  '0'
                ) : (
                  formatCurrency(conceptos[0].price * 1)
                )}
              </h1>
              <h1>IVA: $
                {!conceptos[0] ? (
                  '0'
                ) : (
                  formatCurrency((conceptos[0].price / 100) * 16)
                )
                }
              </h1>
              <h1>Total: $
                {!conceptos[0] ? (
                  '0'
                ) : (
                  formatCurrency(conceptos[0].price * 1 + conceptos[0].price / 100 * 16)
                )
                }</h1>
            </div>

          </div>

          <Button primary onClick={crearNota}>Crear</Button>
        </Form>

      </div>

    </>

  )
}



