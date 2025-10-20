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
    capacity: 25 
  },
  "3. Matemáticas competenciales en Secundaria Manuel Llorens Santa María la Blanca": { 
    name: "Matemáticas competenciales en Secundaria", 
    capacity: 25 
  },
  "4. AyudIA! – La Inteligencia Artificial como compañera de aprendizaje Equipo de Inteligencia Artificial Santa María la Blanca": { 
    name: "AyudIA! – La Inteligencia Artificial como compañera", 
    capacity: 25 
  },
  "5. Innovación social: crea, actúa y cambia el mundo Luis Miguel Olivas Fundación Iruaritz Lezama": { 
    name: "Innovación social: crea, actúa y cambia el mundo", 
    capacity: 25 
  },
  "6. Crecer sin alas prestadas Equipo de Acompañate Santa María la Blanca": { 
    name: "Crecer sin alas prestadas", 
    capacity: 25 
  },
  "7. Claves para cultivar tu salud. Tu vida está en tus manos. Elisabeth Arrojo INMOA y Centro Nacional Prevención Cáncer": { 
    name: "Claves para cultivar tu salud", 
    capacity: 25 
  },
  "8. Metacognición. Una necesidad Elías Domínguez Seminario Menor de Ourense": { 
    name: "Metacognición. Una necesidad", 
    capacity: 25 
  },
  "9. Inspira Talks: La escuela de los sentidos A) Pequeños grandes viajes sensoriales Ana Posada Santa María la Blanca B) Cuerpo que juega, mente que aprende Lorena Gómez Santa María la Blanca": { 
    name: "La escuela de los sentidos", 
    capacity: 25 
  },
  
  // 2ª FRANJA (18:30-19:15h)
  "10. GameLab inclusivo: del aula al juego Raquel Cuesta Santa María la Blanca": { 
    name: "GameLab inclusivo: del aula al juego", 
    capacity: 25 
  },
  "11. Godly Play: «Jugando con Dios» Equipo Godly Play Santa María la Blanca": { 
    name: "Godly Play: \"Jugando con Dios\"", 
    capacity: 25 
  },
  "12. Copilot Chat en el aula: cómo multiplicar el potencial docente con IA Felipe García Gaitero Universidad Europea": { 
    name: "Copilot Chat en el aula: cómo multiplicar el potencial docente", 
    capacity: 25 
  },
  "13. IA para mentes que enseñan Antonio Julio López Universidad Rey Juan Carlos": { 
    name: "IA para mentes que enseñan", 
    capacity: 25 
  },
  "14. Más allá del marcador: deporte, valores y emociones Jose Javier Illana illanactiva": { 
    name: "Más allá del marcador: deporte, valores y emociones", 
    capacity: 25 
  },
  "15. Networking y Comunicación Estratégica en la Escuela y en la Vida Lucila Ballarino ConexIA": { 
    name: "Networking y Comunicación Estratégica", 
    capacity: 25 
  },
  "16. Palabras que construyen: herramientas para transformar el conflicto en conexión con los adolescentes Ana López e Iranzu Arellano Santa María la Blanca": { 
    name: "Palabras que construyen: herramientas para transformar el conflicto", 
    capacity: 25 
  },
  "17. Inspira Talks: Humanizar la educación A) Transformación Digital e Innovación Educativa | IA Aplicada a la Educación Antonio Segura Marrero UNIR B) Desconectar para reconectar Laura Corral Iniciativa pacto de familia Montecarmelo": { 
    name: "Humanizar la educación", 
    capacity: 25 
  },
  "18. Inspira Talks: La emoción de acompañar A) Conciencia emocional: el punto de partida para educar Sara Hernández Cano Educandoatulado B) Cuidar, acompañar y educar Colegio San Ignacio de Loyola": { 
    name: "La emoción de acompañar", 
    capacity: 25 
  }
};

const NO_SELECTION = "No seleccionado";
const STATUS_CONFIRMED = "Confirmado";
const STATUS_WAITLIST = "Lista de Espera";
const SHEET_NAME = "Respuestas de formulario 1";
const STATUS_HEADER = "Estado";
const TIMESTAMP_HEADER = "Fecha de inscripción";
const CONSENT_HEADER_PREFIX = "Consentimiento";
const WORKSHOP_QUESTION_1_ID = "17:30";
const WORKSHOP_QUESTION_2_ID = "18:30";
const DEFAULT_CAPACITY = 25;

let WORKSHOP_LOOKUP_CACHE = null;

function cleanWorkshopText(text) {
  if (!text) {
    return "";
  }
  return text
    .toString()
    .replace(/^[✅❌]\s*/, "")
    .replace(/\s*\([^)]*\)/g, "")
    .replace(/\s*-\s*[^.:]*[.:]/g, " ")
    .replace(/\s*\.\s*$/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeString(value) {
  if (!value) {
    return "";
  }
  return value
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/["“”«»]/g, '"')
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function getWorkshopLookup() {
  if (WORKSHOP_LOOKUP_CACHE) {
    return WORKSHOP_LOOKUP_CACHE;
  }

  const map = {};
  const entries = [];

  Object.keys(WORKSHOP_NAMES).forEach(key => {
    const info = WORKSHOP_NAMES[key];
    const variations = new Set();

    variations.add(key);
    variations.add(cleanWorkshopText(key));

    if (info && info.name) {
      variations.add(info.name);
      variations.add(cleanWorkshopText(info.name));
    }

    const numberMatch = key.match(/^(\d+)\.\s*(.+)$/);
    if (numberMatch) {
      const number = numberMatch[1];
      const rest = numberMatch[2];

      variations.add(`${number}. ${rest}`);
      variations.add(rest);
      variations.add(cleanWorkshopText(rest));

      if (info && info.name) {
        variations.add(`${number}. ${info.name}`);
        variations.add(`${number}. ${cleanWorkshopText(info.name)}`);
      }
    }

    variations.forEach(variation => {
      const normalized = normalizeString(variation);
      if (normalized) {
        map[normalized] = key;
      }
    });
  });

  Object.keys(map).forEach(normalized => {
    entries.push({ normalized, key: map[normalized] });
  });

  WORKSHOP_LOOKUP_CACHE = { map, entries };
  return WORKSHOP_LOOKUP_CACHE;
}

function resolveWorkshopKey(rawText) {
  if (!isWorkshopSelected(rawText)) {
    return null;
  }

  const cleanText = cleanWorkshopText(rawText);
  const normalized = normalizeString(cleanText);
  if (!normalized) {
    return null;
  }

  const lookup = getWorkshopLookup();
  if (lookup.map[normalized]) {
    return lookup.map[normalized];
  }

  for (let i = 0; i < lookup.entries.length; i++) {
    const entry = lookup.entries[i];
    if (entry.normalized.includes(normalized) || normalized.includes(entry.normalized)) {
      return entry.key;
    }
  }

  console.log(`⚠️ Taller no encontrado en el mapeo: "${rawText}" -> "${cleanText}"`);
  return null;
}

function getWorkshopAvailabilityInfo(rawText, availability) {
  if (!isWorkshopSelected(rawText)) {
    return {
      key: null,
      capacity: DEFAULT_CAPACITY,
      remaining: Number.POSITIVE_INFINITY,
      matched: false
    };
  }

  const workshopKey = resolveWorkshopKey(rawText);
  if (!workshopKey) {
    return {
      key: null,
      capacity: DEFAULT_CAPACITY,
      remaining: Number.POSITIVE_INFINITY,
      matched: false
    };
  }

  const capacity = WORKSHOP_NAMES[workshopKey] ? WORKSHOP_NAMES[workshopKey].capacity : DEFAULT_CAPACITY;
  const remaining = (availability && typeof availability[workshopKey] === "number")
    ? availability[workshopKey]
    : capacity;

  return {
    key: workshopKey,
    capacity,
    remaining,
    matched: true
  };
}

function isWorkshopSelected(value) {
  if (!value) {
    return false;
  }
  const trimmed = value.toString().trim();
  return trimmed !== "" && trimmed !== NO_SELECTION;
}

function getResponseSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getSheetByName(SHEET_NAME);
  if (!sheet) {
    throw new Error(`No se pudo encontrar la hoja de respuestas "${SHEET_NAME}".`);
  }
  return sheet;
}

function ensureAdminColumns(sheet) {
  const headerRange = sheet.getRange(1, 1, 1, sheet.getLastColumn());
  const headers = headerRange.getValues()[0];
  const lastRow = sheet.getLastRow();

  const consentIndex = headers.findIndex(title => typeof title === "string" && title.trim().startsWith(CONSENT_HEADER_PREFIX));

  let statusIndex = headers.findIndex(title => typeof title === "string" && title.trim().toLowerCase() === STATUS_HEADER.toLowerCase());
  if (statusIndex === -1) {
    const previousLastColumn = sheet.getLastColumn();
    sheet.insertColumnAfter(previousLastColumn);
    const statusColumnPosition = previousLastColumn + 1;
    sheet.getRange(1, statusColumnPosition).setValue(STATUS_HEADER);
    statusIndex = statusColumnPosition - 1; // zero-based

    if (consentIndex !== -1 && lastRow > 1) {
      const consentRange = sheet.getRange(2, consentIndex + 1, lastRow - 1, 1);
      const consentValues = consentRange.getValues();
      const statusValues = consentValues.map(([value]) => {
        const trimmed = value ? value.toString().trim() : "";
        if (trimmed === STATUS_CONFIRMED || trimmed === STATUS_WAITLIST) {
          return [trimmed];
        }
        return [""];
      });
      if (statusValues.length) {
        sheet.getRange(2, statusColumnPosition, statusValues.length, 1).setValues(statusValues);
      }
    }
  }

  const refreshedHeadersAfterStatus = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  let timestampIndex = refreshedHeadersAfterStatus.findIndex(title => typeof title === "string" && title.trim().toLowerCase() === TIMESTAMP_HEADER.toLowerCase());
  if (timestampIndex === -1) {
    const placeholderIndex = refreshedHeadersAfterStatus.findIndex(title => typeof title === "string" && title.trim().toLowerCase() === "columna 1");
    if (placeholderIndex !== -1) {
      sheet.getRange(1, placeholderIndex + 1).setValue(TIMESTAMP_HEADER);
    } else {
      const previousLastColumn = sheet.getLastColumn();
      sheet.insertColumnAfter(previousLastColumn);
      sheet.getRange(1, previousLastColumn + 1).setValue(TIMESTAMP_HEADER);
    }
  }
}

function getSheetColumnConfig(sheet) {
  ensureAdminColumns(sheet);

  const headerRow = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const findIndex = predicate => headerRow.findIndex(title => predicate(title ? title.toString() : ""));

  const workshop1Column = findIndex(title => title.includes(WORKSHOP_QUESTION_1_ID));
  const workshop2Column = findIndex(title => title.includes(WORKSHOP_QUESTION_2_ID));

  if (workshop1Column === -1 || workshop2Column === -1) {
    throw new Error("No se encontraron las columnas de talleres en la hoja de respuestas.");
  }

  const statusColumn = findIndex(title => title.trim().toLowerCase() === STATUS_HEADER.toLowerCase());
  const timestampColumn = findIndex(title => title.trim().toLowerCase() === TIMESTAMP_HEADER.toLowerCase());
  const consentColumn = findIndex(title => title.trim().startsWith(CONSENT_HEADER_PREFIX));
  const emailColumn = findIndex(title => title.trim().toLowerCase() === "email");
  const nameColumn = findIndex(title => title.trim().toLowerCase() === "nombre");
  const surnameColumn = findIndex(title => title.trim().toLowerCase() === "apellidos");
  const roleColumn = findIndex(title => title.trim().toLowerCase() === "me inscribo como");

  return {
    headerRow,
    workshop1Column,
    workshop2Column,
    statusColumn,
    timestampColumn,
    consentColumn,
    emailColumn,
    nameColumn,
    surnameColumn,
    roleColumn
  };
}

function getRowStatus(row, columnConfig) {
  if (columnConfig.statusColumn > -1) {
    const statusValue = row[columnConfig.statusColumn] ? row[columnConfig.statusColumn].toString().trim() : "";
    if (statusValue) {
      return statusValue;
    }
  }

  if (columnConfig.consentColumn > -1) {
    const consentValue = row[columnConfig.consentColumn] ? row[columnConfig.consentColumn].toString().trim() : "";
    if (consentValue === STATUS_CONFIRMED || consentValue === STATUS_WAITLIST) {
      return consentValue;
    }
  }

  return "";
}

// Función principal que se ejecuta al enviar el formulario
function onFormSubmit(e) {
  try {
    console.log("🚀 Iniciando procesamiento de formulario...");
    console.log("📝 Evento recibido:", e);

    const sheet = getResponseSheet();
    const columnConfig = getSheetColumnConfig(sheet);
    const rowIndex = e && e.range ? e.range.getRow() : sheet.getLastRow();
    
    // Obtener los datos del formulario directamente
    const responses = (e && e.values) 
      ? e.values 
      : sheet.getRange(rowIndex, 1, 1, columnConfig.headerRow.length).getValues()[0];
    console.log("📝 Respuestas del formulario:", responses);

    // Mapeo de columnas (ajustado a tus 12 columnas)
    const email = responses[3]; // Columna D (índice 3)
    const nombre = responses[1]; // Columna B (índice 1)
    const apellidos = responses[2]; // Columna C (índice 2)
    const meInscriboComo = responses[5]; // Columna F (índice 5)
    const taller1 = responses[7]; // Columna H (índice 7) - 1ª Sesión
    const taller2 = responses[8]; // Columna I (índice 8) - 2ª Sesión
    
    console.log("📝 Datos procesados:", {email, nombre, apellidos, meInscriboComo, taller1, taller2});
    
    // Procesar talleres primero (usar valores por defecto si están vacíos)
    const taller1Final = taller1 || "No seleccionado";
    const taller2Final = taller2 || "No seleccionado";
    console.log("📝 Talleres procesados:", {taller1Final, taller2Final});
    
    // Verificar que tenemos los datos básicos necesarios (los talleres son opcionales)
    if (!email || !nombre || !apellidos) {
      console.error("❌ Faltan datos obligatorios");
      MailApp.sendEmail(ADMIN_EMAIL, "❌ Error: Datos incompletos", `Faltan datos obligatorios en la inscripción. Email: ${email}, Nombre: ${nombre}, Apellidos: ${apellidos}, Taller1: ${taller1Final}, Taller2: ${taller2Final}`);
      return;
    }
    
    // Verificar disponibilidad de plazas
    const availability = checkWorkshopAvailability(sheet, columnConfig);
    console.log("📊 Disponibilidad actual:", availability);
    
    // Verificar si se puede confirmar la inscripción (manejar cualquier combinación)
    let canConfirm;
    
    // Verificar si algún taller seleccionado está completo
    const taller1Completo = taller1Final !== "No seleccionado" && isWorkshopComplete(taller1Final, availability);
    const taller2Completo = taller2Final !== "No seleccionado" && isWorkshopComplete(taller2Final, availability);
    
    if (taller1Completo || taller2Completo) {
      // Si algún taller está completo, no se puede confirmar
      canConfirm = false;
      console.log("❌ No se puede confirmar: talleres completos detectados");
    } else if (taller1Final !== "No seleccionado" && taller2Final !== "No seleccionado") {
      // Si hay dos talleres, verificar ambos
      canConfirm = checkAvailability(taller1Final, taller2Final, availability);
    } else if (taller1Final !== "No seleccionado") {
      // Si solo hay taller1, verificar solo el primero
      canConfirm = checkSingleWorkshopAvailability(taller1Final, availability);
    } else if (taller2Final !== "No seleccionado") {
      // Si solo hay taller2, verificar solo el segundo
      canConfirm = checkSingleWorkshopAvailability(taller2Final, availability);
    } else {
      // No hay talleres seleccionados - confirmar como asistente general
      canConfirm = true;
    }
    console.log("✅ ¿Se puede confirmar?", canConfirm);
    
    if (canConfirm) {
      // Confirmar inscripción
      confirmRegistration({
        sheet,
        rowIndex,
        columnConfig,
        email,
        nombre,
        apellidos,
        meInscriboComo,
        taller1: taller1Final,
        taller2: taller2Final
      });
    } else {
      // Añadir a lista de espera
      addToWaitlist({
        sheet,
        rowIndex,
        columnConfig,
        email,
        nombre,
        apellidos,
        meInscriboComo,
        taller1: taller1Final,
        taller2: taller2Final
      });
    }
    
    // Actualizar las opciones del formulario con las plazas restantes
    updateFormOptions();
    
  } catch (error) {
    console.error("❌ Error en onFormSubmit:", error);
    MailApp.sendEmail(ADMIN_EMAIL, "❌ Error en el script de inscripción", `Se ha producido un error en el script de Google Apps Script: ${error.message}\n\nStack: ${error.stack}`);
  }
}

// Función para limpiar las opciones del formulario (eliminar texto de disponibilidad y emojis)
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
            const originalValue = choice.getValue();
            let cleanedValue = cleanWorkshopText(originalValue);
            if (!cleanedValue) {
              cleanedValue = originalValue ? originalValue.trim() : "";
            }

            console.log(`🧹 Limpiando: "${originalValue}" -> "${cleanedValue}"`);
            newChoices.push(choiceItem.createChoice(cleanedValue));
          });
          
          choiceItem.setChoices(newChoices);
          console.log(`✅ Opciones limpiadas para: ${title}`);
        }
      }
    });
    
    console.log("✅ Opciones del formulario limpiadas completamente");
    
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
    
    const sheet = getResponseSheet();
    const columnConfig = getSheetColumnConfig(sheet);
    const availability = checkWorkshopAvailability(sheet, columnConfig);
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
            const originalText = choice.getValue();
            let cleanedText = cleanWorkshopText(originalText);
            if (!cleanedText) {
              cleanedText = originalText ? originalText.trim() : "";
            }

            if (!cleanedText) {
              newChoices.push(choiceItem.createChoice(originalText));
              return;
            }

            if (cleanedText === NO_SELECTION) {
              newChoices.push(choiceItem.createChoice(NO_SELECTION));
              console.log(`🔄 Opción sin selección conservada: "${cleanedText}"`);
              return;
            }

            const info = getWorkshopAvailabilityInfo(originalText, availability);
            const remainingSeats = Number.isFinite(info.remaining) ? info.remaining : info.capacity;
            const normalizedRemaining = Math.max(0, Math.round(remainingSeats));
            const isComplete = info.matched && normalizedRemaining <= 0;

            let newText;
            if (isComplete) {
              newText = `❌ ${cleanedText} (COMPLETO - NO DISPONIBLE)`;
            } else {
              newText = `✅ ${cleanedText} (${normalizedRemaining} plazas disponibles)`;
            }

            newChoices.push(choiceItem.createChoice(newText));
            console.log(`🔄 Actualizado: "${originalText}" -> "${newText}"`);
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
function checkWorkshopAvailability(sheetParam, columnConfigParam) {
  try {
    console.log("🔍 Verificando disponibilidad de talleres...");

    const sheet = sheetParam || getResponseSheet();
    const columnConfig = columnConfigParam || getSheetColumnConfig(sheet);
    const data = sheet.getDataRange().getValues();

    const availability = {};
    Object.keys(WORKSHOP_NAMES).forEach(tallerKey => {
      availability[tallerKey] = WORKSHOP_NAMES[tallerKey].capacity;
    });

    if (data.length <= 1) {
      console.log("📊 Hoja vacía: se mantienen las capacidades iniciales.");
      return availability;
    }

    let confirmadas = 0;
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const estado = getRowStatus(row, columnConfig);

      if (estado === STATUS_CONFIRMED) {
        confirmadas++;
        [columnConfig.workshop1Column, columnConfig.workshop2Column].forEach(colIndex => {
          if (colIndex === -1) {
            return;
          }
          const rawValue = row[colIndex];
          if (!isWorkshopSelected(rawValue)) {
            return;
          }
          const workshopKey = resolveWorkshopKey(rawValue);
          if (workshopKey) {
            availability[workshopKey] = Math.max(0, availability[workshopKey] - 1);
            console.log(`📉 Descontada 1 plaza de ${workshopKey}. Quedan: ${availability[workshopKey]}`);
          } else {
            console.log(`⚠️ Taller no reconocido en fila ${i + 1}: "${rawValue}"`);
          }
        });
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
  const info1 = getWorkshopAvailabilityInfo(taller1, availability);
  const info2 = getWorkshopAvailabilityInfo(taller2, availability);

  const remaining1 = Number.isFinite(info1.remaining) ? info1.remaining : info1.capacity;
  const remaining2 = Number.isFinite(info2.remaining) ? info2.remaining : info2.capacity;

  console.log(`🔍 Verificando disponibilidad: ${cleanWorkshopText(taller1)} (${remaining1}), ${cleanWorkshopText(taller2)} (${remaining2})`);
  return remaining1 > 0 && remaining2 > 0;
}

// Verificar disponibilidad para un solo taller (NUEVA FUNCIÓN)
function checkSingleWorkshopAvailability(taller1, availability) {
  const info = getWorkshopAvailabilityInfo(taller1, availability);
  const remaining = Number.isFinite(info.remaining) ? info.remaining : info.capacity;

  console.log(`🔍 Verificando disponibilidad de taller único: ${cleanWorkshopText(taller1)} (${remaining} plazas)`);
  return remaining > 0;
}

// Verificar si un taller está completo (NUEVA FUNCIÓN)
function isWorkshopComplete(taller, availability) {
  const info = getWorkshopAvailabilityInfo(taller, availability);
  const remaining = Number.isFinite(info.remaining) ? info.remaining : info.capacity;

  console.log(`🔍 Verificando si está completo: ${cleanWorkshopText(taller)} (${remaining} plazas)`);
  if (!info.matched) {
    console.log(`⚠️ Taller no encontrado en mapeo: "${cleanWorkshopText(taller)}" -> se asume disponible`);
    return false;
  }
  return remaining <= 0;
}

// Confirmar inscripción
function confirmRegistration(params) {
  const { sheet, rowIndex, columnConfig, email, nombre, apellidos, meInscriboComo, taller1, taller2 } = params;

  if (!sheet || typeof rowIndex !== "number" || !columnConfig) {
    throw new Error("confirmRegistration requiere sheet, rowIndex y columnConfig válidos.");
  }

  if (columnConfig.statusColumn > -1) {
    sheet.getRange(rowIndex, columnConfig.statusColumn + 1).setValue(STATUS_CONFIRMED);
  }
  if (columnConfig.timestampColumn > -1) {
    sheet.getRange(rowIndex, columnConfig.timestampColumn + 1).setValue(new Date());
  }

  const hasWorkshops = (taller1 && taller1 !== NO_SELECTION) || (taller2 && taller2 !== NO_SELECTION);

  let subject, body;

  if (hasWorkshops) {
    subject = "CONFIRMACION DE INSCRIPCION - XIV Foro de Innovación Educativa";
    body = createConfirmationEmailHTML(nombre, apellidos, meInscriboComo, taller1, taller2);
  } else {
    subject = "CONFIRMACION DE ASISTENCIA GENERAL - XIV Foro de Innovación Educativa";
    body = createGeneralAttendanceEmailHTML(nombre, apellidos, meInscriboComo);
  }

  MailApp.sendEmail({
    to: email,
    subject: subject,
    htmlBody: body,
    noReply: true,
    name: "XIV Foro de Innovación Educativa"
  });

  const adminSubject = `NUEVA INSCRIPCION CONFIRMADA: ${nombre} ${apellidos}`;
  const adminBody = createAdminNotificationEmailHTML(nombre, apellidos, meInscriboComo, taller1, taller2, STATUS_CONFIRMED, email);
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
function addToWaitlist(params) {
  const { sheet, rowIndex, columnConfig, email, nombre, apellidos, meInscriboComo, taller1, taller2 } = params;

  if (!sheet || typeof rowIndex !== "number" || !columnConfig) {
    throw new Error("addToWaitlist requiere sheet, rowIndex y columnConfig válidos.");
  }

  if (columnConfig.statusColumn > -1) {
    sheet.getRange(rowIndex, columnConfig.statusColumn + 1).setValue(STATUS_WAITLIST);
  }
  if (columnConfig.timestampColumn > -1) {
    sheet.getRange(rowIndex, columnConfig.timestampColumn + 1).setValue(new Date());
  }

  const subject = "LISTA DE ESPERA - XIV Foro de Innovación Educativa";
  const body = createWaitlistEmailHTML(nombre, apellidos, meInscriboComo, taller1, taller2);
  MailApp.sendEmail({
    to: email,
    subject: subject,
    htmlBody: body,
    noReply: true,
    name: "XIV Foro de Innovación Educativa"
  });

  const adminSubject = `NUEVA INSCRIPCION EN LISTA DE ESPERA: ${nombre} ${apellidos}`;
  const adminBody = createAdminNotificationEmailHTML(nombre, apellidos, meInscriboComo, taller1, taller2, STATUS_WAITLIST, email);
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
  let cleanTaller1 = taller1 ? taller1.replace(/^[✅❌]\s*/, '').replace(/\s*\((\d+\/\d+\splazas disponibles|COMPLETO|\d+\splazas disponibles|COMPLETO - NO DISPONIBLE)\)/g, '').trim() : "No seleccionado";
  let cleanTaller2 = taller2 ? taller2.replace(/^[✅❌]\s*/, '').replace(/\s*\((\d+\/\d+\splazas disponibles|COMPLETO|\d+\splazas disponibles|COMPLETO - NO DISPONIBLE)\)/g, '').trim() : "No seleccionado";

  // Obtener información detallada de los talleres
  const workshop1Info = taller1 && taller1 !== "No seleccionado" ? getWorkshopDetails(cleanTaller1) : null;
  const workshop2Info = taller2 && taller2 !== "No seleccionado" ? getWorkshopDetails(cleanTaller2) : null;

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
            ${taller1 && taller1 !== "No seleccionado" ? `
            <li class="workshop-item">
              <div class="workshop-title">1ª Sesión (17:30-18:15h)</div>
              <div class="workshop-title">${workshop1Info.title}</div>
              <div class="workshop-presenter">👤 ${workshop1Info.presenter}</div>
              <div class="workshop-institution">🏢 ${workshop1Info.institution}</div>
            </li>
            ` : `
            <li class="workshop-item" style="background: rgba(128,24,54,0.05); border-left: 4px solid #666666;">
              <div class="workshop-title">1ª Sesión (17:30-18:15h)</div>
              <div class="workshop-title" style="color: #666666; font-style: italic;">No seleccionado</div>
              <div class="workshop-presenter" style="color: #666666;">Puedes asistir al networking o Inspira Talks</div>
            </li>
            `}
            ${taller2 && taller2 !== "No seleccionado" ? `
            <li class="workshop-item">
              <div class="workshop-title">2ª Sesión (18:30-19:15h)</div>
              <div class="workshop-title">${workshop2Info.title}</div>
              <div class="workshop-presenter">👤 ${workshop2Info.presenter}</div>
              <div class="workshop-institution">🏢 ${workshop2Info.institution}</div>
            </li>
            ` : `
            <li class="workshop-item" style="background: rgba(128,24,54,0.05); border-left: 4px solid #666666;">
              <div class="workshop-title">2ª Sesión (18:30-19:15h)</div>
              <div class="workshop-title" style="color: #666666; font-style: italic;">No seleccionado</div>
              <div class="workshop-presenter" style="color: #666666;">Puedes asistir al networking o Inspira Talks</div>
            </li>
            `}
          </ul>
          
          <p style="background: rgba(255,215,0,0.1); padding: 15px; border-radius: 8px; border-left: 4px solid #ffd700;">
            <strong>📅 Fecha:</strong> 5 de noviembre de 2025<br>
            <strong>🕔 Horario:</strong> 17:00-20:00h<br>
            <strong>📍 Lugar:</strong> Santa María la Blanca, Madrid
          </p>
          
          <p>¡Esperamos verte en este encuentro de innovación educativa!</p>
          
          <p>Atentamente,<br>
          <strong>El equipo del XIV Foro de Innovación Educativa</strong><br>
          <em>Santa María la Blanca</em></p>
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

function createGeneralAttendanceEmailHTML(nombre, apellidos, meInscriboComo) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Confirmación de Asistencia General - XIV Foro de Innovación Educativa</title>
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
        .general-notice {
          background: rgba(128,24,54,0.1);
          padding: 20px;
          border-radius: 12px;
          border-left: 4px solid #801836;
          margin: 20px 0;
        }
        .activities-list {
          background: rgba(128,24,54,0.05);
          padding: 20px;
          border-radius: 12px;
          margin: 20px 0;
        }
        .activity-item {
          margin-bottom: 15px;
          padding: 10px;
          background: rgba(255,255,255,0.7);
          border-radius: 8px;
          border-left: 3px solid #801836;
        }
        .activity-title {
          font-weight: 700;
          color: #801836;
          margin-bottom: 5px;
        }
        .activity-time {
          color: #666666;
          font-size: 0.9rem;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>✓ CONFIRMACIÓN DE ASISTENCIA GENERAL</h2>
        </div>
        <div class="content">
          <p>Estimado/a <strong class="highlight">${nombre} ${apellidos}</strong>,</p>
          
          <div class="logo-section">
            <p class="logo-text">XIV Foro de Innovación Educativa</p>
            <p class="subtitle">HUMANIA · Desafío educativo</p>
          </div>
          
          <p>¡Tu inscripción ha sido <strong class="highlight">confirmada con éxito</strong>!</p>
          
          <div class="badge">Te inscribes como: ${meInscriboComo}</div>
          
          <div class="general-notice">
            <p><strong>📢 Información importante:</strong></p>
            <p>No te has inscrito en ninguna de las 2 sesiones de talleres, pero <strong>podrás disfrutar igualmente del evento</strong> y participar en todas las actividades generales.</p>
          </div>
          
          <div class="activities-list">
            <h3 style="color: #801836; margin-top: 0;">🎯 Actividades disponibles para ti:</h3>
            
            <div class="activity-item">
              <div class="activity-title">📚 Inspira Talks (15 minutos)</div>
              <div class="activity-time">17:30-18:15h y 18:30-19:15h</div>
              <p>Presentaciones cortas sobre innovación educativa</p>
            </div>
            
            <div class="activity-item">
              <div class="activity-title">🤝 Networking y Café</div>
              <div class="activity-time">Durante todo el evento</div>
              <p>Conecta con otros profesionales de la educación</p>
            </div>
            
            <div class="activity-item">
              <div class="activity-title">🎪 Actividades de Bienvenida</div>
              <div class="activity-time">17:00-17:30h</div>
              <p>Presentación del evento y actividades de integración</p>
            </div>
            
            <div class="activity-item">
              <div class="activity-title">🎉 Clausura y Conclusiones</div>
              <div class="activity-time">19:15-20:00h</div>
              <p>Resumen del evento y próximos pasos</p>
            </div>
          </div>
          
          <p style="background: rgba(255,215,0,0.1); padding: 15px; border-radius: 8px; border-left: 4px solid #ffd700;">
            <strong>📅 Fecha:</strong> 5 de noviembre de 2025<br>
            <strong>🕔 Horario:</strong> 17:00-20:00h<br>
            <strong>📍 Lugar:</strong> Santa María la Blanca, Madrid
          </p>
          
          <p><strong>💡 Consejo:</strong> Si cambias de opinión y quieres participar en algún taller específico de las 2 sesiones, puedes acercarte a los organizadores durante el evento para ver si hay plazas disponibles.</p>
          
          <p>¡Esperamos verte en este encuentro de innovación educativa!</p>
          
          <p>Atentamente,<br>
          <strong>El equipo del XIV Foro de Innovación Educativa</strong><br>
          <em>Santa María la Blanca</em></p>
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
  let cleanTaller1 = taller1 ? taller1.replace(/^[✅❌]\s*/, '').replace(/\s*\((\d+\/\d+\splazas disponibles|COMPLETO|\d+\splazas disponibles|COMPLETO - NO DISPONIBLE)\)/g, '').trim() : "No seleccionado";
  let cleanTaller2 = taller2 ? taller2.replace(/^[✅❌]\s*/, '').replace(/\s*\((\d+\/\d+\splazas disponibles|COMPLETO|\d+\splazas disponibles|COMPLETO - NO DISPONIBLE)\)/g, '').trim() : "No seleccionado";

  // Obtener información detallada de los talleres
  const workshop1Info = taller1 && taller1 !== "No seleccionado" ? getWorkshopDetails(cleanTaller1) : null;
  const workshop2Info = taller2 && taller2 !== "No seleccionado" ? getWorkshopDetails(cleanTaller2) : null;

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
            ${taller1 && taller1 !== "No seleccionado" ? `
            <li class="workshop-item">
              <div class="workshop-title">1ª Sesión (17:30-18:15h)</div>
              <div class="workshop-title">${workshop1Info.title}</div>
              <div class="workshop-presenter">👤 ${workshop1Info.presenter}</div>
              <div class="workshop-institution">🏢 ${workshop1Info.institution}</div>
            </li>
            ` : `
            <li class="workshop-item" style="background: rgba(255,193,7,0.05); border-left: 4px solid #666666;">
              <div class="workshop-title">1ª Sesión (17:30-18:15h)</div>
              <div class="workshop-title" style="color: #666666; font-style: italic;">No seleccionado</div>
              <div class="workshop-presenter" style="color: #666666;">Puedes asistir al networking o Inspira Talks</div>
            </li>
            `}
            ${taller2 && taller2 !== "No seleccionado" ? `
            <li class="workshop-item">
              <div class="workshop-title">2ª Sesión (18:30-19:15h)</div>
              <div class="workshop-title">${workshop2Info.title}</div>
              <div class="workshop-presenter">👤 ${workshop2Info.presenter}</div>
              <div class="workshop-institution">🏢 ${workshop2Info.institution}</div>
            </li>
            ` : `
            <li class="workshop-item" style="background: rgba(255,193,7,0.05); border-left: 4px solid #666666;">
              <div class="workshop-title">2ª Sesión (18:30-19:15h)</div>
              <div class="workshop-title" style="color: #666666; font-style: italic;">No seleccionado</div>
              <div class="workshop-presenter" style="color: #666666;">Puedes asistir al networking o Inspira Talks</div>
            </li>
            `}
          </ul>
          
          <p style="background: rgba(128,24,54,0.05); padding: 15px; border-radius: 8px; border-left: 4px solid #801836;">
            <strong>📅 Fecha:</strong> 5 de noviembre de 2025<br>
            <strong>🕔 Horario:</strong> 17:00-20:00h<br>
            <strong>📍 Lugar:</strong> Santa María la Blanca, Madrid
          </p>
          
          <p>¡Gracias por tu interés en la innovación educativa!</p>
          
          <p>Atentamente,<br>
          <strong>El equipo del XIV Foro de Innovación Educativa</strong><br>
          <em>Santa María la Blanca</em></p>
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
  let cleanTaller1 = taller1 ? taller1.replace(/^[✅❌]\s*/, '').replace(/\s*\((\d+\/\d+\splazas disponibles|COMPLETO|\d+\splazas disponibles|COMPLETO - NO DISPONIBLE)\)/g, '').trim() : "No seleccionado";
  let cleanTaller2 = taller2 ? taller2.replace(/^[✅❌]\s*/, '').replace(/\s*\((\d+\/\d+\splazas disponibles|COMPLETO|\d+\splazas disponibles|COMPLETO - NO DISPONIBLE)\)/g, '').trim() : "No seleccionado";

  // Obtener información detallada de los talleres
  const workshop1Info = taller1 && taller1 !== "No seleccionado" ? getWorkshopDetails(cleanTaller1) : null;
  const workshop2Info = taller2 && taller2 !== "No seleccionado" ? getWorkshopDetails(cleanTaller2) : null;

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
            ${taller1 && taller1 !== "No seleccionado" ? `
            <li class="workshop-item">
              <div class="workshop-title">1ª Sesión (17:30-18:15h)</div>
              <div class="workshop-title">${workshop1Info.title}</div>
              <div class="workshop-presenter">👤 ${workshop1Info.presenter}</div>
              <div class="workshop-institution">🏢 ${workshop1Info.institution}</div>
            </li>
            ` : `
            <li class="workshop-item" style="background: rgba(128,24,54,0.05); border-left: 4px solid #666666;">
              <div class="workshop-title">1ª Sesión (17:30-18:15h)</div>
              <div class="workshop-title" style="color: #666666; font-style: italic;">No seleccionado</div>
              <div class="workshop-presenter" style="color: #666666;">Solo inscrito en 2ª sesión</div>
            </li>
            `}
            ${taller2 && taller2 !== "No seleccionado" ? `
            <li class="workshop-item">
              <div class="workshop-title">2ª Sesión (18:30-19:15h)</div>
              <div class="workshop-title">${workshop2Info.title}</div>
              <div class="workshop-presenter">👤 ${workshop2Info.presenter}</div>
              <div class="workshop-institution">🏢 ${workshop2Info.institution}</div>
            </li>
            ` : `
            <li class="workshop-item" style="background: rgba(128,24,54,0.05); border-left: 4px solid #666666;">
              <div class="workshop-title">2ª Sesión (18:30-19:15h)</div>
              <div class="workshop-title" style="color: #666666; font-style: italic;">No seleccionado</div>
              <div class="workshop-presenter" style="color: #666666;">Solo inscrito en 1ª sesión</div>
            </li>
            `}
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
            // Eliminar CUALQUIER texto entre paréntesis y emojis
            originalText = originalText.replace(/^[✅❌]\s*/, '').replace(/\s*\([^)]*\)/g, '').trim();
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

// Función para limpiar completamente el formulario y recalcular plazas
function limpiarYRecalcularFormulario() {
  try {
    console.log("🧹 Iniciando limpieza completa del formulario...");
    
    // 1. Limpiar completamente el formulario
    console.log("📝 Paso 1: Limpiando formulario...");
    cleanFormOptions();
    
    // 2. Verificar disponibilidad actual
    console.log("📊 Paso 2: Calculando disponibilidad real...");
    const availability = checkWorkshopAvailability();
    
    // 3. Mostrar resumen de talleres completos vs disponibles
    console.log("📋 Paso 3: Resumen de disponibilidad:");
    console.log("❌ Talleres completos:");
    Object.keys(availability).forEach(workshopKey => {
      if (availability[workshopKey] <= 0) {
        console.log(`   - ${WORKSHOP_NAMES[workshopKey].name}: ${availability[workshopKey]} plazas`);
      }
    });
    
    console.log("✅ Talleres disponibles:");
    Object.keys(availability).forEach(workshopKey => {
      if (availability[workshopKey] > 0) {
        console.log(`   - ${WORKSHOP_NAMES[workshopKey].name}: ${availability[workshopKey]} plazas`);
      }
    });
    
    // 4. Actualizar formulario con plazas correctas
    console.log("🔄 Paso 4: Actualizando formulario con plazas correctas...");
    updateFormOptions();
    
    console.log("✅ Limpieza y recálculo completados");
    
  } catch (error) {
    console.error("❌ Error en limpieza completa:", error);
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
            // Eliminar CUALQUIER texto entre paréntesis y emojis
            originalText = originalText.replace(/^[✅❌]\s*/, '').replace(/\s*\([^)]*\)/g, '').trim();
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

// Función para verificar el FORM_ID y analizar el estado actual
function verificarFormIdYEstado() {
  try {
    console.log("🔍 Verificando FORM_ID y estado actual...");
    
    // Verificar que el FORM_ID es correcto
    console.log(`📋 FORM_ID configurado: ${FORM_ID}`);
    
    const form = FormApp.openById(FORM_ID);
    if (!form) {
      console.error("❌ No se pudo encontrar el formulario con ID:", FORM_ID);
      return;
    }
    
    console.log("✅ Formulario encontrado correctamente");
    console.log(`📝 Título del formulario: ${form.getTitle()}`);
    
    // Analizar el estado actual de la hoja de cálculo
    const sheet = SpreadsheetApp.getActiveSheet();
    const data = sheet.getDataRange().getValues();
    console.log(`📊 Total de filas en la hoja: ${data.length}`);
    
    // Contar inscripciones por estado
    let confirmadas = 0;
    let listaEspera = 0;
    let sinEstado = 0;
    
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const estado = row[10]; // Columna K (índice 10) - Estado
      
      if (estado === 'Confirmado') {
        confirmadas++;
      } else if (estado === 'Lista de Espera') {
        listaEspera++;
      } else {
        sinEstado++;
      }
    }
    
    console.log(`📈 Estadísticas de inscripciones:`);
    console.log(`   - Confirmadas: ${confirmadas}`);
    console.log(`   - Lista de Espera: ${listaEspera}`);
    console.log(`   - Sin estado: ${sinEstado}`);
    
    // Analizar talleres más populares
    const talleresCount = {};
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const estado = row[10];
      
      if (estado === 'Confirmado') {
        const taller1 = row[7];
        const taller2 = row[8];
        
        // Limpiar nombres
        let cleanTaller1 = taller1 ? taller1.replace(/^[✅❌]\s*/, '').replace(/\s*\([^)]*\)/g, '').replace(/\s*-\s*[^.]*\./g, '').replace(/\s*\.\s*$/g, '').trim() : '';
        let cleanTaller2 = taller2 ? taller2.replace(/^[✅❌]\s*/, '').replace(/\s*\([^)]*\)/g, '').replace(/\s*-\s*[^.]*\./g, '').replace(/\s*\.\s*$/g, '').trim() : '';
        
        if (cleanTaller1 && cleanTaller1 !== '') {
          talleresCount[cleanTaller1] = (talleresCount[cleanTaller1] || 0) + 1;
        }
        if (cleanTaller2 && cleanTaller2 !== '') {
          talleresCount[cleanTaller2] = (talleresCount[cleanTaller2] || 0) + 1;
        }
      }
    }
    
    console.log(`🎯 Talleres más populares:`);
    Object.entries(talleresCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .forEach(([taller, count]) => {
        console.log(`   - ${taller}: ${count} inscripciones`);
      });
    
    // Calcular disponibilidad real
    const availability = checkWorkshopAvailability();
    console.log(`📊 Disponibilidad calculada:`);
    Object.keys(availability).forEach(workshopKey => {
      const total = WORKSHOP_NAMES[workshopKey].capacity;
      const disponible = availability[workshopKey];
      const ocupadas = total - disponible;
      const porcentaje = Math.round((ocupadas / total) * 100);
      
      let estado = '✅ Disponible';
      if (disponible <= 0) estado = '❌ COMPLETO';
      else if (disponible <= total * 0.2) estado = '⚠️ Pocas plazas';
      
      console.log(`   - ${WORKSHOP_NAMES[workshopKey].name}: ${disponible}/${total} (${porcentaje}% ocupado) ${estado}`);
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
    let cleanTaller1 = taller1.replace(/^[✅❌]\s*/, '').replace(/\s*\((\d+\/\d+\splazas disponibles|COMPLETO|\d+\splazas disponibles|COMPLETO - NO DISPONIBLE)\)/g, '').trim();
    let cleanTaller2 = taller2.replace(/^[✅❌]\s*/, '').replace(/\s*\((\d+\/\d+\splazas disponibles|COMPLETO|\d+\splazas disponibles|COMPLETO - NO DISPONIBLE)\)/g, '').trim();
    
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

// Función para probar inscripción con un solo taller
function probarInscripcionUnTaller() {
  try {
    console.log("🧪 Probando inscripción con un solo taller...");
    
    // Simular datos de prueba con solo un taller
    const testData = [
      new Date(), // Marca temporal
      "Luis Miguel", // Nombre
      "Olivas Torrijos", // Apellidos
      "lmolivas@p.csmb.es", // Email
      "12345678Z", // DNI
      "Docente", // Me inscribo como
      "Fundación Iruaritz Lezama", // Institución
      "5. Innovación social: crea, actúa y cambia el mundo Luis Miguel Olivas Fundación Iruaritz Lezama", // Taller 1ª sesión
      "", // Taller 2ª sesión (VACÍO)
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

// Función para probar inscripción solo con taller2 (caso del error)
function probarInscripcionSoloTaller2() {
  try {
    console.log("🧪 Probando inscripción solo con taller2...");
    
    // Simular datos de prueba con solo taller2 (como en el error)
    const testData = [
      new Date(), // Marca temporal
      "fwf", // Nombre
      "ergdsg", // Apellidos
      "raqelcb@gmail.com", // Email
      "12345678Z", // DNI
      "Docente", // Me inscribo como
      "Colegio de Prueba", // Institución
      "", // Taller 1ª sesión (VACÍO - como en el error)
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
    
    console.log("✅ Prueba de inscripción solo con taller2 completada");
    
  } catch (error) {
    console.error("❌ Error en prueba:", error);
  }
}

// Función para probar inscripción sin talleres (asistencia general)
function probarInscripcionSinTalleres() {
  try {
    console.log("🧪 Probando inscripción sin talleres (asistencia general)...");
    
    // Simular datos de prueba sin talleres
    const testData = [
      new Date(), // Marca temporal
      "María", // Nombre
      "García López", // Apellidos
      "maria.garcia@ejemplo.com", // Email
      "87654321X", // DNI
      "Familiar", // Me inscribo como
      "Particular", // Institución
      "", // Taller 1ª sesión (VACÍO)
      "", // Taller 2ª sesión (VACÍO)
      "Sí", // Comunicación digital
      "", // Estado (se llenará por el script)
      ""  // Fecha de inscripción (se llenará por el script)
    ];
    
    // Añadir fila de prueba a la hoja
    const sheet = SpreadsheetApp.getActiveSheet();
    sheet.appendRow(testData);
    
    // Llamar a onFormSubmit
    onFormSubmit({values: testData});
    
    console.log("✅ Prueba de inscripción sin talleres completada");
    
  } catch (error) {
    console.error("❌ Error en prueba:", error);
  }
}

// Función para probar el caso específico del error (Oihana Llovet)
function probarCasoOihanaLlovet() {
  try {
    console.log("🧪 Probando caso específico de Oihana Llovet...");
    
    // Simular datos exactos del error
    const testData = [
      new Date(), // Marca temporal
      "Oihana", // Nombre
      "Llovet Díaz", // Apellidos
      "ollovet@p.csmb.es", // Email
      "12345678Z", // DNI
      "Docente", // Me inscribo como
      "Santa María la Blanca", // Institución
      "", // Taller 1ª sesión (VACÍO)
      "", // Taller 2ª sesión (VACÍO)
      "Sí", // Comunicación digital
      "", // Estado (se llenará por el script)
      ""  // Fecha de inscripción (se llenará por el script)
    ];
    
    // Añadir fila de prueba a la hoja
    const sheet = SpreadsheetApp.getActiveSheet();
    sheet.appendRow(testData);
    
    // Llamar a onFormSubmit
    onFormSubmit({values: testData});
    
    console.log("✅ Prueba del caso Oihana Llovet completada");
    
  } catch (error) {
    console.error("❌ Error en prueba:", error);
  }
}

// Función para diagnosticar y corregir el problema de "COMPLETO"
function diagnosticarYCorregirCompleto() {
  try {
    console.log("🔍 Diagnosticando problema de 'COMPLETO'...");
    
    // 1. Verificar estado actual del formulario
    const form = FormApp.openById(FORM_ID);
    if (!form) {
      console.error("❌ No se pudo encontrar el formulario");
      return;
    }
    
    const items = form.getItems();
    console.log("📋 Elementos del formulario encontrados:", items.length);
    
    // 2. Verificar opciones actuales del formulario
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
    
    // 3. Verificar disponibilidad calculada
    const availability = checkWorkshopAvailability();
    console.log("📊 Disponibilidad calculada:", availability);
    
    // 4. Verificar coincidencias entre formulario y WORKSHOP_NAMES
    console.log("🔍 Verificando coincidencias...");
    items.forEach(item => {
      const title = item.getTitle();
      
      if (title.includes("¿En qué taller quiero apuntarme a las 17:30 – 18:15 h?") || 
          title.includes("¿En qué taller quiero apuntarme a las 18:30 – 19:15 h?")) {
        
        if (item.getType() === FormApp.ItemType.MULTIPLE_CHOICE) {
          const choiceItem = item.asMultipleChoiceItem();
          const choices = choiceItem.getChoices();
          
          choices.forEach(choice => {
            let originalText = choice.getValue();
            originalText = originalText.replace(/^[✅❌]\s*/, '').replace(/\s*\([^)]*\)/g, '').trim();
            
            let found = false;
            for (const key of Object.keys(WORKSHOP_NAMES)) {
              if (key === originalText || originalText.includes(key.split(':')[0]) || key.includes(originalText.split(':')[0])) {
                found = true;
                console.log(`✅ Coincidencia encontrada: "${originalText}" -> "${key}"`);
                break;
              }
            }
            
            if (!found) {
              console.log(`❌ NO se encontró coincidencia para: "${originalText}"`);
            }
          });
        }
      }
    });
    
    // 5. Limpiar y actualizar formulario
    console.log("🧹 Limpiando formulario...");
    cleanFormOptions();
    
    console.log("🔄 Actualizando formulario...");
    updateFormOptions();
    
    console.log("✅ Diagnóstico y corrección completados");
    
  } catch (error) {
    console.error("❌ Error en diagnóstico:", error);
  }
}

// Función para probar el nuevo sistema de talleres completos
function probarSistemaTalleresCompletos() {
  try {
    console.log("🧪 Probando sistema de talleres completos...");
    
    // 1. Verificar estado actual
    const availability = checkWorkshopAvailability();
    console.log("📊 Disponibilidad actual:", availability);
    
    // 2. Mostrar talleres completos
    console.log("❌ Talleres completos:");
    Object.keys(availability).forEach(workshopKey => {
      if (availability[workshopKey] <= 0) {
        console.log(`   - ${WORKSHOP_NAMES[workshopKey].name}: ${availability[workshopKey]} plazas`);
      }
    });
    
    // 3. Mostrar talleres disponibles
    console.log("✅ Talleres disponibles:");
    Object.keys(availability).forEach(workshopKey => {
      if (availability[workshopKey] > 0) {
        console.log(`   - ${WORKSHOP_NAMES[workshopKey].name}: ${availability[workshopKey]} plazas`);
      }
    });
    
    // 4. Probar el nuevo sistema de mapeo
    console.log("🔍 Probando nuevo sistema de mapeo...");
    const form = FormApp.openById(FORM_ID);
    const items = form.getItems();
    
    items.forEach(item => {
      const title = item.getTitle();
      
      if (title.includes("¿En qué taller quiero apuntarme a las 17:30 – 18:15 h?") || 
          title.includes("¿En qué taller quiero apuntarme a las 18:30 – 19:15 h?")) {
        
        if (item.getType() === FormApp.ItemType.MULTIPLE_CHOICE) {
          const choiceItem = item.asMultipleChoiceItem();
          const choices = choiceItem.getChoices();
          
          console.log(`📋 Probando mapeo para: ${title}`);
          choices.forEach((choice, index) => {
            let originalText = choice.getValue();
            originalText = originalText.replace(/^[✅❌]\s*/, '').replace(/\s*\([^)]*\)/g, '').trim();
            
            // Función auxiliar para encontrar coincidencias más flexibles
            function findWorkshopMatch(cleanText) {
              // 1. Buscar coincidencia exacta
              if (WORKSHOP_NAMES[cleanText]) {
                return cleanText;
              }
              
              // 2. Buscar por número de taller (ej: "1. Artes Escénicas" -> "1. Artes Escénicas...")
              const numberMatch = cleanText.match(/^(\d+)\.\s*(.+)/);
              if (numberMatch) {
                const number = numberMatch[1];
                const rest = numberMatch[2];
                
                for (const key of Object.keys(WORKSHOP_NAMES)) {
                  if (key.startsWith(`${number}.`) && key.includes(rest.split(':')[0])) {
                    return key;
                  }
                }
              }
              
              // 3. Buscar por palabras clave principales
              const keywords = cleanText.split(/[:–-]/)[0].trim().split(/\s+/);
              for (const key of Object.keys(WORKSHOP_NAMES)) {
                const keyKeywords = key.split(/[:–-]/)[0].trim().split(/\s+/);
                let matches = 0;
                for (const keyword of keywords) {
                  if (keyKeywords.some(k => k.toLowerCase().includes(keyword.toLowerCase()) || keyword.toLowerCase().includes(k.toLowerCase()))) {
                    matches++;
                  }
                }
                if (matches >= Math.min(2, keywords.length)) {
                  return key;
                }
              }
              
              // 4. Buscar por coincidencia parcial
              for (const key of Object.keys(WORKSHOP_NAMES)) {
                if (key.includes(cleanText.split(':')[0]) || cleanText.includes(key.split(':')[0])) {
                  return key;
                }
              }
              
              return null;
            }
            
            const workshopKey = findWorkshopMatch(originalText);
            if (workshopKey) {
              const available = availability[workshopKey] !== undefined ? availability[workshopKey] : WORKSHOP_NAMES[workshopKey].capacity;
              console.log(`   ✅ ${index + 1}. "${originalText}" -> "${workshopKey}" (${available} plazas)`);
            } else {
              console.log(`   ❌ ${index + 1}. "${originalText}" -> NO ENCONTRADO`);
            }
          });
        }
      }
    });
    
    // 5. Actualizar formulario
    console.log("🔄 Actualizando formulario con nuevo sistema...");
    updateFormOptions();
    
    console.log("✅ Prueba del sistema completada");
    
  } catch (error) {
    console.error("❌ Error en prueba:", error);
  }
}
