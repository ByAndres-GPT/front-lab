//import { BACKEND_URL } from "./config.js";
document.addEventListener("DOMContentLoaded", () => {
  // Obtener el plan del localStorage
  const userPlans = JSON.parse(localStorage.getItem("userPlans"));
  const sessionsList = document.getElementById("sessions-list");
  const planName = document.getElementById("plan-name");
  const backBtn = document.getElementById("back-btn");

  // Función para volver atrás
  backBtn.addEventListener("click", () => {
    window.location.href = `dashboard.html`;
  });

  // Verificar si hay planes
  if (userPlans && userPlans.length > 0) {
    // Mostrar el primer plan (puedes modificar para mostrar uno específico)
    const plan = userPlans[0];

    // Mostrar nombre del plan
    planName.textContent = plan.nombre_plan;

    // Mostrar sesiones (días)
    if (plan.dias && plan.dias.length > 0) {
      sessionsList.innerHTML = "";

      plan.dias.forEach((dia) => {
        const sessionCard = document.createElement("div");
        sessionCard.className = "session-card";

        sessionCard.innerHTML = `
          <img src="../img/img.webp" alt="Imagen sesión" class="session-image">
          <div class="session-content">
            <div class="session-title">${dia.nombre_dia}</div>
            <div class="session-info">Número de ejercicios: ${dia.ejercicios.length}</div>
          </div>
          <div class="session-actions">&#9776;</div>
        `;

        sessionCard.addEventListener("click", () => {
          // Guardar el plan y sesión seleccionados en localStorage
          localStorage.setItem(
            "selectedSession",
            JSON.stringify({
              planId: plan.id_plan,
              sessionId: dia.id_dia,
            })
          );

          // Redirigir a la vista de detalle de sesión
          window.location.href = `sesion-detalle.html?planId=${plan.id_plan}&sessionId=${dia.id_dia}`;
        });

        sessionsList.appendChild(sessionCard);
      });
    } else {
      sessionsList.innerHTML = "<p>No hay sesiones en este plan.</p>";
    }
  } else {
    planName.textContent = "No se encontró ningún plan";
    sessionsList.innerHTML = "<p>No tienes planes guardados.</p>";
  }

  // Botón "Agregar Sesión" (funcionalidad pendiente)
  document.getElementById("add-session-btn").addEventListener("click", () => {
    console.log("Agregar nueva sesión");
    // Aquí implementarás la lógica para agregar sesiones
  });
});
