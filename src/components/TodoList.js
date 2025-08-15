import React, { useState, useEffect } from "react";
import { getTodos, addTodo, deleteTodo, updateTodo } from "../services/todoService";
import "./TodoList.css"; // import CSS

export default function TodoList() {
    const [todos, setTodos] = useState([]);
    const [title, setTitle] = useState("");
    const [editId, setEditId] = useState(null);

    useEffect(() => {
        fetchTodos();
    }, []);

    const fetchTodos = () => {
        getTodos().then((res) => setTodos(res.data));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title.trim()) return;

        if (editId) {
            updateTodo(editId, { title }).then(() => {
                setTodos(todos.map((t) => (t.id === editId ? { ...t, title } : t)));
                setEditId(null);
                setTitle("");
            });
        } else {
            addTodo({ title }).then((res) => {
                setTodos([...todos, res.data]);
                setTitle("");
            });
        }
    };

    const handleDelete = (id) => {
        deleteTodo(id).then(() => {
            setTodos(todos.filter((t) => t.id !== id));
        });
    };

    const handleEdit = (todo) => {
        setEditId(todo.id);
        setTitle(todo.title);
    };

    return (
        <div className="todo-container">
            <h2>📋 Todo List</h2>

            <form onSubmit={handleSubmit} className="todo-form">
                <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter todo"
                    className="todo-input"
                />
                <button type="submit" className="todo-btn">
                    {editId ? "Update" : "Add"}
                </button>
            </form>

            <ul className="todo-list">
                {todos.map((todo) => (
                    <li key={todo.id} className="todo-item">
                        <span>{todo.title}</span>
                        <div>
                            <button onClick={() => handleEdit(todo)} className="edit-btn">✏️</button>
                            <button onClick={() => handleDelete(todo.id)} className="delete-btn">❌</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
