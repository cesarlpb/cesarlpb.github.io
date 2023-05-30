import { idiomas } from './idiomas.js'
import { experiencia } from './experiencia.js'
import { proyectos } from './proyectos.js'
import { detalles } from './detalles.js'

// Idiomas
let el = document.getElementById("idiomas"); const langs = idiomas.es;
for(const d of langs){
  el.innerHTML += `<p class="mb-1">${d.idioma}</p>
<div class="progress" style="height: 0.65rem;">
  <div class="progress-bar" role="progressbar" style="width: ${d.nivel}%" aria-valuenow="${d.nivel}" aria-valuemin="0" aria-valuemax="100"></div>
</div>`
}
// Experiencia
let exp = document.getElementById("experiencia"); const exps = experiencia.es;
for(const e of exps.reverse()){
  exp.innerHTML += `<div class="ps-3">
  <div class="row align-items-center">
    <h3 class="ps-3 fs-5 mb-0 col-6">${e.cargo}</h3>
    <p class="ps-3 fw-light text-dark mb-0 col-2" style="font-size: 0.8rem;">${e.empresa}</p>
    <p class="ps-1 fw-light text-muted mb-0 col-4" style="font-size: 0.8rem;">${e.periodo}</p>
  </div>
  <p class="ps-1 mb-0">${e.descripcion}</p>
  <ul class="ps-1" style="list-style: none;">
    ${e.tags.map(t => `<li class="badge bg-dark text-light me-1">${t}</li>`).join('')}
  </ul>
  `
}
window.onload = () => {    
  setTimeout(() => {
    document.getElementById("spinner").style.display = "none";
    document.getElementById("experiencia").style.display = "block";
    document.getElementById("proyectos").style.display = "block";
  }, 1000)
}
// Proyectos
let proj = document.getElementById("proyectos"); const projects = proyectos.es;
for(const p of projects.reverse()){
  proj.innerHTML += `<div class="ps-3">
  <div class="row align-items-center">
    <h3 class="ps-3 fs-6 mb-0 col-8">${p.titulo}</h3>
    <p class="ps-3 fw-light text-dark mb-0 col-2" style="font-size: 0.8rem;">${p.tipo}</p>
    <a class="text-decoration-none text-dark col-2" style="font-size: 0.8rem;" target="_blank" href=${p.url}>Ver proyecto</a>
  </div>
  <p class="ps-1 mb-0">${p.descripcion}</p>
  <ul class="ps-1" style="list-style: none;">
    ${p.tags.map(t => `<li class="badge bg-dark text-light me-1">${t}</li>`).join('')}
  </ul>
  `
}
// Sidebar
let detallesDiv = document.getElementById("detalles"); const details = detalles.es;
detallesDiv.innerHTML += `<h2 class="fs-6 mb-1 mt-2">Detalles</h2><p class="my-0"><i class="fa-solid fa-location-pin"></i> &nbsp;Madrid</p>
<p class="my-0"><i class="fa-solid fa-globe"></i> España</p>
<a class="d-block text-decoration-none text-dark" href="tel:+34123456789"><i class="fa-solid fa-phone"></i> +34 123 456 789</a>
<a class="d-block text-decoration-none text-dark" href="mailto:pepe@larana.frog"><i class="fa-solid fa-envelope"></i> pepe@larana.frog</a>

<h2 class="fs-6 mb-1 mt-3">Redes Sociales</h2>
<a class="d-block text-decoration-none text-dark" href="https://github.com/pepe-croak" target="_blank"><i class="fa-brands fa-github"></i> @pepe-croak</a>
<a class="d-block text-decoration-none text-dark" href="https://www.linkedin.com/in/pepe-croak.inc" target="_blank"><i class="fa-brands fa-linkedin"></i> @pepe-croak.inc</a>`