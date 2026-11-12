
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

// Construye automáticamente el diccionario inverso.
// Object.create(null) evita que palabras como "constructor" o "toString"
// se confundan con un código válido al descifrar.
const diccionarioDescifrado = Object.create(null);
for (const letra of Object.keys(diccionarioCifrado)) {
  diccionarioDescifrado[diccionarioCifrado[letra]] = letra;
}

// Pieza 1: Cambia cada carácter por su código. Si es un símbolo raro (como un emoji),
// lo guarda entre corchetes para poder recuperarlo sin perder información.
function sustituirPorCodigo(texto) {
  const listaCodigos = [];
  for (const caracter of texto) {
    if (Object.prototype.hasOwnProperty.call(diccionarioCifrado, caracter)) {
      listaCodigos.push(diccionarioCifrado[caracter]);
    } else {
      listaCodigos.push("[" + caracter + "]");
    }
  }
  return listaCodigos.join(" ");
}

// Inversa de la Pieza 1: Convierte los códigos de vuelta a caracteres originales
function revertirCodigo(textoCodigos) {
  const partes = textoCodigos.split(" ");
  let resultado = "";
  for (const celda of partes) {
    if (celda in diccionarioDescifrado) {
      resultado += diccionarioDescifrado[celda];
    } else if (celda.length >= 3 && celda.startsWith("[") && celda.endsWith("]")) {
      resultado += celda.slice(1, -1);
    } else {
      resultado += celda;
    }
  }
  return resultado;
}

// Pieza 2 (Pieza C de la guía): Invierte todo el texto
function invertir(texto) {
  return Array.from(texto).reverse().join("");
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
  const limpio = texto.trim();
  const paso1 = invertir(limpio);          // 1. Quita la inversión (orden inverso)
  const paso2 = revertirCodigo(paso1);     // 2. Devuelve los códigos a letras
  return paso2;
}

// Detecta si un texto ya parece salida de cifrar() (todo son códigos del diccionario).
function parecePreCifrado(texto) {
  const celdas = invertir(texto.trim()).split(" ");
  return celdas.every(function (celda) {
    return celda in diccionarioDescifrado;
  });
}


// ================= PARTE 2: ARCHIVOS =================

const selector = document.getElementById("archivo");
// El campo se oculta: el selector de archivos se abre desde los botones.
selector.style.display = "none";
let cancelarPendiente = null;

function pedirArchivo() {
  // Si había una petición anterior sin terminar (por ejemplo, un diálogo cancelado
  // que el navegador no avisó), se cierra para que no queden oyentes duplicados.
  if (cancelarPendiente) {
    cancelarPendiente();
  }

  return new Promise(function (entregar) {
    selector.value = "";

    function limpiar() {
      selector.removeEventListener("cancel", alCancelar);
      selector.removeEventListener("change", alCambiar);
      cancelarPendiente = null;
    }

    function alCancelar() {
      limpiar();
      entregar(null);
    }

    async function alCambiar() {
      limpiar();
      const archivo = selector.files[0];

      if (!archivo) {
        entregar(null);
        return;
      }

      if (!archivo.name.toLowerCase().endsWith(".txt")) {
        alert("El archivo debe ser de texto (.txt).");
        entregar(null);
        return;
      }

      const texto = await archivo.text();

      if (texto.length === 0) {
        alert("El archivo está vacío.");
        entregar(null);
        return;
      }

      entregar({ nombre: archivo.name, texto: texto });
    }

    cancelarPendiente = alCancelar;
    selector.addEventListener("cancel", alCancelar);
    selector.addEventListener("change", alCambiar);
  });
}

function descargar(contenido, nombreArchivo) {
  const blob = new Blob([contenido], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const enlace = document.createElement("a");
  enlace.href = url;
  enlace.download = nombreArchivo;
  document.body.appendChild(enlace);
  enlace.click();
  document.body.removeChild(enlace);
  setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
}

function nombreSalida(nombreOriginal, sufijo) {
  const sinExtension = nombreOriginal.slice(0, -4);
  return sinExtension + sufijo + ".txt";
}


// ================= PARTE 3: BOTONES =================
// Los botones de la página reemplazan al antiguo menú con prompt().

const btnCifrar = document.getElementById("btnCifrar");
const btnDescifrar = document.getElementById("btnDescifrar");
const mensaje = document.getElementById("mensaje");
const resultado = document.getElementById("resultado");

let abriendoSelector = false;
let turno = 0;

async function procesar(modo) {
  const miTurno = ++turno;
  const verbo = modo === "cifrar" ? "CIFRAR" : "DESCIFRAR";

  resultado.textContent = "";
  mensaje.textContent = "Selecciona el archivo .txt que quieres " + verbo + ".";

  const espera = pedirArchivo();
  abriendoSelector = true;
  selector.click();
  abriendoSelector = false;

  const archivo = await espera;

  // Si el usuario pulsó otro botón mientras tanto, esta operación ya no cuenta.
  if (miTurno !== turno) {
    return;
  }

  if (archivo === null) {
    mensaje.textContent = "";
    resultado.textContent = "Operación cancelada.";
    return;
  }

  mensaje.textContent = "";

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

    const cifrado = cifrar(archivo.texto);

    if (descifrar(cifrado) !== archivo.texto) {
      resultado.textContent = "¡Cuidado! Al descifrar no se obtiene el texto original. Revisen su sistema.";
      return;
    }

    const nombre = nombreSalida(archivo.nombre, "_cifrado");
    descargar(cifrado, nombre);
    resultado.textContent = "Listo. Se descargó: " + nombre;
  } else {
    const descifrado = descifrar(archivo.texto);
    const nombre = nombreSalida(archivo.nombre, "_descifrado");
    descargar(descifrado, nombre);
    resultado.textContent = "Listo. Se descargó: " + nombre;
  }
}

btnCifrar.addEventListener("click", function () {
  procesar("cifrar");
});

btnDescifrar.addEventListener("click", function () {
  procesar("descifrar");
});

// Si se pulsa directamente el campo de archivo sin elegir antes una acción, se avisa.
selector.addEventListener("click", function (evento) {
  if (!abriendoSelector) {
    evento.preventDefault();
    mensaje.textContent = "Primero pulsa CIFRAR ARCHIVO o DESCIFRAR ARCHIVO.";
  }
});