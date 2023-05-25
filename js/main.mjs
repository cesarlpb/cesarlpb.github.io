"use strict"

import { idiomas } from './lang.js'


console.log(idiomas)
let el = document.getElementById("idiomas");
let data = idiomas.es
console.log(data)
for(const d of data){
  el.innerHTML += `<p class="mb-1">${d.idioma}</p>
<div class="progress" style="height: 0.65rem;">
  <div class="progress-bar" role="progressbar" style="width: ${d.nivel}%" aria-valuenow="${d.nivel}" aria-valuemin="0" aria-valuemax="100"></div>
</div>`
}
  
