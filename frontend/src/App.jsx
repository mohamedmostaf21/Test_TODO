import { useEffect, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');

  const fetchTodos = async () => {
    const response = await fetch(`${API_URL}/api/todos`);
    const data = await response.json();
    setTodos(data);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const addTodo = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const response = await fetch(`${API_URL}/api/todos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    });

    if (response.ok) {
      setTitle('');
      fetchTodos();
    }
  };

  const toggleTodo = async (id, completed) => {
    await fetch(`${API_URL}/api/todos/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed }),
    });
    fetchTodos();
  };

  const deleteTodo = async (id) => {
    await fetch(`${API_URL}/api/todos/${id}`, { method: 'DELETE' });
    fetchTodos();
  };

  return (
    <div className="app">
      <h1>Todo App</h1>
      <form onSubmit={addTodo} className="todo-form">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs to be done?"
        />
        <button type="submit">Add</button>
      </form>

      <ul className="todo-list">
        {todos.map((todo) => (
          <li key={todo._id} className="todo-item">
            <label>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={(e) => toggleTodo(todo._id, e.target.checked)}
              />
              <span className={todo.completed ? 'completed' : ''}>{todo.title}</span>
            </label>
            <button onClick={() => deleteTodo(todo._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
