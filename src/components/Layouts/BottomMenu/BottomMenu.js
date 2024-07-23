import { FaFileAlt, FaHome, FaUser } from 'react-icons/fa'
import { BiSolidFilePlus } from 'react-icons/bi'
import styles from './BottomMenu.module.css'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export function BottomMenu(props) {

  const {categorie} = props

  const [borderCreate, setBorderCreate] = useState(false)
  const [borderNotes, setBorderNotes] = useState(false)
  const [borderHome, setBorderHome] = useState(false)
  const [borderUser, setBorderUser] = useState(false)

  const isBorder = () => {

    if(categorie == 'crearnota'){
      setBorderCreate(true)
      setBorderNotes(false)
      setBorderHome(false)
      setBorderUser(false)
    }
    
    else if(categorie == 'notas'){
      setBorderCreate(false)
      setBorderNotes(true)
      setBorderHome(false)
      setBorderUser(false)
    }

    else if(categorie == 'home'){
      setBorderCreate(false)
      setBorderNotes(false)
      setBorderHome(true)
      setBorderUser(false)
    }

    else if(categorie == 'user'){
      setBorderCreate(false)
      setBorderNotes(false)
      setBorderHome(false)
      setBorderUser(true)
    }
  }

  useEffect(() => {
    isBorder()
  }, [])

  return (

    <div className={styles.section}>
      <Link href='/' className={styles.tab}>
        <div
          className={borderCreate ? 
            `${styles.isActive}` : 
            `${styles.noActive}`}
        >
          <BiSolidFilePlus className='icon1' />
        </div>
      </Link>
      <Link href='notas' className={styles.tab}>
        <div 
          className={borderNotes ? 
            `${styles.isActive}` : 
            `${styles.noActive}`}
        >
          <FaFileAlt className='icon2' />
        </div>
      </Link>
      <Link href='home' className={styles.tab}>
        <div
          className={borderHome ? 
            `${styles.isActive}` : 
            `${styles.noActive}`}
        >
          <FaHome className='icon3' />
        </div>
      </Link>
      <Link href='user' className={styles.tab}>
        <div 
          className={borderUser ? 
            `${styles.isActive}` : 
            `${styles.noActive}`}
        >
          <FaUser className='icon4' />
        </div>
      </Link>
    </div>

  )
}
