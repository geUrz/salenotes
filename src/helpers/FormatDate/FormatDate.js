/* export const formatDate = (fecha) => {
  const date = new Date(fecha)
  const options = { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: 'numeric',hour12: true }
  return date.toLocaleDateString('es-ES', options)
} */

  import { DateTime } from 'luxon';

  /**
   * Convierte una fecha y hora de una zona horaria a otra.
   * @param {string} dateStr - La fecha y hora en formato ISO.
   * @param {string} fromZone - La zona horaria original.
   * @param {string} toZone - La zona horaria a la que se quiere convertir.
   * @returns {string} - La fecha y hora convertida en formato 'yyyy-MM-dd HH:mm:ssZZZZ'.
   */
  const convertTimeZone = (dateStr, fromZone, toZone) => {
    // Convierte la fecha a un DateTime en la zona horaria original
    const dateTime = DateTime.fromISO(dateStr, { zone: fromZone });
  
    // Convierte la fecha a la zona horaria destino
    const convertedDateTime = dateTime.setZone(toZone);
  
    return convertedDateTime.toFormat('dd-MM-yyyy HH:mm'); // Puedes ajustar el formato según sea necesario
  };
  
  export default convertTimeZone;