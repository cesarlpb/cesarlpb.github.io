let datosObtenidos; // Declara una variable global para almacenar los datos

function obtenerDatos() {
  return fetch('datos.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('No se pudo cargar el archivo JSON.');
      }
      return response.json();
    })
    .then(data => {
      datosObtenidos = data; // Asigna los datos a la variable global
    })
    .catch(error => {
      console.error('Error de red:', error);
    });
}

function $(id) {
  return document.getElementById(id);
}
function formatearFecha(fecha) {
  // Obtiene el día, el mes y el año de la fecha
  var dia = fecha.getDate();
  var mes = fecha.getMonth() + 1; // Se suma 1 porque los meses son indexados desde 0
  var anio = fecha.getFullYear();

  // Agrega ceros a la izquierda si es necesario
  if (dia < 10) {
    dia = '0' + dia;
  }
  if (mes < 10) {
    mes = '0' + mes;
  }

  // Retorna la fecha formateada como "dd/mm/aaaa"
  return dia + '/' + mes + '/' + anio;
}

function formatearUrlVideo(url, titulo){
  const esDeYoutube = /^https?:\/\/(www\.)?(youtube\.com|youtu\.be)/.test(url);
  console.log(esDeYoutube)
  if(esDeYoutube){
    const videoId = url.split('v=')[1];
    const embedCode = `<iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
    return embedCode;
  }
  return `<a href="${formatearUrlVideo(url)}" target="_blank" rel='noreferrer'>${titulo}</a>`;
}

document.addEventListener("DOMContentLoaded", function() {
  obtenerDatos()
    .then(() => {
      const rolesJson = datosObtenidos;
      const roles = rolesJson.roles;

      const leyendaLista = document.getElementById("leyenda-lista");
      const diagrama = document.getElementById("diagrama");
      let seleccionadoIndex = null; // Almacena el índice del elemento seleccionado

      // Función para manejar el clic en los elementos de la lista
      function handleListItemClick(event) {
        // Remover la clase 'item-seleccionado' de todos los elementos
        document.querySelectorAll('.item-seleccionado').forEach(el => {
          el.classList.remove('item-seleccionado');
        });
      
        // Remover la clase 'seleccionado' de todos los caminos
        document.querySelectorAll('.camino.seleccionado').forEach(camino => {
          camino.classList.remove('seleccionado');
        });
        document.querySelectorAll('.camino.seleccionado-hover').forEach(camino => {
          camino.classList.remove('seleccionado-hover');
        });
      
        const index = event.target.dataset.index;
        seleccionadoIndex = index; // Actualizar el índice del elemento seleccionado
      
        // Añadir la clase 'item-seleccionado' al ítem clickeado para aplicar la animación
        event.target.classList.add('item-seleccionado');
      
        const camino = document.querySelector(`.camino[data-index="${index}"]`);
        if (camino) {
          camino.classList.add("seleccionado");
        }
      }  
      

      roles.forEach((rol, index) => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `<div class="d-flex"><span class="icon-container">${rol.icono}</span> <span>${rol.nombre}</span></div>`
        // listItem.textContent = rol.nombre;
        listItem.dataset.index = index; // Almacenar el índice del rol
        
        listItem.addEventListener("click", handleListItemClick);
        
        listItem.addEventListener("mouseenter", (event) => {
          const camino = document.querySelector(`.camino[data-index="${event.target.dataset.index}"]`);
          camino.classList.add("seleccionado-hover");
        });

        listItem.addEventListener("mouseleave", (event) => {
          // Verificar si el elemento actual es el seleccionado antes de des-resaltar
          if (event.target.dataset.index !== seleccionadoIndex) {
            const camino = document.querySelector(`.camino[data-index="${event.target.dataset.index}"]`);
            camino.classList.remove("seleccionado-hover");
          }
        });

        leyendaLista.appendChild(listItem);

        const camino = document.createElement("div");
        camino.classList.add("camino");
        camino.dataset.index = index; // Importante para identificar cada camino con su índice
        
        // Ejemplo de vídeo en itinerario:
        // {"order": 1, "titulo": "Titulo 1", "url": "https://www.youtube.com/watch?v=videoId"}
          

        // camino.innerHTML = `<h3>${rol.nombre}</h3><p>${rol.resumen}</p><ul>${rol.itinerario.map(item => `<li>${item}</li>`).join("")}</ul>`;
        
        // camino.innerHTML = `<h3>${rol.nombre}</h3><p>${rol.resumen}</p><ul>${rol.itinerario.map(item => {
        //   if (Array.isArray(item)) {
        //     return `<li><strong class="text-blue-darker">${item[0].toUpperCase()}:</strong> ${item[1]}</li>`;
        //   } else {
        //     return `<li>${item}</li>`;
        //   }
        // }).join("")}</ul>`;   

        camino.innerHTML = `<h3>${rol.nombre}</h3><p>${rol.resumen}</p>
        <details>
        <summary>Ver contenido del itinerario</summary>
        <ul>${rol.itinerario.map(item => {
          if (Array.isArray(item)) {
            if (item.length === 3 && typeof item[2] === 'object') {
              const { videos = [], docs = [] } = item[2];
              const enlacesHTML = [
                ...videos.map(video => `<li>${formatearUrlVideo(video.url)}</li>`),
                ...docs.map(doc => `<li><span class='icon-container'><i class="gg-notes"></i>
                  </span>${doc?.duracion ? 
                    "<span class='icon-container'><i class='gg-time'></i></span><span class='w-100px'>" + doc.duracion + '</span> ' 
                    : ''}
                    <a href="${doc.url}" target="_blank" rel='noreferrer'>${doc.titulo}</a></li>
                    ${doc?.descripcion ? 
                    '<p>' + doc.descripcion + '</p>'
                    : ''}`)
              ].join('');
              return `<li><strong>${item[0].toUpperCase()}:</strong> ${item[1]}<ul>${enlacesHTML}</ul></li>`;
            } else {
              return `<li><strong>${item[0].toUpperCase()}:</strong> ${item[1]}</li>`;
            }
          } else {
            return `<li>${item}</li>`;
          }
        }).join("")}</ul></details>`;        
        diagrama.appendChild(camino);

        // Actualizo footer
        const autor = "<a href='https://github.com/cesarlpb' target='_blank' rel='noreferrer'>César P.</a>"
        const fecha = ""
        const empresa = "<a href='https://onets.es/' target='_blank' rel='noreferrer'>Onets Spain Division</a>"
        function actualizarFooter(){
          const autorEl = $('autor'); autorEl.innerHTML = autor;
          const fechaEl = $('fecha'); fechaEl.innerHTML = formatearFecha(new Date());
          const EmpresaEl = $('empresa'); EmpresaEl.innerHTML = empresa;
        }
        actualizarFooter();
      });
    });
});
