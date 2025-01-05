import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Input, Button, Form, message } from 'antd';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    setLoading(true);

    try {
      // Backend'e login isteği gönder
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email: values.email,
        password: values.password,
      });

      setLoading(false);
      const token = response.data.token;

      if (token) {
        localStorage.setItem('token', token); // Token'ı localStorage'a kaydet
        message.success('Giriş başarılı!');
        navigate('/dashboard'); // Başarılı girişte dashboard'a yönlendir
      } else {
        message.error('Token alınamadı, giriş başarısız.');
      }
    } catch (err) {
      setLoading(false);
      message.error(err.response?.data?.message || 'Giriş sırasında bir hata oluştu');
    }
  };

  const handleRegister = () => {
    navigate('/register'); // Register sayfasına yönlendir
  };

  return (
    <div className="login-page" style={{ padding: '50px', display: 'flex', justifyContent: 'center' }}>
      <div className="login-container" style={{ width: '100%', maxWidth: '400px' }}>
        <h2>Giriş Yap</h2>
        <Form
          onFinish={handleSubmit}
          initialValues={{ email, password }}
          layout="vertical"
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: 'Lütfen email adresinizi girin!' }, { type: 'email', message: 'Geçersiz email!' }]}
          >
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
            />
          </Form.Item>

          <Form.Item
            label="Şifre"
            name="password"
            rules={[{ required: true, message: 'Lütfen şifrenizi girin!' }]}
          >
            <Input.Password
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Şifre"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={loading}
            >
              {loading ? 'Yükleniyor...' : 'Giriş Yap'}
            </Button>
          </Form.Item>

          <Form.Item>
            <Button
              type="link"
              block
              onClick={handleRegister}
            >
              Kayıt Ol
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default LoginPage;
