import { useEffect, useState } from 'react'
import axios from 'axios'
import { Button, Form, FormField, FormGroup, Input, Label } from 'semantic-ui-react'
import { IconCloseModal } from '@/components/Layouts'
import styles from './ClienteForm.module.css'

export function ClienteForm(props) {

  const {onOpenClose} = props

  const [clientes, setClientes] = useState([])
  const [cliente, setCliente] = useState('')
  const [contacto, setContacto] = useState('')
  const [direccion, setDireccion] = useState('')
  const [cel, setCel] = useState('')
  const [email, setEmail] = useState('')

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await axios.get('/api/clients')
        setClientes(response.data)
      } catch (error) {
        console.error('Error al obtener los clientes:', error)
      }
    };

    fetchClientes()
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post('/api/clients', { cliente, contacto, direccion, cel, email })

      setClientes([...clientes, response.data])
      setCliente('')
      setContacto('')
      setDireccion('')
      setCel('')
      setEmail('')
      onOpenClose()
    } catch (error) {
      console.error('Error al crear el cliente:', error)
    }
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
                value={cliente}
                onChange={(e) => setCliente(e.target.value)}
              />
              <Label>
                Contacto
              </Label>
              <Input
                type="text"
                value={contacto}
                onChange={(e) => setContacto(e.target.value)}
              />
              <Label>
                Dirección
              </Label>
              <Input
                type="text"
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
              />
              <Label>
                Celular
              </Label>
              <Input
                type="number"
                value={cel}
                onChange={(e) => setCel(e.target.value)}
              />
              <Label>
                Email
              </Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormField>
          </FormGroup>
        </Form>

        <Button primary onClick={handleSubmit}>Crear</Button>
      </div>

    </>

  )
}
