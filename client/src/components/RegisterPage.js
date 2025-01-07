import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Input, Button, Form, Alert } from 'antd';

const RegisterPage = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    const { email, password } = values;
    
    console.log('Gönderilen email:', email);  // Email'i logla
    console.log('Gönderilen şifre:', password);  // Şifreyi logla
  
    setLoading(true);
  
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        email,
        password,  // Şifreyi olduğu gibi gönderiyoruz
      });
  
      setLoading(false);
      alert('Kayıt başarılı!');
      navigate('/login'); // Kayıt başarılı olduğunda login sayfasına yönlendir
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'Kayıt sırasında bir hata oluştu');
    }
  };
  

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
      <h2>Kayıt Ol</h2>
      {error && <Alert message={error} type="error" />}
      <Form onFinish={handleSubmit}>
        <Form.Item
          name="email"
          label="Email"
          rules={[{ required: true, type: 'email', message: 'Geçerli bir email adresi girin!' }]}
        >
          <Input placeholder="Email" />
        </Form.Item>

        <Form.Item
          name="password"
          label="Şifre"
          rules={[{ required: true, message: 'Lütfen şifrenizi girin!' }]}
        >
          <Input.Password placeholder="Şifre" />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
            loading={loading}
            disabled={loading}
          >
            {loading ? 'Yükleniyor...' : 'Kayıt Ol'}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default RegisterPage;
