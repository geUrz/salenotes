import { useEffect, useRef, useState } from 'react'
import Modal from 'react-modal'
import { IconCloseModal, ListEmpty, Loading } from '@/components/Layouts'
import { map, size } from 'lodash'
import axios from 'axios'
import { FaFilePdf, FaListAlt } from 'react-icons/fa'
import { BasicModal } from '@/layouts'
import styles from './ListaNotas.module.css'
import { ConceptosBox } from '../ConceptosBox'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import { formatCurrency } from '@/helpers/formatCurrency'
import convertTimeZone from '@/helpers/FormatDate/FormatDate'
import QRCode from 'qrcode'

export function ListaNotas(props) {

  const { reload, onReload } = props

  const [notas, setNotas] = useState([])
  const [notaSeleccionada, setNotaSeleccionada] = useState(null)

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

  const [show, setShow] = useState(false)

  //const onOpenClose = () => setShow((prevState) => !prevState)
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



  
    // Zona horaria en la que deseas convertir la fecha
   // Hora en formato ISO en París
  const fromZone = 'Europe/Paris'; // Zona horaria de origen
  const toZone = 'America/Tijuana'; // Zona horaria de destino

  // Convertir la fecha a la zona horaria deseada
  const formatDate = notaSeleccionada ? convertTimeZone(notaSeleccionada.createdAt, fromZone, toZone) : ''; 

  
  

  const generarPDF = async () => {
    if (!notaSeleccionada) return;

    const doc = new jsPDF(
      {
        orientation: 'p',
        unit: 'mm',
        format: 'a6',
        //putOnlyUsedFonts:true
      }
    )

    const logoImg = 'img/logo.png'; // Ruta relativa a la carpeta `public`
    const logoWidth = 30; // Ancho de la imagen en el PDF
    const logoHeight = 8; // Alto de la imagen en el PDF
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
    doc.text(`${notaSeleccionada.titulo}`, 4.5, 44)

    doc.setFontSize(9)
    doc.setTextColor(0, 0, 0)
    doc.text('Folio', 93, 40)
    doc.setFontSize(8)
    doc.setTextColor(120, 120, 120)
    doc.text(`# 00${notaSeleccionada.id}`, 91.5, 44)

    doc.setFontSize(9)
    doc.setTextColor(0, 0, 0)
    doc.text('Descripción', 4.5, 50)
    doc.setFontSize(8)
    doc.setTextColor(120, 120, 120)
    doc.text(`${notaSeleccionada.descripcion}`, 4.5, 54)

    doc.setFontSize(9)
    doc.setTextColor(0, 0, 0)
    doc.text('Fecha/Hora', 83.6, 50)
    doc.setFontSize(8)
    doc.setTextColor(120, 120, 120)
    doc.text(`${formatDate}`, 71, 54)

    doc.autoTable({
      startY: 58,
      head: [['  Tipo', 'Descripción', 'Precio', 'Qty', '     Total']],
      body: notaSeleccionada.conceptos.map(concepto => [
        { content: `${concepto.titulo}`, styles: { halign: 'center' } }, 
        { content: `${concepto.descripcion}`, styles: { halign: 'left' } }, 
        { content: `$${formatCurrency(concepto.precio)}`, styles: { halign: 'right' } },  
        { content: `${concepto.cantidad}`, styles: { halign: 'center' } },  
        { content: `$${formatCurrency(concepto.precio * concepto.cantidad)}`, styles: { halign: 'right' } },  
        ]),
      fontStyle: 'normal',
      textColor: [0, 0, 0],
      headStyles: { fillColor: [0, 150, 170], fontSize: 6.8 },
      bodyStyles: { fontSize: 6.2 },
      columnStyles: {
        0: {
          cellPadding: 1
        },
        1: {
          cellPadding: 1
        },
        2: {
          cellPadding: 3
        },
        3: {
          cellPadding: 1
        },
        4: {
          cellPadding: 1
        }
      },
      margin: { top: 0, left: 4.5, bottom: 0, right: 4.5 },
      columnStyles: {
        0: { cellWidth: 'auto', valign: 'middle' },
        1: { cellWidth: 'auto', valign: 'middle' },
        2: { cellWidth: 'auto', valign: 'middle' }, 
        3: { cellWidth: 'auto', valign: 'middle' }, 
        4: { cellWidth: 'auto', valign: 'middle' } 
    },
    })

    doc.setFontSize(8)
    doc.setTextColor(120, 120, 120)
    doc.text('SubTotal:', 72, 128)
    doc.setFontSize(8)
    doc.setTextColor(0, 0, 0)
    doc.text(`${notaSeleccionada.conceptos[0].precio}`, 86, 128)

    doc.setFontSize(7.5)
    doc.setTextColor(120, 120, 120)
    doc.text('IVA:', 79.2, 132)
    doc.setFontSize(8)
    doc.setTextColor(0, 0, 0)
    doc.text(`${notaSeleccionada.conceptos[0].precio}`, 86, 132)

    doc.setFontSize(9)
    doc.setTextColor(120, 120, 120)
    doc.text('Total:', 76.3, 136)
    doc.setFontSize(9)
    doc.setTextColor(0, 0, 0)
    doc.text(`${notaSeleccionada.conceptos[0].precio}`, 86, 136)

    const qrCodeText = `Nota ID: ${notaSeleccionada.id}, Cliente: ${notaSeleccionada.titulo}, Descripción: ${notaSeleccionada.descripcion}`
    const qrCodeDataUrl = await QRCode.toDataURL(qrCodeText)
    doc.addImage(qrCodeDataUrl, 'PNG', 4, 118, 25, 25)

    doc.save(`Nota_${notaSeleccionada.id}.pdf`)
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
                <h1>00{nota.id}</h1>
                <h1>{nota.titulo}</h1>
                <h1>{nota.descripcion}</h1>
                <h1><FaListAlt onClick={() => onOpenClose(nota)} /></h1>
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

        <div className={styles.sectionModal}>
          {notaSeleccionada && (
            <>
              <div className={styles.rowNotaModal}>
                <div className={styles.rowClienFolio}>
                  <div>
                    <h1>Ciente</h1>
                    <h2>{notaSeleccionada.titulo}</h2>
                  </div>
                  <div>
                    <h1>Folio</h1>
                    <h2># 00{notaSeleccionada.id}</h2>
                  </div>
                </div>
                <div className={styles.rowContactDate}>
                  <div>
                    <h1>Descripción</h1>
                    <h2>{notaSeleccionada.descripcion}</h2>
                  </div>
                  <div>
                    <h1>Fecha / Hora</h1>
                    <h2>{formatDate}</h2>
                  </div>
                </div>
              </div>

              {notaSeleccionada.conceptos && notaSeleccionada.conceptos.length > 0 ? (
                <ConceptosBox conceptos={notaSeleccionada.conceptos} />
              ) : (
                <ListEmpty />
              )}
            </>
          )}

          <div className={styles.iconPDF}>
            {notaSeleccionada && notaSeleccionada.conceptos.length > 0 ? (
              <FaFilePdf onClick={generarPDF} />
            ) : (
              ''
            )}
          </div>

        </div>

      </BasicModal>

    </>

  )
}


{/* <div>
                  {map(notaSeleccionada.conceptos, (concepto) => (
                    <div key={concepto.id} className={styles.rowMapConcept}>
                      <h1>{concepto.titulo}</h1>
                      <h1>{concepto.descripcion}</h1>
                      <h1>${formatCurrency(concepto.precio * 1)}</h1>
                      <h1>{concepto.cantidad}</h1>
                      <h1>${formatCurrency(concepto.cantidad * concepto.precio)}</h1>
                    </div>
                  ))}
                </div> */}