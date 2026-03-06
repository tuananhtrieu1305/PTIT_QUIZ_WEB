document.addEventListener("DOMContentLoaded", () => {
  // Hamburger menu toggle
  const hamburger = document.getElementById("nav-hamburger");
  const navCollapse = document.getElementById("nav-collapse");

  if (hamburger && navCollapse) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("active");
      navCollapse.classList.toggle("active");
    });

    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
      if (!hamburger.contains(e.target) && !navCollapse.contains(e.target)) {
        hamburger.classList.remove("active");
        navCollapse.classList.remove("active");
      }
    });
  }

  const roleTabs = document.querySelectorAll(".role-tab");

  if (roleTabs.length > 0) {
    roleTabs.forEach((tab) => {
      tab.addEventListener("click", function () {
        roleTabs.forEach((t) => t.classList.remove("active"));
        this.classList.add("active");
      });
    });
  }
});

// (REGISTER)
document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("register-form");
  const toggleRegPass = document.getElementById("toggle-pass");
  const regPassInp = document.getElementById("reg-pass");

  if (toggleRegPass && regPassInp) {
    toggleRegPass.addEventListener("click", () => {
      regPassInp.type = regPassInp.type === "password" ? "text" : "password";
    });
  }

  if (regPassInp) {
    regPassInp.addEventListener("input", function () {
      const val = this.value;
      const bar = document.getElementById("strength-bar");
      const fill = document.getElementById("strength-fill");

      if (!bar || !fill) return;

      if (!val) {
        bar.style.display = "none";
        return;
      }
      bar.style.display = "block";

      let score = 0;
      if (val.length >= 8) score++;
      if (/[A-Z]/.test(val)) score++;
      if (/[0-9]/.test(val)) score++;
      if (/[^A-Za-z0-9]/.test(val)) score++;

      const colors = ["#ef4444", "#f97316", "#eab308", "#22c55e"];
      fill.style.width = (score / 4) * 100 + "%";
      fill.style.background = colors[score - 1] || "#ef4444";
    });
  }

  if (registerForm) {
    registerForm.addEventListener("submit", function (e) {
      e.preventDefault();
      let ok = true;

      const name = document.getElementById("reg-name").value.trim();
      const email = document.getElementById("reg-email").value.trim();
      const pass = document.getElementById("reg-pass").value;
      const confirm = document.getElementById("reg-confirm").value;
      const agreed = document.getElementById("agree-terms").checked;

      const setErr = (id, msg) => {
        const errElement = document.getElementById(id);
        if (errElement) {
          errElement.textContent = msg;
        }
        if (msg) ok = false;
      };

      setErr("err-name", !name ? "Vui lòng nhập họ và tên." : "");
      setErr(
        "err-email",
        !email || !email.includes("@") ? "Email không hợp lệ." : "",
      );
      setErr(
        "err-pass",
        pass.length < 8 ? "Mật khẩu phải ít nhất 8 ký tự." : "",
      );
      setErr(
        "err-confirm",
        pass !== confirm ? "Mật khẩu xác nhận không khớp." : "",
      );
      setErr("err-terms", !agreed ? "Vui lòng đồng ý với điều khoản." : "");

      if (ok) {
        registerForm.style.display = "none";
        const successMsg = document.getElementById("success-msg");
        if (successMsg) successMsg.style.display = "block";

        setTimeout(() => {
          window.location.href = "./home.html"; // Chuyển sang trang chủ
        }, 2500);
      }
    });
  }
});

// (LOGIN)
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  const toggleLoginPass = document.getElementById("toggle-login-pass");
  const loginPassInp = document.getElementById("login-pass");

  if (toggleLoginPass && loginPassInp) {
    toggleLoginPass.addEventListener("click", () => {
      loginPassInp.type =
        loginPassInp.type === "password" ? "text" : "password";
    });
  }

  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();
      let ok = true;

      const usernameInp = document.getElementById("login-username");
      const passInp = document.getElementById("login-pass");
      const btnSubmit = document.getElementById("btn-login-submit");

      const username = usernameInp ? usernameInp.value.trim() : "";
      const pass = passInp ? passInp.value : "";

      const setErr = (id, msg) => {
        const errElement = document.getElementById(id);
        if (errElement) {
          errElement.textContent = msg;
        }
        if (msg) ok = false;
      };

      setErr("err-login-user", !username ? "Vui lòng nhập tên đăng nhập." : "");
      setErr("err-login-pass", !pass ? "Vui lòng nhập mật khẩu." : "");

      if (ok) {
        if (btnSubmit) {
          btnSubmit.textContent = "Đang xử lý...";
          btnSubmit.style.opacity = "0.7";
          btnSubmit.style.cursor = "not-allowed";
        }

        setTimeout(() => {
          window.location.href = "./home.html";
        }, 1000);
      }
    });
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const filterTabs = document.querySelectorAll(".filter-tab");

  if (filterTabs.length > 0) {
    filterTabs.forEach((tab) => {
      tab.addEventListener("click", function () {
        filterTabs.forEach((t) => t.classList.remove("active"));
        this.classList.add("active");
      });
    });
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const viewAllExamsBtn = document.getElementById("btn-view-all-exams");
  const allExamsModal = document.getElementById("all-exams-modal");
  const closeExamsModalBtn = document.getElementById("close-exams-modal-btn");

  if (viewAllExamsBtn && allExamsModal && closeExamsModalBtn) {
    viewAllExamsBtn.addEventListener("click", (e) => {
      e.preventDefault();
      allExamsModal.classList.add("active");
    });

    closeExamsModalBtn.addEventListener("click", () => {
      allExamsModal.classList.remove("active");
    });

    allExamsModal.addEventListener("click", (e) => {
      if (e.target === allExamsModal) {
        allExamsModal.classList.remove("active");
      }
    });
  }

  const btnApplyFilter = document.getElementById("btn-apply-filter");
  if (btnApplyFilter) {
    btnApplyFilter.addEventListener("click", () => {
      const examName = document.getElementById("search-exam-name").value;
      const btnOriginalText = btnApplyFilter.textContent;

      btnApplyFilter.textContent = "Đang tìm...";
      btnApplyFilter.style.opacity = "0.8";

      setTimeout(() => {
        btnApplyFilter.textContent = btnOriginalText;
        btnApplyFilter.style.opacity = "1";

        if (examName) {
          alert(`Đã áp dụng bộ lọc!\nTìm kiếm: "${examName}"`);
        } else {
          alert("Đã cập nhật danh sách kỳ thi theo bộ lọc mới!");
        }
      }, 800);
    });
  }
});
