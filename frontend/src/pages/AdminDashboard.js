import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import AuthContext from '../context/AuthContext';
import NewsCard from '../components/NewsCard';
import '../styles/home.css';

function AdminDashboard() {
  const { user, token } = useContext(AuthContext);
  const [news, setNews] = useState([]);
  const [editNews, setEditNews] = useState(null);

  useEffect(() => {
    if (user && (user.role === 'Owner' || user.role === 'Admin')) {
      fetchNews();
    }
  }, [user, token]);

  const fetchNews = async () => {
    try {
      const response = await axios.get('https://5491b775-be59-4e18-9b88-488fde3a90ba-00-191uhpbmd3ymd.pike.replit.dev/api/news', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNews(response.data);
    } catch (error) {
      toast.error('Error fetching news');
      console.error('Error fetching news:', error);
    }
  };

  const handleScrape = async () => {
    try {
      await axios.post('https://5491b775-be59-4e18-9b88-488fde3a90ba-00-191uhpbmd3ymd.pike.replit.dev/api/news/scrape', {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('News scraped successfully!');
      fetchNews();
    } catch (error) {
      toast.error('Error scraping news');
      console.error('Error scraping news:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://5491b775-be59-4e18-9b88-488fde3a90ba-00-191uhpbmd3ymd.pike.replit.dev/api/news/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('News deleted successfully!');
      fetchNews();
    } catch (error) {
      toast.error('Error deleting news');
      console.error('Error deleting news:', error);
    }
  };

  const handleEdit = (newsItem) => {
    setEditNews(newsItem);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`https://5491b775-be59-4e18-9b88-488fde3a90ba-00-191uhpbmd3ymd.pike.replit.dev/api/news/${editNews._id}`, editNews, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('News updated successfully!');
      setEditNews(null);
      fetchNews();
    } catch (error) {
      toast.error('Error updating news');
      console.error('Error updating news:', error);
    }
  };

  if (!user || (user.role !== 'Owner' && user.role !== 'Admin')) {
    return <div>Access denied. Please log in as Admin or Owner.</div>;
  }

  return (
    <div className="home">
      <h1>एडमिन डैशबोर्ड</h1>
      <button onClick={handleScrape} className="scrape-button">
        न्यूज़ स्क्रैप करें
      </button>
      {editNews && (
        <form className="edit-form" onSubmit={handleUpdate}>
          <h2>न्यूज़ एडिट करें</h2>
          <div>
            <label>शीर्षक:</label>
            <input
              type="text"
              value={editNews.title}
              onChange={(e) => setEditNews({ ...editNews, title: e.target.value })}
            />
          </div>
          <div>
            <label>विवरण:</label>
            <textarea
              value={editNews.description}
              onChange={(e) => setEditNews({ ...editNews, description: e.target.value })}
            />
          </div>
          <div>
            <label>कैटेगरी:</label>
            <input
              type="text"
              value={editNews.category}
              onChange={(e) => setEditNews({ ...editNews, category: e.target.value })}
            />
          </div>
          <button type="submit">अपडेट करें</button>
          <button type="button" onClick={() => setEditNews(null)}>रद्द करें</button>
        </form>
      )}
      <h2>सभी न्यूज़</h2>
      <div className="news-grid">
        {news.map(item => (
          <div key={item._id} className="news-item">
            <NewsCard news={item} />
            <p>वेरिफिकेशन: {item.verified ? `Verified by ${item.verificationSource}` : 'Not Verified'}</p>
            <button onClick={() => handleEdit(item)}>एडिट</button>
            <button onClick={() => handleDelete(item._id)}>डिलीट</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminDashboard;