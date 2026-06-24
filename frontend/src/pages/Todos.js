import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '../components/Navbar';
import TodoItem from '../components/TodoItem';
import AddTodoModal from '../components/AddTodoModal';
import { todoAPI } from '../services/api';
import './Todos.css';

const FILTERS = [
  { key: 'all',       label: 'All Tasks' },
  { key: 'active',    label: 'Active' },
  { key: 'completed', label: 'Completed' },
];

export default function Todos() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);

  const loadTodos = useCallback(async () => {
    try {
      setError('');
      const { data } = await todoAPI.getAll();
      setTodos(data);
    } catch (err) {
      setError('Failed to load tasks. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadTodos(); }, [loadTodos]);

  // Derived counts
  const completedCount = todos.filter(t => t.completed).length;
  const activeCount = todos.length - completedCount;

  const filteredTodos = todos.filter(t => {
    if (filter === 'active')    return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  // ===== CRUD Handlers =====
  const handleAdd = async ({ title, description }) => {
    try {
      const { data } = await todoAPI.create({ title, description, completed: false });
      setTodos(prev => [data, ...prev]);
      setShowModal(false);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create task.');
    }
  };

  const handleToggle = async (id) => {
    try {
      const { data: updated } = await todoAPI.toggle(id);
      setTodos(prev => prev.map(t => t.id === id ? updated : t));
    } catch (err) {
      alert('Failed to update task.');
    }
  };

  const handleUpdate = async (id, changes) => {
    try {
      const { data: updated } = await todoAPI.update(id, changes);
      setTodos(prev => prev.map(t => t.id === id ? updated : t));
    } catch (err) {
      alert('Failed to update task.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await todoAPI.delete(id);
      setTodos(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      alert('Failed to delete task.');
    }
  };

  return (
    <div className="todos-layout">
      <Navbar totalCount={todos.length} completedCount={completedCount} />

      <main className="todos-main">
        <div className="todos-container">

          {/* Header */}
          <div className="todos-header">
            <div>
              <h1 className="todos-heading">My Tasks</h1>
              <p className="todos-subheading">
                {activeCount} remaining · {completedCount} completed
              </p>
            </div>
            <button className="btn-add-task" onClick={() => setShowModal(true)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              New Task
            </button>
          </div>

          {/* Filter Tabs */}
          <div className="filter-tabs" role="tablist">
            {FILTERS.map(f => (
              <button
                key={f.key}
                role="tab"
                aria-selected={filter === f.key}
                className={`filter-tab ${filter === f.key ? 'filter-tab--active' : ''}`}
                onClick={() => setFilter(f.key)}
              >
                {f.label}
                <span className="filter-tab-count">
                  {f.key === 'all' ? todos.length
                   : f.key === 'active' ? activeCount
                   : completedCount}
                </span>
              </button>
            ))}
          </div>

          {/* Content */}
          {loading ? (
            <div className="todos-state">
              <div className="loading-pulse" />
              <p>Loading your tasks...</p>
            </div>
          ) : error ? (
            <div className="todos-state todos-state--error">
              <p>{error}</p>
              <button onClick={loadTodos} className="btn-retry">Try Again</button>
            </div>
          ) : filteredTodos.length === 0 ? (
            <div className="todos-state todos-empty">
              <div className="empty-icon">
                {filter === 'completed' ? '🎉' : filter === 'active' ? '✨' : '📝'}
              </div>
              <p className="empty-title">
                {filter === 'completed' ? 'No completed tasks yet'
                 : filter === 'active' ? 'All tasks are done!'
                 : 'No tasks yet'}
              </p>
              <p className="empty-subtitle">
                {filter === 'all'
                  ? 'Create your first task to get started.'
                  : filter === 'active'
                  ? 'Great work! Add more tasks to keep going.'
                  : 'Complete some tasks to see them here.'}
              </p>
              {filter === 'all' && (
                <button className="btn-add-task" onClick={() => setShowModal(true)}>
                  + Add your first task
                </button>
              )}
            </div>
          ) : (
            <ul className="todo-list" aria-label="Tasks">
              {filteredTodos.map(todo => (
                <li key={todo.id}>
                  <TodoItem
                    todo={todo}
                    onToggle={handleToggle}
                    onUpdate={handleUpdate}
                    onDelete={handleDelete}
                  />
                </li>
              ))}
            </ul>
          )}

        </div>
      </main>

      {showModal && (
        <AddTodoModal
          onClose={() => setShowModal(false)}
          onAdd={handleAdd}
        />
      )}
    </div>
  );
}
