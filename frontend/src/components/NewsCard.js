import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/newsCard.css';

function NewsCard({ news }) {
  return (
    <div className="news-card">
      <h2>{news.title}</h2>
      <p>{news.description.substring(0, 100)}...</p>
      <p>वेरिफिकेशन: {news.verified ? `Verified by ${news.verificationSource}` : 'Not Verified'}</p>
      <Link to={`/news/${news._id}`}>और पढ़ें</Link>
    </div>
  );
}

export default NewsCard;