import { Button, Form, FormField, FormGroup, Input, Label } from 'semantic-ui-react'
import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { BasicJoin } from '@/layouts'
import { FaUser } from 'react-icons/fa'
import Link from 'next/link'
import { useRedirectIfAuthenticated } from '@/hook'
import styles from './signin.module.css'

export default function Signin() {

  const [errors, setErrors] = useState({})

  const [credentials, setCredentials] = useState({
    emailOrUsuario: '',
    password: ''
  })

  useRedirectIfAuthenticated()

  const { login } = useAuth()
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    })
  }

  const validarFormSignIn = () => {
    const newErrors = {}

    if (!credentials.emailOrUsuario) {
      newErrors.emailOrUsuario = 'El campo es requerido'
    }

    if (!credentials.password) {
      newErrors.password = 'El campo es requerido'
    }

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validarFormSignIn()) {
      return
    }
    setError(null)

    try {
      await login(credentials.emailOrUsuario, credentials.password)
    } catch (error) {
      console.error('Error capturado:', error);

      if (error.response && error.response.data && error.response.data.error) {
         setError(error.response.data.error); // Error específico del backend
      } else if (error.message) {
         setError(error.message); // Error general de JS (por ejemplo, error de red)
      } else {
         setError('Ocurrió un error inesperado'); // Fallback para cualquier otro tipo de error
      }
   }
  }

  return (

    <BasicJoin relative>

      <div className={styles.user}>
        <FaUser />
        <h1>Iniciar sesión</h1>
      </div>

      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <FormField error={!!errors.emailOrUsuario}>
            <Label>Usuario / Correo</Label>
            <Input
              name='emailOrUsuario'
              type='text'
              value={credentials.emailOrUsuario}
              onChange={handleChange}
            />
            {errors.emailOrUsuario && <span className={styles.error}>{errors.emailOrUsuario}</span>}
          </FormField>
          <FormField error={!!errors.password}>
            <Label>Contraseña</Label>
            <Input
              name='password'
              type='password'
              value={credentials.password}
              onChange={handleChange}
            />
            {errors.password && <span className={styles.error}>{errors.password}</span>}
          </FormField>
        </FormGroup>
        {error && <p className={styles.error}>{error}</p>}
        <Button primary type='submit'>Iniciar sesión</Button>
      </Form>

      <div className={styles.link}>
        <Link href='/join/signup'>
          ¿No tienes un usuario? ¡Crea uno aquí!
        </Link>
      </div>

    </BasicJoin>

  )
}
