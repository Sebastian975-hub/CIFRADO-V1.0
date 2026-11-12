
const diccionarioCifrado = {
  // Minúsculas
  'a': 'p69', 'b': 'q69', 'c': 'r69', 'd': 's69', 'e': 't69',
  'f': 'p70', 'g': 'q70', 'h': 'r70', 'i': 's70', 'j': 't70',
  'k': 'p71', 'l': 'q71', 'm': 'r71', 'n': 's71', 'ñ': 'u71', 'o': 't71',
  'p': 'p72', 'q': 'q72', 'r': 'r72', 's': 's72', 't': 't72',
  'u': 'p73', 'v': 'q73', 'w': 'r73', 'x': 's73', 'y': 't73', 'z': 'p74',

  // Mayúsculas (códigos distintos para no perder la diferencia)
  'A': 'P69', 'B': 'Q69', 'C': 'R69', 'D': 'S69', 'E': 'T69',
  'F': 'P70', 'G': 'Q70', 'H': 'R70', 'I': 'S70', 'J': 'T70',
  'K': 'P71', 'L': 'Q71', 'M': 'R71', 'N': 'S71', 'Ñ': 'U71', 'O': 'T71',
  'P': 'P72', 'Q': 'Q72', 'R': 'R72', 'S': 'S72', 'T': 'T72',
  'U': 'P73', 'V': 'Q73', 'W': 'R73', 'X': 'S73', 'Y': 'T73', 'Z': 'P74',

  // Vocales con tilde y diéresis
  'á': 'a01', 'é': 'e01', 'í': 'i01', 'ó': 'o01', 'ú': 'u01', 'ü': 'u02',
  'Á': 'A01', 'É': 'E01', 'Í': 'I01', 'Ó': 'O01', 'Ú': 'U01', 'Ü': 'U02',

  // Números
  '0': 'q74', '1': 'r74', '2': 's74', '3': 't74', '4': 'p75',
  '5': 'q75', '6': 'r75', '7': 's75', '8': 't75', '9': 'p76',

  // Signos, espacios y saltos de línea
  '!': 'q76', '"': 'r76', '/': 's76', '$': 't76', '%': 'p77',
  '&': 'q77', '(': 'r77', ')': 's77', '=': 't77', ' ': 'p78',
  '.': 'x01', ',': 'x02', ':': 'x03', ';': 'x04', '?': 'x05',
  '¿': 'x06', '¡': 'x07', '-': 'x08', '_': 'x09', '\n': 'x10', '\r': 'x11'
};

// Crea un objeto vacío sin propiedades heredadas para evitar conflictos de nombres
const diccionarioDescifrado = Object.create(null);
// Recorre cada letra original del diccionario cifrado
for (const letra of Object.keys(diccionarioCifrado)) {
  // Invierte la relación: el símbolo cifrado pasa a ser la clave y la letra original su valor
  diccionarioDescifrado[diccionarioCifrado[letra]] = letra;
}

// Pieza 1: Cambia cada carácter por su código. Si es un símbolo raro (como un emoji),
// lo guarda entre corchetes para poder recuperarlo sin perder información.

function sustituirPorCodigo(texto) {
  const listaCodigos = [];
  for (const caracter of texto) {  //Este bucle sirve para revisar cada cadena de texto letra por letrta de principio a final.
    if (Object.prototype.hasOwnProperty.call(diccionarioCifrado, caracter)) { // Verifica de forma segura si el carácter existe como clave en el diccionario
      listaCodigos.push(diccionarioCifrado[caracter]); // Busca el código del carácter en el diccionario y lo agrega al final de la lista
    } else {
      listaCodigos.push("[" + caracter + "]"); // Si el carácter no está en el diccionario, lo guarda tal cual encerrado entre corchetes
    }
  }
  return listaCodigos.join(" ");
}

// Inversa de la Pieza 1: Convierte los códigos de vuelta a caracteres originales
function revertirCodigo(textoCodigos) {
  const partes = textoCodigos.split(" "); // Divide el texto cifrado usando los espacios y guarda cada código en una lista
  let resultado = "";
  for (const celda of partes) {
    if (celda in diccionarioDescifrado) {
      resultado += diccionarioDescifrado[celda]; // Busca la letra original del código y la añade al final del texto descifrado

      // Si el código no está en el diccionario, verifica si es un carácter original encerrado entre corchetes
    } else if (celda.length >= 3 && celda.startsWith("[") && celda.endsWith("]")) {
      // Si es un carácter protegido entre corchetes, le quita los bordes y lo añade al resultado
      resultado += celda.slice(1, -1)
    } else {
      // Si no coincide con nada anterior, conserva el fragmento tal como está
      resultado += celda;
    }
  }
  return resultado;
}

// Pieza 2 (Pieza C de la guía): Invierte todo el texto
function invertir(texto) {
  return Array.from(texto).reverse().join(""); // Convierte el texto en una lista de letras, las invierte y las vuelve a unir al revés
}

// ===== Funciones obligatorias =====
function cifrar(texto) {
  const paso1 = sustituirPorCodigo(texto); // 1. Reemplaza por códigos
  const paso2 = invertir(paso1);           // 2. Invierte el resultado
  return paso2;
}

function descifrar(texto) {
  // Los editores suelen añadir un salto de línea o espacios al final del archivo;
  // al invertir pasarían al principio y romperían el primer código.
  const limpio = texto.trim();             // 1. Elimina todos lso espacios en blanco al principio y al final de un texto.
  const paso1 = invertir(limpio);          // 2. Quita la inversión (orden inverso)
  const paso2 = revertirCodigo(paso1);     // 3. Devuelve los códigos a letras
  return paso2;
}

// Detecta si un texto ya parece salida de cifrar() (todo son códigos del diccionario).
function parecePreCifrado(texto) {
  const celdas = invertir(texto.trim()).split(" "); // Limpia los espacios de los bordes, invierte el texto y lo divide en una lista usando cada espacio
  return celdas.every(function (celda) { // Verifica que todos los elementos de la lista cumplan con el formato válido de cifrado
    return celda in diccionarioDescifrado;
  });
}


// ARCHIVOS 

const selector = document.getElementById("archivo"); // Busca en el HTML el elemento con id "archivo" y lo guarda en una variable para poder usarlo

selector.style.display = "none"; // Oculta el campo original de selección de archivos en la pantalla.
let cancelarPendiente = null; // Crea una variable vacía para controlar y limpiar la espera si el usuario cancela la selección.

function pedirArchivo() {
  // Si había una petición anterior sin terminar (por ejemplo, un diálogo cancelado
  // que el navegador no avisó), se cierra para que no queden oyentes duplicados.
  
  if (cancelarPendiente) { // Si había una selección de archivo anterior abierta, la cancela para empezar limpio.
    cancelarPendiente();
  }

  return new Promise(function (entregar) { // Crea una promesa que esperará hasta que el usuario elija un archivo o cancele.
    selector.value = "";  // Limpia el valor anterior para permitir seleccionar el mismo archivo dos veces seguidas

    function limpiar() { // Desconecta los eventos del selector y reinicia el estado de espera al terminar.
      selector.removeEventListener("cancel", alCancelar);
      selector.removeEventListener("change", alCambiar);
      cancelarPendiente = null;
    }

    function alCancelar() {
      limpiar();
      entregar(null);
    }

    async function alCambiar() {   // Se ejecuta cuando el usuario selecciona un archivo en la ventana
      limpiar();
      const archivo = selector.files[0];

      if (!archivo) {   // Si no se seleccionó ningún archivo, termina sin entregar nada.
        entregar(null);
        return;
      }

      if (!archivo.name.toLowerCase().endsWith(".txt")) {  // Verifica que el archivo tenga extensión .txt sin importar mayúsculas o minúsculas.
        alert("El archivo debe ser de texto (.txt).");
        entregar(null);
        return;
      }

      const texto = await archivo.text();  // Lee el contenido completo del archivo de texto.

      if (texto.length === 0) {       // Verifica que el archivo no esté completamente vacío.
        alert("El archivo está vacío.");
        entregar(null);
        return;
      }

      entregar({ nombre: archivo.name, texto: texto });  // Entrega el nombre y el contenido del archivo listo para cifrar o descifrar.
    }
    
    // Guarda la función de cancelación y activa los eventos para detectar la acción del usuario.
    cancelarPendiente = alCancelar;
    selector.addEventListener("cancel", alCancelar);
    selector.addEventListener("change", alCambiar);
  });
}


function descargar(contenido, nombreArchivo) {
  // Empaqueta el texto en un archivo virtual en memoria con formato de texto plano UTF-8
  const blob = new Blob([contenido], { type: "text/plain;charset=utf-8" }); 
  const url = URL.createObjectURL(blob);   // Crea una dirección temporal en memoria para el archivo virtual.
  
  const enlace = document.createElement("a");   // Crea un enlace invisible, le asigna el archivo y el nombre de descarga
  enlace.href = url;
  enlace.download = nombreArchivo;
  
  // Agrega el enlace a la página, simula un clic para descargar y lo elimina al instante
  document.body.appendChild(enlace);
  enlace.click();
  document.body.removeChild(enlace);
  setTimeout(function () { URL.revokeObjectURL(url); }, 1000);  // Espera un segundo y borra la dirección temporal para liberar memoria
} 
function nombreSalida(nombreOriginal, sufijo) {// Genera el nombre del archivo de salida añadiendo un sufijo antes de la extensión .txt
  const sinExtension = nombreOriginal.slice(0, -4);   // Quita los últimos 4 caracteres (.txt) del nombre original
  return sinExtension + sufijo + ".txt";   // Une el nombre base, el sufijo y vuelve a agregar la extensión .txt
}


// BOTONES
// Los botones de la página reemplazan al antiguo menú con prompt().

const btnCifrar = document.getElementById("btnCifrar");
const btnDescifrar = document.getElementById("btnDescifrar");
const mensaje = document.getElementById("mensaje");
const resultado = document.getElementById("resultado");

let abriendoSelector = false; // Candado para evitar que se abran varias ventanas de selección de archivos al mismo tiempo
let turno = 0; // Contador que identifica cada operación nueva para ignorar procesos anteriores que hayan quedado pendientes

async function procesar(modo) { // Coordina todo el flujo de selección, validación y procesamiento según el modo elegido

  // Asigna un número de turno único a esta ejecución y define el texto de instrucción
  const miTurno = ++turno;
  const verbo = modo === "cifrar" ? "CIFRAR" : "DESCIFRAR";

  // Limpia resultados anteriores y muestra la guía en pantalla.
  resultado.textContent = "";
  mensaje.textContent = "Selecciona el archivo .txt que quieres " + verbo + ".";

  // Prepara la espera y abre la ventana de archivos protegiendo el estado con el candado.
  const espera = pedirArchivo();
  abriendoSelector = true;
  selector.click();
  abriendoSelector = false;
  // Espera a que el usuario seleccione un archivo válido o cancele.
  const archivo = await espera;

    // Si se inició otra operación mientras tanto, descarta esta para evitar cruces.
  if (miTurno !== turno) {
    return;
  }

  if (archivo === null) {    // Si no se entregó ningún archivo, informa que la operación fue cancelada.
    mensaje.textContent = "";
    resultado.textContent = "Operación cancelada.";
    return;
  }
  // Si va a cifrar, advierte si el archivo ya parece cifrado para evitar doble cifrado accidental
  mensaje.textContent = "";

    // Si el usuario eligió cifrar, revisa si el texto ya parece cifrado y pide confirmación para evitar hacerlo dos veces
  if (modo === "cifrar") {
    if (parecePreCifrado(archivo.texto)) {
      const seguir = confirm(
        "Este archivo ya parece estar cifrado. Si lo cifras otra vez quedará mucho más largo.\n\n" +
        "¿Quieres cifrarlo de nuevo de todas formas?"
      );
      if (!seguir) {
        resultado.textContent = "Operación cancelada. Para recuperar el texto usa DESCIFRAR ARCHIVO.";
        return;
      }
    }

    

    const cifrado = cifrar(archivo.texto);     // Cifra el texto del archivo y guarda el resultado

        // Comprueba de inmediato que al descifrarlo se recupere el texto exacto original; si falla, detiene el proceso
    if (descifrar(cifrado) !== archivo.texto) { 
      resultado.textContent = "¡Cuidado! Al descifrar no se obtiene el texto original. Revisen su sistema.";
      return;
    }

        // Genera el nombre con el sufijo "_cifrado", descarga el archivo y confirma en pantalla
    const nombre = nombreSalida(archivo.nombre, "_cifrado");
    descargar(cifrado, nombre);
    resultado.textContent = "Listo. Se descargó: " + nombre;
  } else {
        // Si el modo es descifrar, recupera el texto original, le añade "_descifrado" y lo descarga
    const descifrado = descifrar(archivo.texto);
    const nombre = nombreSalida(archivo.nombre, "_descifrado");
    descargar(descifrado, nombre);
    resultado.textContent = "Listo. Se descargó: " + nombre;
  }
}
// Conecta el botón de cifrar para iniciar el proceso en modo "cifrar"
btnCifrar.addEventListener("click", function () {
  procesar("cifrar");
});
// Conecta el botón de descifrar para iniciar el proceso en modo "descifrar"
btnDescifrar.addEventListener("click", function () {
  procesar("descifrar");
});

// Bloquea la apertura directa del selector de archivos si no se pulsó antes uno de los botones
selector.addEventListener("click", function (evento) {
  if (!abriendoSelector) {
    evento.preventDefault();
    mensaje.textContent = "Primero pulsa CIFRAR ARCHIVO o DESCIFRAR ARCHIVO.";
  }
});
