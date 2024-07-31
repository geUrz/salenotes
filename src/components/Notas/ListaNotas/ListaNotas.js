import { useEffect, useState } from 'react'
import { IconCloseModal, ListEmpty, Loading, ToastSuccess } from '@/components/Layouts'
import { map, size } from 'lodash'
import axios from 'axios'
import { FaInfoCircle } from 'react-icons/fa'
import { BasicModal } from '@/layouts'
import { ConceptosBox } from '../ConceptosBox'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import { formatCurrency, formatDate, formatId } from '@/helpers'
import QRCode from 'qrcode'
import { BiSolidFilePdf } from 'react-icons/bi'
import styles from './ListaNotas.module.css'

export function ListaNotas(props) {

  const { reload, onReload } = props

  const [notas, setNotas] = useState()
  const [notasClient, setNotasClient] = useState([])
  const [show, setShow] = useState(false)
  const [notaSeleccionada, setNotaSeleccionada] = useState(null)

  const[toastSuccess, setToastSuccess] = useState(false)

  const onToastSuccess = () => {
    setToastSuccess(true)
    setTimeout(() => {
      setToastSuccess(false)
    }, 3000)
  }

  useEffect(() => {
    async function fetchNotas() {
      try {
        const response = await axios.get('/api/notes')
        setNotas(response.data);
      } catch (error) {
        console.error('Error al obtener las notas:', error)
      }
    }
    fetchNotas()
  }, [])

  /* useEffect(() => {
    async function fetchNotas() {
      try {
        const response = await axios.get('/api/notes?simple=true')
        setNotas(response.data);
      } catch (error) {
        console.error('Error al obtener las notas:', error)
      }
    }
    fetchNotas()
  }, []) */

  const onOpenClose = async (nota) => {
    try {
      const response = await axios.get(`/api/concepts?nota_id=${nota.id}`)
      nota.conceptos = response.data
      setNotaSeleccionada(nota)
      setShow((prevState) => !prevState)
    } catch (error) {
      console.error('Error al obtener los conceptos:', error)
    }
  }

  const onDeleteConcept = async (conceptId) => {
    try {
      const response = await axios.delete(`/api/concepts`, {
        params: { concept_id: conceptId },
      });
      if (response.status === 200) {
        setNotaSeleccionada((prevState) => ({
          ...prevState,
          conceptos: prevState.conceptos.filter((concepto) => concepto.id !== conceptId),
        }));
      } else {
        console.error('Error al eliminar el concepto: Respuesta del servidor no fue exitosa', response);
      }
    } catch (error) {
      console.error('Error al eliminar el concepto:', error.response || error.message || error);
    }
  }

  const onAddConcept = (concept) => {
    setNotaSeleccionada((prevState) => ({
      ...prevState,
      conceptos: [...prevState.conceptos, concept],
    }))
    onReload()
  }

  const handleUpdateConcept = async (conceptId, updatedConcept) => {
    try {
      const response = await axios.put(`/api/concepts/${conceptId}`, updatedConcept);
      if (response.status === 200) {
        setNotaSeleccionada((prevState) => ({
          ...prevState,
          conceptos: prevState.conceptos.map((concepto) =>
            concepto.id === conceptId ? response.data : concepto
          ),
        }));
      } else {
        console.error('Error al actualizar el concepto: Respuesta del servidor no fue exitosa', response);
      }
    } catch (error) {
      console.error('Error al actualizar el concepto:', error.response || error.message || error);
    }
  };

  const generarPDF = async () => {
    if (!notaSeleccionada) return;

    const doc = new jsPDF(
      {
        orientation: 'p',
        unit: 'mm',
        format: 'a6'
      }
    )

    const logoImg = 'img/logo.png'
    const logoWidth = 30
    const logoHeight = 8
    doc.addImage(logoImg, 'PNG', 4.2, 14, logoWidth, logoHeight)

    doc.setFont('helvetica')

    doc.setFontSize(9)
    doc.setTextColor(0, 0, 0)
    doc.text('CLICKNET', 84.5, 10)
    doc.setFontSize(8)
    doc.setTextColor(120, 120, 120)
    doc.text('Punta Este Corporativo', 70.8, 14)
    doc.text('Calzada Carranza 951', 72, 18)
    doc.text('Piso 10 Suite 304, Interior "E"', 63, 22)
    doc.setFontSize(7)
    doc.text('C.P. 2125', 89, 26)
    doc.setFontSize(8)
    doc.setTextColor(0, 0, 0)
    doc.text('Juan Roberto Espinoza Espinoza', 58, 30)
    doc.setFontSize(7)
    doc.setTextColor(120, 120, 120)
    doc.text('RFC: EIEJ8906244J3', 76, 34)

    doc.setFontSize(9)
    doc.setTextColor(0, 0, 0)
    doc.text('Cliente', 4.5, 40)
    doc.setFontSize(8)
    doc.setTextColor(120, 120, 120)
    doc.text(`${notaSeleccionada.cliente}`, 4.5, 44)

    doc.setFontSize(9)
    doc.setTextColor(0, 0, 0)
    doc.text('Folio', 93, 40)
    doc.setFontSize(8)
    doc.setTextColor(120, 120, 120)
    doc.text(`# ${formatId(notaSeleccionada.id)}`, 89.8, 44)

    doc.setFontSize(9)
    doc.setTextColor(0, 0, 0)
    doc.text('Contacto', 4.5, 50)
    doc.setFontSize(8)
    doc.setTextColor(120, 120, 120)
    doc.text(`${notaSeleccionada.descripcion}`, 4.5, 54)

    doc.setFontSize(9)
    doc.setTextColor(0, 0, 0)
    doc.text('Fecha/Hora', 83.6, 50)
    doc.setFontSize(8)
    doc.setTextColor(120, 120, 120)
    doc.text(`${formatDate(notaSeleccionada.createdAt)}`, 71, 54)

    doc.autoTable({
      startY: 58,
      head: [
        [
          { content: 'Tipo', styles: { halign: 'center' } },
          { content: 'Concepto', styles: { halign: 'left' } },
          { content: 'Precio', styles: { halign: 'right' } },
          { content: 'Qty', styles: { halign: 'center' } },
          { content: 'Total', styles: { halign: 'right' } },         
        ]
      ],
      styles: {
        cellPadding: 1,
        cellWidth: 'auto',
      },
      body: notaSeleccionada.conceptos.map(concepto => [
        { content: `${concepto.tipo}`, styles: { halign: 'center' } }, 
        { content: `${concepto.concepto}`, styles: { halign: 'left' } }, 
        { content: `$${formatCurrency(concepto.precio)}`, styles: { halign: 'right' } },  
        { content: `${concepto.cantidad}`, styles: { halign: 'center' } },  
        { content: `$${formatCurrency(concepto.precio * concepto.cantidad)}`, styles: { halign: 'right' } },  
        ]),
      headStyles: { fillColor: [0, 150, 170], fontSize: 6.8 },
      bodyStyles: { fontSize: 6.2 },
      columnStyles: {
        0: {
          cellPadding: 1,
          cellWidth: 'auto', 
          valign: 'middle'
        },
        1: {
          cellPadding: 1,
          cellWidth: 'auto', 
          valign: 'middle'
        },
        2: {
          cellPadding: 1,
          cellWidth: 'auto', 
          valign: 'middle'
        },
        3: {
          cellPadding: 1,
          cellWidth: 'auto', 
          valign: 'middle'
        },
        4: {
          cellPadding: 1,
          cellWidth: 'auto', 
          valign: 'middle'
        }
      },

      margin: { top: 0, left: 4.5, bottom: 0, right: 4.5 },

    })

    const subtotal = notaSeleccionada.conceptos.reduce((sum, concepto) => sum + concepto.precio * concepto.cantidad, 0);
    const iva = subtotal * 0.16;
    const total = subtotal + iva;

    const verticalData = [
      ['Subtotal:', `$${formatCurrency(subtotal)}`],
      ['IVA:', `$${formatCurrency(iva)}`],
      ['Total:', `$${formatCurrency(total)}`]
    ]
    
    doc.autoTable({
      startY: 124,
      margin: { left: 67.5, bottom: 0, right: 4.5 },
      body: verticalData, 
      styles: {
        cellPadding: 1,
        valign: 'middle',
        fontSize: 7,
      },
      columnStyles: {
        0: { cellWidth: 15, fontStyle: 'bold', halign: 'right' },
        1: { cellWidth: 18, halign: 'right' }  
      }
    })


    const qrCodeText = `Nota ID: ${notaSeleccionada.id}, Cliente: ${notaSeleccionada.titulo}, Descripción: ${notaSeleccionada.descripcion}`
    const qrCodeDataUrl = await QRCode.toDataURL(qrCodeText)
    doc.addImage(qrCodeDataUrl, 'PNG', 2, 118, 25, 25)

    doc.save(`Nota_${formatId(notaSeleccionada.id)}.pdf`)
  }

  return (

    <>

      {!notas ? (
        <Loading />
      ) : (
        size(notas) === 0 ? (
          <ListEmpty />
        ) : (
          <div className={styles.section}>
            {map(notas, (nota) => (
              <div key={nota.id} className={styles.rowNota}>
                <h1>{formatId(nota.id)}</h1>
                <h1>{nota.cliente}</h1>
                <h1>{nota.descripcion}</h1>
                <h1><FaInfoCircle onClick={() => onOpenClose(nota)} /></h1>
              </div>
            ))}
          </div>
        )
      )}

      <BasicModal
        show={show}
        onClose={onOpenClose}
        title="Detalles de la Nota"
      >
        <IconCloseModal onOpenClose={onOpenClose} />

        {toastSuccess && <ToastSuccess contain='Concepto creado exitosamente' onClose={() => setToast(false)} />}

        <div className={styles.sectionModal}>
          {notaSeleccionada && (
            <>
              <div className={styles.rowNotaModal}>
                <div className={styles.rowClienFolio}>
                  <div>
                    <h1>Ciente</h1>
                    <h2>{notaSeleccionada.cliente}</h2>
                  </div>
                  <div>
                    <h1>Folio</h1>
                    <h2># {formatId(notaSeleccionada.id)}</h2>
                  </div>
                </div>
                <div className={styles.rowContactDate}>
                  <div>
                    <h1>Descripción</h1>
                    <h2>{notaSeleccionada.descripcion}</h2>
                  </div>
                  <div>
                    <h1>Fecha / Hora</h1>
                    <h2>{formatDate(notaSeleccionada.createdAt)}</h2>
                  </div>
                </div>
              </div>

              {/* PASAR TOGGLEIVA POR PROPS */}
              {/* PASAR TOGGLEIVA POR PROPS */}
              {/* PASAR TOGGLEIVA POR PROPS */}
              {/* PASAR TOGGLEIVA POR PROPS */}
              {/* PASAR TOGGLEIVA POR PROPS */}
              {/* {notaSeleccionada.conceptos && notaSeleccionada.conceptos.length > 0 ? ( */}
                <ConceptosBox onToastSuccess={onToastSuccess} reload={reload} onReload={onReload} conceptos={notaSeleccionada.conceptos} onDeleteConcept={onDeleteConcept} onAddConcept={onAddConcept} handleUpdateConcept={handleUpdateConcept} notaId={notaSeleccionada.id} />
              {/* ) : (
                <ListEmpty />
              )} */}
            </>
          )}

          <div className={styles.iconPDF}>
            {notaSeleccionada && notaSeleccionada.conceptos.length > 0 ? (
              <BiSolidFilePdf onClick={generarPDF} />
            ) : (
              ''
            )}
          </div>

        </div>

      </BasicModal>

    </>

  )
}
