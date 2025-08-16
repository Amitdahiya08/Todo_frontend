import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import TodoList from './components/TodoList';
import AddTodo from './components/AddTodo';
import Login from './components/Login';
import Signup from './components/Signup';
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';
import { isAuthenticated } from './services/authService';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public routes */}
          <Route
            path="/login"
            element={
              isAuthenticated() ? <Navigate to="/" replace /> : <Login />
            }
          />
          <Route
            path="/signup"
            element={
              isAuthenticated() ? <Navigate to="/" replace /> : <Signup />
            }
          />

          {/* Protected routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <div>
                  <Header />
                  <div className="container">
                    <TodoApp />
                  </div>
                </div>
              </ProtectedRoute>
            }
          />

          {/* Redirect to login if no route matches */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

// TodoApp component (moved from main App)
function TodoApp() {
  const [editingTodo, setEditingTodo] = React.useState(null);
  const refreshRef = React.useRef(null);

  const refreshTodos = () => {
    if (refreshRef.current) {
      refreshRef.current();
    }
  };

  const handleEdit = (todo) => {
    setEditingTodo(todo);
  };

  const clearEdit = () => {
    setEditingTodo(null);
  };

  return (
    <div className="todo-app">
      <TodoList
        ref={(el) => {
          refreshRef.current = el?.fetchTodos;
        }}
        onEdit={handleEdit}
      />
    </div>
  );
}

export default App;
