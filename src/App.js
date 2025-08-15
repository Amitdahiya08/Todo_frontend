import React, { useState, useRef } from 'react';
import TodoList from './components/TodoList';
import AddTodo from './components/AddTodo';
import { getTodos } from './services/todoService';

function App() {
  const [editingTodo, setEditingTodo] = useState(null);
  const refreshRef = useRef(null);

  const refreshTodos = () => {
    if (refreshRef.current) {
      refreshRef.current();
    }
  };

  return (
    <div>
      <h1>Todo App</h1>
      <AddTodo
        refreshTodos={refreshTodos}
        editingTodo={editingTodo}
        clearEdit={() => setEditingTodo(null)}
      />
      <TodoList
        ref={(el) => {
          refreshRef.current = el?.fetchTodos;
        }}
        onEdit={(todo) => setEditingTodo(todo)}
      />
    </div>
  );
}

export default App;
