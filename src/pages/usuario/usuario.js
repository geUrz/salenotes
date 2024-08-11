import { BasicLayout, BasicModal } from '@/layouts'
import ProtectedRoute from '@/components/Layouts/ProtectedRoute/ProtectedRoute'
import { Loading, ToastSuccess } from '@/components/Layouts'
import { useAuth } from '@/context/AuthContext'
import styles from './usuario.module.css'
import { FaEdit, FaUser } from 'react-icons/fa'
import { Button } from 'semantic-ui-react'
import { ModUsuarioForm } from '@/components/Usuario'
import { useState } from 'react'

export default function Usuario() {

  const [show, setShow] = useState(false)

  const [setToastSuccess] = useState(false)

  const onToastSuccess = () => setToastSuccess((prevState) => !prevState)

  const onOpenClose = () => setShow((prevState) => !prevState)

  const { user, logout, loading } = useAuth()

  if (loading) {
    <Loading size={45} loading={1} />
  }

  return (

    <ProtectedRoute>

      <BasicLayout relative title='Usuario' categorie='usuario'>

        <div className={styles.main}>
          <div className={styles.section}>
            <FaUser />
            
            {!user ? (
              ''
            ) : (
              <>
              
                <h1>{user.usuario}</h1>
                <h2>{user.email}</h2>
              
              </>
            )}

            <div className={styles.iconEdit}>
              <div onClick={onOpenClose}>
                <FaEdit />
              </div>
            </div>

            <Button negative onClick={logout}>
              Cerrar sesión
            </Button>
          </div>
        </div>

        <BasicModal title='modificar usuario' show={show} onClose={onOpenClose}>
            <ModUsuarioForm user={user} onOpenClose={onOpenClose} onToastSuccess={onToastSuccess} />
        </BasicModal>

      </BasicLayout>

    </ProtectedRoute>

  )
}
