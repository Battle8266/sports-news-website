import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import '../styles/form.css';

function Feedback() {
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
      await axios.post('https://5491b775-be59-4e18-9b88-488fde3a90ba-00-191uhpbmd3ymd.pike.replit.dev/api/feedback', formData);
      toast.success('Feedback submitted successfully!');
      setFormData({
        name: '',
        email: '',
        favoriteSports: [],
        feedback: '',
        wantsToContribute: false,
      });
    } catch (error) {
      toast.error('Error submitting feedback');
      console.error('Error submitting feedback:', error);
    }
  };

  const handleSportChange = (e) => {
    const sport = e.target.value;
    if (e.target.checked) {
      setFormData({ ...formData, favoriteSports: [...formData.favoriteSports, sport] });
    } else {
      setFormData({
        ...formData,
        favoriteSports: formData.favoriteSports.filter(s => s !== sport),
      });
    }
  };

  return (
    <div className="form-container">
      <h1>फीडबैक</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>नाम:</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
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
          <label>पसंदीदा खेल (एक या अधिक चुनें):</label>
          <label>
            <input
              type="checkbox"
              value="Cricket"
              checked={formData.favoriteSports.includes('Cricket')}
              onChange={handleSportChange}
            />
            क्रिकेट
          </label>
          <label>
            <input
              type="checkbox"
              value="Football"
              checked={formData.favoriteSports.includes('Football')}
              onChange={handleSportChange}
            />
            फुटबॉल
          </label>
          <label>
            <input
              type="checkbox"
              value="Hockey"
              checked={formData.favoriteSports.includes('Hockey')}
              onChange={handleSportChange}
            />
            हॉकी
          </label>
        </div>
        <div>
          <label>फीडबैक:</label>
          <textarea
            value={formData.feedback}
            onChange={(e) => setFormData({ ...formData, feedback: e.target.value })}
            required
          />
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              checked={formData.wantsToContribute}
              onChange={(e) => setFormData({ ...formData, wantsToContribute: e.target.checked })}
            />
            मैं योगदान देना चाहता हूँ
          </label>
        </div>
        <button type="submit">सबमिट करें</button>
      </form>
    </div>
  );
}

export default Feedback;