import React from 'react';
import '../styles/home.css';

function NewsTicker({ news }) {
  return (
    <div className="news-ticker">
      {news.map(item => (
        <span key={item._id}>{item.title} ({item.verified ? 'Verified' : 'Unverified'}) | </span>
      ))}
    </div>
  );
}

export default NewsTicker;