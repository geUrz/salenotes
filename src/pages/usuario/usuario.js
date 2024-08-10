import { BasicLayout } from '@/layouts'
import ProtectedRoute from '@/components/Layouts/ProtectedRoute/ProtectedRoute'
import { Loading } from '@/components/Layouts'
import { useAuth } from '@/context/AuthContext'
import styles from './usuario.module.css'
import { FaUser } from 'react-icons/fa'
import { Button } from 'semantic-ui-react'

export default function Usuario() {

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
                <h1>{user.email}</h1>
              
              </>
            )}

            <Button negative onClick={logout}>
              Cerrar sesión
            </Button>
          </div>
        </div>

      </BasicLayout>

    </ProtectedRoute>

  )
}
