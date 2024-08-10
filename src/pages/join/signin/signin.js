import { Button, Form, FormField, FormGroup, Input, Label } from 'semantic-ui-react';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { BasicJoin } from '@/layouts';
import { FaUser } from 'react-icons/fa';
import Link from 'next/link';
import { useRedirectIfAuthenticated } from '@/hook';
import styles from './signin.module.css';

export default function Signin() {

  const [credentials, setCredentials] = useState({
    emailOrUsuario: '',
    password: ''
  })

  useRedirectIfAuthenticated()

  const { login } = useAuth();
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await login(credentials.emailOrUsuario, credentials.password)
    } catch (error) {
      setError("Correo o contraseña inválida");
      console.error("Error:", error);
    }
  };

  return (

    <BasicJoin relative>

      <div className={styles.user}>
        <FaUser />
        <h1>Iniciar sesión</h1>
      </div>

      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <FormField>
            <Label>Usuario / Correo</Label>
            <Input
              name='emailOrUsuario'
              type='text'
              value={credentials.emailOrUsuario}
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
