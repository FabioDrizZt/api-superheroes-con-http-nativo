# API de Superhéroes con Módulo HTTP Nativo de Node.js

Este proyecto es una implementación de una API RESTful simple para gestionar una colección de superhéroes. Fue desarrollado como parte de una práctica para demostrar el uso del módulo `http` incorporado en Node.js, sin depender de frameworks externos como Express.

La API lee datos desde un archivo `superheroes.json` y permite a los clientes obtener la lista completa de superhéroes, buscar por índice numérico o buscar por nombre.

## Características

- **Servidor HTTP Básico:** Creado utilizando únicamente el módulo `http` de Node.js.
- **Enrutamiento Simple:** Implementa un sistema de enrutamiento basado en la URL solicitada.
- **Fuente de Datos JSON:** Utiliza `superheroes.json` como base de datos.
- **Endpoints Definidos:**
  - `GET /superheroes/all`: Devuelve todos los superhéroes.
  - `GET /superheroes/id/:indice`: Devuelve un superhéroe por su posición (índice) en el array.
  - `GET /superheroes/nombre/:nombre_superheroe`: Busca superhéroes por nombre (coincidencia parcial, insensible a mayúsculas/minúsculas).
- **Manejo de Errores:** Devuelve respuestas JSON con códigos de estado apropiados (404 para rutas no encontradas o índices inválidos, 400 para peticiones mal formadas).

## Prerrequisitos

- [Node.js](https://nodejs.org/) (incluye npm) instalado en tu sistema. Se recomienda una versión LTS reciente.

## Instalación

1.  **Clona el repositorio:**
    ```bash
    git clone <URL_DEL_REPOSITORIO>
    cd <NOMBRE_DEL_DIRECTORIO>
    ```
2.  **Asegura el archivo de datos:**
    Este proyecto requiere un archivo llamado `superheroes.json` en la raíz del directorio. Asegúrate de que exista y contenga un array de objetos de superhéroes con el formato esperado. Un ejemplo del contenido se encuentra más abajo o puedes usar el archivo incluido en el repositorio si existe.

    _Formato esperado para cada objeto en `superheroes.json`:_

    ```json
    {
      "id": 1,
      "nombre_real": "Bruce Wayne",
      "nombre_superheroe": "Batman",
      "poderes": [
        "inteligencia",
        "entrenamiento en artes marciales",
        "tecnología avanzada"
      ],
      "grupo": "Liga de la Justicia"
    }
    ```

## Ejecución

1.  Abre una terminal en el directorio del proyecto.
2.  Ejecuta el servidor con Node.js:
    ```bash
    node server.js
    ```
3.  Si todo va bien, verás un mensaje en la consola indicando que el servidor está escuchando en `http://localhost:3000`.

## Endpoints de la API

La API expone las siguientes rutas (todas usan el método `GET`):

- **`GET /superheroes/all`**

  - **Descripción:** Devuelve la lista completa de superhéroes almacenada en `superheroes.json`.
  - **Respuesta Exitosa (200 OK):** Un array JSON con todos los objetos de superhéroes.
  - **Ejemplo:** `http://localhost:3000/superheroes/all`

- **`GET /superheroes/id/:indice`**

  - **Descripción:** Devuelve un único superhéroe basado en su posición (índice numérico de base 0) dentro del array del archivo JSON.
  - **:indice:** Debe ser un número entero no negativo.
  - **Respuesta Exitosa (200 OK):** Un objeto JSON que representa al superhéroe encontrado en esa posición.
  - **Respuesta de Error (404 Not Found):** Si el índice no es un número válido o está fuera del rango del array. Devuelve un objeto JSON `{ "error": "Superhéroe no encontrado para ese índice." }`.
  - **Respuesta de Error (400 Bad Request):** Si no se proporciona el índice después de `/id/`. Devuelve `{ "error": "Falta el índice del superhéroe en la URL." }`.
  - **Ejemplos:**
    - `http://localhost:3000/superheroes/id/0` (Devuelve el primer superhéroe)
    - `http://localhost:3000/superheroes/id/5`
    - `http://localhost:3000/superheroes/id/99` (Probablemente error 404)

- **`GET /superheroes/nombre/:nombre_superheroe`**

  - **Descripción:** Busca superhéroes cuyo campo `nombre_superheroe` coincida parcial o totalmente con el parámetro proporcionado. La búsqueda no distingue entre mayúsculas y minúsculas.
  - **:nombre_superheroe:** El término de búsqueda. Los espacios y caracteres especiales deben estar codificados para URL (aunque la mayoría de los clientes lo hacen automáticamente).
  - **Respuesta Exitosa (200 OK):** Un array JSON que contiene todos los objetos de superhéroes que coinciden con la búsqueda. El array estará vacío (`[]`) si no se encuentran coincidencias.
  - **Respuesta de Error (400 Bad Request):** Si no se proporciona el nombre después de `/nombre/`. Devuelve `{ "error": "Falta el nombre del superhéroe en la URL." }`.
  - **Ejemplos:**
    - `http://localhost:3000/superheroes/nombre/man` (Busca nombres que contengan "man")
    - `http://localhost:3000/superheroes/nombre/Capitana`
    - `http://localhost:3000/superheroes/nombre/Wonder%20Woman` (Nombre con espacio codificado)
    - `http://localhost:3000/superheroes/nombre/thor` (Probablemente devolverá `[]`)

- **Cualquier otra ruta**
  - **Descripción:** Si se accede a una URL que no coincide con ninguna de las rutas definidas (ej. `/villanos`, `/`).
  - **Respuesta (404 Not Found):** Devuelve un objeto JSON `{ "error": "Ruta no encontrada." }`.

## Pruebas

Puedes probar la API utilizando herramientas como:

1.  **REST Client (Extensión de VS Code):**
    - Si tienes la extensión "REST Client" instalada, puedes usar el archivo `superheroes-api.http` (si está incluido en el repositorio) para enviar peticiones predefinidas a todos los endpoints. Simplemente abre el archivo y haz clic en "Send Request".
2.  **`curl` (Línea de comandos):**

    ```bash
    # Obtener todos
    curl http://localhost:3000/superheroes/all

    # Obtener por índice 2
    curl http://localhost:3000/superheroes/id/2

    # Buscar por nombre "Woman"
    curl http://localhost:3000/superheroes/nombre/Woman

    # Probar ruta inexistente (muestra headers con -i)
    curl -i http://localhost:3000/ruta/invalida
    ```

3.  **Postman, Insomnia, Rest Client u otras herramientas de cliente API vistas en clase.**
4.  **Tu navegador web** (para las peticiones GET simples).

## Estructura del Proyecto
```
/
├── server.js           # Lógica principal del servidor y API
├── superheroes.json    # Base de datos de superhéroes
├── superheroes-api.http # Archivo para pruebas con REST Client
└── README.md           # Este archivo
```
