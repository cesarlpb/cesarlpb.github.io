// Definicion variables
const canvas = document.getElementById('juegoSerpiente');
const ctx = canvas.getContext('2d');
const botonSt = document.getElementById('botonStart');
const puntosDisplay = document.getElementById('puntos');
const cuadrado = 20;
// Empieza el juego con la serpiente en medio de la pantalla
let serpiente = [{x: canvas.width/2, y: canvas.height/2}];
let dx = cuadrado;
let dy = 0;
// Asignación aleatoria coordenadas con valor entero redondeado
// en una cuadrícula de 20x20 y múltiplo del tamaño del cuadrado 
let manzana = {x: Math.floor(Math.random() * 20) * cuadrado, y: Math.floor(Math.random() * 20) * cuadrado};
let juego;
let puntos = 0;
ctx.fillStyle = "rgba(100,255,100,0.8)";
ctx.fillRect(0, 0, canvas.width, canvas.height);
let selectorVeloz = document.getElementById('veloz');

// Eventos listener para boton Start del juego y flechas teclado
botonSt.addEventListener('click', empiezoJ);
document.addEventListener('keydown', cambioDireccion);

function empiezoJ() {
  // Reset juego
  serpiente = [{x: canvas.width/2, y: canvas.height/2}];
  dx = cuadrado;
  dy = 0;
  manzana = {x: Math.floor(Math.random() * 20) * cuadrado, y: Math.floor(Math.random() * 20) * cuadrado};
  puntos = 0;

  // Detener el intervalo del juego
  if (juego) {
    clearInterval(juego);
  }
  
  // Velocidad juego. Convierte este valor de cadena a un número entero
    velo = parseInt(selectorVeloz.value);

  // Optiene texto del option
    combo = document.getElementById('veloz');
    nivel = combo.options[combo.selectedIndex].text;
    salida = ("Puntuación de: " + puntos + " Manzanas - Nivel Juego: " + nivel);
    document.getElementById("output").innerHTML = salida;

  // Empieza juego si se selecciona velocidad, y define el intervalo actualización juego
  if (velo >= 100 && velo <= 200) {
    juego = setInterval(dibujo, velo);
  }
}

function cambioDireccion(e) {
  if (e.keyCode === 37 && dx !== cuadrado) { // flecha izquierda
    dx = -cuadrado;
    dy = 0;
  } else if (e.keyCode === 38 && dy !== cuadrado) { // flecha arriba
    dx = 0;
    dy = -cuadrado;
  } else if (e.keyCode === 39 && dx !== -cuadrado) { // flecha derecha
    dx = cuadrado;
    dy = 0;
  } else if (e.keyCode === 40 && dy !== -cuadrado) { // flecha abajo
    dx = 0;
    dy = cuadrado;
  }
}

function dibujo() {
  // Borra todo el area del cuadrado
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Background cesped
  let imagen = new Image();
  imagen.src = "cesped.png";
  let patron = ctx.createPattern(imagen, "no-repeat");
  ctx.fillStyle = patron;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Cuadrado manzana
  ctx.fillStyle = 'red';
  ctx.fillRect(manzana.x, manzana.y, cuadrado, cuadrado);

  // Contorno cuadrado manzana
  ctx.strokeStyle = 'black';
  ctx.strokeRect(manzana.x, manzana.y, cuadrado, cuadrado);

  // Cuadrado serpiente
  ctx.fillStyle = 'white';
  serpiente.forEach((segment) => {
  ctx.fillRect(segment.x, segment.y, cuadrado, cuadrado);
  
  // Contorno cuadrado serpiente
  ctx.strokeStyle = 'black';
  ctx.strokeRect(segment.x, segment.y, cuadrado, cuadrado);
  });

  // Agrega una coordenada al array serpiente
  const cabeza = {x: serpiente[0].x + dx, y: serpiente[0].y + dy};
  serpiente.unshift(cabeza);

  // Comprueba si la serpiente come manzana sino elimina última coordenada del array y la devuelve
  // cada diez manzanas sube un nivel
  if (cabeza.x === manzana.x && cabeza.y === manzana.y) {
    manzana = {x: Math.floor(Math.random() * 20) * cuadrado, y: Math.floor(Math.random() * 20) * cuadrado};
    puntos++;
    salida = ("Puntuación de: " + puntos + " Manzanas - Nivel Juego: " + nivel);
    document.getElementById("output").innerHTML = salida;
    if (puntos % 10 === 0) {
      levelUp();
    }
  } else {
    serpiente.pop();
  }

  // Comprueba si la serpiente colisiona con el limite o ella misma, entonces finaliza juego
  if (cabeza.x < 0 || cabeza.x >= canvas.width || cabeza.y < 0 || cabeza.y >= canvas.height || colision()) {
    clearInterval(juego);
    alert("Fin del Juego !!! ");
  }
}

// Función para subir nivel cada 10 manzanas
function levelUp() {
  clearInterval(juego);
  juego = setInterval(dibujo, velo);
  velo = Math.max(velo - 50, 100)
   if (velo === 200) {
    nivel = "Facil";
  } else if (velo === 150) {
    nivel =  "Medio";
  } else if (velo === 100) {
    nivel =  "Difícil";
  } else {
    nivel = nivel;
  }
  output = ("Puntuación de: " + puntos + " Manzanas - Nivel Juego: " + nivel);
  document.getElementById("output").innerHTML = output;
}

// Comprueba colision con ella misma:
// 'serpiente.slice(1)' matriz que contiene todos los segmentos de la serpiente, excepto la cabeza.
// 'some()' pasa por cada elemento en la matriz serpiente.slice(1), y
// aplica la función (segment => segment.x === serpiente[0].x && segment.y === serpiente[0].y) a cada segmento
function colision() {
  return serpiente.slice(1).some(segment => segment.x === serpiente[0].x && segment.y === serpiente[0].y);
}
