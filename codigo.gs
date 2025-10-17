// Configuración
const ADMIN_EMAIL = "rcuesta@p.csmb.es";
const FORM_ID = "1o4nDH2hOvwPkHGvQNrtxYgTcHQP5edL7SxqO6XyTt84";

// Mapeo completo de talleres con capacidades individuales
const WORKSHOP_NAMES = {
  // 1ª FRANJA (17:30-18:15h)
  "1. Artes Escénicas para la Inclusión: Estrategias Creativas en el Aula Instituto Artes Escénicas": { 
    name: "Artes Escénicas para la Inclusión", 
    capacity: 25 
  },
  "2. Matemáticas creativas en Educación Primaria Irene López, Cristina Bezón y Beatriz Hernández Santa María la Blanca": { 
    name: "Matemáticas creativas en Educación Primaria", 
    capacity: 20 
  },
  "3. Matemáticas competenciales en Secundaria Manuel Llorens Santa María la Blanca": { 
    name: "Matemáticas competenciales en Secundaria", 
    capacity: 22 
  },
  "4. AyudIA! – La Inteligencia Artificial como compañera de aprendizaje Equipo de Inteligencia Artificial Santa María la Blanca": { 
    name: "AyudIA! – La Inteligencia Artificial como compañera", 
    capacity: 18 
  },
  "5. Innovación social: crea, actúa y cambia el mundo Luis Miguel Olivas Fundación Iruaritz Lezama": { 
    name: "Innovación social: crea, actúa y cambia el mundo", 
    capacity: 20 
  },
  "6. Crecer sin alas prestadas Equipo de Acompañate Santa María la Blanca": { 
    name: "Crecer sin alas prestadas", 
    capacity: 15 
  },
  "7. Claves para cultivar tu salud. Tu vida está en tus manos. Elisabeth Arrojo INMOA y Centro Nacional Prevención Cáncer": { 
    name: "Claves para cultivar tu salud", 
    capacity: 20 
  },
  "8. Metacognición. Una necesidad Elías Domínguez Seminario Menor de Ourense": { 
    name: "Metacognición. Una necesidad", 
    capacity: 18 
  },
  "9. Inspira Talks: La escuela de los sentidos A) Pequeños grandes viajes sensoriales Ana Posada Santa María la Blanca B) Cuerpo que juega, mente que aprende Lorena Gómez Santa María la Blanca": { 
    name: "La escuela de los sentidos", 
    capacity: 30 
  },
  
  // 2ª FRANJA (18:30-19:15h)
  "10. GameLab inclusivo: del aula al juego Raquel Cuesta Santa María la Blanca": { 
    name: "GameLab inclusivo: del aula al juego", 
    capacity: 20 
  },
  "11. Godly Play: «Jugando con Dios» Equipo Godly Play Santa María la Blanca": { 
    name: "Godly Play: \"Jugando con Dios\"", 
    capacity: 15 
  },
  "12. Copilot Chat en el aula: cómo multiplicar el potencial docente con IA Felipe García Gaitero Universidad Europea": { 
    name: "Copilot Chat en el aula: cómo multiplicar el potencial docente", 
    capacity: 25 
  },
  "13. IA para mentes que enseñan Antonio Julio López Universidad Rey Juan Carlos": { 
    name: "IA para mentes que enseñan", 
    capacity: 20 
  },
  "14. Más allá del marcador: deporte, valores y emociones Jose Javier Illana illanactiva": { 
    name: "Más allá del marcador: deporte, valores y emociones", 
    capacity: 18 
  },
  "15. Networking y Comunicación Estratégica en la Escuela y en la Vida Lucila Ballarino ConexIA": { 
    name: "Networking y Comunicación Estratégica", 
    capacity: 22 
  },
  "16. Palabras que construyen: herramientas para transformar el conflicto en conexión con los adolescentes Ana López e Iranzu Arellano Santa María la Blanca": { 
    name: "Palabras que construyen: herramientas para transformar el conflicto", 
    capacity: 15 
  },
  "17. Inspira Talks: Humanizar la educación A) Transformación Digital e Innovación Educativa | IA Aplicada a la Educación Antonio Segura Marrero UNIR B) Desconectar para reconectar Laura Corral Iniciativa pacto de familia Montecarmelo": { 
    name: "Humanizar la educación", 
    capacity: 20 
  },
  "18. Inspira Talks: La emoción de acompañar A) Conciencia emocional: el punto de partida para educar Sara Hernández Cano Educandoatulado B) Cuidar, acompañar y educar Colegio San Ignacio de Loyola": { 
    name: "La emoción de acompañar", 
    capacity: 18 
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
    
    // Verificar que tenemos todos los datos necesarios
    if (!email || !nombre || !apellidos || !taller1 || !taller2) {
      console.error("❌ Faltan datos obligatorios");
      MailApp.sendEmail(ADMIN_EMAIL, "❌ Error: Datos incompletos", `Faltan datos obligatorios en la inscripción. Email: ${email}, Nombre: ${nombre}, Apellidos: ${apellidos}, Taller1: ${taller1}, Taller2: ${taller2}`);
      return;
    }
    
    // Verificar disponibilidad de plazas
    const availability = checkWorkshopAvailability();
    console.log("📊 Disponibilidad actual:", availability);
    
    // Verificar si se puede confirmar la inscripción
    const canConfirm = checkAvailability(taller1, taller2, availability);
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

// Función para verificar la disponibilidad de talleres (CORREGIDA)
function checkWorkshopAvailability() {
  try {
    console.log("🔍 Verificando disponibilidad de talleres...");
    
    const sheet = SpreadsheetApp.getActiveSheet();
    const data = sheet.getDataRange().getValues();
    
    // Inicializar disponibilidad con las capacidades máximas
    const availability = {};
    Object.keys(WORKSHOP_NAMES).forEach(tallerKey => {
      availability[tallerKey] = WORKSHOP_NAMES[tallerKey].capacity; // CORREGIDO: Acceder a .capacity
    });
    
    console.log("📊 Capacidades iniciales:", availability);
    
    // Contar inscripciones confirmadas
    let confirmadas = 0;
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const estado = row[10]; // Columna K (índice 10) - Estado
      
      if (estado === 'Confirmado') {
        confirmadas++;
        const taller1 = row[7]; // Columna H (índice 7) - 1ª Sesión
        const taller2 = row[8]; // Columna I (índice 8) - 2ª Sesión
        
        console.log(`📝 Fila ${i}: ${taller1}, ${taller2}, Estado: ${estado}`);
        
        // Limpiar nombres de talleres (eliminar texto de disponibilidad)
        let cleanTaller1 = taller1.replace(/\s*\((\d+\/\d+\splazas disponibles|COMPLETO|\d+\splazas disponibles)\)/g, '').trim();
        let cleanTaller2 = taller2.replace(/\s*\((\d+\/\d+\splazas disponibles|COMPLETO|\d+\splazas disponibles)\)/g, '').trim();
        
        console.log(`🧹 Talleres limpios: "${cleanTaller1}", "${cleanTaller2}"`);
        
        // Descontar plazas si los talleres están en el mapeo
        if (WORKSHOP_NAMES[cleanTaller1]) {
          availability[cleanTaller1] = Math.max(0, availability[cleanTaller1] - 1);
          console.log(`📉 Descontada 1 plaza de ${cleanTaller1}. Quedan: ${availability[cleanTaller1]}`);
        } else {
          console.log(`⚠️ Taller 1 no encontrado en mapeo: "${cleanTaller1}"`);
        }
        
        if (WORKSHOP_NAMES[cleanTaller2]) {
          availability[cleanTaller2] = Math.max(0, availability[cleanTaller2] - 1);
          console.log(`📉 Descontada 1 plaza de ${cleanTaller2}. Quedan: ${availability[cleanTaller2]}`);
        } else {
          console.log(`⚠️ Taller 2 no encontrado en mapeo: "${cleanTaller2}"`);
        }
      }
    }
    
    console.log(`📊 Total de inscripciones confirmadas: ${confirmadas}`);
    console.log("📊 Disponibilidad final calculada:", availability);
    
    return availability;
    
  } catch (error) {
    console.error("❌ Error verificando disponibilidad:", error);
    return {};
  }
}

// Verificar si hay plazas disponibles para los talleres seleccionados (CORREGIDA)
function checkAvailability(taller1, taller2, availability) {
  // Limpiar los nombres de talleres (eliminar texto de disponibilidad)
  let cleanTaller1 = taller1.replace(/\s*\((\d+\/\d+\splazas disponibles|COMPLETO|\d+\splazas disponibles)\)/g, '').trim();
  let cleanTaller2 = taller2.replace(/\s*\((\d+\/\d+\splazas disponibles|COMPLETO|\d+\splazas disponibles)\)/g, '').trim();
  
  console.log(`🧹 Taller 1 limpio: "${cleanTaller1}"`);
  console.log(`🧹 Taller 2 limpio: "${cleanTaller2}"`);
  
  // Ahora, availability[cleanTallerX] debería ser un número
  let available1 = WORKSHOP_NAMES[cleanTaller1] ? availability[cleanTaller1] : 0;
  let available2 = WORKSHOP_NAMES[cleanTaller2] ? availability[cleanTaller2] : 0;
  
  console.log(`🔍 Verificando disponibilidad: ${cleanTaller1} (${available1}), ${cleanTaller2} (${available2})`);
  return available1 > 0 && available2 > 0;
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

// --- Funciones para crear los cuerpos de los emails (CON IDENTIDAD CORPORATIVA) ---

// --- Funciones para crear los cuerpos de los emails (CON IDENTIDAD CORPORATIVA E INFORMACIÓN DE PRESENTADORES) ---

function createConfirmationEmailHTML(nombre, apellidos, meInscriboComo, taller1, taller2) {
  // Limpiar los nombres de talleres para buscar en WORKSHOP_NAMES
  let cleanTaller1 = taller1.replace(/\s*\((\d+\/\d+\splazas disponibles|COMPLETO|\d+\splazas disponibles)\)/g, '').trim();
  let cleanTaller2 = taller2.replace(/\s*\((\d+\/\d+\splazas disponibles|COMPLETO|\d+\splazas disponibles)\)/g, '').trim();

  // Obtener información detallada de los talleres
  const workshop1Info = getWorkshopDetails(cleanTaller1);
  const workshop2Info = getWorkshopDetails(cleanTaller2);

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Confirmación de Inscripción - XIV Foro de Innovación Educativa</title>
      <style>
        body { 
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
          line-height: 1.6; 
          color: #1a1a1a; 
          margin: 0; 
          padding: 0; 
          background: linear-gradient(135deg, rgba(128,24,54,0.03) 0%, rgba(106,20,48,0.03) 100%);
        }
        .container { 
          max-width: 600px; 
          margin: 20px auto; 
          padding: 0; 
          border-radius: 16px; 
          overflow: hidden;
          box-shadow: 0 8px 32px rgba(128,24,54,0.15);
          background: rgba(255,255,255,0.95);
          backdrop-filter: blur(15px);
        }
        .header { 
          background: linear-gradient(135deg, #801836 0%, #6a1430 100%); 
          color: white; 
          padding: 30px 20px; 
          text-align: center; 
          position: relative;
          overflow: hidden;
        }
        .header::before {
          content: '';
          position: absolute;
          top: -50px;
          right: -50px;
          width: 100px;
          height: 100px;
          background: rgba(255,255,255,0.1);
          border-radius: 50%;
          transform: rotate(45deg);
        }
        .header h2 {
          margin: 0;
          font-size: 1.4rem;
          font-weight: 800;
          position: relative;
          z-index: 2;
        }
        .content { 
          padding: 30px; 
          background: rgba(255,255,255,0.9);
        }
        .footer { 
          text-align: center; 
          font-size: 0.8rem; 
          color: #666666; 
          margin-top: 20px; 
          padding: 20px;
          background: rgba(247,245,246,0.8);
          border-top: 1px solid rgba(128,24,54,0.1);
        }
        .workshop-list { 
          list-style-type: none; 
          padding: 0; 
          margin: 20px 0;
        }
        .workshop-item { 
          background: rgba(128,24,54,0.05); 
          margin-bottom: 16px; 
          padding: 20px; 
          border-left: 4px solid #801836; 
          border-radius: 8px;
          transition: all 0.3s ease;
        }
        .workshop-item:hover {
          background: rgba(128,24,54,0.08);
          transform: translateX(5px);
        }
        .workshop-title {
          font-weight: 700;
          color: #801836;
          font-size: 1rem;
          margin-bottom: 8px;
        }
        .workshop-presenter {
          color: #666666;
          font-size: 0.9rem;
          margin-bottom: 4px;
        }
        .workshop-institution {
          color: #801836;
          font-size: 0.85rem;
          font-weight: 600;
          font-style: italic;
        }
        .highlight {
          color: #801836;
          font-weight: 700;
        }
        .badge {
          display: inline-block;
          background: linear-gradient(135deg, #801836 0%, #6a1430 100%);
          color: white;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
          margin: 5px 0;
        }
        .logo-section {
          text-align: center;
          margin: 20px 0;
          padding: 20px;
          background: rgba(128,24,54,0.05);
          border-radius: 12px;
        }
        .logo-text {
          color: #801836;
          font-weight: 800;
          font-size: 1.1rem;
          margin: 0;
        }
        .subtitle {
          color: #666666;
          font-size: 0.9rem;
          margin: 5px 0 0 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>✓ CONFIRMACIÓN DE INSCRIPCIÓN</h2>
        </div>
        <div class="content">
          <p>Estimado/a <strong class="highlight">${nombre} ${apellidos}</strong>,</p>
          
          <div class="logo-section">
            <p class="logo-text">XIV Foro de Innovación Educativa</p>
            <p class="subtitle">HUMANIA · Desafío educativo</p>
          </div>
          
          <p>¡Tu inscripción ha sido <strong class="highlight">confirmada con éxito</strong>!</p>
          
          <div class="badge">Te inscribes como: ${meInscriboComo}</div>
          
          <p><strong>Tus talleres seleccionados:</strong></p>
          <ul class="workshop-list">
            <li class="workshop-item">
              <div class="workshop-title">1ª Sesión (17:30-18:15h)</div>
              <div class="workshop-title">${workshop1Info.title}</div>
              <div class="workshop-presenter">👤 ${workshop1Info.presenter}</div>
              <div class="workshop-institution">🏢 ${workshop1Info.institution}</div>
            </li>
            <li class="workshop-item">
              <div class="workshop-title">2ª Sesión (18:30-19:15h)</div>
              <div class="workshop-title">${workshop2Info.title}</div>
              <div class="workshop-presenter">👤 ${workshop2Info.presenter}</div>
              <div class="workshop-institution">🏢 ${workshop2Info.institution}</div>
            </li>
          </ul>
          
          <p style="background: rgba(255,215,0,0.1); padding: 15px; border-radius: 8px; border-left: 4px solid #ffd700;">
            <strong>📅 Fecha:</strong> 5 de noviembre de 2025<br>
            <strong>🕔 Horario:</strong> 17:00-20:00h<br>
            <strong>📍 Lugar:</strong> Santa María la Blanca, Madrid
          </p>
          
          <p>¡Esperamos verte en este encuentro de innovación educativa!</p>
          
          <p>Atentamente,<br>
          <strong>El equipo del XIV Foro de Innovación Educativa</strong><br>
          <em>Colegio Santa María la Blanca</em></p>
        </div>
        <div class="footer">
          <p>Este es un mensaje automático. Por favor, no respondas a este correo.</p>
          <p style="margin-top: 10px; font-size: 0.75rem; opacity: 0.8;">
            Departamento de Innovación Educativa · Santa María la Blanca
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function createWaitlistEmailHTML(nombre, apellidos, meInscriboComo, taller1, taller2) {
  // Limpiar los nombres de talleres para buscar en WORKSHOP_NAMES
  let cleanTaller1 = taller1.replace(/\s*\((\d+\/\d+\splazas disponibles|COMPLETO|\d+\splazas disponibles)\)/g, '').trim();
  let cleanTaller2 = taller2.replace(/\s*\((\d+\/\d+\splazas disponibles|COMPLETO|\d+\splazas disponibles)\)/g, '').trim();

  // Obtener información detallada de los talleres
  const workshop1Info = getWorkshopDetails(cleanTaller1);
  const workshop2Info = getWorkshopDetails(cleanTaller2);

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Lista de Espera - XIV Foro de Innovación Educativa</title>
      <style>
        body { 
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
          line-height: 1.6; 
          color: #1a1a1a; 
          margin: 0; 
          padding: 0; 
          background: linear-gradient(135deg, rgba(255,193,7,0.03) 0%, rgba(255,152,0,0.03) 100%);
        }
        .container { 
          max-width: 600px; 
          margin: 20px auto; 
          padding: 0; 
          border-radius: 16px; 
          overflow: hidden;
          box-shadow: 0 8px 32px rgba(255,193,7,0.15);
          background: rgba(255,255,255,0.95);
          backdrop-filter: blur(15px);
        }
        .header { 
          background: linear-gradient(135deg, #ffd700 0%, #ffb300 100%); 
          color: #801836; 
          padding: 30px 20px; 
          text-align: center; 
          position: relative;
          overflow: hidden;
        }
        .header::before {
          content: '';
          position: absolute;
          top: -50px;
          right: -50px;
          width: 100px;
          height: 100px;
          background: rgba(128,24,54,0.1);
          border-radius: 50%;
          transform: rotate(45deg);
        }
        .header h2 {
          margin: 0;
          font-size: 1.4rem;
          font-weight: 800;
          position: relative;
          z-index: 2;
        }
        .content { 
          padding: 30px; 
          background: rgba(255,255,255,0.9);
        }
        .footer { 
          text-align: center; 
          font-size: 0.8rem; 
          color: #666666; 
          margin-top: 20px; 
          padding: 20px;
          background: rgba(255,243,205,0.8);
          border-top: 1px solid rgba(255,193,7,0.2);
        }
        .workshop-list { 
          list-style-type: none; 
          padding: 0; 
          margin: 20px 0;
        }
        .workshop-item { 
          background: rgba(255,193,7,0.1); 
          margin-bottom: 16px; 
          padding: 20px; 
          border-left: 4px solid #ffd700; 
          border-radius: 8px;
          transition: all 0.3s ease;
        }
        .workshop-item:hover {
          background: rgba(255,193,7,0.15);
          transform: translateX(5px);
        }
        .workshop-title {
          font-weight: 700;
          color: #801836;
          font-size: 1rem;
          margin-bottom: 8px;
        }
        .workshop-presenter {
          color: #666666;
          font-size: 0.9rem;
          margin-bottom: 4px;
        }
        .workshop-institution {
          color: #801836;
          font-size: 0.85rem;
          font-weight: 600;
          font-style: italic;
        }
        .highlight {
          color: #801836;
          font-weight: 700;
        }
        .badge {
          display: inline-block;
          background: linear-gradient(135deg, #ffd700 0%, #ffb300 100%);
          color: #801836;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
          margin: 5px 0;
        }
        .logo-section {
          text-align: center;
          margin: 20px 0;
          padding: 20px;
          background: rgba(255,193,7,0.1);
          border-radius: 12px;
        }
        .logo-text {
          color: #801836;
          font-weight: 800;
          font-size: 1.1rem;
          margin: 0;
        }
        .subtitle {
          color: #666666;
          font-size: 0.9rem;
          margin: 5px 0 0 0;
        }
        .waitlist-notice {
          background: rgba(255,193,7,0.1);
          padding: 20px;
          border-radius: 12px;
          border-left: 4px solid #ffd700;
          margin: 20px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>⏳ LISTA DE ESPERA</h2>
        </div>
        <div class="content">
          <p>Estimado/a <strong class="highlight">${nombre} ${apellidos}</strong>,</p>
          
          <div class="logo-section">
            <p class="logo-text">XIV Foro de Innovación Educativa</p>
            <p class="subtitle">HUMANIA · Desafío educativo</p>
          </div>
          
          <div class="waitlist-notice">
            <p><strong>Hemos recibido tu inscripción</strong>, pero actualmente los talleres que has seleccionado están completos.</p>
            <p>Te hemos añadido a nuestra <strong>lista de espera</strong> y te notificaremos inmediatamente si se libera alguna plaza.</p>
          </div>
          
          <div class="badge">Te inscribes como: ${meInscriboComo}</div>
          
          <p><strong>Tus talleres seleccionados:</strong></p>
          <ul class="workshop-list">
            <li class="workshop-item">
              <div class="workshop-title">1ª Sesión (17:30-18:15h)</div>
              <div class="workshop-title">${workshop1Info.title}</div>
              <div class="workshop-presenter">👤 ${workshop1Info.presenter}</div>
              <div class="workshop-institution">🏢 ${workshop1Info.institution}</div>
            </li>
            <li class="workshop-item">
              <div class="workshop-title">2ª Sesión (18:30-19:15h)</div>
              <div class="workshop-title">${workshop2Info.title}</div>
              <div class="workshop-presenter">👤 ${workshop2Info.presenter}</div>
              <div class="workshop-institution">🏢 ${workshop2Info.institution}</div>
            </li>
          </ul>
          
          <p style="background: rgba(128,24,54,0.05); padding: 15px; border-radius: 8px; border-left: 4px solid #801836;">
            <strong>📅 Fecha:</strong> 5 de noviembre de 2025<br>
            <strong>🕔 Horario:</strong> 17:00-20:00h<br>
            <strong>📍 Lugar:</strong> Santa María la Blanca, Madrid
          </p>
          
          <p>¡Gracias por tu interés en la innovación educativa!</p>
          
          <p>Atentamente,<br>
          <strong>El equipo del XIV Foro de Innovación Educativa</strong><br>
          <em>Colegio Santa María la Blanca</em></p>
        </div>
        <div class="footer">
          <p>Este es un mensaje automático. Por favor, no respondas a este correo.</p>
          <p style="margin-top: 10px; font-size: 0.75rem; opacity: 0.8;">
            Departamento de Innovación Educativa · Santa María la Blanca
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function createAdminNotificationEmailHTML(nombre, apellidos, meInscriboComo, taller1, taller2, status, email) {
  const availability = checkWorkshopAvailability();
  let availabilityDetails = '';
  Object.keys(WORKSHOP_NAMES).forEach(workshopKey => {
    const totalCapacity = WORKSHOP_NAMES[workshopKey].capacity;
    const remaining = availability[workshopKey] !== undefined ? availability[workshopKey] : totalCapacity;
    const occupied = totalCapacity - remaining;
    const percentage = Math.round((occupied / totalCapacity) * 100);
    
    let statusColor = '#801836';
    let statusText = 'Disponible';
    if (remaining === 0) {
      statusColor = '#dc3545';
      statusText = 'COMPLETO';
    } else if (remaining <= totalCapacity * 0.2) {
      statusColor = '#ffd700';
      statusText = 'Pocas plazas';
    }
    
    availabilityDetails += `
      <li style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid rgba(128,24,54,0.1);">
        <span><strong>${WORKSHOP_NAMES[workshopKey].name}</strong></span>
        <span style="color: ${statusColor}; font-weight: 600;">${remaining}/${totalCapacity} (${percentage}%)</span>
      </li>`;
  });

  // Limpiar los nombres de talleres para buscar en WORKSHOP_NAMES
  let cleanTaller1 = taller1.replace(/\s*\((\d+\/\d+\splazas disponibles|COMPLETO|\d+\splazas disponibles)\)/g, '').trim();
  let cleanTaller2 = taller2.replace(/\s*\((\d+\/\d+\splazas disponibles|COMPLETO|\d+\splazas disponibles)\)/g, '').trim();

  // Obtener información detallada de los talleres
  const workshop1Info = getWorkshopDetails(cleanTaller1);
  const workshop2Info = getWorkshopDetails(cleanTaller2);

  const headerColor = status === 'Confirmado' ? 'linear-gradient(135deg, #801836 0%, #6a1430 100%)' : 'linear-gradient(135deg, #ffd700 0%, #ffb300 100%)';
  const textColor = status === 'Confirmado' ? 'white' : '#801836';
  const accentColor = status === 'Confirmado' ? '#801836' : '#ffd700';

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Notificación Administrador - XIV Foro de Innovación Educativa</title>
      <style>
        body { 
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
          line-height: 1.6; 
          color: #1a1a1a; 
          margin: 0; 
          padding: 0; 
          background: linear-gradient(135deg, rgba(128,24,54,0.03) 0%, rgba(106,20,48,0.03) 100%);
        }
        .container { 
          max-width: 700px; 
          margin: 20px auto; 
          padding: 0; 
          border-radius: 16px; 
          overflow: hidden;
          box-shadow: 0 8px 32px rgba(128,24,54,0.15);
          background: rgba(255,255,255,0.95);
          backdrop-filter: blur(15px);
        }
        .header { 
          background: ${headerColor}; 
          color: ${textColor}; 
          padding: 30px 20px; 
          text-align: center; 
          position: relative;
          overflow: hidden;
        }
        .header::before {
          content: '';
          position: absolute;
          top: -50px;
          right: -50px;
          width: 100px;
          height: 100px;
          background: rgba(255,255,255,0.1);
          border-radius: 50%;
          transform: rotate(45deg);
        }
        .header h2 {
          margin: 0;
          font-size: 1.4rem;
          font-weight: 800;
          position: relative;
          z-index: 2;
        }
        .content { 
          padding: 30px; 
          background: rgba(255,255,255,0.9);
        }
        .footer { 
          text-align: center; 
          font-size: 0.8rem; 
          color: #666666; 
          margin-top: 20px; 
          padding: 20px;
          background: rgba(247,245,246,0.8);
          border-top: 1px solid rgba(128,24,54,0.1);
        }
        .workshop-list { 
          list-style-type: none; 
          padding: 0; 
          margin: 20px 0;
        }
        .workshop-item { 
          background: rgba(128,24,54,0.05); 
          margin-bottom: 16px; 
          padding: 20px; 
          border-left: 4px solid ${accentColor}; 
          border-radius: 8px;
        }
        .workshop-title {
          font-weight: 700;
          color: #801836;
          font-size: 1rem;
          margin-bottom: 8px;
        }
        .workshop-presenter {
          color: #666666;
          font-size: 0.9rem;
          margin-bottom: 4px;
        }
        .workshop-institution {
          color: #801836;
          font-size: 0.85rem;
          font-weight: 600;
          font-style: italic;
        }
        .availability-list { 
          list-style-type: none; 
          padding: 0; 
          border-top: 2px solid rgba(128,24,54,0.1); 
          margin-top: 30px; 
          padding-top: 20px;
          background: rgba(128,24,54,0.02);
          border-radius: 8px;
          padding: 20px;
        }
        .availability-list li { 
          margin-bottom: 8px; 
        }
        .highlight {
          color: #801836;
          font-weight: 700;
        }
        .status-badge {
          display: inline-block;
          background: ${accentColor};
          color: ${status === 'Confirmado' ? 'white' : '#801836'};
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
          margin: 5px 0;
        }
        .admin-info {
          background: rgba(128,24,54,0.05);
          padding: 20px;
          border-radius: 12px;
          border-left: 4px solid #801836;
          margin: 20px 0;
        }
        .summary-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 15px;
          margin: 20px 0;
        }
        .stat-card {
          background: rgba(128,24,54,0.05);
          padding: 15px;
          border-radius: 8px;
          text-align: center;
          border-left: 4px solid #801836;
        }
        .stat-number {
          font-size: 1.5rem;
          font-weight: 800;
          color: #801836;
          display: block;
        }
        .stat-label {
          font-size: 0.8rem;
          color: #666666;
          margin-top: 5px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>${status === 'Confirmado' ? '✓ NUEVA INSCRIPCIÓN CONFIRMADA' : '⏳ NUEVA INSCRIPCIÓN EN LISTA DE ESPERA'}</h2>
        </div>
        <div class="content">
          <div class="admin-info">
            <h3 style="margin-top: 0; color: #801836;">📋 Datos del participante</h3>
            <ul style="list-style: none; padding: 0;">
              <li><strong>Nombre:</strong> ${nombre} ${apellidos}</li>
              <li><strong>Email:</strong> ${email}</li>
              <li><strong>Se inscribe como:</strong> ${meInscriboComo}</li>
              <li><strong>Estado:</strong> <span class="status-badge">${status}</span></li>
            </ul>
          </div>
          
          <p><strong>Talleres seleccionados:</strong></p>
          <ul class="workshop-list">
            <li class="workshop-item">
              <div class="workshop-title">1ª Sesión (17:30-18:15h)</div>
              <div class="workshop-title">${workshop1Info.title}</div>
              <div class="workshop-presenter">👤 ${workshop1Info.presenter}</div>
              <div class="workshop-institution">🏢 ${workshop1Info.institution}</div>
            </li>
            <li class="workshop-item">
              <div class="workshop-title">2ª Sesión (18:30-19:15h)</div>
              <div class="workshop-title">${workshop2Info.title}</div>
              <div class="workshop-presenter">👤 ${workshop2Info.presenter}</div>
              <div class="workshop-institution">🏢 ${workshop2Info.institution}</div>
            </li>
          </ul>
          
          <h3 style="color: #801836; border-bottom: 2px solid #801836; padding-bottom: 10px;">📊 RESUMEN DE PLAZAS ACTUAL</h3>
          <ul class="availability-list">
            ${availabilityDetails}
          </ul>
          
          <div class="summary-stats">
            <div class="stat-card">
              <span class="stat-number">${Object.keys(WORKSHOP_NAMES).length}</span>
              <div class="stat-label">Total Talleres</div>
            </div>
            <div class="stat-card">
              <span class="stat-number">${Object.values(availability).reduce((sum, val) => sum + val, 0)}</span>
              <div class="stat-label">Plazas Disponibles</div>
            </div>
            <div class="stat-card">
              <span class="stat-number">${Object.values(WORKSHOP_NAMES).reduce((sum, val) => sum + val.capacity, 0) - Object.values(availability).reduce((sum, val) => sum + val, 0)}</span>
              <div class="stat-label">Plazas Ocupadas</div>
            </div>
          </div>
        </div>
        <div class="footer">
          <p>Notificación automática del sistema de inscripciones</p>
          <p style="margin-top: 10px; font-size: 0.75rem; opacity: 0.8;">
            Departamento de Innovación Educativa · Santa María la Blanca
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Función auxiliar para obtener detalles de los talleres
function getWorkshopDetails(workshopName) {
  // Mapeo completo de talleres con información detallada extraída de talleres.html
  const workshopDetails = {
    "1. Artes Escénicas para la Inclusión: Estrategias Creativas en el Aula Instituto Artes Escénicas": {
      title: "Artes Escénicas para la Inclusión: Estrategias Creativas en el Aula",
      presenter: "Instituto Artes Escénicas",
      institution: "Instituto Artes Escénicas"
    },
    "2. Matemáticas creativas en Educación Primaria Irene López, Cristina Bezón y Beatriz Hernández Santa María la Blanca": {
      title: "Matemáticas creativas en Educación Primaria",
      presenter: "Irene López, Cristina Bezón y Beatriz Hernández",
      institution: "Santa María la Blanca"
    },
    "3. Matemáticas competenciales en Secundaria Manuel Llorens Santa María la Blanca": {
      title: "Matemáticas competenciales en Secundaria",
      presenter: "Manuel Llorens",
      institution: "Santa María la Blanca"
    },
    "4. AyudIA! – La Inteligencia Artificial como compañera de aprendizaje Equipo de Inteligencia Artificial Santa María la Blanca": {
      title: "AyudIA! – La Inteligencia Artificial como compañera de aprendizaje",
      presenter: "Equipo de Inteligencia Artificial",
      institution: "Santa María la Blanca"
    },
    "5. Innovación social: crea, actúa y cambia el mundo Luis Miguel Olivas Fundación Iruaritz Lezama": {
      title: "Innovación social: crea, actúa y cambia el mundo",
      presenter: "Luis Miguel Olivas",
      institution: "Fundación Iruaritz Lezama"
    },
    "6. Crecer sin alas prestadas Equipo de Acompañate Santa María la Blanca": {
      title: "Crecer sin alas prestadas",
      presenter: "Equipo de Acompañate",
      institution: "Santa María la Blanca"
    },
    "7. Claves para cultivar tu salud. Tu vida está en tus manos. Elisabeth Arrojo INMOA y Centro Nacional Prevención Cáncer": {
      title: "Claves para cultivar tu salud. Tu vida está en tus manos.",
      presenter: "Elisabeth Arrojo",
      institution: "INMOA y Centro Nacional Prevención Cáncer"
    },
    "8. Metacognición. Una necesidad Elías Domínguez Seminario Menor de Ourense": {
      title: "Metacognición. Una necesidad",
      presenter: "Elías Domínguez",
      institution: "Seminario Menor de Ourense"
    },
    "9. Inspira Talks: La escuela de los sentidos A) Pequeños grandes viajes sensoriales Ana Posada Santa María la Blanca B) Cuerpo que juega, mente que aprende Lorena Gómez Santa María la Blanca": {
      title: "Inspira Talks: La escuela de los sentidos",
      presenter: "Ana Posada y Lorena Gómez",
      institution: "Santa María la Blanca"
    },
    "10. GameLab inclusivo: del aula al juego Raquel Cuesta Santa María la Blanca": {
      title: "GameLab inclusivo: del aula al juego",
      presenter: "Raquel Cuesta",
      institution: "Santa María la Blanca"
    },
    "11. Godly Play: «Jugando con Dios» Equipo Godly Play Santa María la Blanca": {
      title: "Godly Play: «Jugando con Dios»",
      presenter: "Equipo Godly Play",
      institution: "Santa María la Blanca"
    },
    "12. Copilot Chat en el aula: cómo multiplicar el potencial docente con IA Felipe García Gaitero Universidad Europea": {
      title: "Copilot Chat en el aula: cómo multiplicar el potencial docente con IA",
      presenter: "Felipe García Gaitero",
      institution: "Universidad Europea"
    },
    "13. IA para mentes que enseñan Antonio Julio López Universidad Rey Juan Carlos": {
      title: "IA para mentes que enseñan",
      presenter: "Antonio Julio López",
      institution: "Universidad Rey Juan Carlos"
    },
    "14. Más allá del marcador: deporte, valores y emociones Jose Javier Illana illanactiva": {
      title: "Más allá del marcador: deporte, valores y emociones",
      presenter: "Jose Javier Illana",
      institution: "illanactiva"
    },
    "15. Networking y Comunicación Estratégica en la Escuela y en la Vida Lucila Ballarino ConexIA": {
      title: "Networking y Comunicación Estratégica en la Escuela y en la Vida",
      presenter: "Lucila Ballarino",
      institution: "ConexIA"
    },
    "16. Palabras que construyen: herramientas para transformar el conflicto en conexión con los adolescentes Ana López e Iranzu Arellano Santa María la Blanca": {
      title: "Palabras que construyen: herramientas para transformar el conflicto en conexión con los adolescentes",
      presenter: "Ana López e Iranzu Arellano",
      institution: "Santa María la Blanca"
    },
    "17. Inspira Talks: Humanizar la educación A) Transformación Digital e Innovación Educativa | IA Aplicada a la Educación Antonio Segura Marrero UNIR B) Desconectar para reconectar Laura Corral Iniciativa pacto de familia Montecarmelo": {
      title: "Inspira Talks: Humanizar la educación",
      presenter: "Antonio Segura Marrero y Laura Corral",
      institution: "UNIR e Iniciativa pacto de familia Montecarmelo"
    },
    "18. Inspira Talks: La emoción de acompañar A) Conciencia emocional: el punto de partida para educar Sara Hernández Cano Educandoatulado B) Cuidar, acompañar y educar Colegio San Ignacio de Loyola": {
      title: "Inspira Talks: La emoción de acompañar",
      presenter: "Sara Hernández Cano y Colegio San Ignacio de Loyola",
      institution: "Educandoatulado y Colegio San Ignacio de Loyola"
    }
  };

  // Buscar el taller por nombre exacto o parcial
  for (const [key, details] of Object.entries(workshopDetails)) {
    if (key.includes(workshopName) || workshopName.includes(key.split(':')[0])) {
      return details;
    }
  }

  // Si no se encuentra, devolver información básica
  return {
    title: workshopName,
    presenter: "Información no disponible",
    institution: "Información no disponible"
  };
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
    "Juan", // Nombre
    "Pérez", // Apellidos
    "test@example.com", // Email
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