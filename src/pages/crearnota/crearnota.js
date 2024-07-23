import { BasicLayout } from '@/layouts'
import { FaPlusCircle } from 'react-icons/fa'
import { useState } from 'react'
import { BasicModal } from '@/layouts'
import { NotaForm } from '@/components/Notas'
import styles from './crearnota.module.css'

export default function Crearnota() {

  const [show, setShow] = useState(false)

  const onOpenClose = () => setShow((prevState) => !prevState)

  const [reload, setReload] = useState()

  const onReload = () => setReload((prevState) => !prevState)

  return (

    <BasicLayout title='Crear Nota' categorie='crearnota' onReload={onReload}>

      <div className={styles.section}>
        <div className={styles.container}>
          <div onClick={onOpenClose}>
            <FaPlusCircle />
          </div>
          <h1>Crear nota</h1>
        </div>
      </div>

      <BasicModal title='Crear nota' show={show} onClose={onOpenClose}>
        <NotaForm reload={reload} onReload={onReload} onOpenClose={onOpenClose} />
      </BasicModal>

    </BasicLayout>

  )
} 


  /* import { useState } from 'react';
  import axios from 'axios';
  
  export default function CrearNota() {
      const [titulo, setTitulo] = useState('');
      const [descripcion, setDescripcion] = useState('');
      const [conceptos, setConceptos] = useState([]);
      const [nuevoConcepto, setNuevoConcepto] = useState({ descripcion: '', cantidad: 0, precio: 0 });
  
      const crearNota = async () => {
          try {
              const response = await axios.post('/api/notes', { titulo, descripcion });
              const notaId = response.data.id;
              // Guardar conceptos asociados a la nota
              await Promise.all(conceptos.map(concepto =>
                  axios.post('/api/concepts', { nota_id: notaId, ...concepto })
              ));
              alert('Nota creada exitosamente!');
              setTitulo('');
              setDescripcion('');
              setConceptos([]);
          } catch (error) {
              console.error('Error al crear la nota:', error);
              alert('Hubo un error al crear la nota. Por favor, inténtalo de nuevo.');
          }
      };
  
      const añadirConcepto = () => {
          setConceptos([...conceptos, nuevoConcepto]);
          setNuevoConcepto({ descripcion: '', cantidad: 0, precio: 0 });
      };
  
      return (
          <div>
              <h1>Crear Nota y Conceptos</h1>
  
              <div>
                  <h2>Crear Nota</h2>
                  <input
                      type="text"
                      placeholder="Título"
                      value={titulo}
                      onChange={(e) => setTitulo(e.target.value)}
                  />
                  <textarea
                      placeholder="Descripción"
                      value={descripcion}
                      onChange={(e) => setDescripcion(e.target.value)}
                  />
              </div>
  
              <div>
                  <h2>Añadir Concepto</h2>
                  <input
                      type="text"
                      placeholder="Descripción del concepto"
                      value={nuevoConcepto.descripcion}
                      onChange={(e) => setNuevoConcepto({ ...nuevoConcepto, descripcion: e.target.value })}
                  />
                  <input
                      type="number"
                      placeholder="Cantidad"
                      value={nuevoConcepto.cantidad}
                      onChange={(e) => setNuevoConcepto({ ...nuevoConcepto, cantidad: parseInt(e.target.value) })}
                  />
                  <input
                      type="number"
                      placeholder="Precio"
                      value={nuevoConcepto.precio}
                      onChange={(e) => setNuevoConcepto({ ...nuevoConcepto, precio: parseFloat(e.target.value) })}
                  />
                  <button onClick={añadirConcepto}>Añadir Concepto</button>
  
                  <ul>
                      {conceptos.map((concepto, index) => (
                          <li key={index}>
                              <p>{concepto.descripcion}</p>
                              <p>Cantidad: {concepto.cantidad}</p>
                              <p>Precio: ${concepto.precio}</p>
                          </li>
                      ))}
                  </ul>
              </div>
  
              <button onClick={crearNota}>Guardar Nota y Conceptos</button>
          </div>
      );
  } */