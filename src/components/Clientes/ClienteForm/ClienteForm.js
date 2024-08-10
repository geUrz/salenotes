import { useEffect, useState } from 'react'
import axios from 'axios'
import { Button, Form, FormField, FormGroup, Input, Label } from 'semantic-ui-react'
import { IconCloseModal } from '@/components/Layouts'
import styles from './ClienteForm.module.css'

export function ClienteForm(props) {

  const {reload, onReload, onOpenClose} = props

  const [clientes, setClientes] = useState([])
  const [cliente, setCliente] = useState('')
  const [contacto, setContacto] = useState('')
  const [direccion, setDireccion] = useState('')
  const [cel, setCel] = useState('')
  const [email, setEmail] = useState('')
  const [errors, setErrors] = useState({})

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await axios.get('/api/clientes')
        setClientes(response.data)
      } catch (error) {
        console.error('Error al obtener los clientes:', error)
      }
    }

    fetchClientes()

  }, [])

  const validarFormCliente = () => {
    const newErrors = {}

    if (!cliente) {
      newErrors.cliente = 'El campo es requerido'
    }

    if (!contacto) {
      newErrors.contacto = 'El campo es requerido'
    }

    if (!direccion) {
      newErrors.direccion = 'El campo es requerido'
    }

    if (!cel) {
      newErrors.cel = 'El campo es requerido'
    }

    if (!email) {
      newErrors.email = 'El campo es requerido'
    }

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validarFormCliente()) {
      return
    }

    try {
      const response = await axios.post('/api/clientes', { cliente, contacto, direccion, cel, email })

      setClientes([...clientes, response.data])
      setCliente('')
      setContacto('')
      setDireccion('')
      setCel('')
      setEmail('')
      onOpenClose()
      onReload()

    } catch (error) {
      console.error('Error al crear el cliente:', error);
    }

  }

  return (

    <>

      <IconCloseModal onOpenClose={onOpenClose} />

      <div className={styles.main}>
        <Form>
          <FormGroup widths='equal'>
            <FormField error={!!errors.cliente}>
              <Label>
                Cliente
              </Label>
              <Input
                type="text"
                value={cliente}
                onChange={(e) => setCliente(e.target.value)}
              />
              {errors.cliente && <span className={styles.error}>{errors.cliente}</span>}
              </FormField>
              <FormField error={!!errors.contacto}>
              <Label>
                Contacto
              </Label>
              <Input
                type="text"
                value={contacto}
                onChange={(e) => setContacto(e.target.value)}
              />
              {errors.contacto && <span className={styles.error}>{errors.contacto}</span>}
              </FormField>
              <FormField error={!!errors.direccion}>
              <Label>
                Dirección
              </Label>
              <Input
                type="text"
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
              />
              {errors.direccion && <span className={styles.error}>{errors.direccion}</span>}
              </FormField>
              <FormField error={!!errors.cel}>
              <Label>
                Celular
              </Label>
              <Input
                type="number"
                value={cel}
                onChange={(e) => setCel(e.target.value)}
              />
              {errors.cel && <span className={styles.error}>{errors.cel}</span>}
              </FormField>
              <FormField error={!!errors.email}>
              <Label>
                Email
              </Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && <span className={styles.error}>{errors.email}</span>}
            </FormField>
          </FormGroup>
        </Form>

        <Button primary onClick={handleSubmit}>Crear</Button>
      </div>

    </>

  )
}
