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

  const [credentials, setCredentials] = useState({
    usuario: '',
    email: '',
    password: '',
    confirmarPassword: ''
  });

  useRedirectIfAuthenticated()

  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (credentials.password !== credentials.confirmarPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    try {
      const response = await axios.post('/api/auth/register', credentials);
      console.log('Usuario registrado:', response.data);

      router.push('/join/signin')

      // Limpiar el formulario
      setCredentials({
        usuario: '',
        email: '',
        password: '',
        confirmarPassword: ''
      })

      setError(null); // Limpiar el error si el registro fue exitoso
    } catch (error) {
      setError("Hubo un problema al crear el usuario. Inténtalo de nuevo.");
      console.error("Error:", error);
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
          <FormField>
            <Label>Usuario</Label>
            <Input
              name='usuario'
              type='text'
              value={credentials.usuario}
              onChange={handleChange}
            />
          </FormField>
          <FormField>
            <Label>Correo</Label>
            <Input
              name='email'
              type='email'
              value={credentials.email}
              onChange={handleChange}
            />
          </FormField>
          <FormField>
            <Label>Contraseña</Label>
            <Input
              name='password'
              type='password'
              value={credentials.password}
              onChange={handleChange}
            />
          </FormField>
          <FormField>
            <Label>Confirmar contraseña</Label>
            <Input
              name='confirmarPassword'
              type='password'
              value={credentials.confirmarPassword}
              onChange={handleChange}
            />
          </FormField>
        </FormGroup>
        {error && <p className={styles.error}>{error}</p>}
        <Button primary type='submit'>Crear usuario</Button>
      </Form>

      <div className={styles.link}>
        <Link href='/join/signin'>
          ¡ Iniciar sesión ! 
        </Link>
      </div>

    </BasicJoin>

  )
}
