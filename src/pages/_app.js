//import { AuthProvider } from '@/contexts'
import 'semantic-ui-css/semantic.min.css'
import '@/styles/globals.css'

export default function App(props) {

  const { Component, pageProps } = props

  return(
  
    //<AuthProvider>
      <Component {...pageProps} />
    //</AuthProvider>

  ) 
}
