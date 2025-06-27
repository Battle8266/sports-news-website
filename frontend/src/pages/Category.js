import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import NewsCard from '../components/NewsCard';
import '../styles/home.css';

function Category() {
  const { sport } = useParams();
  const [news, setNews] = useState([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get('https://5491b775-be59-4e18-9b88-488fde3a90ba-00-191uhpbmd3ymd.pike.replit.dev/api/news', {
          params: { category: sport },
        });
        setNews(response.data);
      } catch (error) {
        toast.error('Error fetching news');
        console.error('Error fetching news:', error);
      }
    };
    fetchNews();
  }, [sport]);

  return (
    <div className="home">
      <h1>{sport} न्यूज़</h1>
      <div className="news-grid">
        {news.map(item => (
          <NewsCard key={item._id} news={item} />
        ))}
      </div>
    </div>
  );
}

export default Category;