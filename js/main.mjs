import { bio } from './bio.js'
import { idiomas } from './idiomas.js'
import { experiencia } from './experiencia.js'
import { proyectos } from './proyectos.js'
import { detalles } from './detalles.js'

// Miro si hay idioma guardado en Local Storage
const urlParams = new URLSearchParams(window.location.search);
const LANG = urlParams.get("lang") == null ? localStorage.getItem("lang") ?? "en" : urlParams.get("lang");
console.log(LANG)
// Cambio el idioma en Local Storage:
localStorage.setItem("lang", LANG);

// Idiomas
const langs = idiomas[LANG];

let h2 = document.getElementById("idiomas-h2");
h2.innerHTML = LANG == "es"
  ? `<i class="fa-solid fa-font"></i> Idiomas`
  : `<i class="fa-solid fa-font"></i> Languages`;
let el = document.getElementById("idiomas");

el.innerHTML += `<div class="row">`
for(const d of langs){
  el.innerHTML += `<div class="lang-row border border-muted border-top-0 border-start-0 border-end-0"><p class="d-inline-block mb-1 col-4">${d.idioma}</p><p class="d-inline-block mb-1 fw-light col-8">${d.nivel}</p></div>`
}
el.innerHTML += `</div>`
// Barras de progreso (para usar descomentar):
/*
<div class="progress" style="height: 0.65rem;">
  <div class="progress-bar bg bg-dark" role="progressbar" style="width: ${d.progreso}%" aria-valuenow="${d.progreso}" aria-valuemin="0" aria-valuemax="100"></div>
</div>
*/
//
// Experiencia
let exp = document.getElementById("experiencia"); const exps = experiencia.es;
for(const e of exps.reverse()){
  exp.innerHTML += `<div class="ps-4">
  <div class="row align-items-center ps-1">
    <h3 class="ps-3 mb-0 col-6 fw-bold" style="font-size: 1rem">${e.cargo}</h3>
    <p class="ps-3 fw-light text-dark mb-0 col-3" style="font-size: 0.8rem;">${e.empresa}</p>
    <p class="ps-1 fw-light text-muted mb-0 col-3" style="font-size: 0.8rem;">${e.periodo}</p>
  </div>
  <p class="ps-2 mb-0">${e.descripcion}</p>
  <ul class="ps-1 mt-0 mb-3" style="list-style: none;">
    ${e.tags.map(t => `<li class="badge bg-dark text-light me-1">${t}</li>`).join('')}
  </ul>
  `
}
document.getElementById("experiencia").style.display = "block";
document.getElementById("proyectos").style.display = "block";
// window.onload = () => {    
//   setTimeout(() => {
//     // document.getElementById("spinner").style.display = "none";
//     document.getElementById("experiencia").style.display = "block";
//     document.getElementById("proyectos").style.display = "block";
//   }, 1000)
// }
// Proyectos
let proj = document.getElementById("proyectos"); const projects = proyectos.es;
for(const p of projects.reverse()){
  proj.innerHTML += `<div class="ps-0 mt-2">
  <div class="row align-items-between">
    <h3 class="ps-2 mb-0 col-8 fw-bold" style="font-size: 1rem">${p.titulo}</h3>
    <p class="ps-0 fw-light text-dark mb-0 col-4" style="font-size: 0.8rem;">${p.tipo}</p>
  </div>
  <p class="ps-0 mb-0">${p.descripcion}</p>
  <ul class="ps-0" style="list-style: none;">
    ${p.tags.map(t => `<li class="badge bg-dark text-light me-1">${t}</li>`).join('')}
  </ul>
  <a class="see-project-btn d-inline-block text-decoration-none text-dark col py-1 mx-auto btn btn-outline-dark" style="font-size: 1rem;" target="_blank" href=${p.url}>Ver proyecto</a>
  `
}
// Sidebar
let detallesDiv = document.getElementById("detalles"); const details = detalles.es;
detallesDiv.innerHTML += `<p class="my-0"><i class="fa-solid fa-location-pin"></i> &nbsp;${details.ciudad}</p>
<p class="my-0"><i class="fa-solid fa-globe"></i> ${details.pais}</p>
<a class="d-block text-decoration-none text-dark fw-bold" href="${details.telegramUrl}" target="_blank"><i class="fa-brands fa-telegram"></i> ${details.telegramHandle}</a>
<a class="d-inline-block text-decoration-none fw-bold text-dark" href="${details.form}" target="_blank"><i class="fa-solid fa-file"></i> &nbsp;Contacto</a>

<h2 class="fs-5 mb-1 mt-3"><i class="fa-solid fa-link"></i> Enlaces</h2>
<a class="d-block text-decoration-none text-dark fw-bold" href="${details.portfolioUrl}" target="_blank"><i class="fa-solid fa-file"></i> &nbsp;${details.portfolioText}</a>
<a class="d-block text-decoration-none text-dark fw-bold" href="${details.githubUrl}" target="_blank"><i class="fa-brands fa-github"></i> ${details.githubHandle}</a>
<a class="d-block text-decoration-none text-dark fw-bold" href="${details.linkedinUrl}" target="_blank"><i class="fa-brands fa-linkedin"></i> ${details.linkedinHandle}</a>`