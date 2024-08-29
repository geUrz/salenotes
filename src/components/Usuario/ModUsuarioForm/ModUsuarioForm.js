import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { useAuth } from '@/context/AuthContext'
import { Form, Button, Input, Label, FormGroup, FormField } from 'semantic-ui-react'
import styles from './ModUsuarioForm.module.css'
import { IconCloseModal, Confirm } from '@/components/Layouts'
import { FaCheck, FaTimes } from 'react-icons/fa'

export function ModUsuarioForm(props) {

  const {onOpenClose} = props

  const [showConfirm, setShowConfirm] = useState(false)

  const onShowConfirm = () => setShowConfirm((prevState) => !prevState)

  const { user, logout } = useAuth()
  
  const [activateAdmin, setActivateAdmin] = useState(false)

  const timer = useRef(null)

  const handleTouchStart = () => {
    timer.current = setTimeout(() => {
      setActivateAdmin(prev => !prev)
    }, 3000)
  }

  const handleTouchEnd = () => {
    clearTimeout(timer.current)
  }

  const handleKeyDown = (e) => {
    if (e.ctrlKey && e.key === '0') {
      e.preventDefault()
      setActivateAdmin((prevState) => !prevState)
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
  
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  const [formData, setFormData] = useState({
    newUsuario: user.usuario || '',
    newEmail: user.email || '',
    newIsAdmin: user.is_admin || '',
    newPassword: '',
    confirmPassword: '' 
  });

  const [error, setError] = useState(null)
  const [errors, setErrors] = useState({})

  const validarFormUser = () => {
    const newErrors = {};
  
    if (!formData.newUsuario) {
      newErrors.newUsuario = 'El campo es requerido';
    }
  
    if (!formData.newEmail) {
      newErrors.newEmail = 'El campo es requerido';
    }
    
    onShowConfirm()

    setErrors(newErrors);
  
    return Object.keys(newErrors).length === 0;
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validarFormUser()) {
      return
    }

    setError(null)
    
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden')
      onShowConfirm()
      return
    }

    try {
      await axios.put('/api/auth/updateUser', {
        userId: user.id,
        newUsuario: formData.newUsuario,
        newEmail: formData.newEmail,
        newIsAdmin: formData.newIsAdmin,
        newPassword: formData.newPassword,
      })

      logout()

    } catch (error) {
      console.error('Error al actualizar el perfil:', error);
      if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error);
      } else {
        setError('Ocurrió un error inesperado');
      }
    }
  }

  return (
    <>

      <IconCloseModal onOpenClose={onOpenClose} />

      <Form onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
        <FormGroup>
          <FormField error={!!errors.newUsuario}>
            <Label>Nuevo Usuario</Label>
            <Input
              name='newUsuario'
              type='text'
              value={formData.newUsuario}
              onChange={handleChange}
            />
            {errors.newUsuario && <span className={styles.error}>{errors.newUsuario}</span>}
          </FormField>
          <FormField error={!!errors.newEmail}>
            <Label>Nuevo Correo</Label>
            <Input
              name='newEmail'
              type='email'
              value={formData.newEmail}
              onChange={handleChange}
            />
            {errors.newEmail && <span className={styles.error}>{errors.newEmail}</span>}
          </FormField>
          
          {!activateAdmin ? (
            ''
          ) : (
            <FormField>
              <Label>Nivel</Label>
              <select
                name='newIsAdmin'
                type='text'
                value={formData.newIsAdmin}
                onChange={handleChange}
              >
                <option value=''></option>
                <option value='true'>admin</option>
                <option value='false'>usuario</option>
              </select>
            </FormField>
          )}

          <FormField>
            <Label>Nueva Contraseña</Label>
            <Input
              name='newPassword'
              type='password'
              value={formData.newPassword}
              onChange={handleChange}
            />
          </FormField>
          <FormField>
            <Label>Confirmar nueva contraseña</Label>
            <Input
              name='confirmPassword'
              type='password'
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </FormField>
        </FormGroup>
        {error && <p className={styles.error}>{error}</p>}
        <Button primary onClick={onShowConfirm}>Guardar</Button>
      </Form>

      <Confirm
        open={showConfirm}
        cancelButton={
          <div className={styles.iconClose}>
            <FaTimes />
          </div>
        }
        confirmButton={
          <div className={styles.iconCheck}>
            <FaCheck />
          </div>
        }
        onConfirm={handleSubmit}
        onCancel={onShowConfirm}
        content='¿ Estas seguro de modificar el usuario ? La sesión se cerrara'
      />

    </>

  )
}
