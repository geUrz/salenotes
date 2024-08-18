import { useRef, useState } from 'react'
import SignaturePad from 'react-signature-canvas'
import styles from './FirmaDigital.module.css'
import { Button } from 'semantic-ui-react'
import { IconCloseModal } from '../IconCloseModal'
import axios from 'axios'

export function FirmaDigital(props) {

  const { notaId, reload, onReload, onOpenCloseFirma } = props
  
  const [trimmedDataURL, setTrimmedDataURL] = useState(null)
  const sigPad = useRef({})

  const clear = () => {
    sigPad.current.clear()
  }

  const trim = async () => {
    const signature = sigPad.current.getTrimmedCanvas().toDataURL('image/png')
    setTrimmedDataURL(signature)
    await onSave(signature)
  }

  const onSave = async (signature) => {
      try {
        const response = await axios.put(`/api/notas?id=${notaId}`, {
          firma: signature
        })

        onReload()
        onOpenCloseFirma()

      if (response.status === 200) {
        // Handle successful save
        console.log('Firma guardada exitosamente')
      }
    } catch (error) {
      console.error('Error al guardar la firma:', error)
    }
  }
  
  return (

    <>

      <IconCloseModal onOpenClose={onOpenCloseFirma} />

      <div className={styles.signatureContainer}>
        <SignaturePad
          ref={sigPad}
          penColor='azure'
          minWidth={1}
          maxWidth={1}
          canvasProps={{ className: styles.signatureCanvas }} />
        <div className={styles.controls}>
          <Button secondary onClick={clear}>Limpiar</Button>
          <Button primary onClick={trim}>Firmar</Button>
        </div>
      </div>

    </>

  )
}
