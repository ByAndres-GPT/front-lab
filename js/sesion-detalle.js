//import { BACKEND_URL } from "./config.js";
document.addEventListener("DOMContentLoaded", () => {
  // Obtener parámetros de la URL
  const urlParams = new URLSearchParams(window.location.search);
  const planId = urlParams.get("planId");
  const sessionId = urlParams.get("sessionId");

  // Elementos del DOM
  const sessionTitle = document.getElementById("session-title");
  const exercisesList = document.getElementById("exercises-list");
  const backBtn = document.getElementById("back-btn");

  // Obtener datos del localStorage
  const userPlans = JSON.parse(localStorage.getItem("userPlans"));

  // Función para volver atrás
  backBtn.addEventListener("click", () => {
    window.location.href = `plan-detalle.html?planId=${planId}`;
  });

  // Buscar la sesión específica
  if (userPlans && userPlans.length > 0 && planId && sessionId) {
    const plan = userPlans.find((p) => p.id_plan == planId);

    if (plan && plan.dias) {
      const session = plan.dias.find((d) => d.id_dia == sessionId);

      if (session) {
        // Mostrar título de la sesión
        sessionTitle.textContent =
          session.nombre_dia || `Session ${plan.dias.indexOf(session) + 1}`;

        // Mostrar ejercicios
        if (session.ejercicios && session.ejercicios.length > 0) {
          exercisesList.innerHTML = "";

          session.ejercicios.forEach((ejercicio, index) => {
            const exerciseCard = document.createElement("div");
            exerciseCard.className = "exercise-card";

            exerciseCard.innerHTML = `
            <div class="exercise-item">
              <img src="../img/img.webp" alt="Imagen ejercicio" class="exercise-img">
              <div class="exercise-info">
                <div class="exercise-title">${ejercicio.nombre}</div>
                <div class="exercise-subtitle">
                  ${ejercicio.series} series · ${
              ejercicio.repeticiones
            } repeticiones · ${ejercicio.peso || "0"} kg
                </div>
              </div>
              <div class="exercise-menu">≡</div>
            </div>`;

            exerciseCard.addEventListener("click", () => {
              const nombreEjercicio = encodeURIComponent(
                ejercicio.nombre
              );
              window.location.href = `ejercicio-detalle.html?name=${nombreEjercicio}`;
            });
            exercisesList.appendChild(exerciseCard);
          });
        } else {
          exercisesList.innerHTML = "<p>No hay ejercicios en esta sesión.</p>";
        }
      } else {
        exercisesList.innerHTML = "<p>Sesión no encontrada.</p>";
      }
    } else {
      exercisesList.innerHTML = "<p>Plan no encontrado.</p>";
    }
  } else {
    exercisesList.innerHTML = "<p>No se encontraron datos del plan.</p>";
  }
});
