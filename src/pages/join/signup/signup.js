import { Button, Form, FormField, FormGroup, Input, Label } from 'semantic-ui-react'
import { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'
import { BasicJoin } from '@/layouts'
import { FaUserPlus } from 'react-icons/fa'
import Link from 'next/link'
import { useRedirectIfAuthenticated } from '@/hook'
import styles from './signup.module.css'

export default function Signup() {

  const router = useRouter()

  const [errors, setErrors] = useState({})

  const [credentials, setCredentials] = useState({
    usuario: '',
    email: '',
    password: '',
    confirmarPassword: ''
  });

  useRedirectIfAuthenticated()

  const [error, setError] = useState(null)

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    })
  }

  const validarFormSignUp = () => {
    const newErrors = {}

    if (!credentials.usuario) {
      newErrors.usuario = 'El campo es requerido'
    }

    if (!credentials.email) {
      newErrors.email = 'El campo es requerido'
    }

    if (!credentials.password) {
      newErrors.password = 'El campo es requerido'
    }

    if (!credentials.confirmarPassword) {
      newErrors.confirmarPassword = 'El campo es requerido'
    }

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validarFormSignUp()) {
      return
    }
    setError(null)

    if (credentials.password !== credentials.confirmarPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    try {
      await axios.post('/api/auth/register', credentials)

      router.push('/join/signin')

      setCredentials({
        usuario: '',
        email: '',
        password: '',
        confirmarPassword: ''
      })

      setError(null)
    } catch (error) {
      console.error('Error capturado:', error);

      if (error.response && error.response.data && error.response.data.error) {
         setError(error.response.data.error); // Error específico del backend
      } else if (error.message) {
         setError(error.message); // Error general de JS (por ejemplo, error de red)
      } else {
         setError('¡ Ocurrió un error inesperado !'); // Fallback para cualquier otro tipo de error
      }
    }
  };

  return (

    <BasicJoin relative>

      <div className={styles.user}>
        <FaUserPlus />
        <h1>Crear usuario</h1>
      </div>

      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <FormField error={!!errors.usuario}>
            <Label>Usuario</Label>
            <Input
              name='usuario'
              type='text'
              value={credentials.usuario}
              onChange={handleChange}
            />
            {errors.usuario && <span className={styles.error}>{errors.usuario}</span>}
          </FormField>
          <FormField error={!!errors.email}>
            <Label>Correo</Label>
            <Input
              name='email'
              type='email'
              value={credentials.email}
              onChange={handleChange}
            />
            {errors.email && <span className={styles.error}>{errors.email}</span>}
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
          <FormField error={!!errors.confirmarPassword}>
            <Label>Confirmar contraseña</Label>
            <Input
              name='confirmarPassword'
              type='password'
              value={credentials.confirmarPassword}
              onChange={handleChange}
            />
            {errors.confirmarPassword && <span className={styles.error}>{errors.confirmarPassword}</span>}
          </FormField>
        </FormGroup>
        {error && <p className={styles.error}>{error}</p>}
        <Button primary type='submit'>Crear usuario</Button>
      </Form>

      <div className={styles.link}>
        <Link href='/join/signin'>
          Iniciar sesión 
        </Link>
      </div>

    </BasicJoin>

  )
}
