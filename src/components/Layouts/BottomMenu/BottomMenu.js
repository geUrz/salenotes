import { FaFileAlt, FaHome, FaUser } from 'react-icons/fa'
import { BiSolidFilePlus } from 'react-icons/bi'
import styles from './BottomMenu.module.css'
import Link from 'next/link'

export function BottomMenu() {
  return (

    <div className={styles.section}>
      <Link href='/' className={styles.tab}>
        <BiSolidFilePlus className='icon1' />
      </Link>
      <Link href='record' className={styles.tab}>
        <FaFileAlt className='icon2' />
      </Link>
      <Link href='home' className={styles.tab}>
        <FaHome className='icon3' />
      </Link>
      <Link href='user' className={styles.tab}>
        <FaUser className='icon4' />
      </Link>
    </div>

  )
}
