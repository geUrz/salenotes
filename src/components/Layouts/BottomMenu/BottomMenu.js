import { FaFileAlt, FaFileInvoiceDollar, FaHome, FaUser, FaUserPlus, FaUsers } from 'react-icons/fa'
import { BiSolidFilePlus } from 'react-icons/bi'
import styles from './BottomMenu.module.css'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export function BottomMenu(props) {

  const {categorie} = props

  const [borderNote, setBorderNote] = useState(false)
  const [borderClient, setBorderClient] = useState(false)
  const [borderCount, setBorderCount] = useState(false)
  const [borderUsuario, setBorderUsuario] = useState(false)

  const isBorder = () => {

    if(categorie == 'notas'){
      setBorderNote(true)
      setBorderClient(false)
      setBorderCount(false)
      setBorderUsuario(false)
    }

    if(categorie == 'clientes'){
      setBorderNote(false)
      setBorderClient(true)
      setBorderCount(false)
      setBorderUsuario(false)
    }
    
    else if(categorie == 'cuentas'){
      setBorderNote(false)
      setBorderClient(false)
      setBorderCount(true)
      setBorderUsuario(false)
    }

    else if(categorie == 'usuario'){
      setBorderNote(false)
      setBorderClient(false)
      setBorderCount(false)
      setBorderUsuario(true)
    }
  }

  useEffect(() => {
    isBorder()
  }, [])

  return (

    <div className={styles.section}>
      <Link href='/' className={styles.tab}>
      <div 
          className={borderNote ? 
            `${styles.isActive}` : 
            `${styles.noActive}`}
        >
          <FaFileAlt />
        </div>
      </Link>
      <Link href='clientes' className={styles.tab}>
        <div
          className={borderClient ? 
            `${styles.isActive}` : 
            `${styles.noActive}`}
        >
          <FaUsers />
        </div>
      </Link>
      <Link href='cuentas' className={styles.tab}>
        <div
          className={borderCount ? 
            `${styles.isActive}` : 
            `${styles.noActive}`}
        >
          <FaFileInvoiceDollar />
        </div>
      </Link>
      <Link href='usuario' className={styles.tab}>
        <div
          className={borderUsuario ? 
            `${styles.isActive}` : 
            `${styles.noActive}`}
        >
          <FaUser />
        </div>
      </Link>
    </div>

  )
}
