import React, { useState, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import '../styles/form.css';

function Login() {
  const { setUser, setToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://5491b775-be59-4e18-9b88-488fde3a90ba-00-191uhpbmd3ymd.pike.replit.dev/api/auth/login', formData);
      setUser(response.data.user);
      setToken(response.data.token);
      localStorage.setItem('token', response.data.token);
      toast.success('Logged in successfully!');
      navigate(response.data.user.role === 'Owner' || response.data.user.role === 'Admin' ? '/admin' : '/');
    } catch (error) {
      toast.error('Error logging in');
      console.error('Error logging in:', error);
    }
  };

  return (
    <div className="form-container">
      <h1>लॉगिन</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>ईमेल:</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>
        <div>
          <label>पासवर्ड:</label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
        </div>
        <button type="submit">लॉगिन</button>
      </form>
    </div>
  );
}

export default Login;