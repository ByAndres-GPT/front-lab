document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const nombreEjercicio = params.get("name");

  const titleEl = document.getElementById("exercise-title");
  const imgEl = document.getElementById("exercise-img");
  const musculoPrincipalEl = document.getElementById("musculo-principal");
  const musculosSecundariosEl = document.getElementById("musculos-secundarios");
  const instruccionesEl = document.getElementById("instrucciones");

  document.getElementById("back-btn").addEventListener("click", () => {
    history.back();
  });

  if (!nombreEjercicio) {
    titleEl.textContent = "Ejercicio no especificado";
    return;
  }

  const url = `https://exercisedb.p.rapidapi.com/exercises/name/${nombreEjercicio.toLowerCase()}?offset=0&limit=1`;
  const options = {
    method: "GET",
    headers: {
      "x-rapidapi-key": "193da7e9e6msha0e9b2dd705baedp16b5b0jsn0240da949894",
      "x-rapidapi-host": "exercisedb.p.rapidapi.com",
    },
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    console.log(data);

    if (!data || !Array.isArray(data) || data.length === 0) {
      mostrarError(`No se encontró información para "${nombreEjercicio}"`);
      return;
    }

    const ejercicio = data[0];

    titleEl.textContent = nombreEjercicio;

    // Validar si hay una imagen
    if (ejercicio.gifUrl) {
      imgEl.src = ejercicio.gifUrl;
    } else {
      imgEl.src = "../img/img.webp";
    }

    // Validar si hay datos de músculos
    musculoPrincipalEl.textContent = ejercicio.target || "No disponible";
    musculosSecundariosEl.textContent =
      ejercicio.secondaryMuscles?.join(", ") || "No disponibles";

    // Validar si hay instrucciones
    if (ejercicio.instructions && ejercicio.instructions.length > 0) {
      instruccionesEl.innerHTML = ejercicio.instructions
        .map((i) => `<li>${i}</li>`)
        .join("");
    } else {
      instruccionesEl.innerHTML = "<li>No hay instrucciones disponibles</li>";
    }
  } catch (error) {
    console.error("Error al obtener los datos del ejercicio", error);
    mostrarError("Error al cargar el ejercicio");
  }
  function mostrarError(mensaje) {
    titleEl.textContent = mensaje;
    imgEl.src = "../img/img.webp";
    musculoPrincipalEl.textContent = "No disponible";
    musculosSecundariosEl.textContent = "No disponibles";
    instruccionesEl.innerHTML = "<li>No hay instrucciones disponibles</li>";
  }
});
