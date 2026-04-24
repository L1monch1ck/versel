const API = "http://127.0.0.1:8000";

async function register() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!email || !password) {
    showMessage("Fill all fields", "red");
    return;
  }

  const res = await fetch(`${API}/register`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();
  showMessage(data.message, "green");
}

async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!email || !password) {
    showMessage("Enter email and password", "red");
    return;
  }

  const res = await fetch(`${API}/login`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();

  if (data.message === "Login successful") {
    showMessage("Welcome!", "green");

    // сохраняем пользователя
    localStorage.setItem("user", email);

    // редирект
    setTimeout(() => {
      window.location.href = "index.html";
    }, 1000);

  } else {
    showMessage(data.message, "red");
  }
}

function showMessage(text, color) {
  const msg = document.getElementById("message");
  msg.innerText = text;
  msg.style.color = color;
}