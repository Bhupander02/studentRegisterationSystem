let editingStudentId = null;

const form = document.getElementById("registrationForm");
const list = document.getElementById("studentList");
const msg = document.getElementById("message");

document.addEventListener("DOMContentLoaded", loadStudents);

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const fd = new FormData(form);
  const student = {
    name: fd.get("studentName").trim(),
    email: fd.get("email").trim(),
    studentID: fd.get("studentId").trim(),
    contact: fd.get("contactNum").trim(),
  };

  if (
    !student.name ||
    !student.email ||
    !student.studentID ||
    !student.contact
  ) {
    msg.textContent = "Please complete all fields.";
    msg.classList.remove("text-green-600");
    msg.classList.add("text-red-600");
    return;
  }

  let students = getStudents();
  if (editingStudentId) {
    students = students.map((s) =>
      s.studentID === editingStudentId ? student : s
    );
    showMessage("Student Details Updated.", "success");
    editingStudentId = null; //we write this again to clear the editing mode
  } else {
    students.unshift(student);
    showMessage("Student Registered.", "Success");
  }

  localStorage.setItem("students", JSON.stringify(students));

  list.innerHTML = "";
  students.forEach(renderStudent);
  form.reset();
  form.studentName.focus();
});

list.addEventListener("click", (e) => {
  const li = e.target.closest("li");
  if (!li) return;

  const studentID = li.dataset.id;

  if (e.target.classList.contains("remove-btn")) {
    const students = getStudents().filter((s) => s.studentID !== studentID);
    localStorage.setItem("students", JSON.stringify(students));

    li.remove();
    showMessage("Student removed.", "error");
  }

  if (e.target.classList.contains("edit-btn")) {
    const student = getStudents().find((s) => s.studentID === studentID);
    if (student) {
      form.studentName.value = student.name;
      form.email.value = student.email;
      form.studentId.value = student.studentID;
      form.contactNum.value = student.contact;
      editingStudentId = student.studentID;

      showMessage(
        "Editing mode: make changes and click Register Student.",
        "info"
      );
    }
  }
});

function getStudents() {
  return JSON.parse(localStorage.getItem("students")) || [];
}

function loadStudents() {
  const students = getStudents();
  students.forEach(renderStudent);
}

function renderStudent(student) {
  const li = document.createElement("li");
  li.dataset.id = student.studentID;
  li.className =
    "p-3 bg-white border rounded-md flex items-start justify-between";
  li.innerHTML = `
    <div>
      <div class="font-medium text-gray-800">${escapeHtml(student.name)} 
        <span class="text-xs text-gray-500">(${escapeHtml(
          student.studentID
        )})</span>
      </div>
      <div class="text-xs text-gray-500">${escapeHtml(
        student.contact
      )} • ${escapeHtml(student.email)}</div>
      </div>
      <button type="button" class="text-xs text-red-600 hover:underline remove-btn">Remove</button>
      <button type="button" class="text-xs text-red-600 hover:underline edit-btn">Edit</button>
      `;
  list.prepend(li);
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function showMessage(text, type) {
  msg.textContent = text;
  msg.classList.remove("text-green-600", "text-red-600", "text-blue-600");
  if (type === "success") msg.classList.add("text-green-600");
  else if (type === "error") msg.classList.add("text-red-600");
  else msg.classList.add("text-blue-600");
}
