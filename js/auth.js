// ===== NutriCheck Auth =====
// Tài khoản mặc định lưu trong localStorage
// Lần đầu chạy sẽ tự tạo tài khoản admin/admin123

const AUTH_KEY = "nutricheck_auth";
const CREDENTIALS_KEY = "nutricheck_credentials";

function initCredentials() {
  if (!localStorage.getItem(CREDENTIALS_KEY)) {
    localStorage.setItem(CREDENTIALS_KEY, JSON.stringify({
      username: "admin",
      password: "admin123"
    }));
  }
}

function isLoggedIn() {
  return localStorage.getItem(AUTH_KEY) === "true";
}

function login(username, password) {
  const creds = JSON.parse(localStorage.getItem(CREDENTIALS_KEY));
  if (username === creds.username && password === creds.password) {
    localStorage.setItem(AUTH_KEY, "true");
    return true;
  }
  return false;
}

function logout() {
  localStorage.removeItem(AUTH_KEY);
}

// ===== Khởi chạy =====
initCredentials();

const loginScreen = document.getElementById("loginScreen");
const adminScreen = document.getElementById("adminScreen");
const loginBtn    = document.getElementById("loginBtn");
const logoutBtn   = document.getElementById("logoutBtn");
const loginMsg    = document.getElementById("loginMessage");

function showAdmin() {
  loginScreen.style.display = "none";
  adminScreen.style.display = "block";
}

function showLogin() {
  loginScreen.style.display = "flex";
  adminScreen.style.display = "none";
}

// Kiểm tra session khi tải trang
if (isLoggedIn()) {
  showAdmin();
} else {
  showLogin();
}

// Đăng nhập
loginBtn.addEventListener("click", () => {
  const username = document.getElementById("loginUsername").value.trim();
  const password = document.getElementById("loginPassword").value;

  if (!username || !password) {
    loginMsg.innerHTML = `<div class="message error">Vui lòng nhập đầy đủ thông tin.</div>`;
    return;
  }

  if (login(username, password)) {
    loginMsg.innerHTML = "";
    showAdmin();
  } else {
    loginMsg.innerHTML = `<div class="message error">Sai tên đăng nhập hoặc mật khẩu.</div>`;
  }
});

// Cho phép nhấn Enter để đăng nhập
document.getElementById("loginPassword").addEventListener("keydown", (e) => {
  if (e.key === "Enter") loginBtn.click();
});

// Đăng xuất
logoutBtn.addEventListener("click", () => {
  logout();
  showLogin();
});