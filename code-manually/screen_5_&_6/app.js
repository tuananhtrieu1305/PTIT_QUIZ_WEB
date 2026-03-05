document.addEventListener("DOMContentLoaded", () => {
  const navItems = document.querySelectorAll(".nav-item[data-target]");
  const views = document.querySelectorAll(".view-section");

  navItems.forEach((item) => {
    item.addEventListener("click", function (e) {
      e.preventDefault();

      navItems.forEach((nav) => nav.classList.remove("active"));

      this.classList.add("active");

      views.forEach((view) => (view.style.display = "none"));

      const targetId = this.getAttribute("data-target");
      document.getElementById(targetId).style.display = "block";
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const paginationButtons = document.querySelectorAll(".pagination-btn");

  paginationButtons.forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      paginationButtons.forEach((button) => button.classList.remove("active"));
      this.classList.add("active");
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const viewAllBtn = document.querySelector(".view-all");
  const modal = document.getElementById("all-submissions-modal");
  const closeBtn = document.getElementById("close-modal-btn");

  if (viewAllBtn && modal && closeBtn) {
    viewAllBtn.addEventListener("click", (e) => {
      e.preventDefault();
      modal.classList.add("active");
    });

    closeBtn.addEventListener("click", () => {
      modal.classList.remove("active");
    });

    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.classList.remove("active");
      }
    });
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const eyeButtons = document.querySelectorAll(".result-table .btn-icon");
  const studentModal = document.getElementById("student-detail-modal");
  const closeStudentBtn = document.getElementById("close-student-modal-btn");

  if (eyeButtons.length > 0 && studentModal) {
    eyeButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        studentModal.classList.add("active");
      });
    });

    closeStudentBtn.addEventListener("click", () => {
      studentModal.classList.remove("active");
    });

    studentModal.addEventListener("click", (e) => {
      if (e.target === studentModal) {
        studentModal.classList.remove("active");
      }
    });
  }

  const filterSelects = document.querySelectorAll(".filter-bar select");
  const toastContainer = document.getElementById("toast-container");

  function showToast(message) {
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerHTML = `
    <span class="toast-icon">✅</span>
    <span class="toast-message">${message}</span>
  `;

    toastContainer.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.add("show");
    });

    setTimeout(() => {
      toast.classList.remove("show");

      setTimeout(() => {
        toast.remove();
      }, 400);
    }, 3000);
  }

  if (filterSelects.length > 0) {
    filterSelects.forEach((select) => {
      select.addEventListener("change", (e) => {
        showToast("Đã cập nhật thống kê theo tiêu chí mới");
      });
    });
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const btnExportPdf = document.getElementById("btn-export-pdf");
  const btnExportExcel = document.getElementById("btn-export-excel");

  function downloadDummyFile(filename, fileContent) {
    const blob = new Blob([fileContent], { type: "text/plain" });

    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = filename;

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    window.URL.revokeObjectURL(url);
  }

  if (btnExportPdf) {
    btnExportPdf.addEventListener("click", () => {
      downloadDummyFile(
        "PTIT_Bao_Cao_Thong_Ke.pdf",
        "Đây là file PDF demo dùng để báo cáo môn học. Nội dung rác.",
      );
    });
  }

  if (btnExportExcel) {
    btnExportExcel.addEventListener("click", () => {
      downloadDummyFile(
        "PTIT_Bao_Cao_Thong_Ke.xlsx",
        "Đây là file Excel demo. Dữ liệu rác.",
      );
    });
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const btnOpenCreateExam = document.getElementById("btn-open-create-exam");
  const modalCreateExam = document.getElementById("create-exam-modal");
  const btnCloseCreateExam = document.getElementById("close-exam-modal-btn");
  const btnAddQuestion = document.getElementById("btn-add-question");
  const questionsContainer = document.getElementById("questions-container");
  let questionCount = 1;

  const btnOpenAddStudent = document.getElementById("btn-open-add-student");
  const modalAddStudent = document.getElementById("add-student-modal");
  const btnCloseAddStudent = document.getElementById(
    "close-add-student-modal-btn",
  );

  const btnImportExcel = document.getElementById("btn-import-excel");
  const excelFileInput = document.getElementById("excel-file-input");

  if (btnOpenCreateExam && modalCreateExam) {
    btnOpenCreateExam.addEventListener("click", () =>
      modalCreateExam.classList.add("active"),
    );
    btnCloseCreateExam.addEventListener("click", () =>
      modalCreateExam.classList.remove("active"),
    );
  }

  if (btnOpenAddStudent && modalAddStudent) {
    btnOpenAddStudent.addEventListener("click", () =>
      modalAddStudent.classList.add("active"),
    );
    btnCloseAddStudent.addEventListener("click", () =>
      modalAddStudent.classList.remove("active"),
    );
  }

  document.querySelectorAll(".modal-overlay").forEach((overlay) => {
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) overlay.classList.remove("active");
    });
  });

  if (btnImportExcel && excelFileInput) {
    btnImportExcel.addEventListener("click", (e) => {
      e.preventDefault();
      excelFileInput.click();
    });

    excelFileInput.addEventListener("change", function () {
      if (this.files && this.files.length > 0) {
        this.value = "";
      }
    });
  }

  if (btnAddQuestion && questionsContainer) {
    btnAddQuestion.addEventListener("click", (e) => {
      e.preventDefault();
      questionCount++;

      const newQuestion = document.createElement("div");
      newQuestion.className = "question-card";

      newQuestion.innerHTML = `
      <div class="question-header">
        <strong>Câu hỏi ${questionCount}</strong>
        <button class="btn-delete-q" onclick="this.closest('.question-card').remove()">🗑 Xóa</button>
      </div>
      <textarea class="form-control" rows="2" placeholder="Nhập nội dung câu hỏi..."></textarea>
      <div class="answers-list">
        <div class="answer-item">
          <input type="radio" name="q${questionCount}_correct" checked>
          <input type="text" class="form-control" placeholder="Đáp án A">
        </div>
        <div class="answer-item">
          <input type="radio" name="q${questionCount}_correct">
          <input type="text" class="form-control" placeholder="Đáp án B">
        </div>
        <div class="answer-item">
          <input type="radio" name="q${questionCount}_correct">
          <input type="text" class="form-control" placeholder="Đáp án C">
        </div>
        <div class="answer-item">
          <input type="radio" name="q${questionCount}_correct">
          <input type="text" class="form-control" placeholder="Đáp án D">
        </div>
      </div>
    `;

      questionsContainer.appendChild(newQuestion);

      questionsContainer.scrollTop = questionsContainer.scrollHeight;
    });
  }

  document.getElementById("btn-save-exam")?.addEventListener("click", () => {
    modalCreateExam.classList.remove("active");
  });

  document.getElementById("btn-save-student")?.addEventListener("click", () => {
    modalAddStudent.classList.remove("active");
  });
});
