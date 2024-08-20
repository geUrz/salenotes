import { AuthProvider } from '@/context/AuthContext'
import 'semantic-ui-css/semantic.min.css'
import { useEffect } from 'react'
import initOneSignal from '@/libs/onesignal'
import '@/styles/globals.css'

export default function App(props) {

  const { Component, pageProps } = props

  useEffect(() => {
    initOneSignal();
  }, []);

  return(
  
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>

  ) 
}
