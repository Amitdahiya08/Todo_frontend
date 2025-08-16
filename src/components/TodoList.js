import React, { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { getTodos, addTodo, deleteTodo, updateTodo } from "../services/todoService";
import "./TodoList.css";

const TodoList = forwardRef(({ onEdit }, ref) => {
    const [todos, setTodos] = useState([]);
    const [title, setTitle] = useState("");
    const [editId, setEditId] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchTodos();
    }, []);

    const fetchTodos = async () => {
        try {
            setLoading(true);
            const response = await getTodos();
            setTodos(response.data);
        } catch (error) {
            console.error('Error fetching todos:', error);
        } finally {
            setLoading(false);
        }
    };

    // Expose fetchTodos to parent component
    useImperativeHandle(ref, () => ({
        fetchTodos
    }));

    const handleSubmit = async (e) => {
        console.log('handleSubmit called with event:', e);
        e.preventDefault();
        console.log('Event prevented, title:', title, 'editId:', editId);

        if (!title.trim()) {
            console.log('Title is empty, returning early');
            return;
        }

        try {
            if (editId) {
                console.log('Updating existing todo:', editId);
                // Update existing todo
                await updateTodo(editId, { title, completed: false });
                setTodos(todos.map((t) => (t.id === editId ? { ...t, title } : t)));
                setEditId(null);
                setTitle("");
            } else {
                console.log('Creating new todo with title:', title);
                // Create new todo
                const newTodo = { title, completed: false };
                console.log('Calling addTodo with:', newTodo);
                const response = await addTodo(newTodo);
                console.log('addTodo response:', response);
                setTodos([...todos, response.data]);
                setTitle("");
            }
        } catch (error) {
            console.error('Error saving todo:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteTodo(id);
            setTodos(todos.filter((t) => t.id !== id));
        } catch (error) {
            console.error('Error deleting todo:', error);
        }
    };

    const handleEdit = (todo) => {
        setEditId(todo.id);
        setTitle(todo.title);
        if (onEdit) {
            onEdit(todo);
        }
    };

    const handleToggleComplete = async (todo) => {
        try {
            const updatedTodo = { ...todo, completed: !todo.completed };
            await updateTodo(todo.id, updatedTodo);
            setTodos(todos.map((t) => (t.id === todo.id ? updatedTodo : t)));
        } catch (error) {
            console.error('Error updating todo:', error);
        }
    };

    const clearEdit = () => {
        setEditId(null);
        setTitle("");
    };

    return (
        <div className="todo-container">
            <h2>📋 Todo List</h2>

            <form onSubmit={handleSubmit} className="todo-form">
                <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={editId ? "Edit todo" : "Enter new todo"}
                    className="todo-input"
                    required
                />
                <button type="submit" className="todo-btn">
                    {editId ? "Update" : "Add"}
                </button>
                {editId && (
                    <button type="button" onClick={clearEdit} className="cancel-btn">
                        Cancel
                    </button>
                )}
            </form>

            {loading ? (
                <div className="loading">Loading todos...</div>
            ) : (
                <ul className="todo-list">
                    {todos.map((todo) => (
                        <li key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
                            <div className="todo-content">
                                <input
                                    type="checkbox"
                                    checked={todo.completed}
                                    onChange={() => handleToggleComplete(todo)}
                                    className="todo-checkbox"
                                />
                                <span className={`todo-title ${todo.completed ? 'completed-text' : ''}`}>
                                    {todo.title}
                                </span>
                            </div>
                            <div className="todo-actions">
                                <button onClick={() => handleEdit(todo)} className="edit-btn" title="Edit">
                                    ✏️
                                </button>
                                <button onClick={() => handleDelete(todo.id)} className="delete-btn" title="Delete">
                                    ❌
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            {todos.length === 0 && !loading && (
                <div className="no-todos">No todos yet. Add one above!</div>
            )}
        </div>
    );
});

export default TodoList;
