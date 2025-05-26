import { BACKEND_URL } from "./config.js";
document.addEventListener("DOMContentLoaded", async () => {
  // Obtener datos del usuario del localStorage
  const userName = localStorage.getItem("userName");
  const userEmail = localStorage.getItem("userEmail");
  const userId = localStorage.getItem("userId");

  // Mostrar información personal
  document.getElementById("userName").textContent = userName || "No disponible";
  document.getElementById("userEmail").textContent =
    userEmail || "No disponible";

  document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "login.html"; // Cambia esto según tu estructura de carpetas
  });

  // Obtener planes del usuario
  try {
    let plans = JSON.parse(localStorage.getItem("userPlans"));

    // Si no hay planes en localStorage o queremos actualizar, hacemos petición
    if (!plans || plans.length === 0) {
      const response = await fetch(
        `${BACKEND_URL}/planEntrenamiento/user/${userId}`
      );

      if (!response.ok) {
        throw new Error("Error al obtener los planes");
      }

      const data = await response.json();
      plans = data.planes;

      // Guardar en localStorage para futuras visitas
      localStorage.setItem("userPlans", JSON.stringify(plans));
    }

    // Mostrar el primer plan (puedes ajustar para mostrar varios)
    if (plans && plans.length > 0) {
      const latestPlan = plans[0];

      document.getElementById("planName").textContent = latestPlan.nombre_plan;
      document.getElementById("sessionCount").textContent =
        latestPlan.dias.length;

      document.getElementById("planCard").style.display = "block";
      document.getElementById("generatePlanBtn").style.display = "none";
    } else {
      document.getElementById("planName").textContent = "No tienes planes aún";
      document.getElementById("sessionCount").textContent = "0";

      // Mostrar botón para generar plan
      document.getElementById("planCard").style.display = "none";
      document.getElementById("generatePlanBtn").style.display = "inline-block";
    }
  } catch (error) {
    console.error("Error:", error);
    document.getElementById("planName").textContent = "Error al cargar el plan";
    document.getElementById("sessionCount").textContent = "-";
  }
});
