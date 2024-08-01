import { useEffect, useState } from 'react'
import { Button, Form, FormField, FormGroup, Input, Label, TextArea } from 'semantic-ui-react'
import axios from 'axios'
import { formatCurrency } from '@/helpers/formatCurrency'
import { IconCloseModal } from '@/components/Layouts'
import styles from './NotaForm.module.css'
import { BiToggleLeft, BiToggleRight } from 'react-icons/bi'

export function NotaForm(props) {

  const { reload, onReload, onOpenClose, onToastSuccess } = props

  const [cliente, setCliente] = useState('')
  const [clientes, setClientes] = useState([]);
  const [descripcion, setDescripcion] = useState('')
  const [conceptos, setConceptos] = useState([])
  const [nuevoConcepto, setNuevoConcepto] = useState({ tipo: '', concepto: '', cantidad: '', precio: '' })
  const [errors, setErrors] = useState({})
  const [toggleIVA, setToggleIVA] = useState()

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

  const validarFormCliente = () => {
    const newErrors = {}

    if (!cliente) {
      newErrors.cliente = 'El campo es requerido'
    }

    if (!descripcion) {
      newErrors.descripcion = 'El campo es requerido'
    }

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0
  }

  const validarFormConceptos = () => {
    const newErrors = {}

    if (!nuevoConcepto.tipo) {
      newErrors.tipo = 'El campo es requerido'
    }

    if (!nuevoConcepto.concepto) {
      newErrors.concepto = 'El campo es requerido'
    }

    if (!nuevoConcepto.cantidad) {
      newErrors.cantidad = 'El campo es requerido'
    } else if (nuevoConcepto.cantidad <= 0) {
      newErrors.cantidad = 'La cantidad debe ser mayor a 0'
    }

    if (!nuevoConcepto.precio) {
      newErrors.precio = 'El campo es requerido'
    } else if (nuevoConcepto.precio <= 0) {
      newErrors.precio = 'El precio debe ser mayor a 0'
    }

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0
  }

  const crearNota = async (e) => {
    e.preventDefault()

    if (!validarFormCliente()) {
      return
    }

    try {
      const response = await axios.post('/api/notes', { cliente_id: cliente, descripcion })
      const notaId = response.data.id
      await Promise.all(conceptos.map(concepto =>
        axios.post('/api/concepts', { nota_id: notaId, ...concepto })
      ))
      onToastSuccess()
      setCliente('');
      setDescripcion('')
      setConceptos([])
      onOpenClose()
      onReload()
    } catch (error) {
      console.error('Error al crear la nota:', error)

    }
  }

  const añadirConcepto = () => {
    if (!validarFormConceptos()) {
      return
    }
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

  useEffect(() => {
    const savedToggleIVA = localStorage.getItem('ontoggleIVA')
    if (savedToggleIVA) {
      setToggleIVA(JSON.parse(savedToggleIVA))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('ontoggleIVA', JSON.stringify(toggleIVA))
  }, [toggleIVA])

  const onToggleIVA = () => {
    setToggleIVA(prevState => (!prevState))
  }

  return (

    <>

      <IconCloseModal onOpenClose={onOpenClose} />

      <div className={styles.main}>

        <Form>
          <FormGroup widths='equal'>
            <FormField error={!!errors.cliente}>
              <Label>Cliente</Label>
              <select value={cliente} onChange={(e) => setCliente(e.target.value)}>
                <option value=""></option>
                {clientes.map((cliente) => (
                  <option key={cliente.id} value={cliente.id}>
                    {cliente.cliente}
                  </option>
                ))}
              </select>
              {errors.cliente && <span className={styles.error}>{errors.cliente}</span>}
            </FormField>
          </FormGroup>
          <FormGroup widths='equal'>
            <FormField error={!!errors.descripcion}>
              <Label>Descripción</Label>
              <TextArea
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
              />
              {errors.descripcion && <span className={styles.error}>{errors.descripcion}</span>}
            </FormField>
          </FormGroup>
        </Form>

        <Form>
          <FormGroup widths='equal'>
            <FormField error={!!errors.tipo}>
              <Label>Tipo</Label>
              <select
                value={nuevoConcepto.tipo}
                onChange={(e) => setNuevoConcepto({ ...nuevoConcepto, tipo: e.target.value })}
              >
                <option value=''></option>
                <option value='Servicio'>Servicio</option>
                <option value='Producto'>Producto</option>
              </select>
              {errors.tipo && <span className={styles.error}>{errors.tipo}</span>}
            </FormField>
            <FormField error={!!errors.concepto}>
              <Label>Concepto</Label>
              <Input
                type="text"
                value={nuevoConcepto.concepto}
                onChange={(e) => setNuevoConcepto({ ...nuevoConcepto, concepto: e.target.value })}
              />
              {errors.concepto && <span className={styles.error}>{errors.concepto}</span>}
            </FormField>
            <FormField error={!!errors.cantidad}>
              <Label>Qty</Label>
              <Input
                type="number"
                value={nuevoConcepto.cantidad}
                onChange={(e) => setNuevoConcepto({ ...nuevoConcepto, cantidad: parseInt(e.target.value) })}
              />
              {errors.cantidad && <span className={styles.error}>{errors.cantidad}</span>}
            </FormField>
            <FormField error={!!errors.precio}>
              <Label>Precio</Label>
              <Input
                type="number"
                value={nuevoConcepto.precio}
                onChange={(e) => setNuevoConcepto({ ...nuevoConcepto, precio: parseFloat(e.target.value) })}
              />
              {errors.precio && <span className={styles.error}>{errors.precio}</span>}
            </FormField>
          </FormGroup>
          <Button secondary onClick={añadirConcepto}>Añadir Concepto</Button>
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
          <div>       
            <h1>Subtotal:</h1>
            
            {!toggleIVA ? (
              <div className={styles.toggleOn}>
                <BiToggleRight onClick={onToggleIVA} />
                <h1>IVA:</h1>
              </div>
            ) : (
              <div className={styles.toggleOff}>
                <BiToggleLeft onClick={onToggleIVA} />
                <h1>IVA:</h1>
              </div>
            )}

            <h1>Total:</h1>
          </div>

            <div>
            
            {toggleIVA ? (
              
              <>

                <h1>-</h1>
                <h1>-</h1>
              
              </>

            ) : (
              <>
              
              <h1>$
                {!conceptos[0] ? (
                  '0'
                ) : (
                  formatCurrency(subtotal)
                )}
              </h1>
              <h1>$
                {!conceptos[0] ? (
                  '0'
                ) : (
                  formatCurrency(iva)
                )
                }
              </h1>
              
              </>
            )}

            {toggleIVA ? (
              <h1>$
              {!conceptos[0] ? (
                '0'
              ) : (
                formatCurrency(subtotal)
              )
              }
            </h1>
            ) : (
              <h1>$
              {!conceptos[0] ? (
                '0'
              ) : (
                formatCurrency(total)
              )
              }
            </h1>
            )}

          </div>
          </div>

        </div>

        <Button primary onClick={crearNota}>Crear</Button>


      </div>

    </>

  )
}



