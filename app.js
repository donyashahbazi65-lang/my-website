let isLogin = true; // حالت پیش‌فرض: ورود

function toggleMode() {
  isLogin = !isLogin;
  document.getElementById("form-title").innerText = isLogin ? "ورود" : "ثبت‌نام";
  document.getElementById("submit-btn").innerText = isLogin ? "ورود" : "ثبت‌نام";
  document.getElementById("toggle-text").innerHTML = isLogin
    ? 'حساب نداری؟ <a href="#" onclick="toggleMode()">ثبت‌نام کن</a>'
    : 'حساب داری؟ <a href="#" onclick="toggleMode()">وارد شو</a>';
}

function handleAuth(e) {
  e.preventDefault();
  
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  
  let users = JSON.parse(localStorage.getItem("users")) || [];
  
  if (isLogin) {
    // ورود
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      localStorage.setItem("loggedInUser", JSON.stringify(user));
      window.location.href = "dashboard.html";
    } else {
      alert("ایمیل یا رمز عبور اشتباه است ❌");
    }
  } else {
    // ثبت‌نام
    const exists = users.some(u => u.email === email);
    if (exists) {
      alert("این ایمیل قبلاً ثبت‌نام کرده ✅");
    } else {
      users.push({ email, password, plan: "free" });
      localStorage.setItem("users", JSON.stringify(users));
      alert("ثبت‌نام با موفقیت انجام شد 🎉 حالا وارد شو");
      toggleMode();
    }
  }
}

function logout() {
  localStorage.removeItem("loggedInUser");
  window.location.href = "index.html";
}
function loadDashboard() {
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  if (!loggedInUser) {
    window.location.href = "login.html";
    return;
  }

  document.getElementById("welcome").innerText = `سلام 👋 ${loggedInUser.email}`;
  
  userPlan = loggedInUser.plan || "free";
  const p = plans[userPlan];

  document.getElementById("plan-name").innerText = p.name;

  const planFeaturesEl = document.getElementById("plan-features");
  planFeaturesEl.innerHTML = "";
  p.features.forEach(f => {
    const li = document.createElement("li");
    li.textContent = f;
    planFeaturesEl.appendChild(li);
  });

  const upgradeBtn = document.getElementById("upgrade-btn");
  if (p.upgrade) {
    upgradeBtn.style.display = "inline-block";
    upgradeBtn.innerText = p.upgrade;
    upgradeBtn.onclick = () => {
      loggedInUser.plan = userPlan === "free" ? "basic" : "pro";
      localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));
      loadDashboard();
    };
  } else {
    upgradeBtn.style.display = "none";
  }
}