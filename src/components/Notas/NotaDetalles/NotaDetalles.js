import { FirmaDigital, IconCloseModal, ToastSuccess } from '@/components/Layouts'
import { formatCurrency, formatDate, formatId } from '@/helpers'
import { NotasRowHeadModal } from '../NotasRowHead'
import { useEffect, useState } from 'react'
import { BiToggleLeft, BiToggleRight } from 'react-icons/bi'
import { FaCheck, FaPlus, FaTimes, FaTrash } from 'react-icons/fa'
import { NotaConceptos } from '../NotaConceptos'
import { BasicModal, ModalForm } from '@/layouts'
import { NotaConceptosForm } from '../NotaConceptosForm'
import { Button, Confirm, Form, FormField, FormGroup, Image, Label, TextArea } from 'semantic-ui-react'
import { NotaPDF } from '../NotaPDF'
import { useAuth } from '@/context/AuthContext'
import styles from './NotaDetalles.module.css'
import axios from 'axios'

export function NotaDetalles(props) {

  const { notas, notaId, reload, onReload, onOpenClose, onAddConcept, onDeleteConcept, onShowConfirm } = props
  
  const { user } = useAuth()

  const [showForm, setShowForm] = useState(false)
  const [showFirma, setShowFirma] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [currentConcept, setCurrentConcept] = useState(null)
  const [toastSuccess, setToastSuccess] = useState(false)
  const [toastSuccessPDF, setToastSuccessPDF] = useState(false)

  const [nota, setNota] = useState(notas.nota || '')
  const [notaNota, setnotaNota] = useState('')
  const [editNota, setEditNota] = useState(!!notas.nota)

  const onOpenCloseFirma = () => setShowFirma((prevState) => !prevState)

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const userAgent = navigator.userAgent || '';
    const mobile = /Mobile|Android|iP(hone|od|ad)|IEMobile|Opera Mini/i.test(userAgent);
    setIsMobile(mobile);
  }, []);

  const SWIPE_THRESHOLD = 150;

  const [startCoords, setStartCoords] = useState(null);
  const [isSwiping, setIsSwiping] = useState(false);
  const [activate, setActivate] = useState(false);

  // Maneja el inicio del deslizamiento
  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    setStartCoords({ x: touch.clientX, y: touch.clientY });
    setIsSwiping(true);
  };

  // Maneja el movimiento del deslizamiento
  const handleTouchMove = (e) => {
    if (!isSwiping) return;

    const touch = e.touches[0];
    const endCoords = { x: touch.clientX, y: touch.clientY };

    // Calcula la distancia del deslizamiento
    const deltaX = endCoords.x - startCoords.x;
    const deltaY = endCoords.y - startCoords.y;
    const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);

    // Si el deslizamiento supera el umbral, activa la acción
    if (distance > SWIPE_THRESHOLD) {
      setActivate(true)
    }
  }

  useEffect(() => {
    setEditNota(!!notas.nota)
  }, [notas.nota])

  const onToastSuccess = () => {
    setToastSuccess(true)
    setTimeout(() => {
      setToastSuccess(false)
    }, 3000)
  }

  const onToastSuccessPDF = () => {
    setToastSuccessPDF(true)
    setTimeout(() => {
      setToastSuccessPDF(false)
    }, 3000)
  }

  const onOpenCloseConfirm = (concepto) => {
    setShowConfirm((prevState) => !prevState)
    setCurrentConcept(concepto.id)
  }

  const onOpenCloseForm = (concepto) => {
    setShowForm((prevState) => !prevState)
    setCurrentConcept(concepto.id)
  }

  const handleDeleteConcept = () => {
    onDeleteConcept(currentConcept)
    setShowConfirm(false)
  }

  const [toggleIVA, setToggleIVA] = useState(false)

  const onIVA = () => {
    setToggleIVA((prevState) => !prevState)
  }

  useEffect(() => {
    const savedToggleIVA = localStorage.getItem('ontoggleIVA')
    if (savedToggleIVA) {
      setToggleIVA(JSON.parse(savedToggleIVA))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('ontoggleIVA', JSON.stringify(toggleIVA))
  }, [toggleIVA])

  const subtotal = notas.conceptos.reduce((sum, concepto) => sum + concepto.precio * concepto.cantidad, 0)
  const iva = subtotal * 0.16
  const total = subtotal + iva

  const handleNotaChange = (e) => {
    setNota(e.target.value);
  }

  const handleAddNota = async () => {
    try {

      const response = await axios.put(`/api/notas?id=${notaId.id}`, { nota })

      if (response.status === 200) {
        setEditNota(!!nota)

        const updateNota = { ...notas, nota }
        setnotaNota(updateNota)
        onReload()
        onToastSuccess()
      }
    } catch (error) {
      console.error('Error al actualizar la nota:', error.response?.data || error.message);
    }
  }

  return (

    <>

      <IconCloseModal onOpenClose={onOpenClose} />

      {toastSuccess && <ToastSuccess contain='Concepto agregado exitosamente' onClose={() => setToastSuccess(false)} />}

      {toastSuccessPDF && <ToastSuccess contain='PDF creado exitosamente' onClose={() => setToastSuccessPDF(false)} />}

      <div className={styles.section}>

        <div className={styles.box1}>
          <div className={styles.box1_1}>
            <div>
              <h1>Cliente</h1>
              <h1>{notas.cliente}</h1>
            </div>
            <div>
              <h1>Folio</h1>
              <h1>{formatId(notas.id)}</h1>
            </div>
          </div>
          <div className={styles.box1_2}>
            <div>
              <h1>Marca / Modelo</h1>
              <h1>{notas.marca}</h1>
            </div>
            <div>
              <h1>Fecha</h1>
              <h1>{formatDate(notas.createdAt)}</h1>
            </div>
          </div>
        </div>

        <NotasRowHeadModal rowMain />

        <NotaConceptos conceptos={notas.conceptos} onOpenCloseConfirm={onOpenCloseConfirm} handleDeleteConcept={handleDeleteConcept} />

        <div className={styles.iconPlus}>
          <div onClick={onOpenCloseForm}>
            <FaPlus />
          </div>
        </div>

        <div className={styles.boxMain}>
        <div className={styles.box3_0}>

          {notas.firma ? (
            <>
            
              <div onTouchStart={handleTouchStart} onTouchMove={handleTouchMove}>
                <Image src={notas.firma} />

                {activate ? (
                  <div className={styles.activateTrash}>
                    <div onClick={() => setActivate(false)}>
                      <FaTimes />
                    </div>
                    <div>
                      <FaTrash />
                    </div>
                  </div>
                ) : (
                  ''
                )}

              </div>
            
            </>
          ) : (
            <>
            
              <div className={styles.iconFirmaPlus} onClick={onOpenCloseFirma}>
                <FaPlus />
              </div>
            
            </>
          )}

          <div className={styles.linea}></div>
            <div className={styles.firmaIsMobile}>
              <h1>Firma</h1> 
              {isMobile && notas.firma ? (
                ''
              ) : (
                <FaTrash />
              )}
            </div>
          </div>

        <div className={styles.box3}>
          <div className={styles.box3_1}>
            <h1>Subtotal:</h1>

            {!toggleIVA ? (

              <div className={styles.toggleOFF} onClick={onIVA}>
                <BiToggleLeft />
                <h1>IVA:</h1>
              </div>

            ) : (

              <div className={styles.toggleON} onClick={onIVA}>
                <BiToggleRight />
                <h1>IVA:</h1>
              </div>

            )}

            <h1>Total:</h1>
          </div>

          <div className={styles.box3_2}>

            {!toggleIVA ? (
              <>

                <h1>-</h1>
                <h1>-</h1>

              </>
            ) : (
              <>

                <h1>{formatCurrency(subtotal)}</h1>
                <h1>{formatCurrency(iva)}</h1>

              </>
            )}

            {!toggleIVA ? (
              <h1>{formatCurrency(subtotal)}</h1>
            ) : (
              <h1>{formatCurrency(total)}</h1>
            )}

          </div>
        </div>
        </div>

        <div className={styles.formNota}>
          <Form>
            <FormGroup>
              <FormField>
                <Label>
                  Nota:
                </Label>
                <TextArea
                  value={nota}
                  onChange={handleNotaChange}
                  placeholder="Escribe una nota aquí..."
                />
              </FormField>
            </FormGroup>
            <Button secondary onClick={handleAddNota}>
              {editNota ? 'Modificar nota' : 'Añadir nota'}
            </Button>
          </Form>
        </div>

        <NotaPDF notas={notas} conceptos={notas.conceptos} notaNota={notaNota.nota} onToastSuccessPDF={onToastSuccessPDF} />

        <div className={styles.footerDetalles}>
          <div>
            <h1>creada por:
              {!user ? (
                <span> - no disponible -</span>
              ) : (
                <span> {user.usuario}</span>
              )}
            </h1>
          </div>
          <div onClick={onShowConfirm}>
            <FaTrash />
          </div>
        </div>
      </div>

      <ModalForm title='Agregar concepto' showForm={showForm} onClose={onOpenCloseForm}>
        <NotaConceptosForm reload={reload} onReload={onReload} onOpenCloseForm={onOpenCloseForm} onAddConcept={onAddConcept} notaId={notaId.id} onToastSuccess={onToastSuccess} />
      </ModalForm>

      <BasicModal show={showFirma} onClose={onOpenCloseFirma}>
        <FirmaDigital reload={reload} onReload={onReload} notaId={notaId.id} onOpenCloseFirma={onOpenCloseFirma} />
      </BasicModal>

      <Confirm
        open={showConfirm}
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
        onCancel={onOpenCloseConfirm}
        content='¿ Estas seguro de eliminar el concepto ?'
      />

    </>

  )
}
