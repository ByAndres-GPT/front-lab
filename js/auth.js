// URL base de tu backend (ajusta según tu configuración)
const API_BASE_URL = `${BACKEND_URL}/usuarios`;	

// Elementos del formulario
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

// Función para mostrar mensajes
function showMessage(message, isError = false) {
  const messageDiv = document.createElement("div");
  messageDiv.className = `message ${isError ? "error" : "success"}`;
  messageDiv.textContent = message;

  const container = document.querySelector(".auth-container");
  container.insertBefore(messageDiv, container.firstChild);

  setTimeout(() => {
    messageDiv.remove();
  }, 1000);
}

// Manejar login
async function handleLogin(e) {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const response = await fetch(`${API_BASE_URL}/login`, {	
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        correo: email,
        contrasena: password,
      }),
    });

    const data = await response.json();

    if (data.error) {
      throw new Error(data.message);
    }

    // Guardar datos básicos del usuario en localStorage
    localStorage.setItem("userId", data.usuario.id_usuario);
    localStorage.setItem("userEmail", data.usuario.correo);
    localStorage.setItem("userName", data.usuario.nombre);

    showMessage("Inicio de sesión exitoso");
    setTimeout(() => {
      window.location.href = "dashboard.html"; // Redirige al dashboard
    }, 1500);
  } catch (error) {
    showMessage(error.message, true);
    console.error("Error:", error);
  }
}

// Manejar registro
async function handleRegister(e) {
  e.preventDefault();

  const firstName = document.getElementById("firstName").value;
  const lastName = document.getElementById("lastName").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nombre: firstName,
        apellido: lastName,
        correo: email,
        contrasena: password,
      }),
    });

    const data = await response.json();

    if (data.error) {
      throw new Error(data.message);
    }

    showMessage("Registro exitoso. Redirigiendo...");
    setTimeout(() => {
      window.location.href = "login.html";
    }, 1500);
  } catch (error) {
    showMessage(error.message, true);
    console.error("Error:", error);
  }
}

// Event listeners
if (loginForm) {
  loginForm.addEventListener("submit", handleLogin);
}

if (registerForm) {
  registerForm.addEventListener("submit", handleRegister);
}
