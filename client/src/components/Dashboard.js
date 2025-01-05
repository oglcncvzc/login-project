import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Yönlendirme için
import { jwtDecode } from 'jwt-decode';
import Todo from './Todo'; // To-Do bileşeni

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate(); // Yönlendirme için

  useEffect(() => {
    const token = localStorage.getItem('token'); // LocalStorage'dan token'ı al
    if (!token) {
      navigate('/login'); // Token yoksa login sayfasına yönlendir
    } else {
      try {
        const decodedToken = jwtDecode(token); // Token'ı çözümle
        const userEmail = decodedToken.email || 'Bilinmeyen Kullanıcı'; // Kullanıcı email'ini al
        setUser({ email: userEmail }); // Kullanıcıyı state'e set et
      } catch (error) {
        console.error('Geçersiz token:', error);
        setUser(null);
        navigate('/login'); // Geçersiz token varsa login sayfasına yönlendir
      }
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token'); // Token'ı sil
    setUser(null);
    navigate('/login'); // Login sayfasına yönlendir
  };

  return (
    <div>
      <h2>Hoşgeldiniz!</h2>
      {user ? (
        <>
          <p>Merhaba {user.email}, giriş yaptınız!</p>
          <button onClick={handleLogout}>Çıkış Yap</button>
          {/* To-Do Bileşeni */}
          <Todo />
        </>
      ) : (
        <p>Kullanıcı bilgileri yükleniyor...</p>
      )}
    </div>
  );
};

export default Dashboard;
