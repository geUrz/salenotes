import { useEffect, useState } from 'react'
import { Button, Form, FormField, FormGroup, Input, Label, TextArea } from 'semantic-ui-react'
import styles from './NotaForm.module.css'
import axios from 'axios'
import { formatCurrency } from '@/helpers/formatCurrency'
import { IconCloseModal } from '@/components/Layouts'

export function NotaForm(props) {

  const { reload, onReload, onOpenClose } = props

  const [cliente, setCliente] = useState('')
  const [clientes, setClientes] = useState([]);
  const [descripcion, setDescripcion] = useState('')
  const [conceptos, setConceptos] = useState([])
  const [nuevoConcepto, setNuevoConcepto] = useState({ tipo: '', concepto: '', cantidad: '', precio: '' })

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await axios.get('/api/clients')
        setClientes(response.data);
      } catch (error) {
        console.error('Error al obtener clientes:', error)
      }
    };
    fetchClientes()
  }, [])

  const crearNota = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post('/api/notes', { cliente_id: cliente, descripcion })
      const notaId = response.data.id
      // Guardar conceptos asociados a la nota
      await Promise.all(conceptos.map(concepto =>
        axios.post('/api/concepts', { nota_id: notaId, ...concepto })
      ))
      alert('Nota creada exitosamente!')
      setCliente('');
      setDescripcion('')
      setConceptos([])
      onOpenClose()
      onReload()
    } catch (error) {
      console.error('Error al crear la nota:', error)
      alert('Hubo un error al crear la nota. Por favor, inténtalo de nuevo.')
    }
  }

  const añadirConcepto = () => {
    setConceptos([...conceptos, nuevoConcepto]);
    setNuevoConcepto({ tipo: '', concepto: '', cantidad: '', precio: '' })
  }

  const calcularTotales = () => {
    const subtotal = conceptos.reduce((acc, curr) => acc + curr.cantidad * curr.precio, 0);
    const iva = subtotal * 0.16;
    const total = subtotal + iva;
    return { subtotal, iva, total }
  };

  const { subtotal, iva, total } = calcularTotales()

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
              <select value={cliente} onChange={(e) => setCliente(e.target.value)}>
                <option value=""></option>
                {clientes.map((cliente) => (
                  <option key={cliente.id} value={cliente.id}>
                    {cliente.cliente}
                  </option>
                ))}
              </select>
              <Label>
                Descripción
              </Label>
              <TextArea
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
              />

            </FormField>
          </FormGroup>
        </Form>

        <Form>
          <FormGroup widths='equal'>
            <FormField>
            <Label className={styles.formLabel}>
              Tipo
            </Label>
            <FormField
              type="text"
              control='select'
              value={nuevoConcepto.tipo}
              onChange={(e) => setNuevoConcepto({ ...nuevoConcepto, tipo: e.target.value })}
            >
              <option value=''></option>
              <option value='Servicio'>Servicio</option>
              <option value='Producto'>Producto</option>
            </FormField>
          <Label>
            Concepto
          </Label>
          <Input
            type="text"
            value={nuevoConcepto.concepto}
            onChange={(e) => setNuevoConcepto({ ...nuevoConcepto, concepto: e.target.value })}
          />
          <Label>
            Qty
          </Label>
          <Input
            type="number"
            value={nuevoConcepto.cantidad}
            onChange={(e) => setNuevoConcepto({ ...nuevoConcepto, cantidad: parseInt(e.target.value) })}
          />
          <Label>
            Precio
          </Label>
          <Input
            type="number"
            value={nuevoConcepto.precio}
            onChange={(e) => setNuevoConcepto({ ...nuevoConcepto, precio: parseFloat(e.target.value) })}
          />
          <Button secondary onClick={añadirConcepto}>Añadir Concepto</Button>
            </FormField>
          </FormGroup>
        </Form>

          <div className={styles.section}>
            <div className={styles.rowConcept}>
              <h1>Tipo</h1>
              <h1>Concepto</h1>
              <h1>Precio</h1>
              <h1>Qty</h1>
              <h1>Total</h1>
            </div>
            {conceptos.map((concepto, index) => (
              <div key={index} className={styles.rowMapConcept}>
                <h1>{concepto.tipo}</h1>
                <h1>{concepto.concepto}</h1>
                <h1>${formatCurrency(concepto.precio * 1)}</h1>
                <h1>{concepto.cantidad}</h1>
                <h1>${formatCurrency(concepto.cantidad * concepto.precio)}</h1>
              </div>
            ))}

            <div className={styles.sectionTotal}>
              <div className={styles.boxLeft}>
                <h1>Subtotal:</h1>
                <h1>IVA:</h1>
                <h1>Total:</h1>
              </div>

              <div className={styles.boxRight}>
                {!conceptos[0] ? (
                  <h1>$0.00</h1>
                ) : (
                  <h1>${formatCurrency(subtotal)}</h1>
                )}
                {!conceptos[0] ? (
                  <h1>$0.00</h1>
                ) : (
                  <h1>${formatCurrency(iva)}</h1>
                )
                }
                {!conceptos[0] ? (
                  <h1>$0.00</h1>
                ) : (
                  <h1>${formatCurrency(total)}</h1>
                )
                }
              </div>
            </div>

          </div>

          <Button primary onClick={crearNota}>Crear</Button>
        

      </div>

    </>

  )
}



