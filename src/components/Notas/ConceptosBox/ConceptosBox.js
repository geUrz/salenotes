import { map } from 'lodash'
import { formatCurrency } from '@/helpers/formatCurrency'
import { FaCheck, FaPlus, FaTimes } from 'react-icons/fa'
import { useEffect, useState } from 'react'
import { ModalForm } from '@/layouts'
import { Confirm } from '@/components/Layouts/Confirm'
import { ConceptoForm } from '../ConceptoForm'
import { Loading } from '@/components/Layouts'
import { BiToggleLeft, BiToggleRight } from 'react-icons/bi'
import styles from './ConceptosBox.module.css'

export function ConceptosBox(props) {

  const { reload, onReload, conceptos, onDeleteConcept, onAddConcept, notaId } = props
  const [show, setShow] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [currentConcept, setCurrentConcept] = useState(null)
  const [toggleIVA, setToggleIVA] = useState()

  const onOpenClose = (concepto) => {
    setShow((prevState) => !prevState)
    setCurrentConcept(concepto.id)
  }

  const onOpenCloseForm = (concepto) => {
    setShowForm((prevState) => !prevState)
    setCurrentConcept(concepto.id)
  }

  const handleDeleteConcept = () => {
    onDeleteConcept(currentConcept)
    setShow(false)
  }

  const subtotal = conceptos.reduce((sum, concepto) => sum + concepto.precio * concepto.cantidad, 0)
  const iva = subtotal * 0.16
  const total = subtotal + iva

  useEffect(() => {
    const savedToggleIVA = localStorage.getItem('ontoggleIVA')
    if (savedToggleIVA) {
      setToggleIVA(JSON.parse(savedToggleIVA))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('ontoggleIVA', JSON.stringify(toggleIVA))
  }, [toggleIVA])

  const onToggleIVA = () => {
    setToggleIVA(prevState => (!prevState))
  }

  return (

    <>

      <div className={styles.section}>
        <div className={styles.rowConcept}>
          <h1>Tipo</h1>
          <h1>Concepto</h1>
          <h1>Precio</h1>
          <h1>Qty</h1>
          <h1>Total</h1>
        </div>

        {!conceptos ? (
          <Loading />
        ) : (
          <>
            {map(conceptos, (concepto) => (
              <div key={concepto.id} className={styles.rowMapConcept} onClick={() => onOpenClose(concepto)}>
                <h1>{concepto.tipo}</h1>
                <h1>{concepto.concepto}</h1>
                <h1>${formatCurrency(concepto.precio * 1)}</h1>
                <h1>{concepto.cantidad}</h1>
                <h1>${formatCurrency(subtotal)}</h1>
              </div>
            ))}
          </>
        )}

        <div className={styles.iconPlus}>
          <div onClick={onOpenCloseForm}>
            <FaPlus />
          </div>
        </div>

        <div className={styles.sectionTotal}>
          <div>       
            <h1>Subtotal:</h1>
            
            {!toggleIVA ? (
              <div className={styles.toggleOn}>
                <BiToggleRight onClick={onToggleIVA} />
                <h1>IVA:</h1>
              </div>
            ) : (
              <div className={styles.toggleOff}>
                <BiToggleLeft onClick={onToggleIVA} />
                <h1>IVA:</h1>
              </div>
            )}

            <h1>Total:</h1>
          </div>
          <div>
            
            {toggleIVA ? (
              
              <>

                <h1>-</h1>
                <h1>-</h1>
              
              </>

            ) : (
              <>
              
              <h1>$
                {!conceptos[0] ? (
                  '0'
                ) : (
                  formatCurrency(subtotal)
                )}
              </h1>
              <h1>$
                {!conceptos[0] ? (
                  '0'
                ) : (
                  formatCurrency(iva)
                )
                }
              </h1>
              
              </>
            )}

            {toggleIVA ? (
              <h1>$
              {!conceptos[0] ? (
                '0'
              ) : (
                formatCurrency(subtotal)
              )
              }
            </h1>
            ) : (
              <h1>$
              {!conceptos[0] ? (
                '0'
              ) : (
                formatCurrency(total)
              )
              }
            </h1>
            )}

          </div>
        </div>

      </div>

      <ModalForm title='Crear Concepto' showForm={showForm}>
        <ConceptoForm reload={reload} onReload={onReload} conceptos={conceptos} onOpenCloseForm={onOpenCloseForm} currentConcept={currentConcept} onAddConcept={onAddConcept} notaId={notaId} />
      </ModalForm>

      <Confirm
        open={show}
        cancelButton={
          <div className={styles.iconClose}>
            <FaTimes />
          </div>
        }
        confirmButton={
          <div className={styles.iconCheck}>
            <FaCheck />
          </div>
        }
        onConfirm={handleDeleteConcept}
        onCancel={onOpenClose}
        content='¿ Estas seguro de eliminar el concepto ?'
      />

    </>

  )
}
