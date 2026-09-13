function mountQuiz(root, { id, questions }) {
  const key = "curso-ns-quiz-" + id;
  const saved = Number(localStorage.getItem(key) || 0);
  if (saved) root.dataset.score = String(saved);

  root.innerHTML = questions.map((q, i) => `
    <fieldset>
      <legend>${i + 1}. ${q.q}</legend>
      ${q.opts.map((opt, j) => `
        <label><input type="radio" name="${id}-q${i}" value="${j}" /> ${opt}</label>
      `).join("")}
    </fieldset>
  `).join("") + `<button type="button" data-grade>Corregir</button><p class="result muted"></p>`;

  root.querySelector("[data-grade]").addEventListener("click", () => {
    let ok = 0;
    questions.forEach((q, i) => {
      const picked = root.querySelector(`input[name="${id}-q${i}"]:checked`);
      const box = root.querySelectorAll("fieldset")[i];
      box.classList.remove("ok", "bad");
      if (picked && Number(picked.value) === q.a) {
        ok += 1;
        box.classList.add("ok");
      } else {
        box.classList.add("bad");
      }
    });
    const pct = Math.round((100 * ok) / questions.length);
    localStorage.setItem(key, String(pct));
    root.dataset.score = String(pct);
    root.querySelector(".result").textContent =
      `${ok} / ${questions.length} (${pct}%). ` +
      (pct === 100
        ? "Listo: en el chat dime «checkpoint 1» y te pregunto yo, sin opciones."
        : "Repasa el apartado que falló y vuelve a corregir.");
    window.dispatchEvent(new CustomEvent("quiz-scored", { detail: { id, pct } }));
  });
}

function markRoadmap() {
  document.querySelectorAll("[data-quiz]").forEach((el) => {
    const pct = Number(localStorage.getItem("curso-ns-quiz-" + el.dataset.quiz) || 0);
    const pill = el.querySelector(".pill");
    if (!pill) return;
    if (pct === 100) {
      pill.textContent = "quiz " + pct + "%";
      pill.classList.add("done");
      pill.classList.remove("go");
    } else if (pct > 0) {
      pill.textContent = "quiz " + pct + "%";
    }
  });
}
