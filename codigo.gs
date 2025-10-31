// Configuración
const ADMIN_EMAIL = "rcuesta@p.csmb.es";
const FORM_ID = "1o4nDH2hOvwPkHGvQNrtxYgTcHQP5edL7SxqO6XyTt84";

// Mapeo completo de talleres con capacidades individuales
const WORKSHOP_NAMES = {
  // 1ª FRANJA (17:30-18:15h)
  "1. Artes Escénicas para la Inclusión: Estrategias Creativas en el Aula Instituto Artes Escénicas": { 
    name: "Artes Escénicas para la Inclusión", 
    capacity: 30 
  },
  "2. Matemáticas creativas en Educación Primaria Irene López, Cristina Bezón y Beatriz Hernández Santa María la Blanca": { 
    name: "Matemáticas creativas en Educación Primaria", 
    capacity: 30 
  },
  "3. Matemáticas competenciales en Secundaria Manuel Llorens Santa María la Blanca": { 
    name: "Matemáticas competenciales en Secundaria", 
    capacity: 30 
  },
  "4. AyudIA! – La Inteligencia Artificial como compañera de aprendizaje Equipo de Inteligencia Artificial Santa María la Blanca": { 
    name: "AyudIA! – La Inteligencia Artificial como compañera", 
    capacity: 30
  },
  "5. Innovación social: crea, actúa y cambia el mundo Luis Miguel Olivas Fundación Iruaritz Lezama": { 
    name: "Innovación social: crea, actúa y cambia el mundo", 
    capacity: 30 
  },
  "6. Crecer sin alas prestadas Equipo de Acompañate Santa María la Blanca": { 
    name: "Crecer sin alas prestadas", 
    capacity: 30 
  },
  "7. Claves para cultivar tu salud. Tu vida está en tus manos. Elisabeth Arrojo INMOA y Centro Nacional Prevención Cáncer": { 
    name: "Claves para cultivar tu salud", 
    capacity: 31 
  },
  "8. Metacognición. Una necesidad Elías Domínguez Seminario Menor de Ourense": { 
    name: "Metacognición. Una necesidad", 
    capacity: 30 
  },
  "9. Inspira Talks: La escuela de los sentidos A) Pequeños grandes viajes sensoriales Ana Posada Santa María la Blanca B) Cuerpo que juega, mente que aprende Lorena Gómez Santa María la Blanca": { 
    name: "La escuela de los sentidos", 
    capacity: 30 
  },
  
  // 2ª FRANJA (18:30-19:15h)
  "10. GameLab inclusivo: del aula al juego Raquel Cuesta Santa María la Blanca": { 
    name: "GameLab inclusivo: del aula al juego", 
    capacity: 31 
  },
  "11. Godly Play: «Jugando con Dios» Equipo Godly Play Santa María la Blanca": { 
    name: "Godly Play: \"Jugando con Dios\"", 
    capacity: 30 
  },
  "12. Copilot Chat en el aula: cómo multiplicar el potencial docente con IA Felipe García Gaitero Universidad Europea": { 
    name: "Copilot Chat en el aula: cómo multiplicar el potencial docente", 
    capacity: 30 
  },
  "13. IA para mentes que enseñan Alicia Carrascosa y Raúl Bernabé Santa María la Blanca": { 
    name: "IA para mentes que enseñan", 
    capacity: 30 
  },
  "14. Más allá del marcador: deporte, valores y emociones Jose Javier Illana illanactiva": { 
    name: "Más allá del marcador: deporte, valores y emociones", 
    capacity: 30 
  },
  "15. Networking y Comunicación Estratégica en la Escuela y en la Vida Lucila Ballarino ConexIA": { 
    name: "Networking y Comunicación Estratégica", 
    capacity: 30 
  },
  "16. Palabras que construyen: herramientas para transformar el conflicto en conexión con los adolescentes Ana López e Iranzu Arellano Santa María la Blanca": { 
    name: "Palabras que construyen: herramientas para transformar el conflicto", 
    capacity: 30 
  },
  "17. Inspira Talks: Humanizar la educación A) Liderazgo y cultura de innovación educativa Luis Miguel Olivas Fundación Iruaritz Lezama B) Desconectar para reconectar Laura Corral Iniciativa pacto de familia Montecarmelo": { 
    name: "Humanizar la educación", 
    capacity: 30 
  },
  "18. Inspira Talks: La emoción de acompañar A) Conciencia emocional: el punto de partida para educar Sara Hernández Cano Educandoatulado B) Cuidar, acompañar y educar Colegio San Ignacio de Loyola": { 
    name: "La emoción de acompañar", 
    capacity: 30 
  }
};

// Función principal que se ejecuta al enviar el formulario
function onFormSubmit(e) {
  try {
    console.log("🚀 Iniciando procesamiento de formulario...");
    console.log("📝 Evento recibido:", e);
    
    // Obtener los datos del formulario directamente
    const responses = e.values;
    console.log("📝 Respuestas del formulario:", responses);

    // Mapeo de columnas (ajustado a tus 12 columnas)
    const email = responses[3]; // Columna D (índice 3)
    const nombre = responses[1]; // Columna B (índice 1)
    const apellidos = responses[2]; // Columna C (índice 2)
    const meInscriboComo = responses[5]; // Columna F (índice 5)
    const taller1 = responses[7]; // Columna H (índice 7) - 1ª Sesión
    const taller2 = responses[8]; // Columna I (índice 8) - 2ª Sesión
    
    console.log("📝 Datos procesados:", {email, nombre, apellidos, meInscriboComo, taller1, taller2});
    
    // Verificar datos básicos obligatorios
    if (!email || !nombre || !apellidos) {
      console.error("❌ Faltan datos básicos obligatorios");
      MailApp.sendEmail(ADMIN_EMAIL, "❌ Error: Datos básicos incompletos", `Faltan datos básicos obligatorios en la inscripción. Email: ${email}, Nombre: ${nombre}, Apellidos: ${apellidos}`);
      return;
    }
    
    // Verificar que al menos un taller esté seleccionado
    if (!taller1 && !taller2) {
      console.error("❌ No se ha seleccionado ningún taller");
      MailApp.sendEmail(ADMIN_EMAIL, "❌ Error: Sin talleres seleccionados", `El usuario no ha seleccionado ningún taller. Email: ${email}, Nombre: ${nombre}, Apellidos: ${apellidos}`);
      return;
    }
    
    // Verificar disponibilidad de plazas
    const availability = checkWorkshopAvailability();
    console.log("📊 Disponibilidad actual:", availability);
    
    // Verificar si se puede confirmar la inscripción
    let canConfirm = false;
    
    if (taller1 && taller2) {
      // Ambos talleres seleccionados
      canConfirm = checkAvailability(taller1, taller2, availability);
    } else if (taller1) {
      // Solo taller 1 seleccionado
      canConfirm = checkSingleWorkshopAvailability(taller1, availability);
    } else if (taller2) {
      // Solo taller 2 seleccionado
      canConfirm = checkSingleWorkshopAvailability(taller2, availability);
    }
    
    console.log("✅ ¿Se puede confirmar?", canConfirm);
    
    if (canConfirm) {
      // Confirmar inscripción
      confirmRegistration(email, nombre, apellidos, meInscriboComo, taller1, taller2);
    } else {
      // Añadir a lista de espera
      addToWaitlist(email, nombre, apellidos, meInscriboComo, taller1, taller2);
    }
    
    // Actualizar las opciones del formulario con las plazas restantes
    updateFormOptions();
    
  } catch (error) {
    console.error("❌ Error en onFormSubmit:", error);
    MailApp.sendEmail(ADMIN_EMAIL, "❌ Error en el script de inscripción", `Se ha producido un error en el script de Google Apps Script: ${error.message}\n\nStack: ${error.stack}`);
  }
}

// Función para limpiar las opciones del formulario (eliminar texto de disponibilidad)
function cleanFormOptions() {
  try {
    console.log("🧹 Limpiando opciones del formulario...");
    
    const form = FormApp.openById(FORM_ID);
    if (!form) {
      console.error("❌ No se pudo encontrar el formulario con ID:", FORM_ID);
      return;
    }
    
    const items = form.getItems();
    
    items.forEach(item => {
      const title = item.getTitle();
      
      if (title.includes("¿En qué taller quiero apuntarme a las 17:30 – 18:15 h?") || 
          title.includes("¿En qué taller quiero apuntarme a las 18:30 – 19:15 h?")) {
        
        if (item.getType() === FormApp.ItemType.MULTIPLE_CHOICE) {
          const choiceItem = item.asMultipleChoiceItem();
          const choices = choiceItem.getChoices();
          const newChoices = [];
          
          choices.forEach(choice => {
            let originalText = choice.getValue();
            // Eliminar cualquier texto de disponibilidad existente
            originalText = originalText.replace(/\s*\((\d+\/\d+\splazas disponibles|COMPLETO|\d+\splazas disponibles)\)/g, '').trim();
            newChoices.push(choiceItem.createChoice(originalText));
          });
          
          choiceItem.setChoices(newChoices);
          console.log(`🔄 Opciones limpiadas para: ${title}`);
        }
      }
    });
    
    console.log("✅ Opciones del formulario limpiadas");
    
  } catch (error) {
    console.error("❌ Error limpiando opciones:", error);
    MailApp.sendEmail(ADMIN_EMAIL, "❌ Error limpiando opciones del formulario", `Se ha producido un error en el script de Google Apps Script al limpiar opciones: ${error.message}\n\nStack: ${error.stack}`);
  }
}

// ACTUALIZAR OPCIONES DEL FORMULARIO CON PLAZAS DISPONIBLES (CORREGIDA)
function updateFormOptions() {
  try {
    console.log("🔄 Actualizando opciones del formulario...");
    
    const form = FormApp.openById(FORM_ID);
    
    if (!form) {
      console.error("❌ No se pudo encontrar el formulario con ID:", FORM_ID);
      return;
    }
    
    const availability = checkWorkshopAvailability();
    console.log("📊 Disponibilidad para actualizar formulario:", availability);
    
    // Obtener todos los elementos del formulario
    const items = form.getItems();
    
    items.forEach(item => {
      const title = item.getTitle();
      
      // Buscar las preguntas de talleres
      if (title.includes("¿En qué taller quiero apuntarme a las 17:30 – 18:15 h?") || 
          title.includes("¿En qué taller quiero apuntarme a las 18:30 – 19:15 h?")) {
        
        if (item.getType() === FormApp.ItemType.MULTIPLE_CHOICE) {
          const choiceItem = item.asMultipleChoiceItem();
          const choices = choiceItem.getChoices();
          const newChoices = [];
          
          choices.forEach(choice => {
            let originalText = choice.getValue();
            
            // Limpiar el texto de disponibilidad existente antes de añadir el nuevo
            originalText = originalText.replace(/\s*\((\d+\/\d+\splazas disponibles|COMPLETO|\d+\splazas disponibles)\)/g, '').trim();
            
            // Buscar la disponibilidad para este taller
            let available = 0;
            
            // Si el taller existe en WORKSHOP_NAMES
            if (WORKSHOP_NAMES[originalText]) {
              // Obtener la disponibilidad del objeto 'availability' (que ahora contiene números)
              available = availability[originalText] !== undefined ? availability[originalText] : WORKSHOP_NAMES[originalText].capacity;
            }
            
            let newText;
            if (available <= 0) {
              newText = `${originalText} (COMPLETO)`;
            } else {
              newText = `${originalText} (${available} plazas disponibles)`;
            }
            
            newChoices.push(choiceItem.createChoice(newText));
            console.log(`🔄 Actualizado: ${originalText} -> ${available} plazas`);
          });
          
          choiceItem.setChoices(newChoices);
          console.log(`✅ Opciones actualizadas para: ${title}`);
        }
      }
    });
    
    console.log("✅ Opciones del formulario actualizadas correctamente");
    
  } catch (error) {
    console.error("❌ Error actualizando opciones:", error);
    MailApp.sendEmail(ADMIN_EMAIL, "❌ Error actualizando opciones del formulario", `Se ha producido un error en el script de Google Apps Script al actualizar opciones: ${error.message}\n\nStack: ${error.stack}`);
  }
}

// Función para verificar la disponibilidad de talleres (CORREGIDA - SIN FILTRAR POR ESTADO)
function checkWorkshopAvailability() {
  try {
    console.log("🔍 Verificando disponibilidad de talleres...");
    
    const sheet = SpreadsheetApp.getActiveSheet();
    const data = sheet.getDataRange().getValues();
    
    if (!data || data.length < 2) {
      console.log("⚠️ Hoja sin datos de inscripciones");
      const availabilityEmpty = {};
      Object.keys(WORKSHOP_NAMES).forEach(t => availabilityEmpty[t] = WORKSHOP_NAMES[t].capacity);
      return availabilityEmpty;
    }
    
    // Buscar columnas por headers
    const headers = data[0];
    const colTaller1 = headers.findIndex(h => String(h).includes('¿En qué taller quiero apuntarme a las 17:30'));
    const colTaller2 = headers.findIndex(h => String(h).includes('¿En qué taller quiero apuntarme a las 18:30'));
    
    if (colTaller1 === -1 || colTaller2 === -1) {
      console.log("⚠️ No se encontraron columnas de talleres. Usando índices antiguos de respaldo.");
    }
    
    // Inicializar disponibilidad con las capacidades máximas
    const availability = {};
    Object.keys(WORKSHOP_NAMES).forEach(tallerKey => {
      availability[tallerKey] = WORKSHOP_NAMES[tallerKey].capacity;
    });
    
    console.log("📊 Capacidades iniciales:", availability);
    
    // Contar TODAS las inscripciones (sin filtrar por estado)
    let totalInscripciones = 0;
    let conUnTaller = 0;
    let conDosTalleres = 0;
    
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const taller1 = colTaller1 !== -1 ? row[colTaller1] : row[7];
      const taller2 = colTaller2 !== -1 ? row[colTaller2] : row[8];
      
      // Solo contar si hay al menos un taller seleccionado
      if (taller1 || taller2) {
        totalInscripciones++;
        
        // Limpiar nombres de talleres (eliminar texto de disponibilidad)
        let cleanTaller1 = sanitizeWorkshopName(taller1);
        let cleanTaller2 = sanitizeWorkshopName(taller2);
        
        // Buscar coincidencias en WORKSHOP_NAMES
        const key1 = findWorkshopMatch(cleanTaller1);
        const key2 = findWorkshopMatch(cleanTaller2);
        
        if (key1 && key2) {
          conDosTalleres++;
          availability[key1] = Math.max(0, availability[key1] - 1);
          availability[key2] = Math.max(0, availability[key2] - 1);
          console.log(`📝 Fila ${i}: ${cleanTaller1} + ${cleanTaller2}`);
        } else if (key1 || key2) {
          conUnTaller++;
          if (key1) {
            availability[key1] = Math.max(0, availability[key1] - 1);
            console.log(`📝 Fila ${i}: Solo ${cleanTaller1}`);
          }
          if (key2) {
            availability[key2] = Math.max(0, availability[key2] - 1);
            console.log(`📝 Fila ${i}: Solo ${cleanTaller2}`);
          }
        }
      }
    }
    
    console.log(`📊 Total de inscripciones: ${totalInscripciones}`);
    console.log(`📊 Con un taller: ${conUnTaller}`);
    console.log(`📊 Con dos talleres: ${conDosTalleres}`);
    console.log("📊 Disponibilidad final calculada:", availability);
    
    return availability;
    
  } catch (error) {
    console.error("❌ Error verificando disponibilidad:", error);
    return {};
  }
}

// Verificar si hay plazas disponibles para los talleres seleccionados (CORREGIDA)
function checkAvailability(taller1, taller2, availability) {
  // Limpiar los nombres de talleres
  let cleanTaller1 = sanitizeWorkshopName(taller1);
  let cleanTaller2 = sanitizeWorkshopName(taller2);
  
  console.log(`🧹 Taller 1 limpio: "${cleanTaller1}"`);
  console.log(`🧹 Taller 2 limpio: "${cleanTaller2}"`);
  
  // Buscar coincidencias en WORKSHOP_NAMES
  const key1 = findWorkshopMatch(cleanTaller1);
  const key2 = findWorkshopMatch(cleanTaller2);
  
  let available1 = 0;
  let available2 = 0;
  
  if (key1) {
    available1 = availability[key1] !== undefined ? availability[key1] : WORKSHOP_NAMES[key1].capacity;
  }
  
  if (key2) {
    available2 = availability[key2] !== undefined ? availability[key2] : WORKSHOP_NAMES[key2].capacity;
  }
  
  console.log(`🔍 Verificando disponibilidad: ${cleanTaller1} (${available1}), ${cleanTaller2} (${available2})`);
  return available1 > 0 && available2 > 0;
}

// Verificar disponibilidad para un solo taller
function checkSingleWorkshopAvailability(taller, availability) {
  // Limpiar el nombre del taller (eliminar texto de disponibilidad)
  let cleanTaller = taller.replace(/\s*\((\d+\/\d+\splazas disponibles|COMPLETO|\d+\splazas disponibles)\)/g, '').trim();
  
  console.log(`🧹 Taller único limpio: "${cleanTaller}"`);
  
  // Buscar coincidencia en WORKSHOP_NAMES
  const key = findWorkshopMatch(cleanTaller);
  if (!key) {
    console.log(`🔍 Taller no reconocido o no seleccionado: "${cleanTaller}"`);
    return false;
  }
  
  // Verificar disponibilidad
  let available = availability[key] !== undefined ? availability[key] : WORKSHOP_NAMES[key].capacity;
  
  console.log(`🔍 Verificando disponibilidad de taller único: ${sanitizeWorkshopName(taller)} (${available} plazas)`);
  return available > 0;
}

// Funciones auxiliares para limpiar y mapear nombres de talleres
function sanitizeWorkshopName(value) {
  if (!value) return "";
  return String(value)
    .replace(/^[✅❌]\s*/, '')
    .replace(/\s*\((\d+\/\d+\splazas disponibles|COMPLETO|\d+\splazas disponibles)\)/g, '')
    .replace(/\s*-\s*NO DISPONIBLE/gi, '')
    .replace(/\s*\.\s*$/g, '')
    .trim();
}

function findWorkshopMatch(input) {
  const cleanText = sanitizeWorkshopName(input);
  if (!cleanText) return "";
  
  // Buscar coincidencia exacta
  if (WORKSHOP_NAMES[cleanText]) {
    return cleanText;
  }
  
  // Buscar por número de taller (más flexible)
  const numberMatch = cleanText.match(/^(\d+)\.\s*(.+)/);
  if (numberMatch) {
    const number = numberMatch[1];
    const rest = numberMatch[2].split(':')[0].trim();
    
    // Buscar coincidencia exacta por número
    const exactByNumber = Object.keys(WORKSHOP_NAMES).find(key => 
      key.startsWith(number + '.') && key.includes(rest)
    );
    if (exactByNumber) return exactByNumber;
    
    // Buscar coincidencia parcial por número (más flexible)
    const partialByNumber = Object.keys(WORKSHOP_NAMES).find(key => {
      if (!key.startsWith(number + '.')) return false;
      const keyRest = key.split(':')[0].replace(/^\d+\.\s*/, '').trim();
      return keyRest.includes(rest) || rest.includes(keyRest);
    });
    if (partialByNumber) return partialByNumber;
  }
  
  // Buscar por palabras clave (más flexible)
  const head = cleanText.split(':')[0].trim();
  const byHead = Object.keys(WORKSHOP_NAMES).find(key => {
    const keyHead = key.split(':')[0].trim();
    return keyHead === head || key.includes(head) || head.includes(keyHead);
  });
  
  return byHead || "";
}

// Confirmar inscripción
function confirmRegistration(email, nombre, apellidos, meInscriboComo, taller1, taller2) {
  const sheet = SpreadsheetApp.getActiveSheet();
  const lastRow = sheet.getLastRow();
  
  // Actualizar estado a "Confirmado" (columna K) y Fecha de inscripción (columna L)
  sheet.getRange(lastRow, 11).setValue('Confirmado');
  sheet.getRange(lastRow, 12).setValue(new Date());
  
  // Enviar email de confirmación
  const subject = "CONFIRMACION DE INSCRIPCION - XIV Foro de Innovación Educativa";
  const body = createConfirmationEmailHTML(nombre, apellidos, meInscriboComo, taller1, taller2);
  MailApp.sendEmail({
    to: email,
    subject: subject,
    htmlBody: body,
    noReply: true,
    name: "XIV Foro de Innovación Educativa"
  });
  
  // Notificar al administrador
  const adminSubject = `NUEVA INSCRIPCION CONFIRMADA: ${nombre} ${apellidos}`;
  const adminBody = createAdminNotificationEmailHTML(nombre, apellidos, meInscriboComo, taller1, taller2, "Confirmado", email);
  MailApp.sendEmail({
    to: ADMIN_EMAIL,
    subject: adminSubject,
    htmlBody: adminBody,
    noReply: true,
    name: "XIV Foro de Innovación Educativa"
  });
  
  console.log(`✅ Inscripción de ${nombre} ${apellidos} confirmada.`);
}

// Añadir a lista de espera
function addToWaitlist(email, nombre, apellidos, meInscriboComo, taller1, taller2) {
  const sheet = SpreadsheetApp.getActiveSheet();
  const lastRow = sheet.getLastRow();
  
  // Actualizar estado a "Lista de Espera" (columna K) y Fecha de inscripción (columna L)
  sheet.getRange(lastRow, 11).setValue('Lista de Espera');
  sheet.getRange(lastRow, 12).setValue(new Date());
  
  // Enviar email de lista de espera
  const subject = "LISTA DE ESPERA - XIV Foro de Innovación Educativa";
  const body = createWaitlistEmailHTML(nombre, apellidos, meInscriboComo, taller1, taller2);
  MailApp.sendEmail({
    to: email,
    subject: subject,
    htmlBody: body,
    noReply: true,
    name: "XIV Foro de Innovación Educativa"
  });
  
  // Notificar al administrador
  const adminSubject = `NUEVA INSCRIPCION EN LISTA DE ESPERA: ${nombre} ${apellidos}`;
  const adminBody = createAdminNotificationEmailHTML(nombre, apellidos, meInscriboComo, taller1, taller2, "Lista de Espera", email);
  MailApp.sendEmail({
    to: ADMIN_EMAIL,
    subject: adminSubject,
    htmlBody: adminBody,
    noReply: true,
    name: "XIV Foro de Innovación Educativa"
  });
  
  console.log(`⏳ Inscripción de ${nombre} ${apellidos} añadida a lista de espera.`);
}

// --- Funciones para crear los cuerpos de los emails (SIN EMOJIS) ---

function createConfirmationEmailHTML(nombre, apellidos, meInscriboComo, taller1, taller2) {
  // Limpiar los nombres de talleres para buscar en WORKSHOP_NAMES
  let cleanTaller1 = taller1 ? sanitizeWorkshopName(taller1) : '';
  let cleanTaller2 = taller2 ? sanitizeWorkshopName(taller2) : '';

  // Obtener nombres de display
  const key1 = findWorkshopMatch(cleanTaller1);
  const key2 = findWorkshopMatch(cleanTaller2);
  const displayName1 = key1 ? WORKSHOP_NAMES[key1].name : cleanTaller1;
  const displayName2 = key2 ? WORKSHOP_NAMES[key2].name : cleanTaller2;

  // Construir la lista de talleres seleccionados
  let workshopsList = '';
  if (cleanTaller1 && cleanTaller2) {
    workshopsList = `
      <ul class="workshop-list">
        <li><strong>1ª Sesión:</strong> ${displayName1}</li>
        <li><strong>2ª Sesión:</strong> ${displayName2}</li>
      </ul>
    `;
  } else if (cleanTaller1) {
    workshopsList = `
      <ul class="workshop-list">
        <li><strong>1ª Sesión:</strong> ${displayName1}</li>
        <li><strong>2ª Sesión:</strong> No seleccionado</li>
      </ul>
    `;
  } else if (cleanTaller2) {
    workshopsList = `
      <ul class="workshop-list">
        <li><strong>1ª Sesión:</strong> No seleccionado</li>
        <li><strong>2ª Sesión:</strong> ${displayName2}</li>
      </ul>
    `;
  }

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Confirmación de Inscripción</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
        .header { background-color: #4CAF50; color: white; padding: 10px 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { padding: 20px; }
        .footer { text-align: center; font-size: 0.8em; color: #777; margin-top: 20px; }
        .workshop-list { list-style-type: none; padding: 0; }
        .workshop-list li { background-color: #f9f9f9; margin-bottom: 5px; padding: 10px; border-left: 5px solid #4CAF50; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>CONFIRMACION DE INSCRIPCION</h2>
        </div>
        <div class="content">
          <p>Estimado/a <strong>${nombre} ${apellidos}</strong>,</p>
          <p>¡Tu inscripción al <strong>XIV Foro de Innovación Educativa</strong> ha sido confirmada con éxito!</p>
          <p>Te has inscrito como: <strong>${meInscriboComo}</strong></p>
          <p>Tus talleres seleccionados son:</p>
          ${workshopsList}
          <p>¡Esperamos verte allí!</p>
          <p>Atentamente,</p>
          <p>El equipo del XIV Foro de Innovación Educativa</p>
        </div>
        <div class="footer">
          <p>Este es un mensaje automático, por favor no respondas a este correo.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function createWaitlistEmailHTML(nombre, apellidos, meInscriboComo, taller1, taller2) {
  // Limpiar los nombres de talleres para buscar en WORKSHOP_NAMES
  let cleanTaller1 = taller1 ? taller1.replace(/\s*\((\d+\/\d+\splazas disponibles|COMPLETO|\d+\splazas disponibles)\)/g, '').trim() : '';
  let cleanTaller2 = taller2 ? taller2.replace(/\s*\((\d+\/\d+\splazas disponibles|COMPLETO|\d+\splazas disponibles)\)/g, '').trim() : '';

  // Construir la lista de talleres seleccionados
  let workshopsList = '';
  if (cleanTaller1 && cleanTaller2) {
    workshopsList = `
      <ul class="workshop-list">
        <li><strong>1ª Sesión:</strong> ${WORKSHOP_NAMES[cleanTaller1] ? WORKSHOP_NAMES[cleanTaller1].name : cleanTaller1}</li>
        <li><strong>2ª Sesión:</strong> ${WORKSHOP_NAMES[cleanTaller2] ? WORKSHOP_NAMES[cleanTaller2].name : cleanTaller2}</li>
      </ul>
    `;
  } else if (cleanTaller1) {
    workshopsList = `
      <ul class="workshop-list">
        <li><strong>1ª Sesión:</strong> ${WORKSHOP_NAMES[cleanTaller1] ? WORKSHOP_NAMES[cleanTaller1].name : cleanTaller1}</li>
        <li><strong>2ª Sesión:</strong> No seleccionado</li>
      </ul>
    `;
  } else if (cleanTaller2) {
    workshopsList = `
      <ul class="workshop-list">
        <li><strong>1ª Sesión:</strong> No seleccionado</li>
        <li><strong>2ª Sesión:</strong> ${WORKSHOP_NAMES[cleanTaller2] ? WORKSHOP_NAMES[cleanTaller2].name : cleanTaller2}</li>
      </ul>
    `;
  }

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Inscripción en Lista de Espera</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
        .header { background-color: #FFC107; color: white; padding: 10px 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { padding: 20px; }
        .footer { text-align: center; font-size: 0.8em; color: #777; margin-top: 20px; }
        .workshop-list { list-style-type: none; padding: 0; }
        .workshop-list li { background-color: #fff3cd; margin-bottom: 5px; padding: 10px; border-left: 5px solid #FFC107; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>LISTA DE ESPERA</h2>
        </div>
        <div class="content">
          <p>Estimado/a <strong>${nombre} ${apellidos}</strong>,</p>
          <p>Hemos recibido tu inscripción al <strong>XIV Foro de Innovación Educativa</strong>.</p>
          <p>Actualmente, los talleres que has seleccionado están completos, por lo que te hemos añadido a la lista de espera.</p>
          <p>Te has inscrito como: <strong>${meInscriboComo}</strong></p>
          <p>Tus talleres seleccionados son:</p>
          ${workshopsList}
          <p>Si se libera alguna plaza, te notificaremos inmediatamente.</p>
          <p>¡Gracias por tu interés!</p>
          <p>Atentamente,</p>
          <p>El equipo del XIV Foro de Innovación Educativa</p>
        </div>
        <div class="footer">
          <p>Este es un mensaje automático, por favor no respondas a este correo.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function createAdminNotificationEmailHTML(nombre, apellidos, meInscriboComo, taller1, taller2, status, email) {
  const availability = checkWorkshopAvailability(); // Esto ahora devolverá números
  let availabilityDetails = '';
  Object.keys(WORKSHOP_NAMES).forEach(workshopKey => {
    // CORREGIDO: Acceder a la capacidad desde WORKSHOP_NAMES y a las restantes desde availability
    const totalCapacity = WORKSHOP_NAMES[workshopKey].capacity;
    const remaining = availability[workshopKey] !== undefined ? availability[workshopKey] : totalCapacity;
    availabilityDetails += `<li><strong>${WORKSHOP_NAMES[workshopKey].name}:</strong> ${remaining} plazas restantes (de ${totalCapacity})</li>`;
  });

  // Limpiar los nombres de talleres para buscar en WORKSHOP_NAMES
  let cleanTaller1 = taller1 ? taller1.replace(/\s*\((\d+\/\d+\splazas disponibles|COMPLETO|\d+\splazas disponibles)\)/g, '').trim() : '';
  let cleanTaller2 = taller2 ? taller2.replace(/\s*\((\d+\/\d+\splazas disponibles|COMPLETO|\d+\splazas disponibles)\)/g, '').trim() : '';

  // Construir la lista de talleres seleccionados
  let workshopsList = '';
  if (cleanTaller1 && cleanTaller2) {
    workshopsList = `
      <ul class="workshop-list">
        <li><strong>1ª Sesión:</strong> ${WORKSHOP_NAMES[cleanTaller1] ? WORKSHOP_NAMES[cleanTaller1].name : cleanTaller1}</li>
        <li><strong>2ª Sesión:</strong> ${WORKSHOP_NAMES[cleanTaller2] ? WORKSHOP_NAMES[cleanTaller2].name : cleanTaller2}</li>
      </ul>
    `;
  } else if (cleanTaller1) {
    workshopsList = `
      <ul class="workshop-list">
        <li><strong>1ª Sesión:</strong> ${WORKSHOP_NAMES[cleanTaller1] ? WORKSHOP_NAMES[cleanTaller1].name : cleanTaller1}</li>
        <li><strong>2ª Sesión:</strong> No seleccionado</li>
      </ul>
    `;
  } else if (cleanTaller2) {
    workshopsList = `
      <ul class="workshop-list">
        <li><strong>1ª Sesión:</strong> No seleccionado</li>
        <li><strong>2ª Sesión:</strong> ${WORKSHOP_NAMES[cleanTaller2] ? WORKSHOP_NAMES[cleanTaller2].name : cleanTaller2}</li>
      </ul>
    `;
  }

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Notificación de Inscripción</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
        .header { background-color: ${status === 'Confirmado' ? '#4CAF50' : '#FFC107'}; color: white; padding: 10px 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { padding: 20px; }
        .footer { text-align: center; font-size: 0.8em; color: #777; margin-top: 20px; }
        .workshop-list { list-style-type: none; padding: 0; }
        .workshop-list li { background-color: #f9f9f9; margin-bottom: 5px; padding: 10px; border-left: 5px solid ${status === 'Confirmado' ? '#4CAF50' : '#FFC107'}; }
        .availability-list { list-style-type: none; padding: 0; border-top: 1px solid #eee; margin-top: 20px; padding-top: 10px;}
        .availability-list li { margin-bottom: 3px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>${status === 'Confirmado' ? 'NUEVA INSCRIPCION CONFIRMADA' : 'NUEVA INSCRIPCION EN LISTA DE ESPERA'}</h2>
        </div>
        <div class="content">
          <p>Se ha registrado una nueva inscripción:</p>
          <ul>
              <li><strong>Nombre:</strong> ${nombre} ${apellidos}</li>
              <li><strong>Email:</strong> ${email}</li>
              <li><strong>Se inscribe como:</strong> ${meInscriboComo}</li>
            <li><strong>Estado:</strong> <strong>${status}</strong></li>
            </ul>
          <p>Talleres seleccionados:</p>
          ${workshopsList}
          <h3>RESUMEN DE PLAZAS ACTUAL:</h3>
          <ul class="availability-list">
            ${availabilityDetails}
          </ul>
        </div>
        <div class="footer">
          <p>Este es un mensaje automático.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Función para ejecutar manualmente la limpieza y actualización de opciones
function setupFormInitial() {
  console.log("🚀 Configurando formulario inicial...");
  cleanFormOptions(); // Primero limpia
  updateFormOptions(); // Luego actualiza
  console.log("✅ Formulario configurado correctamente");
}

// Función de prueba para simular una inscripción
function testFormSubmission() {
  console.log("🧪 Iniciando prueba de inscripción...");
  
  // Simular datos de prueba
  const testData = [
    new Date(), // Marca temporal
    "R", // Nombre
    "Prueba", // Apellidos
    "raqelcb@gmail.com", // Email
    "12345678Z", // DNI
    "Docente", // Me inscribo como
    "Colegio de Prueba", // Institución
    "1. Artes Escénicas para la Inclusión: Estrategias Creativas en el Aula Instituto Artes Escénicas", // Taller 1ª sesión
    "10. GameLab inclusivo: del aula al juego Raquel Cuesta Santa María la Blanca", // Taller 2ª sesión
    "Sí", // Comunicación digital
    "", // Estado (se llenará por el script)
    ""  // Fecha de inscripción (se llenará por el script)
  ];
  
  // Añadir fila de prueba a la hoja
  const sheet = SpreadsheetApp.getActiveSheet();
  sheet.appendRow(testData);
  
  // Llamar a onFormSubmit
  onFormSubmit({values: testData});
  
  console.log("✅ Prueba completada");
}

// Función para verificar el estado actual del formulario
function checkFormStatus() {
  console.log("🔍 Verificando estado del formulario...");
  const availability = checkWorkshopAvailability();
  console.log("📊 Estado actual de plazas:", availability);
  updateFormOptions();
  console.log("✅ Formulario actualizado");
}

// Función de diagnóstico para verificar el estado
function diagnosticForm() {
  try {
    console.log("🔍 Iniciando diagnóstico del formulario...");
    
    const form = FormApp.openById(FORM_ID);
    if (!form) {
      console.error("❌ No se pudo encontrar el formulario con ID:", FORM_ID);
      return;
    }
    
    const items = form.getItems();
    console.log("📋 Total de elementos en el formulario:", items.length);
    
    items.forEach((item, index) => {
      const title = item.getTitle();
      console.log(`📝 Elemento ${index + 1}: ${title}`);
      
      if (title.includes("¿En qué taller quiero apuntarme a las 17:30 – 18:15 h?") || 
          title.includes("¿En qué taller quiero apuntarme a las 18:30 – 19:15 h?")) {
        
        if (item.getType() === FormApp.ItemType.MULTIPLE_CHOICE) {
          const choiceItem = item.asMultipleChoiceItem();
          const choices = choiceItem.getChoices();
          console.log(`🎯 Encontrada pregunta de talleres: ${title}`);
          console.log(`📊 Número de opciones: ${choices.length}`);
          
          choices.forEach((choice, choiceIndex) => {
            const choiceText = choice.getValue();
            console.log(`   Opción ${choiceIndex + 1}: ${choiceText}`);
          });
        }
      }
    });
    
    // Verificar disponibilidad
    const availability = checkWorkshopAvailability();
    console.log("📊 Disponibilidad calculada:", availability);
    
  } catch (error) {
    console.error("❌ Error en diagnóstico:", error);
  }
}

// Función de reset completo
function resetFormCompletely() {
  try {
    console.log("🔄 Iniciando reset completo del formulario...");
    
    const form = FormApp.openById(FORM_ID);
    if (!form) {
      console.error("❌ No se pudo encontrar el formulario con ID:", FORM_ID);
      return;
    }
    
    const items = form.getItems();
    
    items.forEach(item => {
      const title = item.getTitle();
      
      if (title.includes("¿En qué taller quiero apuntarme a las 17:30 – 18:15 h?") || 
          title.includes("¿En qué taller quiero apuntarme a las 18:30 – 19:15 h?")) {
        
        if (item.getType() === FormApp.ItemType.MULTIPLE_CHOICE) {
          const choiceItem = item.asMultipleChoiceItem();
          const choices = choiceItem.getChoices();
          const newChoices = [];
          
          choices.forEach(choice => {
            let originalText = choice.getValue();
            // Eliminar CUALQUIER texto entre paréntesis
            originalText = originalText.replace(/\s*\([^)]*\)/g, '').trim();
            newChoices.push(choiceItem.createChoice(originalText));
          });
          
          choiceItem.setChoices(newChoices);
          console.log(`✅ Reset completado para: ${title}`);
        }
      }
    });
    
    console.log("✅ Reset completo finalizado");
    
    // Ahora actualizar con las plazas correctas
    updateFormOptions();
    
  } catch (error) {
    console.error("❌ Error en reset completo:", error);
  }
}

// Función para probar el envío de emails
function testEmailSending() {
  try {
    console.log("📧 Probando envío de emails...");
    
    const testEmail = "rcuesta@p.csmb.es"; // Tu email real
    const subject = "PRUEBA DE EMAIL - XIV Foro de Innovación Educativa";
    const body = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Prueba de Email</title>
      </head>
      <body>
        <h2>PRUEBA DE EMAIL</h2>
        <p>Este es un email de prueba para verificar que el sistema de envío funciona correctamente.</p>
        <p>Si recibes este email, el sistema está funcionando.</p>
      </body>
      </html>
    `;
    
    MailApp.sendEmail({
      to: testEmail,
      subject: subject,
      htmlBody: body,
      noReply: true,
      name: "XIV Foro de Innovación Educativa"
    });
    
    console.log(`✅ Email de prueba enviado a: ${testEmail}`);
    
  } catch (error) {
    console.error("❌ Error enviando email de prueba:", error);
  }
}

// Función para diagnosticar el problema de plazas
function diagnosticPlazas() {
  try {
    console.log("🔍 Diagnosticando problema de plazas...");
    
    const sheet = SpreadsheetApp.getActiveSheet();
    const data = sheet.getDataRange().getValues();
    console.log("📊 Total de filas en la hoja:", data.length);
    
    // Verificar la última fila
    const lastRow = data.length - 1;
    const lastData = data[lastRow];
    console.log("📝 Última fila de datos:", lastData);
    
    const taller1 = lastData[7]; // Columna H (índice 7)
    const taller2 = lastData[8]; // Columna I (índice 8)
    console.log("🎯 Talleres seleccionados:", {taller1, taller2});
    
    // Limpiar los nombres de talleres para buscar en WORKSHOP_NAMES
    let cleanTaller1 = taller1.replace(/\s*\((\d+\/\d+\splazas disponibles|COMPLETO|\d+\splazas disponibles)\)/g, '').trim();
    let cleanTaller2 = taller2.replace(/\s*\((\d+\/\d+\splazas disponibles|COMPLETO|\d+\splazas disponibles)\)/g, '').trim();

    // Verificar si los talleres están en el mapeo
    console.log("🔍 ¿Taller 1 en mapeo?", WORKSHOP_NAMES[cleanTaller1] ? "SÍ" : "NO");
    console.log("🔍 ¿Taller 2 en mapeo?", WORKSHOP_NAMES[cleanTaller2] ? "SÍ" : "NO");
    
    if (WORKSHOP_NAMES[cleanTaller1]) {
      console.log("📊 Capacidad Taller 1:", WORKSHOP_NAMES[cleanTaller1].capacity);
    }
    if (WORKSHOP_NAMES[cleanTaller2]) {
      console.log("📊 Capacidad Taller 2:", WORKSHOP_NAMES[cleanTaller2].capacity);
    }
    
    // Calcular disponibilidad
    const availability = checkWorkshopAvailability();
    console.log("📊 Disponibilidad calculada:", availability);
    
    // Verificar disponibilidad específica
    const available1 = WORKSHOP_NAMES[cleanTaller1] ? availability[cleanTaller1] : 0;
    const available2 = WORKSHOP_NAMES[cleanTaller2] ? availability[cleanTaller2] : 0;
    
    console.log("🔍 Disponibilidad específica:");
    console.log(`   Taller 1 (${cleanTaller1}): ${available1} plazas`);
    console.log(`   Taller 2 (${cleanTaller2}): ${available2} plazas`);
    
    const canConfirm = available1 > 0 && available2 > 0;
    console.log("✅ ¿Se puede confirmar?", canConfirm);
    
    // Mostrar todas las inscripciones confirmadas
    console.log("📋 Inscripciones confirmadas:");
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const estado = row[10]; // Columna K (índice 10)
      if (estado === 'Confirmado') {
        console.log(`   Fila ${i}: ${row[7]} + ${row[8]}`);
      }
    }
    
  } catch (error) {
    console.error("❌ Error en diagnóstico:", error);
  }
}

// Función para limpiar datos de prueba
function limpiarDatosPrueba() {
  try {
    console.log("🧹 Limpiando datos de prueba...");
    
    const sheet = SpreadsheetApp.getActiveSheet();
    const data = sheet.getDataRange().getValues();
    
    // Buscar filas de prueba (que contengan "Juan" o "test@example.com")
    const rowsToDelete = [];
    
    for (let i = data.length - 1; i >= 1; i--) { // Empezar desde el final
      const row = data[i];
      const nombre = row[1]; // Columna B
      const email = row[3]; // Columna D
      
      if (nombre === "Juan" || email === "test@example.com") {
        rowsToDelete.push(i + 1); // +1 porque las filas empiezan en 1
        console.log(`🗑️ Marcada para eliminar fila ${i + 1}: ${nombre} - ${email}`);
      }
    }
    
    // Eliminar filas (de mayor a menor para no afectar los índices)
    rowsToDelete.sort((a, b) => b - a);
    rowsToDelete.forEach(rowNum => {
      sheet.deleteRow(rowNum);
      console.log(`✅ Eliminada fila ${rowNum}`);
    });
    
    console.log(`✅ Limpieza completada. Eliminadas ${rowsToDelete.length} filas de prueba`);
    
  } catch (error) {
    console.error("❌ Error limpiando datos:", error);
  }
}

// Función para limpiar datos de prueba y resetear
function limpiarYResetear() {
  try {
    console.log("🧹 Limpiando datos de prueba y reseteando...");
    
    const sheet = SpreadsheetApp.getActiveSheet();
    const data = sheet.getDataRange().getValues();
    
    // Buscar filas de prueba (que contengan "Juan" o "test@example.com" o "raqelcb@gmail.com")
    const rowsToDelete = [];
    
    for (let i = data.length - 1; i >= 1; i--) { // Empezar desde el final
      const row = data[i];
      const nombre = row[1]; // Columna B
      const email = row[3]; // Columna D
      
      if (nombre === "Juan" || email === "test@example.com" || email === "raqelcb@gmail.com") {
        rowsToDelete.push(i + 1); // +1 porque las filas empiezan en 1
        console.log(`🗑️ Marcada para eliminar fila ${i + 1}: ${nombre} - ${email}`);
      }
    }
    
    // Eliminar filas (de mayor a menor para no afectar los índices)
    rowsToDelete.sort((a, b) => b - a);
    rowsToDelete.forEach(rowNum => {
      sheet.deleteRow(rowNum);
      console.log(`✅ Eliminada fila ${rowNum}`);
    });
    
    console.log(`✅ Limpieza completada. Eliminadas ${rowsToDelete.length} filas de prueba`);
    
    // Resetear formulario
    resetFormCompletely();
    
  } catch (error) {
    console.error("❌ Error limpiando datos:", error);
  }
}

// Función para actualizar el formulario después de la limpieza
function actualizarFormularioDespuesLimpieza() {
  try {
    console.log("🔄 Actualizando formulario después de la limpieza...");
    
    const form = FormApp.openById(FORM_ID);
    if (!form) {
      console.error("❌ No se pudo encontrar el formulario con ID:", FORM_ID);
      return;
    }
    
    const items = form.getItems();
    
    items.forEach(item => {
      const title = item.getTitle();
      
      if (title.includes("¿En qué taller quiero apuntarme a las 17:30 – 18:15 h?") || 
          title.includes("¿En qué taller quiero apuntarme a las 18:30 – 19:15 h?")) {
        
        if (item.getType() === FormApp.ItemType.MULTIPLE_CHOICE) {
          const choiceItem = item.asMultipleChoiceItem();
          const choices = choiceItem.getChoices();
          const newChoices = [];
          
          choices.forEach(choice => {
            let originalText = choice.getValue();
            // Eliminar CUALQUIER texto entre paréntesis
            originalText = originalText.replace(/\s*\([^)]*\)/g, '').trim();
            newChoices.push(choiceItem.createChoice(originalText));
          });
          
          choiceItem.setChoices(newChoices);
          console.log(`✅ Opciones limpiadas para: ${title}`);
        }
      }
    });
    
    console.log("✅ Formulario limpiado correctamente");
    
    // Ahora actualizar con las plazas correctas
    updateFormOptions();
    
  } catch (error) {
    console.error("❌ Error actualizando formulario:", error);
  }
}

// Función para verificar el estado después de la limpieza
function verificarEstadoActual() {
  try {
    console.log("🔍 Verificando estado actual después de la limpieza...");
    
    const sheet = SpreadsheetApp.getActiveSheet();
    const data = sheet.getDataRange().getValues();
    console.log("📊 Total de filas en la hoja:", data.length);
    
    // Verificar disponibilidad
    const availability = checkWorkshopAvailability();
    console.log("📊 Disponibilidad actual:", availability);
    
    // Mostrar solo talleres con plazas disponibles
    Object.keys(availability).forEach(workshopKey => {
      if (availability[workshopKey] > 0) {
        console.log(`✅ ${WORKSHOP_NAMES[workshopKey].name}: ${availability[workshopKey]} plazas disponibles`);
      }
    });
    
  } catch (error) {
    console.error("❌ Error verificando estado:", error);
  }
}

// Función para diagnosticar el descuento de plazas
function diagnosticarDescuentoPlazas() {
  try {
    console.log("🔍 Diagnosticando descuento de plazas...");
    
    const sheet = SpreadsheetApp.getActiveSheet();
    const data = sheet.getDataRange().getValues();
    console.log("📊 Total de filas en la hoja:", data.length);
    
    // Verificar la última fila
    const lastRow = data.length - 1;
    const lastData = data[lastRow];
    console.log("📝 Última fila de datos:", lastData);
    
    const taller1 = lastData[7]; // Columna H (índice 7)
    const taller2 = lastData[8]; // Columna I (índice 8)
    const estado = lastData[10]; // Columna K (índice 10)
    
    console.log("🎯 Última inscripción:");
    console.log(`   Taller 1: ${taller1}`);
    console.log(`   Taller 2: ${taller2}`);
    console.log(`   Estado: ${estado}`);
    
    // Limpiar nombres de talleres
    let cleanTaller1 = taller1.replace(/\s*\((\d+\/\d+\splazas disponibles|COMPLETO|\d+\splazas disponibles)\)/g, '').trim();
    let cleanTaller2 = taller2.replace(/\s*\((\d+\/\d+\splazas disponibles|COMPLETO|\d+\splazas disponibles)\)/g, '').trim();
    
    console.log("🧹 Talleres limpios:");
    console.log(`   Taller 1: ${cleanTaller1}`);
    console.log(`   Taller 2: ${cleanTaller2}`);
    
    // Verificar si están en el mapeo
    console.log("🔍 Verificación en mapeo:");
    console.log(`   Taller 1 en mapeo: ${WORKSHOP_NAMES[cleanTaller1] ? 'SÍ' : 'NO'}`);
    console.log(`   Taller 2 en mapeo: ${WORKSHOP_NAMES[cleanTaller2] ? 'SÍ' : 'NO'}`);
    
    // Calcular disponibilidad actual
    const availability = checkWorkshopAvailability();
    console.log("📊 Disponibilidad actual:", availability);
    
    // Verificar disponibilidad específica
    const available1 = WORKSHOP_NAMES[cleanTaller1] ? availability[cleanTaller1] : 0;
    const available2 = WORKSHOP_NAMES[cleanTaller2] ? availability[cleanTaller2] : 0;
    
    console.log("🔍 Disponibilidad específica:");
    console.log(`   ${cleanTaller1}: ${available1} plazas`);
    console.log(`   ${cleanTaller2}: ${available2} plazas`);
    
    // Mostrar todas las inscripciones confirmadas
    console.log("📋 Inscripciones confirmadas:");
    let confirmadas = 0;
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const estado = row[10]; // Columna K (índice 10)
      if (estado === 'Confirmado') {
        confirmadas++;
        console.log(`   Fila ${i}: ${row[7]} + ${row[8]} - Estado: ${estado}`);
      }
    }
    console.log(`📊 Total de inscripciones confirmadas: ${confirmadas}`);
    
  } catch (error) {
    console.error("❌ Error en diagnóstico:", error);
  }
}

// Función para forzar actualización del formulario
function forzarActualizacionFormulario() {
  try {
    console.log("🔄 Forzando actualización del formulario...");
    
    // Primero limpiar
    cleanFormOptions();
    
    // Luego actualizar
    updateFormOptions();
    
    console.log("✅ Actualización forzada completada");
    
  } catch (error) {
    console.error("❌ Error en actualización forzada:", error);
  }
}

// Función para verificar el estado del formulario
function verificarEstadoFormulario() {
  try {
    console.log("🔍 Verificando estado del formulario...");
    
    const form = FormApp.openById(FORM_ID);
    if (!form) {
      console.error("❌ No se pudo encontrar el formulario");
      return;
    }
    
    const items = form.getItems();
    
    items.forEach(item => {
      const title = item.getTitle();
      
      if (title.includes("¿En qué taller quiero apuntarme a las 17:30 – 18:15 h?") || 
          title.includes("¿En qué taller quiero apuntarme a las 18:30 – 19:15 h?")) {
        
        if (item.getType() === FormApp.ItemType.MULTIPLE_CHOICE) {
          const choiceItem = item.asMultipleChoiceItem();
          const choices = choiceItem.getChoices();
          
          console.log(`📋 ${title}:`);
          choices.forEach((choice, index) => {
            const choiceText = choice.getValue();
            console.log(`   ${index + 1}. ${choiceText}`);
          });
        }
      }
    });
    
  } catch (error) {
    console.error("❌ Error verificando formulario:", error);
  }
}

// Función para probar el descuento de plazas (CORREGIDA)
function probarDescuentoPlazas() {
  try {
    console.log("🧪 Probando descuento de plazas...");
    
    const availability = checkWorkshopAvailability(); // Esto ahora devolverá números
    
    console.log("📊 Resultado del descuento:");
    Object.keys(availability).forEach(tallerKey => {
      const capacidad = WORKSHOP_NAMES[tallerKey].capacity; // CORREGIDO: Acceder a .capacity
      const disponible = availability[tallerKey];
      const ocupadas = capacidad - disponible;
      
      console.log(`   ${WORKSHOP_NAMES[tallerKey].name}: ${ocupadas}/${capacidad} ocupadas, ${disponible} disponibles`);
    });
    
  } catch (error) {
    console.error("❌ Error en prueba:", error);
  }
}

function contarInscripcionesManual() {
  try {
    console.log("🔢 Contando inscripciones manualmente...");
    
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getActiveSheet();
    const data = sheet.getDataRange().getValues();
    
    if (data.length <= 1) {
      console.log("❌ No hay datos en la hoja");
      return;
    }
    
    const headers = data[0];
    const taller1Col = headers.indexOf("¿En qué taller quiero apuntarme a las 17:30 – 18:15 h?");
    const taller2Col = headers.indexOf("¿En qué taller quiero apuntarme a las 18:30 – 19:15 h?");
    const estadoCol = headers.indexOf("Estado");
    
    if (taller1Col === -1 || taller2Col === -1) {
      console.log("❌ No se encontraron las columnas de talleres");
      return;
    }
    
    // Contador para cada taller
    const contadores = {};
    
    // Inicializar contadores
    Object.keys(WORKSHOP_NAMES).forEach(key => {
      contadores[key] = { franja1: 0, franja2: 0, total: 0 };
    });
    
    // Contar inscripciones CONFIRMADAS únicamente
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const taller1 = row[taller1Col];
      const taller2 = row[taller2Col];
      const estado = estadoCol !== -1 ? row[estadoCol] : row[10];
      
      // Solo contar inscripciones confirmadas
      if (estado && String(estado).trim().toLowerCase() === 'confirmado') {
        if (taller1 && taller1.trim()) {
          const cleanTaller1 = taller1.replace(/\s*\((\d+\/\d+\splazas disponibles|COMPLETO|\d+\splazas disponibles)\)/g, '').trim();
          if (WORKSHOP_NAMES[cleanTaller1]) {
            contadores[cleanTaller1].franja1++;
            contadores[cleanTaller1].total++;
          }
        }
        
        if (taller2 && taller2.trim()) {
          const cleanTaller2 = taller2.replace(/\s*\((\d+\/\d+\splazas disponibles|COMPLETO|\d+\splazas disponibles)\)/g, '').trim();
          if (WORKSHOP_NAMES[cleanTaller2]) {
            contadores[cleanTaller2].franja2++;
            contadores[cleanTaller2].total++;
          }
        }
      }
    }
    
    // Mostrar resultados
    console.log("📊 CONTEO MANUAL DE INSCRIPCIONES CONFIRMADAS:");
    console.log("=".repeat(60));
    
    Object.keys(WORKSHOP_NAMES).forEach(key => {
      const total = contadores[key].total;
      const disponible = WORKSHOP_NAMES[key].capacity - total;
      const estado = disponible <= 0 ? "COMPLETO" : `${disponible} plazas`;
      
      console.log(`${key}:`);
      console.log(`  Franja 1: ${contadores[key].franja1} inscritos`);
      console.log(`  Franja 2: ${contadores[key].franja2} inscritos`);
      console.log(`  Total únicos: ${total} inscritos`);
      console.log(`  Capacidad: ${WORKSHOP_NAMES[key].capacity}`);
      console.log(`  Disponibles: ${disponible}`);
      console.log(`  Estado: ${estado}`);
      console.log("");
    });
    
    // Mostrar también el conteo del sistema actual para comparar
    console.log("🔍 COMPARACIÓN CON SISTEMA ACTUAL:");
    console.log("=".repeat(40));
    const availability = checkWorkshopAvailability();
    Object.keys(WORKSHOP_NAMES).forEach(key => {
      const sistemaActual = availability[key];
      const manual = WORKSHOP_NAMES[key].capacity - contadores[key].total;
      const diferencia = sistemaActual - manual;
      
      if (diferencia !== 0) {
        console.log(`⚠️ ${key}: Sistema=${sistemaActual}, Manual=${manual}, Diferencia=${diferencia}`);
      }
    });
    
  } catch (error) {
    console.error("❌ Error en conteo manual:", error);
  }
}

function corregirConteoInscripciones() {
  try {
    console.log("🔧 Corrigiendo conteo de inscripciones...");
    
    // Primero calcular los datos reales desde el CSV
    const datosReales = calcularDisponibilidadReal();
    
    console.log("📊 DATOS REALES CALCULADOS:");
    console.log("=".repeat(50));
    
    Object.keys(datosReales).forEach(key => {
      const data = datosReales[key];
      const estado = data.disponibles <= 0 ? "COMPLETO" : `${data.disponibles} plazas`;
      
      console.log(`${WORKSHOP_NAMES[key].name}:`);
      console.log(`  Inscritos: ${data.inscritos}`);
      console.log(`  Capacidad: ${data.capacidad}`);
      console.log(`  Disponibles: ${data.disponibles}`);
      console.log(`  Estado: ${estado}`);
      console.log("");
    });
    
    // Actualizar el formulario con los datos reales
    console.log("🔄 Actualizando formulario con datos reales...");
    updateFormOptionsWithCorrectData(datosReales);
    
  } catch (error) {
    console.error("❌ Error corrigiendo conteo:", error);
  }
}

function calcularDisponibilidadReal() {
  try {
    console.log("🔍 Calculando disponibilidad real desde el CSV...");
    
    const sheet = SpreadsheetApp.getActiveSheet();
    const data = sheet.getDataRange().getValues();
    
    if (!data || data.length < 2) {
      console.log("❌ No hay datos en la hoja");
      return {};
    }
    
    // Buscar columnas por headers
    const headers = data[0];
    const colTaller1 = headers.findIndex(h => String(h).includes('¿En qué taller quiero apuntarme a las 17:30'));
    const colTaller2 = headers.findIndex(h => String(h).includes('¿En qué taller quiero apuntarme a las 18:30'));
    
    console.log(`📊 Columnas encontradas: Taller1=${colTaller1}, Taller2=${colTaller2}`);
    
    // Contador para cada taller
    const contadores = {};
    Object.keys(WORKSHOP_NAMES).forEach(key => {
      contadores[key] = 0;
    });
    
    let totalInscripciones = 0;
    let conUnTaller = 0;
    let conDosTalleres = 0;
    
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const taller1 = colTaller1 !== -1 ? row[colTaller1] : row[7];
      const taller2 = colTaller2 !== -1 ? row[colTaller2] : row[8];
      
      // Solo contar si hay al menos un taller seleccionado
      if (taller1 || taller2) {
        totalInscripciones++;
        
        const cleanTaller1 = sanitizeWorkshopName(taller1);
        const cleanTaller2 = sanitizeWorkshopName(taller2);
        
        const key1 = findWorkshopMatch(cleanTaller1);
        const key2 = findWorkshopMatch(cleanTaller2);
        
        if (key1 && key2) {
          conDosTalleres++;
          contadores[key1]++;
          contadores[key2]++;
        } else if (key1 || key2) {
          conUnTaller++;
          if (key1) contadores[key1]++;
          if (key2) contadores[key2]++;
        }
      }
    }
    
    console.log(`📊 Total de inscripciones: ${totalInscripciones}`);
    console.log(`📊 Con un taller: ${conUnTaller}`);
    console.log(`📊 Con dos talleres: ${conDosTalleres}`);
    
    // Crear objeto con datos reales
    const datosReales = {};
    Object.keys(WORKSHOP_NAMES).forEach(key => {
      const inscritos = contadores[key];
      const capacidad = WORKSHOP_NAMES[key].capacity;
      const disponibles = Math.max(0, capacidad - inscritos);
      
      datosReales[key] = {
        inscritos: inscritos,
        capacidad: capacidad,
        disponibles: disponibles
      };
    });
    
    return datosReales;
    
  } catch (error) {
    console.error("❌ Error calculando disponibilidad real:", error);
    return {};
  }
}

function updateFormOptionsWithCorrectData(datosCorrectos) {
  try {
    const form = FormApp.openById(FORM_ID);
    const items = form.getItems();
    
    items.forEach(item => {
      const title = item.getTitle();
      
      if (title.includes("¿En qué taller quiero apuntarme a las 17:30 – 18:15 h?") || 
          title.includes("¿En qué taller quiero apuntarme a las 18:30 – 19:15 h?")) {
        
        if (item.getType() === FormApp.ItemType.MULTIPLE_CHOICE) {
          const choiceItem = item.asMultipleChoiceItem();
          const choices = choiceItem.getChoices();
          const newChoices = [];
          const completos = [];
          
          choices.forEach(choice => {
            let originalText = choice.getValue();
            
            // Limpiar el texto de disponibilidad existente
            originalText = originalText.replace(/\s*\((\d+\/\d+\splazas disponibles|COMPLETO|\d+\splazas disponibles)\)/g, '').trim();
            
            // Buscar coincidencia en WORKSHOP_NAMES
            const key = findWorkshopMatch(originalText);
            let available = 0;
            
            if (key && datosCorrectos[key]) {
              available = datosCorrectos[key].disponibles;
            } else if (key && WORKSHOP_NAMES[key]) {
              available = WORKSHOP_NAMES[key].capacity;
            }
            
            if (available <= 0) {
              // Agregar a la lista de completos
              completos.push(originalText);
              console.log(`❌ COMPLETO: ${originalText}`);
            } else {
              // Agregar como opción disponible
              const newText = `${originalText} (${available} plazas disponibles)`;
              newChoices.push(choiceItem.createChoice(newText));
              console.log(`✅ Disponible: ${originalText} -> ${available} plazas`);
            }
          });
          
          // Establecer solo las opciones disponibles
          choiceItem.setChoices(newChoices);
          
          // Agregar talleres completos al texto de ayuda
          if (completos.length > 0) {
            const helpText = `COMPLETO:\n- ${completos.join('\n- ')}`;
            item.setHelpText(helpText);
            console.log(`📝 Help text actualizado: ${helpText}`);
          } else {
            item.setHelpText("");
          }
          
          console.log(`✅ Opciones actualizadas para: ${title}. Disponibles: ${newChoices.length}, Completos: ${completos.length}`);
        }
      }
    });
    
    console.log("✅ Formulario actualizado con datos correctos");
    
  } catch (error) {
    console.error("❌ Error actualizando formulario:", error);
  }
}

function forzarActualizacionCorrecta() {
  try {
    console.log("🔧 Forzando actualización con números exactos...");
    
    // Primero limpiar todas las opciones
    cleanFormOptions();
    
    // Luego aplicar los datos correctos
    corregirConteoInscripciones();
    
    console.log("✅ Actualización forzada completada");
    
  } catch (error) {
    console.error("❌ Error en actualización forzada:", error);
  }
}

// Función para probar inscripción con un solo taller
function probarInscripcionUnTaller() {
  try {
    console.log("🧪 Probando inscripción con un solo taller...");
    
    // Simular datos de prueba con solo un taller
    const testData = [
      new Date(), // Marca temporal
      "Prueba", // Nombre
      "Prueba", // Apellidos
      "rcuesta@p.csmb.es", // Email
      "12345678Z", // DNI
      "Periodista", // Me inscribo como
      "Colegio de Prueba", // Institución
      "6. Crecer sin alas prestadas Equipo de Acompañate Santa María la Blanca", // Solo Taller 1ª sesión
      "", // Taller 2ª sesión vacío
      "Sí", // Comunicación digital
      "", // Estado (se llenará por el script)
      ""  // Fecha de inscripción (se llenará por el script)
    ];
    
    // Añadir fila de prueba a la hoja
    const sheet = SpreadsheetApp.getActiveSheet();
    sheet.appendRow(testData);
    
    // Llamar a onFormSubmit
    onFormSubmit({values: testData});
    
    console.log("✅ Prueba de inscripción con un solo taller completada");
    
  } catch (error) {
    console.error("❌ Error en prueba:", error);
  }
}

// Función para probar inscripción con dos talleres
function probarInscripcionDosTalleres() {
  try {
    console.log("🧪 Probando inscripción con dos talleres...");
    
    // Simular datos de prueba con dos talleres
    const testData = [
      new Date(), // Marca temporal
      "Prueba", // Nombre
      "Dos Talleres", // Apellidos
      "rcuesta@p.csmb.es", // Email
      "12345678Z", // DNI
      "Docente", // Me inscribo como
      "Colegio de Prueba", // Institución
      "1. Artes Escénicas para la Inclusión: Estrategias Creativas en el Aula Instituto Artes Escénicas", // Taller 1ª sesión
      "11. Godly Play: «Jugando con Dios» Equipo Godly Play Santa María la Blanca", // Taller 2ª sesión
      "Sí", // Comunicación digital
      "", // Estado (se llenará por el script)
      ""  // Fecha de inscripción (se llenará por el script)
    ];
    
    // Añadir fila de prueba a la hoja
    const sheet = SpreadsheetApp.getActiveSheet();
    sheet.appendRow(testData);
    
    // Llamar a onFormSubmit
    onFormSubmit({values: testData});
    
    console.log("✅ Prueba de inscripción con dos talleres completada");
    
  } catch (error) {
    console.error("❌ Error en prueba:", error);
  }
}

// Función para probar solo el envío de emails (sin añadir a la hoja)
function probarEnvioEmails() {
  try {
    console.log("📧 Probando envío de emails...");
    
    // Probar email de confirmación con un taller
    console.log("📧 Probando email de confirmación con un taller...");
    const email1Taller = createConfirmationEmailHTML(
      "María", 
      "García López", 
      "Docente", 
      "1. Artes Escénicas para la Inclusión: Estrategias Creativas en el Aula Instituto Artes Escénicas", 
      ""
    );
    
    MailApp.sendEmail({
      to: "rcuesta@p.csmb.es",
      subject: "PRUEBA: Email confirmación con 1 taller",
      htmlBody: email1Taller,
      noReply: true,
      name: "XIV Foro de Innovación Educativa"
    });
    
    // Probar email de confirmación con dos talleres
    console.log("📧 Probando email de confirmación con dos talleres...");
    const email2Talleres = createConfirmationEmailHTML(
      "Juan", 
      "Pérez Martínez", 
      "Docente", 
      "1. Artes Escénicas para la Inclusión: Estrategias Creativas en el Aula Instituto Artes Escénicas", 
      "11. Godly Play: «Jugando con Dios» Equipo Godly Play Santa María la Blanca"
    );
    
    MailApp.sendEmail({
      to: "rcuesta@p.csmb.es",
      subject: "PRUEBA: Email confirmación con 2 talleres",
      htmlBody: email2Talleres,
      noReply: true,
      name: "XIV Foro de Innovación Educativa"
    });
    
    console.log("✅ Pruebas de envío de emails completadas");
    
  } catch (error) {
    console.error("❌ Error en prueba de emails:", error);
  }
}

// Función para actualizar el formulario con los datos correctos del CSV
function actualizarFormularioConDatosReales() {
  try {
    console.log("🔄 Actualizando formulario con datos reales del CSV...");
    
    // Primero limpiar las opciones
    cleanFormOptions();
    
    // Calcular disponibilidad real
    const datosReales = calcularDisponibilidadReal();
    
    console.log("📊 DATOS REALES CALCULADOS:");
    console.log("=".repeat(50));
    
    Object.keys(datosReales).forEach(key => {
      const data = datosReales[key];
      const estado = data.disponibles <= 0 ? "COMPLETO" : `${data.disponibles} plazas`;
      
      console.log(`${WORKSHOP_NAMES[key].name}:`);
      console.log(`  Inscritos: ${data.inscritos}`);
      console.log(`  Capacidad: ${data.capacidad}`);
      console.log(`  Disponibles: ${data.disponibles}`);
      console.log(`  Estado: ${estado}`);
      console.log("");
    });
    
    // Actualizar el formulario
    updateFormOptionsWithCorrectData(datosReales);
    
    console.log("✅ Formulario actualizado con datos reales");
    
  } catch (error) {
    console.error("❌ Error actualizando formulario:", error);
  }
}

// Función para diagnosticar problemas de mapeo
function diagnosticarMapeo() {
  try {
    console.log("🔍 Diagnosticando problemas de mapeo...");
    
    const sheet = SpreadsheetApp.getActiveSheet();
    const data = sheet.getDataRange().getValues();
    
    if (!data || data.length < 2) {
      console.log("❌ No hay datos en la hoja");
      return;
    }
    
    // Buscar columnas por headers
    const headers = data[0];
    const colEstado = headers.findIndex(h => String(h).trim().toLowerCase() === 'estado');
    const colTaller1 = headers.findIndex(h => String(h).includes('¿En qué taller quiero apuntarme a las 17:30'));
    const colTaller2 = headers.findIndex(h => String(h).includes('¿En qué taller quiero apuntarme a las 18:30'));
    
    console.log(`📊 Columnas encontradas: Estado=${colEstado}, Taller1=${colTaller1}, Taller2=${colTaller2}`);
    
    // Contar talleres únicos encontrados
    const talleresEncontrados = new Set();
    const talleresNoMapeados = new Set();
    
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const estado = colEstado !== -1 ? row[colEstado] : row[10];
      const statusText = estado ? String(estado).trim().toLowerCase() : "";
      
      if (statusText === 'confirmado' || statusText === 'confirmada') {
        const taller1 = colTaller1 !== -1 ? row[colTaller1] : row[7];
        const taller2 = colTaller2 !== -1 ? row[colTaller2] : row[8];
        
        const cleanTaller1 = sanitizeWorkshopName(taller1);
        const cleanTaller2 = sanitizeWorkshopName(taller2);
        
        if (cleanTaller1) {
          talleresEncontrados.add(cleanTaller1);
          const key1 = findWorkshopMatch(cleanTaller1);
          if (!key1) {
            talleresNoMapeados.add(cleanTaller1);
          }
        }
        
        if (cleanTaller2) {
          talleresEncontrados.add(cleanTaller2);
          const key2 = findWorkshopMatch(cleanTaller2);
          if (!key2) {
            talleresNoMapeados.add(cleanTaller2);
          }
        }
      }
    }
    
    console.log(`\n📊 TALLERES ENCONTRADOS EN CSV (${talleresEncontrados.size}):`);
    Array.from(talleresEncontrados).sort().forEach(taller => {
      const key = findWorkshopMatch(taller);
      const status = key ? `✅ -> "${key}"` : "❌ NO MAPEADO";
      console.log(`   "${taller}" ${status}`);
    });
    
    if (talleresNoMapeados.size > 0) {
      console.log(`\n❌ TALLERES NO MAPEADOS (${talleresNoMapeados.size}):`);
      Array.from(talleresNoMapeados).sort().forEach(taller => {
        console.log(`   "${taller}"`);
      });
    }
    
    console.log(`\n📋 CLAVES EN WORKSHOP_NAMES:`);
    Object.keys(WORKSHOP_NAMES).sort().forEach(key => {
      console.log(`   "${key}"`);
    });
    
  } catch (error) {
    console.error("❌ Error diagnosticando mapeo:", error);
  }
}

// Función para probar casos problemáticos específicos
function probarCasosProblematicos() {
  try {
    console.log("🧪 Probando casos problemáticos...");
    
    const testCases = [
      // Taller 10 (GameLab)
      "10. GameLab inclusivo: del aula al juego Raquel Cuesta Santa María la Blanca",
      "10. GameLab inclusivo: del aula al juego Raquel Cuesta Santa María la Blanca (15 plazas disponibles)",
      
      // Taller 8 (Metacognición)
      "8. Metacognición. Una necesidad Elías Domínguez Seminario Menor de Ourense",
      
      // Taller 7 (Claves para cultivar tu salud)
      "7. Claves para cultivar tu salud. Tu vida está en tus manos. Elisabeth Arrojo INMOA y Centro Nacional Prevención Cáncer",
      
      // Taller 4 (AyudIA)
      "4. AyudIA! – La Inteligencia Artificial como compañera de aprendizaje Equipo de Inteligencia Artificial Santa María la Blanca"
    ];
    
    testCases.forEach(testCase => {
      console.log(`\n🔍 Probando: "${testCase}"`);
      const clean = sanitizeWorkshopName(testCase);
      console.log(`🧹 Limpio: "${clean}"`);
      const match = findWorkshopMatch(clean);
      console.log(`✅ Resultado: "${match}"`);
      
      if (match) {
        const capacidad = WORKSHOP_NAMES[match].capacity;
        console.log(`📊 Capacidad: ${capacidad}`);
      }
    });
    
    // Verificar claves específicas
    console.log(`\n📋 CLAVES ESPECÍFICAS:`);
    const keys = ['10. GameLab inclusivo: del aula al juego Raquel Cuesta Santa María la Blanca', 
                  '8. Metacognición. Una necesidad Elías Domínguez Seminario Menor de Ourense',
                  '7. Claves para cultivar tu salud. Tu vida está en tus manos. Elisabeth Arrojo INMOA y Centro Nacional Prevención Cáncer',
                  '4. AyudIA! – La Inteligencia Artificial como compañera de aprendizaje Equipo de Inteligencia Artificial Santa María la Blanca'];
    
    keys.forEach(key => {
      const existe = WORKSHOP_NAMES[key] ? '✅' : '❌';
      const capacidad = WORKSHOP_NAMES[key] ? WORKSHOP_NAMES[key].capacity : 'N/A';
      console.log(`   "${key}" ${existe} (Capacidad: ${capacidad})`);
    });
    
  } catch (error) {
    console.error("❌ Error probando casos:", error);
  }
}

// Función para verificar el conteo real de inscripciones (CORREGIDA - SIN FILTRAR POR ESTADO)
function verificarConteoReal() {
  try {
    console.log("🔍 Verificando conteo real de inscripciones...");
    
    const sheet = SpreadsheetApp.getActiveSheet();
    const data = sheet.getDataRange().getValues();
    
    if (!data || data.length < 2) {
      console.log("❌ No hay datos en la hoja");
      return;
    }
    
    // Buscar columnas por headers
    const headers = data[0];
    const colTaller1 = headers.findIndex(h => String(h).includes('¿En qué taller quiero apuntarme a las 17:30'));
    const colTaller2 = headers.findIndex(h => String(h).includes('¿En qué taller quiero apuntarme a las 18:30'));
    
    console.log(`📊 Columnas encontradas: Taller1=${colTaller1}, Taller2=${colTaller2}`);
    
    // Contador para cada taller
    const contadores = {};
    Object.keys(WORKSHOP_NAMES).forEach(key => {
      contadores[key] = 0;
    });
    
    let totalInscripciones = 0;
    let conUnTaller = 0;
    let conDosTalleres = 0;
    let noMapeados = 0;
    
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const taller1 = colTaller1 !== -1 ? row[colTaller1] : row[7];
      const taller2 = colTaller2 !== -1 ? row[colTaller2] : row[8];
      
      // Solo contar si hay al menos un taller seleccionado
      if (taller1 || taller2) {
        totalInscripciones++;
        
        const cleanTaller1 = sanitizeWorkshopName(taller1);
        const cleanTaller2 = sanitizeWorkshopName(taller2);
        
        const key1 = findWorkshopMatch(cleanTaller1);
        const key2 = findWorkshopMatch(cleanTaller2);
        
        if (key1) contadores[key1]++;
        if (key2) contadores[key2]++;
        
        if (!key1 && cleanTaller1) {
          noMapeados++;
          console.log(`⚠️ Taller 1 no mapeado - Fila ${i}: "${cleanTaller1}"`);
        }
        if (!key2 && cleanTaller2) {
          noMapeados++;
          console.log(`⚠️ Taller 2 no mapeado - Fila ${i}: "${cleanTaller2}"`);
        }
        
        if (key1 && key2) {
          conDosTalleres++;
        } else if (key1 || key2) {
          conUnTaller++;
        }
      }
    }
    
    console.log(`📊 RESUMEN:`);
    console.log(`   Total inscripciones: ${totalInscripciones}`);
    console.log(`   Con un taller: ${conUnTaller}`);
    console.log(`   Con dos talleres: ${conDosTalleres}`);
    console.log(`   No mapeados: ${noMapeados}`);
    console.log(`📊 CONTEO POR TALLER:`);
    
    Object.keys(WORKSHOP_NAMES).forEach(key => {
      const inscritos = contadores[key];
      const disponibles = WORKSHOP_NAMES[key].capacity - inscritos;
      const estado = disponibles <= 0 ? "COMPLETO" : `${disponibles} plazas`;
      console.log(`   ${WORKSHOP_NAMES[key].name}: ${inscritos}/${WORKSHOP_NAMES[key].capacity} (${estado})`);
    });
    
  } catch (error) {
    console.error("❌ Error verificando conteo:", error);
  }
}
