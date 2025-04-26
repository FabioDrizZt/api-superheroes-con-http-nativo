// -----------------------------------------------------------------------------
// Paso 1: Importar los módulos necesarios
// -----------------------------------------------------------------------------
// Necesitamos 'http' para crear el servidor y manejar las peticiones/respuestas.
const http = require('http');
// Necesitamos 'fs' (File System) para leer nuestro archivo de datos.
const fs = require('fs');

// -----------------------------------------------------------------------------
// Paso 2: Cargar los datos de los superhéroes
// -----------------------------------------------------------------------------
// Vamos a leer el archivo 'superheroes.json' de forma síncrona al inicio.
// Esto es aceptable aquí porque es una operación que solo hacemos una vez
// cuando el servidor arranca. Si el archivo fuera muy grande o esto fuera
// una operación frecuente, consideraríamos la versión asíncrona.
let superheroesData = []; // Inicializamos un array vacío por si falla la lectura
try {
  // Leemos el contenido del archivo especificando la codificación 'utf-8' para obtener un string.
  const rawData = fs.readFileSync('./superheroes.json', 'utf-8');
  // Parseamos el string JSON a un objeto/array JavaScript.
  superheroesData = JSON.parse(rawData);
  console.log("Datos de superhéroes cargados exitosamente.");
} catch (error) {
  // Si hay un error (ej: archivo no existe, JSON inválido), lo mostramos
  // y el servidor funcionará con un array vacío o podríamos decidir detenerlo.
  console.error("Error al cargar o parsear 'superheroes.json':", error);
  // Podríamos optar por salir si los datos son cruciales:
  // process.exit(1);
}

// -----------------------------------------------------------------------------
// Paso 3: Crear el servidor HTTP
// -----------------------------------------------------------------------------
// http.createServer() recibe una función callback que se ejecutará CADA VEZ
// que llegue una petición al servidor. Esta función recibe dos argumentos:
// 'req' (request): Objeto con información de la petición del cliente (URL, método, headers, etc.).
// 'res' (response): Objeto que usamos para enviar la respuesta al cliente.
const server = http.createServer((req, res) => {
  console.log(`Recibida petición: ${req.method} ${req.url}`); // Log para ver qué llega

  // -------------------------------------------------------------------------
  // Paso 4: Implementar el enrutamiento y lógica de cada ruta
  // -------------------------------------------------------------------------
  // Analizamos la URL solicitada para determinar qué acción tomar.
  const url = req.url;
  const method = req.method; // Aunque solo esperamos GET, es buena práctica verificarlo.

  // --- Ruta /superheroes/all ---
  if (url === '/superheroes/all' && method === 'GET') {
    // Establecemos la cabecera 'Content-Type' para indicar que la respuesta es JSON.
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    // Enviamos los datos completos de superhéroes, convertidos a string JSON.
    res.end(JSON.stringify(superheroesData));

    // --- Ruta /superheroes/id/:indice ---
  } else if (url.startsWith('/superheroes/id/') && method === 'GET') {
    // Extraemos el índice de la URL.
    // Ejemplo: /superheroes/id/2 -> parts = ['', 'superheroes', 'id', '2']
    const parts = url.split('/');
    const indexStr = parts[3]; // El índice estará en la cuarta posición

    if (indexStr) { // Verificamos que exista algo después de /id/
      const index = parseInt(indexStr, 10); // Convertimos a número base 10

      // Validamos el índice:
      // 1. ¿Es un número válido? (isNaN)
      // 2. ¿Está dentro del rango del array? (>= 0 y < longitud)
      if (!isNaN(index) && index >= 0 && index < superheroesData.length) {
        const superhero = superheroesData[index];
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify(superhero));
      } else {
        // Índice inválido o fuera de rango
        res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' }); // Usamos 404 como "no encontrado"
        res.end(JSON.stringify({ error: 'Superhéroe no encontrado para ese índice.' }));
      }
    } else {
      // No se proporcionó índice después de /id/
      res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' }); // Bad Request
      res.end(JSON.stringify({ error: 'Falta el índice del superhéroe en la URL.' }));
    }

    // --- Ruta /superheroes/nombre/:nombre_superheroe ---
  } else if (url.startsWith('/superheroes/nombre/') && method === 'GET') {
    // Extraemos el nombre de la URL.
    const parts = url.split('/');
    let searchNameEncoded = parts[3]; // El nombre estará en la cuarta posición

    if (searchNameEncoded) { // Verificamos que exista algo después de /nombre/
      // Decodificamos el nombre por si contiene caracteres especiales (ej: %20 para espacios)
      const searchName = decodeURIComponent(searchNameEncoded).toLowerCase();

      // Filtramos el array buscando coincidencias parciales (includes) sin importar mayúsculas/minúsculas.
      const results = superheroesData.filter(hero =>
        hero.nombre_superheroe.toLowerCase().includes(searchName)
      );

      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      // Devolvemos el array de resultados (puede estar vacío si no hay coincidencias).
      res.end(JSON.stringify(results));
    } else {
      // No se proporcionó nombre después de /nombre/
      res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' }); // Bad Request
      res.end(JSON.stringify({ error: 'Falta el nombre del superhéroe en la URL.' }));
    }

    // --- Rutas Inexistentes ---
  } else {
    // Si la URL no coincide con ninguna ruta definida
    res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' }); // Not Found
    res.end(JSON.stringify({ error: 'Ruta no encontrada.' }));
  }
});

// -----------------------------------------------------------------------------
// Paso 5: Iniciar el servidor y escuchar en un puerto
// -----------------------------------------------------------------------------
// Definimos el puerto en el que escuchará nuestro servidor.
const PORT = 3000; // Puerto estándar para desarrollo local
// server.listen() inicia el servidor. El callback se ejecuta una vez que el servidor
// está listo para aceptar conexiones.
server.listen(PORT, () => {
  console.log(`¡Servidor de Superhéroes escuchando en http://localhost:${PORT}!`);
  console.log("Rutas disponibles:");
  console.log(` -> GET http://localhost:${PORT}/superheroes/all`);
  console.log(` -> GET http://localhost:${PORT}/superheroes/id/{indice}`);
  console.log(` -> GET http://localhost:${PORT}/superheroes/nombre/{nombre}`);
});