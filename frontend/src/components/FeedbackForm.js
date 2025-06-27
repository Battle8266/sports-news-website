// frontend/src/components/FeedbackForm.js
import React, { useState } from 'react';
import axios from 'axios';
import '../styles/feedback.css';

function FeedbackForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    favoriteSports: [],
    feedback: '',
    wantsToContribute: false,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/feedback', formData);
      alert('Feedback submitted!');
      setFormData({ name: '', email: '', favoriteSports: [], feedback: '', wantsToContribute: false });
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox' && name === 'favoriteSports') {
      setFormData({
        ...formData,
        favoriteSports: checked
          ? [...formData.favoriteSports, value]
          : formData.favoriteSports.filter(sport => sport !== value),
      });
    } else {
      setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    }
  };

  return (
    <form className="feedback-form" onSubmit={handleSubmit}>
      <h2>फीडबैक दें</h2>
      <div>
        <label>नाम:</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} required />
      </div>
      <div>
        <label>ईमेल:</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} required />
      </div>
      <div>
        <label>पसंदीदा खेल:</label>
        <label><input type="checkbox" name="favoriteSports" value="Cricket" onChange={handleChange} /> क्रिकेट</label>
        <label><input type="checkbox" name="favoriteSports" value="Football" onChange={handleChange} /> फुटबॉल</label>
        <label><input type="checkbox" name="favoriteSports" value="Hockey" onChange={handleChange} /> हॉकी</label>
      </div>
      <div>
        <label>फीडबैक:</label>
        <textarea name="feedback" value={formData.feedback} onChange={handleChange} required />
      </div>
      <div>
        <label>
          <input type="checkbox" name="wantsToContribute" checked={formData.wantsToContribute} onChange={handleChange} />
          क्या आप न्यूज़ कंटेंट में योगदान देना चाहते हैं?
        </label>
      </div>
      <button type="submit">सबमिट करें</button>
    </form>
  );
}

export default FeedbackForm;