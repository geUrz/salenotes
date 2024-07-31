import { useEffect, useState } from 'react'
import axios from 'axios'
import { Button, Form, FormField, FormGroup, Input, Label } from 'semantic-ui-react'
import { IconCloseModal } from '@/components/Layouts'
import styles from './ClienteModForm.module.css'

export function ClienteModForm(props) {

  const { reload, onReload, clienteSeleccionado, onOpenClose, onToastSuccess } = props

  const [cliente, setCliente] = useState('')
  const [contacto, setContacto] = useState('')
  const [direccion, setDireccion] = useState('')
  const [cel, setCel] = useState('')
  const [email, setEmail] = useState('')

  useEffect(() => {
    if (clienteSeleccionado) {
      setCliente(clienteSeleccionado.cliente)
      setContacto(clienteSeleccionado.contacto)
      setDireccion(clienteSeleccionado.direccion)
      setCel(clienteSeleccionado.cel)
      setEmail(clienteSeleccionado.email)
    }
  }, [clienteSeleccionado])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.put(`/api/clients?id=${clienteSeleccionado.id}`, { cliente, contacto, direccion, cel, email })
      onToastSuccess()
      onOpenClose()
      onReload()
    } catch (error) {
      console.error('Error al actualizar el cliente:', error)
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
        <Button primary onClick={handleSubmit}>Actualizar</Button>
      </div>
    </>
  )
}
