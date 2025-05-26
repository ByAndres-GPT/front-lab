import { BACKEND_URL } from "./config.js";
document.addEventListener("DOMContentLoaded", () => {
  const planForm = document.getElementById("planForm");
  const userId = localStorage.getItem("userId");

  if (!userId) {
    window.location.href = "login.html";
    return;
  }

  planForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Mostrar estado de carga
    const submitBtn = planForm.querySelector(".submit-btn");
    submitBtn.disabled = true;
    submitBtn.textContent = "Generando...";

    try {
      // Obtener valores del formulario
      const height = document.getElementById("height").value;
      const weight = document.getElementById("weight").value;
      const goal = document.getElementById("goal").value;
      const days = document.getElementById("days").value;

      // Validar datos
      if (!height || !weight || !goal || !days) {
        throw new Error("Por favor completa todos los campos");
      }

      // 1. Obtener plan de la API externa
      const apiUrl = `https://magicloops.dev/api/loop/b19f52c4-d481-4922-a82a-4a127b084663/run?size=${height}&weight=${weight}&goal=${goal}&available_days=${days}`;

      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error("Error al generar el plan desde la API externa");
      }

      const planData = await response.json();

      console.log("planData", planData);

      // 2. Enviar plan al backend
      const saveResponse = await fetch(
        `${BACKEND_URL}/planEntrenamiento/${userId}/complete`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            plan_name: planData.plan_name,
            training_days: planData.training_days,
          }),
        }
      );

      if (!saveResponse.ok) {
        const errorData = await saveResponse.json();
        throw new Error(errorData.message || "Error al guardar el plan");
      }

      const result = await saveResponse.json();

      showMessage("¡Plan generado y guardado exitosamente!", false);

      // Redirigir después de 1.5 segundos
      setTimeout(() => {
        window.location.href = `dashboard.html?planId=${result.plan.id_plan}`;
      }, 1500);
    } catch (error) {
      showMessage(error.message, true);
      console.error("Error:", error);
    } finally {
      // Restaurar botón
      submitBtn.disabled = false;
      submitBtn.textContent = "Generar Plan de Entrenamiento";
    }
  });

  function showMessage(message, isError) {
    // Eliminar mensajes anteriores
    const oldMessage = document.querySelector(".message");
    if (oldMessage) oldMessage.remove();

    const messageDiv = document.createElement("div");
    messageDiv.className = `message ${isError ? "error" : "success"}`;
    messageDiv.textContent = message;

    planForm.insertBefore(messageDiv, planForm.firstChild);
  }
});
