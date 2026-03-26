# Taller 2
## Spec-driven para una web turística simple

**spec-drive :=** *specification driven* quiere decir que el trabajo se basa
en indicaciones, diagramas, flujos, etc. que se le da al equipo o a las 
herramientas de IA para trabajar.

---

## Objetivo del taller

- Diseñar una web turística simple a partir de especificaciones
- Pensar el flujo del usuario, no el código
- Identificar pantallas, datos y llamadas a APIs
- Publicar una versión básica en GitHub Pages, Vercel o similar

**Nota:** puedes usar anotaciones o diagramas para apoyar los specs
---

## Qué vamos a construir

Una web simple que permita:

- Login mock
- Ver reservas del usuario
- Ver viajes o itinerarios
- Mostrar datos traídos desde una API o mock
- Navegar entre pantallas básicas

---

## En qué nos centraremos

- Qué hace el usuario
- Qué pantalla necesita
- Qué datos turísticos intervienen
- Qué petición API ocurre
- Qué respuesta vuelve al frontend

No buscamos programar complejo.  
Buscamos modelar bien el producto.

---

## Flujo mínimo propuesto

1. Home
2. Login mock
3. Dashboard
4. Mis reservas
5. Mis viajes
6. Logout

---

## Datos turísticos que aparecerán

- usuario
- reserva
- destino
- fecha
- precio
- estado de reserva

---

## APIs / mocks

Podemos usar:

- datos mock en JSON
- una API sencilla montada por el profesor
- Supabase o VPS como backend de apoyo

La idea no es desarrollar backend,
sino entender cómo el frontend consume datos mediante APIs.

---

## Herramienta sugerida

### Opción recomendada
- Bolt.new o Replit en navegador

### Despliegue
- GitHub Pages para versión estática
- Vercel para despliegue rápido

---

## Recomendación metodológica

Todos los proyectos parten de una plantilla base común.

Cada alumno o grupo define:
- su tipo de web turística
- sus pantallas
- sus datos
- sus endpoints esperados

Después, sobre esa base, se adapta el proyecto.

---

## Actividad rápida (8–10 min)

Define tu producto en 5 puntos:

1. Tipo de web turística
2. Usuario principal
3. 3 pantallas clave
4. 3 datos clave
5. 2 endpoints que necesitaría

---

## Entregable del taller

Un mini spec visual con:

- nombre del proyecto
- flujo del usuario
- pantallas
- datos
- endpoints o mocks

### Ejemplo de spec simple

### Proyecto
TravelMini BCN

### Usuario
Turista con reservas activas

### Pantallas
- Login
- Mis reservas
- Mis viajes

### Datos
- nombre
- destino
- fecha
- precio
- estado

### Endpoints (datos que necesitas)
- GET /me/reservas
- GET /me/viajes

---

- No hace falta código perfecto.
- Hace falta una idea clara.