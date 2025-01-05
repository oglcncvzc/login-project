import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Checkbox, Button, Space, message } from 'antd';

const Todo = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedTodos, setSelectedTodos] = useState([]); // Seçilen görevleri tutan state
  const API_URL = 'http://localhost:5000/api/todos'; // Backend URL

  // Görevleri listele
  const fetchTodos = async () => {
    setLoading(true);
    
    // Token'ı localStorage'dan al
    const token = localStorage.getItem('token');  // token'ı kaydettiğiniz yer
  
    try {
      const response = await axios.get(API_URL, {
        headers: {
          'Authorization': `Bearer ${token}`,  // Token'ı başlığa ekliyoruz
        }
      });
      const tasks = response.data.map(todo => ({
        ...todo,
        isCompleted: todo.isCompleted || false, // Eğer isCompleted undefined ise false olarak ayarla
        id: todo._id, // _id'yi id olarak atıyoruz
      }));
      setTodos(tasks);
    } catch (err) {
      setError('Görevler yüklenemedi!');
    } finally {
      setLoading(false);
    }
  };

  // Görev oluştur
  const createTodo = async () => {
    if (!newTodo.trim()) return alert('Görev metni boş olamaz!');
    try {
      const response = await axios.post(`${API_URL}/create`, { title: newTodo });
      const newTask = { ...response.data.task, isCompleted: false, id: response.data.task._id };
      setTodos([...todos, newTask]);
      setNewTodo('');
    } catch (err) {
      setError('Görev oluşturulamadı!');
    }
  };

  // Görev sil
  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${API_URL}/delete/${id}`);
      setTodos(todos.filter((todo) => todo.id !== id));
    } catch (err) {
      setError('Görev silinemedi!');
    }
  };

  // Görev güncelle
  const updateTodo = async (id, updatedTodo) => {
    try {
      const response = await axios.put(`${API_URL}/update/${id}`, updatedTodo);
      setTodos(
        todos.map((todo) => (todo.id === id ? { ...todo, ...response.data.task } : todo))
      );
    } catch (err) {
      setError('Görev güncellenemedi!');
    }
  };

  // Tüm görevleri sil
  const deleteAllTodos = async () => {
    try {
      await axios.delete(`${API_URL}/delete-all`);
      setTodos([]); // Listeyi temizle
    } catch (err) {
      setError('Tüm görevler silinemedi!');
    }
  };

  // Tüm görevleri tamamlanmış olarak işaretle
  const markAllCompleted = async () => {
    try {
      await axios.put(`${API_URL}/mark-all-completed`);
      setTodos(todos.map(todo => ({ ...todo, isCompleted: true }))); // Tüm görevleri tamamlandı olarak işaretle
    } catch (err) {
      setError('Tüm görevler tamamlanamadı!');
    }
  };

  // Seçilen görevleri işaretle / kaldır
  const handleSelectAll = () => {
    if (selectedTodos.length === todos.length) {
      setSelectedTodos([]); // Eğer tüm görevler zaten seçiliyse, kaldır
    } else {
      setSelectedTodos(todos.map(todo => todo.id)); // Tüm görevleri seç
    }
  };

  const handleBulkDelete = () => {
    if (selectedTodos.length === 0) {
      message.error('Lütfen silmek için görevleri seçin');
      return;
    }
    selectedTodos.forEach(async (id) => {
      await deleteTodo(id);
    });
    setSelectedTodos([]); // Seçimleri temizle
    message.success('Seçilen görevler silindi');
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleSelectChange = (id) => {
    setSelectedTodos((prevSelectedTodos) =>
      prevSelectedTodos.includes(id)
        ? prevSelectedTodos.filter((todoId) => todoId !== id) // Seçili değilse, seç
        : [...prevSelectedTodos, id] // Seçili değilse, ekle
    );
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>To-Do Uygulaması</h1>

      <div>
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Yeni görev girin..."
          style={{ padding: '8px', width: '300px' }}
        />
        <button onClick={createTodo} style={{ marginLeft: '10px', padding: '8px' }}>
          Ekle
        </button>
      </div>

      {loading && <p>Yükleniyor...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div style={{ marginTop: '20px' }}>
        <Space>
          <Button onClick={deleteAllTodos} style={{ marginRight: '10px' }}>
            Tümünü Sil
          </Button>
          <Button onClick={markAllCompleted}>
            Hepsini Tamamla
          </Button>
          <Button onClick={handleBulkDelete} style={{ marginLeft: '10px' }}>
            Seçilenleri Sil
          </Button>
          <Button onClick={handleSelectAll} style={{ marginLeft: '10px' }}>
            {selectedTodos.length === todos.length ? 'Tümünü Kaldır' : 'Tümünü Seç'}
          </Button>
        </Space>
      </div>

      <ul style={{ marginTop: '20px' }}>
        {todos.map((todo) => (
          <li key={todo.id} style={{ marginBottom: '10px' }}>
            <Checkbox
              checked={selectedTodos.includes(todo.id)}
              onChange={() => handleSelectChange(todo.id)}
              style={{ marginRight: '10px' }}
            />
            <span
              style={{
                textDecoration: todo.isCompleted ? 'line-through' : 'none',
                marginRight: '10px',
              }}
            >
              {todo.title}
            </span>
            <button
              onClick={() => updateTodo(todo.id, { isCompleted: !todo.isCompleted })}
              style={{ marginRight: '5px' }}
            >
              {todo.isCompleted ? 'Tamamlandı Kaldır' : 'Tamamlandı'}
            </button>
            <button onClick={() => deleteTodo(todo.id)}>Sil</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Todo;
