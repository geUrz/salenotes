import { BasicLayout } from '@/layouts'
import styles from './create.module.css'
import { FaPlusCircle } from 'react-icons/fa'
import { useEffect, useState } from 'react'
import { BasicModal } from '@/layouts'
import { map } from 'lodash'

export default function Create() {

  const [show, setShow] = useState(false)

  const onOpenClose = () => setShow((prevState) => !prevState)

  const [products, setProducts] = useState()

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('api/getNotes')
        const result = await response.json()
        setProducts(result)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    
    fetchData()
  }, [])


  if(products){
    var total 
    var iva 
  } 

  

  return (

    <BasicLayout>

      <div className={styles.section}>
        <div className={styles.container}>
          {/* <div onClick={onOpenClose}>
            <FaPlusCircle />
          </div>
          <h1>Crear nota</h1> */}
          <div>
      <div>
      {!products ? (
              <h1>Sin producto</h1>
            ) : (
              <>
                {map(products, (product) => (
                <div key={product.id}>
                {(product.type_id) === 1 ? (
                  <h1>Servicio</h1>
                ) : (product.type_id) === 2 ? (
                  <h1>Producto</h1>
                ) : ('')} 
                <h1>{product.concept}</h1> 
                <h1>{product.price}</h1>  
                <h1>{product.qty}</h1>
                <h1>{
                   total = (product.price) * (product.qty)
                }</h1>
                <h1>{
                  iva = ( total / 100 ) * 16
                }</h1>
                <h1>{
                  total + iva
                }</h1>
                </div>
              ))}
              
              </>
            )}
      </div>
    </div>
        </div>
      </div>

      <BasicModal show={show} onClose={onOpenClose}>

      </BasicModal>

    </BasicLayout>

  )
}
