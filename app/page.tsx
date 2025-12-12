'use client';
import { useEffect, useState } from 'react';

interface Todo {
  id: string;
  title: string;
  done: boolean;
  createdAt: string;
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function refresh() {
    try {
      const res = await fetch('/api/todos');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setTodos(data);
    } catch (err) {
      setError('Gagal memuat data');
      console.error(err);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  async function addTodo() {
    if (!title.trim()) {
      setError('Title tidak boleh kosong');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title.trim() }),
      });

      if (!res.ok) throw new Error('Failed to add');

      setTitle('');
      await refresh();
    } catch (err) {
      setError('Gagal menambahkan todo');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function toggleTodo(id: string, done: boolean) {
    try {
      const res = await fetch('/api/todos', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, done: !done }),
      });

      if (!res.ok) throw new Error('Failed to update');
      await refresh();
    } catch (err) {
      setError('Gagal mengupdate todo');
      console.error(err);
    }
  }

  async function deleteTodo(id: string) {
    if (!confirm('Yakin ingin menghapus todo ini?')) return;
    
    try {
      const res = await fetch('/api/todos', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) throw new Error('Failed to delete');
      await refresh();
    } catch (err) {
      setError('Gagal menghapus todo');
      console.error(err);
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading) {
      addTodo();
    }
  };

  const stats = {
    total: todos.length,
    completed: todos.filter((t) => t.done).length,
    pending: todos.filter((t) => !t.done).length,
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '40px 20px',
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px', color: 'white' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>
            📝 Todo CRUD App
          </h1>
          <p>Next.js + Vercel Postgres</p>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(3, 1fr)', 
          gap: '15px',
          marginBottom: '30px' 
        }}>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '20px',
            textAlign: 'center',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#667eea' }}>
              {stats.total}
            </div>
            <div style={{ fontSize: '0.875rem', color: '#666' }}>Total</div>
          </div>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '20px',
            textAlign: 'center',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981' }}>
              {stats.completed}
            </div>
            <div style={{ fontSize: '0.875rem', color: '#666' }}>Selesai</div>
          </div>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '20px',
            textAlign: 'center',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f59e0b' }}>
              {stats.pending}
            </div>
            <div style={{ fontSize: '0.875rem', color: '#666' }}>Pending</div>
          </div>
        </div>

        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '30px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
        }}>
          {error && (
            <div style={{
              background: '#fee2e2',
              border: '1px solid #fecaca',
              borderRadius: '8px',
              padding: '12px',
              marginBottom: '20px',
              color: '#dc2626',
            }}>
              ⚠️ {error}
            </div>
          )}

          <div style={{ marginBottom: '30px' }}>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Tambahkan todo baru..."
                disabled={loading}
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  border: '2px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  outline: 'none',
                }}
              />
              <button
                onClick={addTodo}
                disabled={loading}
                style={{
                  padding: '12px 24px',
                  background: loading ? '#ccc' : '#667eea',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: loading ? 'not-allowed' : 'pointer',
                }}
              >
                {loading ? 'Loading...' : '➕ Tambah'}
              </button>
            </div>
          </div>

          <div>
            {todos.length === 0 ? (
              <div style={{ 
                textAlign: 'center', 
                padding: '60px 20px', 
                color: '#999' 
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '15px' }}>📝</div>
                <p style={{ fontSize: '1.125rem' }}>Belum ada todo</p>
                <p style={{ fontSize: '0.875rem' }}>Tambahkan todo pertama Anda!</p>
              </div>
            ) : (
              todos.map((todo) => (
                <div
                  key={todo.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '15px',
                    padding: '16px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    marginBottom: '10px',
                    background: 'white',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={todo.done}
                    onChange={() => toggleTodo(todo.id, todo.done)}
                    style={{
                      width: '20px',
                      height: '20px',
                      cursor: 'pointer',
                    }}
                  />

                  <div style={{ flex: 1 }}>
                    <p
                      style={{
                        fontSize: '1.125rem',
                        textDecoration: todo.done ? 'line-through' : 'none',
                        color: todo.done ? '#9ca3af' : '#1f2937',
                        marginBottom: '4px',
                        margin: 0,
                      }}
                    >
                      {todo.title}
                    </p>
                    <p style={{ fontSize: '0.75rem', color: '#9ca3af', margin: '4px 0 0 0' }}>
                      {new Date(todo.createdAt).toLocaleString('id-ID')}
                    </p>
                  </div>

                  <button
                    onClick={() => deleteTodo(todo.id)}
                    style={{
                      padding: '8px 16px',
                      background: '#fee2e2',
                      color: '#dc2626',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                    }}
                  >
                    🗑️ Hapus
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

