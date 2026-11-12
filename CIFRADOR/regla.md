# Documentación del Sistema de Cifrado — `regla.md`

## 1. Integrantes del grupo
* Johan Sebastian Jimenez
* Matias Leandro Sierra

---

## 2. Cómo usar el programa
1. Abre el archivo `index.html` haciendo doble clic sobre él para ejecutarlo en el navegador (Chrome o Edge).
2. En la página verás dos botones principales: **CIFRAR ARCHIVO** y **DESCIFRAR ARCHIVO**.
3. Haz clic en el botón de la acción que deseas realizar. El sistema abrirá automáticamente la ventana del explorador para elegir un archivo `.txt` (si se intenta activar el selector directamente sin elegir una acción antes, el sistema lo bloquea y muestra un aviso).
4. Selecciona tu archivo de texto. El programa validará que sea `.txt` y que no esté vacío, lo procesará y descargará automáticamente el resultado en tu carpeta de **Descargas** con el sufijo `_cifrado.txt` o `_descifrado.txt`.

---

## 3. Nuestro sistema
Nuestro sistema de cifrado combina **dos piezas secuenciales** para transformar cualquier texto en una secuencia ilegible sin perder información:

1. **Pieza 1 — Sustitución por códigos únicos (`sustituirPorCodigo`):** Cada carácter del texto original (letras mayúsculas, minúsculas, vocales con tilde o diéresis, números, signos, espacios y saltos de línea) se reemplaza por un código exclusivo de tres caracteres definido en `diccionarioCifrado` (por ejemplo, `'a'` se transforma en `'p69'` y `'A'` en `'P69'`). Si aparece un símbolo especial que no está en el diccionario (como un emoji o `@`), se encierra entre corchetes (`[carácter]`) para conservarlo intacto. Todos los códigos se unen separados por un espacio (`" "`).
2. **Pieza 2 — Inversión total del texto (`invertir` — Pieza C de la guía):** Una vez que todo el mensaje está convertido en códigos separados por espacios, se invierte por completo el orden de todos los caracteres de derecha a izquierda.

**¿Cómo se deshace?**
Se ejecutan los pasos en orden exactamente inverso:
1. Primero se limpia cualquier espacio o salto de línea accidental al final del archivo cifrado (`texto.trim()`) y se vuelve a invertir el texto completo para devolver los códigos a su posición original.
2. Luego se separan los códigos usando los espacios (`split(" ")`) y se reemplaza cada código por su carácter original consultando `diccionarioDescifrado` (o quitando los corchetes `[ ]` si era un símbolo externo).

---

## 4. Ejemplo a mano

### Ejemplo 1: `HOLA`
* **Texto original:** `HOLA`
* **Paso 1 (Sustitución por código):**
  * `H` → `R70`
  * `O` → `T71`
  * `L` → `Q71`
  * `A` → `P69`
  * *Resultado Paso 1:* `R70 T71 Q71 P69`
* **Paso 2 (Invertir todo el texto):**
  * Se invierte carácter por carácter: `96P 17Q 17T 07R`
* **Texto cifrado final:** `96P 17Q 17T 07R`

### Ejemplo 2: `Ñandú`
* **Texto original:** `Ñandú`
* **Paso 1 (Sustitución por código):**
  * `Ñ` → `U71`
  * `a` → `p69`
  * `n` → `s71`
  * `d` → `s69`
  * `ú` → `u01`
  * *Resultado Paso 1:* `U71 p69 s71 s69 u01`
* **Paso 2 (Invertir todo el texto):**
  * Se invierte carácter por carácter: `10u 96s 17s 96p 17U`
* **Texto cifrado final:** `10u 96s 17s 96p 17U`

---

## 5. Explicación del código (Parte 1)
* **`diccionarioCifrado` y `diccionarioDescifrado`:** `diccionarioCifrado` es un objeto que asigna un código único de 3 caracteres a cada letra, número y signo. `diccionarioDescifrado` se crea con `Object.create(null)` (para evitar colisiones con propiedades heredadas de JavaScript como `toString` o `constructor`) y se llena automáticamente invirtiendo claves y valores mediante `Object.keys()`.
* **`sustituirPorCodigo(texto)`:** Recorre el texto carácter por carácter con `for...of`. Usa `hasOwnProperty` para comprobar si el carácter existe en el diccionario; si existe agrega su código a un arreglo, y si no existe lo guarda entre corchetes (`"[" + caracter + "]"`). Devuelve el arreglo unido por espacios (`join(" ")`).
* **`revertirCodigo(textoCodigos)`:** Divide la cadena cifrada por espacios con `split(" ")`. Si el fragmento está en `diccionarioDescifrado`, recupera la letra original; si tiene corchetes al inicio y al final (`celda.length >= 3`), extrae el carácter interno con `slice(1, -1)`.
* **`invertir(texto)`:** Convierte el texto en un arreglo de caracteres con `Array.from(texto)` (respetando emojis y caracteres especiales), invierte el orden con `.reverse()` y lo vuelve a unir con `.join("")`.
* **`cifrar(texto)`:** Aplica primero `sustituirPorCodigo(texto)` y al resultado le aplica `invertir(paso1)`.
* **`descifrar(texto)`:** Limpia los bordes con `texto.trim()` (para evitar que un salto de línea añadido por un editor rompa el primer código al invertir), aplica `invertir(limpio)` y finalmente `revertirCodigo(paso1)`.
* **`parecePreCifrado(texto)`:** Función auxiliar de seguridad que invierte el texto y verifica con `.every()` si todos los bloques coinciden con códigos válidos del diccionario, avisando al usuario si intenta cifrar un archivo que ya estaba cifrado.

---

## 6. Cómo funciona el programa
* **Interfaz, botones y protecciones (`Parte 3`):** El programa utiliza los botones `btnCifrar` y `btnDescifrar` conectados a la función asíncrona `procesar(modo)`. Esta función gestiona un contador `turno` para cancelar operaciones anteriores si el usuario cambia de botón rápidamente, activa la bandera `abriendoSelector` antes de ejecutar `selector.click()` y cuenta con un escuchador `selector.addEventListener("click", ...)` que usa `evento.preventDefault()` para bloquear el selector si se intenta abrir sin haber pulsado primero uno de los botones. Además, verifica con `parecePreCifrado()` si el texto ya estaba cifrado y realiza la autoverificación `descifrar(cifrado) !== archivo.texto` antes de descargar.
* **Lectura de archivos (`Parte 2`):** Debido a la caja de arena (*sandbox*) del navegador, `pedirArchivo()` oculta el `<input type="file">`, lo dispara desde código y devuelve una `Promise`. Escucha los eventos `"change"` y `"cancel"`, limpia escuchadores previos con `cancelarPendiente` para no acumular eventos, valida que sea `.txt` y que no esté vacío, y lee el texto de forma asíncrona con `await archivo.text()`.
* **Creación y descarga (`descargar` y `nombreSalida`):** Crea un archivo virtual en memoria UTF-8 mediante `new Blob([contenido], { type: "text/plain;charset=utf-8" })`, genera una URL temporal con `URL.createObjectURL()`, añade temporalmente una etiqueta `<a>` al `document.body` para ejecutar la descarga con el sufijo `_cifrado.txt` o `_descifrado.txt` y libera la memoria un segundo después con `URL.revokeObjectURL()`.

---

## 7. Verificación
1. Preparamos el archivo `original.txt` con más de 3 líneas de texto variado (mayúsculas, minúsculas, `ñ`, vocales con tilde, diéresis, números y signos).
2. Ejecutamos el programa para cifrar `original.txt`, obteniendo `original_cifrado.txt`, y luego desciframos ese archivo para obtener `original_cifrado_descifrado.txt`.
3. En **Visual Studio Code**, usamos la herramienta de comparación (*Select for Compare* en `original.txt` y *Compare with Selected* en `original_cifrado_descifrado.txt`).
4. **Resultado:** VS Code confirmó que **no existe ninguna diferencia** entre el archivo original y el descifrado. También realizamos pruebas con textos externos (noticias y símbolos especiales) verificando que la recuperación es exacta.

---

## 8. Por qué es reversible
El sistema garantiza que nunca se pierda información por cuatro motivos técnicos:
1. **Biyección en el diccionario:** Cada carácter tiene un código exclusivo y distinto de 3 caracteres; ninguna clave comparte valor con otra (se diferencian mayúsculas, minúsculas y tildes).
2. **Protección de símbolos externos:** Cualquier carácter que no esté en el diccionario se encapsula entre corchetes `[ ]`, permitiendo identificarlo y restaurarlo sin convertirlo en `undefined`.
3. **Aislamiento de diccionario con `Object.create(null)`:** Evita que palabras reservadas de objetos en JavaScript interfieran con la búsqueda de códigos al descifrar.
4. **Inversión exacta:** `Array.from(texto).reverse().join("")` invierte los caracteres manteniendo intactos los caracteres compuestos o emojis, y aplicarlo dos veces devuelve la cadena original.

---

## 9. Intercambio entre grupos
* **Grupo asignado:** [Escribir el número o nombre del otro grupo]
* **¿Logramos romper su sistema?:** [Escribir Sí o No]
* **Cómo lo intentamos y análisis:** [Explicar qué pista les dieron, si probaron fuerza bruta en la consola o análisis de frecuencia con `console.table()`, y qué elementos dificultaron o permitieron descifrar el mensaje].

---

## 10. Respuestas a las preguntas de la Práctica 1

1. **¿Por qué `archivo.size` y `texto.length` dan números distintos?**
   Porque `archivo.size` mide el peso físico del archivo en **bytes**, mientras que `texto.length` cuenta la cantidad de **caracteres** en JavaScript. En la codificación **UTF-8**, los caracteres básicos ASCII (letras sin tilde, números y signos simples) ocupan 1 byte, pero la `ñ`, las vocales con tilde (`á, é, í, ó, ú`) y la diéresis (`ü`) ocupan **2 bytes** cada uno. Por ello, cuando el texto incluye estos caracteres, `archivo.size` siempre será mayor que `texto.length`.

2. **¿Por qué una página web no puede leer un archivo de tu computador sin que tú lo elijas?**
   Por seguridad. Los navegadores ejecutan JavaScript dentro de un entorno aislado llamado **"caja de arena" (*sandbox*)**. Esta restricción impide que cualquier sitio web acceda libremente a las carpetas del sistema operativo o lea archivos privados sin el consentimiento explícito del usuario mediante un selector de archivos.

3. **¿Qué quedaría guardado en la variable si escribes `archivo.text()` sin `await`?**
