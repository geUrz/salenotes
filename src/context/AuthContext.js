import { createContext, useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function loadUserFromCookies() {
      try {
        const response = await axios.get('/api/auth/me') // Endpoint para verificar el token y obtener el usuario
        setUser(response.data.user)
      } catch (error) {
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    loadUserFromCookies();
  }, [])

  const login = async (emailOrUsuario, password) => {
    try {
      const response = await axios.post('/api/auth/login', { emailOrUsuario, password })
      setUser(response.data.user)
      router.push('/') // Redirigir después de iniciar sesión
    } catch (error) {
      console.error('Login failed:', error)
    }
  }

  const logout = async () => {
    try {
      await axios.post('/api/auth/logout')
      setUser(null)
      router.push('/join/signin')
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext)
}
