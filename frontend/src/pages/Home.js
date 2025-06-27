import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import NewsCard from '../components/NewsCard';
import NewsTicker from '../components/NewsTicker';
import { Link } from 'react-router-dom';
import '../styles/home.css';

function Home() {
  const [news, setNews] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get('https://5491b775-be59-4e18-9b88-488fde3a90ba-00-191uhpbmd3ymd.pike.replit.dev/api/news', {
          params: { search, category },
        });
        setNews(response.data);
      } catch (error) {
        toast.error('Error fetching news');
        console.error('Error fetching news:', error);
      }
    };
    fetchNews();
  }, [search, category]);

  return (
    <div className="home">
      <h1>स्पोर्ट्स न्यूज़</h1>
      <Link to="/scores" className="scrape-button">लाइव स्कोर देखें</Link>
      <div className="filters">
        <input
          type="text"
          placeholder="न्यूज़ खोजें..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">सभी कैटेगरी</option>
          <option value="Cricket">क्रिकेट</option>
          <option value="Football">फुटबॉल</option>
          <option value="Hockey">हॉकी</option>
        </select>
      </div>
      <NewsTicker news={news.slice(0, 5)} />
      <div className="news-grid">
        {news.map(item => (
          <NewsCard key={item._id} news={item} />
        ))}
      </div>
    </div>
  );
}

export default Home;