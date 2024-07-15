import { BottomMenu, Title } from '@/components/Layouts'
import styles from './BasicLayout.module.css'
import classNames from 'classnames'

export function BasicLayout(props) {

  const {
    children, 
    relative=false,
    title
  } = props

  return (

    <>
    
    <Title title={title} />

    <div className={classNames({[styles.relative] : relative})}>
      {children}
    </div>

    <BottomMenu />

    </>

  )
}
