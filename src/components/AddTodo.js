import React, { useState } from 'react';

export default function AddTodo({ refreshTodos, editingTodo, clearEdit }) {
    const [title, setTitle] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title.trim()) return;

        // Call the parent's refresh function
        if (refreshTodos) {
            refreshTodos();
        }
        setTitle("");
    };

    return (
        <div className="add-todo-container">
            <h3>Add New Todo</h3>
            <form onSubmit={handleSubmit} className="add-todo-form">
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter todo title"
                    className="add-todo-input"
                    required
                />
                <button type="submit" className="add-todo-btn">
                    Add Todo
                </button>
            </form>
        </div>
    );
}
