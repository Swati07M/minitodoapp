const API_URL = 'https://beryl-basalt-gooseberry.glitch.me';


// Signup Functionality
document.getElementById('signup-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('signup-email').value;
  const password = document.getElementById('signup-password').value;

  const response = await fetch(`${API_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (response.ok) {
    alert('Signup successful!');
  } else {
    alert('Signup failed. Email might already be in use.');
  }
});
// Login Functionality
document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  const response = await fetch(`${API_URL}/users`);
  const users = await response.json();

  const user = users.find(u => u.email == email && u.password == password);
  if (user) {
    localStorage.setItem('userId', user.id);
    location.href = './todos.html';
  } else {
    alert('Invalid email or password!');
  }
});

// Fetch and Display Todos
async function fetchTodos() {
  const userId = localStorage.getItem('userId');
  const response = await fetch(`${API_URL}/todos?userId=${userId}`);
  const todos = await response.json();

  const todoList = document.getElementById('todo-list');
  todoList.innerHTML = '';
  todos.forEach(todo => {
    const li = document.createElement('li');
    li.textContent = todo.task;

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.onclick = () => deleteTodo(todo.id);

    li.appendChild(deleteBtn);
    todoList.appendChild(li);
  });
}

// Add a Todo
document.getElementById('todo-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const task = document.getElementById('todo-input').value;
  const userId = localStorage.getItem('userId');

  await fetch(`${API_URL}/todos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, task, completed: false }),
  });

  fetchTodos();
});

// Delete a Todo
async function deleteTodo(id) {
  await fetch(`${API_URL}/todos/${id}`, { method: 'DELETE' });
  fetchTodos();
}

// Logout
function logout() {
  localStorage.clear();
  location.href = './index.html';
}

// Load Todos on Page Load
if (location.pathname.endsWith('todos.html')) {
  fetchTodos();
}
