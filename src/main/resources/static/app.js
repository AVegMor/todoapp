const form = document.getElementById("task-form");
const titleInput = document.getElementById("title");
const taskList = document.getElementById("task-list");
const emptyState = document.getElementById("empty-state");
const taskCounter = document.getElementById("task-counter");
const themeToggle = document.getElementById("theme-toggle");

const THEME_KEY = "todoapp-theme";

function getPreferredTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === "light" || saved === "dark") return saved;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function setTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem(THEME_KEY, theme);
  themeToggle.textContent = theme === "dark" ? "☀️" : "🌙";
  themeToggle.setAttribute("aria-label", theme === "dark" ? "Activar modo claro" : "Activar modo oscuro");
}

themeToggle.addEventListener("click", () => {
  const current = document.documentElement.getAttribute("data-theme") || "light";
  setTheme(current === "dark" ? "light" : "dark");
});

async function loadTasks() {
  const response = await fetch("/api/tasks");
  const tasks = await response.json();
  taskList.innerHTML = "";

  taskCounter.textContent = `${tasks.length} tarea${tasks.length === 1 ? "" : "s"}`;
  emptyState.hidden = tasks.length !== 0;

  tasks.forEach((task) => {
    const li = document.createElement("li");
    li.className = "task-item";

    const left = document.createElement("div");
    left.className = "task-main";
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.setAttribute("aria-label", `Marcar tarea ${task.title}`);
    checkbox.addEventListener("change", () => toggleTask(task.id, checkbox.checked));

    const text = document.createElement("span");
    text.className = "task-title";
    text.textContent = task.title;
    if (task.completed) text.classList.add("done");

    const label = document.createElement("label");
    label.appendChild(text);

    left.appendChild(checkbox);
    left.appendChild(label);

    const removeButton = document.createElement("button");
    removeButton.className = "delete-btn";
    removeButton.textContent = "Eliminar";
    removeButton.addEventListener("click", () => deleteTask(task.id));

    li.appendChild(left);
    li.appendChild(removeButton);
    taskList.appendChild(li);
  });
}

async function createTask(title) {
  await fetch("/api/tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title }),
  });
  await loadTasks();
}

async function toggleTask(id, completed) {
  await fetch(`/api/tasks/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ completed }),
  });
  await loadTasks();
}

async function deleteTask(id) {
  await fetch(`/api/tasks/${id}`, { method: "DELETE" });
  await loadTasks();
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const title = titleInput.value.trim();
  if (!title) return;
  await createTask(title);
  titleInput.value = "";
  titleInput.focus();
});

setTheme(getPreferredTheme());
loadTasks();
