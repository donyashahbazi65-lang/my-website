// سال فوتر
document.addEventListener('DOMContentLoaded', () => {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // اگر در auth.html هَش داشتیم ( #signup یا #login ) فرم‌ها بیاد بالا
  if (location.pathname.endsWith('/auth.html') && (location.hash === '#signup' || location.hash === '#login')) {
    const el = document.querySelector(location.hash);
    if (el) { el.scrollIntoView({behavior:'instant', block:'start'}); }
  }

  // ثبت‌نامِ نمایشی (سمت کلاینت) — بعدا به بک‌اند وصل کن
  const signup = document.getElementById('signupForm');
  if (signup) {
    signup.addEventListener('submit', (e) => {
      e.preventDefault();
      // اعتبارسنجی ساده
      const fd = new FormData(signup);
      if (!fd.get('email') || !fd.get('password')) return;
      localStorage.setItem('lynera_user', JSON.stringify({name: fd.get('name') || 'کاربر Lynera'}));
      location.href = '/dashboard.html';
    });
  }

  // ورودِ نمایشی
  const login = document.getElementById('loginForm');
  if (login) {
    login.addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(login);
      if (!fd.get('email') || !fd.get('password')) return;
      localStorage.setItem('lynera_user', JSON.stringify({name: fd.get('email')}));
      location.href = '/dashboard.html';
    });
  }

  // حفاظت خیلی سادهٔ داشبوردِ نمونه (اختیاری)
  if (location.pathname.endsWith('/dashboard.html')) {
    const user = localStorage.getItem('lynera_user');
    if (!user) {
      location.replace('/auth.html#login');
    }
  }

  // خروج
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('lynera_user');
      location.href = '/';
    });
  }
});