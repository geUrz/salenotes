import { BasicLayout, BasicModal } from '@/layouts'
import { useState } from 'react'
import { Add } from '@/components/Layouts'
import styles from './clientes.module.css'
import { ClienteForm } from '@/components/Clientes'
import { ListaClientes } from '@/components/Clientes/ListaClientes'
import { FaCog } from 'react-icons/fa'


export default function Cliente() {

  const [show, setShow] = useState(false)

  const onOpenClose = () => setShow((prevState) => !prevState)

  const [reload, setReload] = useState()

  const onReload = () => setReload((prevState) => !prevState)

  return (
    
    <BasicLayout title='Lista de Clientes' categorie='clientes' onReload={onReload}>

<div className={styles.section}>
        <div className={styles.container}>
          {/* <div className={styles.countNotes}>
            <ServicioNotas />
            <ProductoNotas />
          </div> */}
          <div className={styles.rows}>
            
            <div className={styles.row}>
              <h1>Código</h1>
              <h1>Cliente</h1>
              <h1>Contacto</h1>
              <h1><FaCog /></h1>
            </div>
            
            <ListaClientes reload={reload} onReload={onReload} />
            
          </div>
        </div>
      </div>

      <Add title='Crear cliente' onOpenClose={onOpenClose} />
      
      <BasicModal title='Crear cliente' show={show} onClose={onOpenClose}>
        <ClienteForm reload={reload} onReload={onReload} onOpenClose={onOpenClose} />
      </BasicModal>

    </BasicLayout>

  )
}
