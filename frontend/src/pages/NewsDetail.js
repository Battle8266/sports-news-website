import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import AuthContext from '../context/AuthContext';
import { FaWhatsapp, FaTwitter, FaTelegram } from 'react-icons/fa';
import '../styles/newsCard.css';

function NewsDetail() {
  const { id } = useParams();
  const { user, token } = useContext(AuthContext);
  const [news, setNews] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get(`https://5491b775-be59-4e18-9b88-488fde3a90ba-00-191uhpbmd3ymd.pike.replit.dev/api/news/${id}`);
        setNews(response.data);
      } catch (error) {
        toast.error('Error fetching news');
        console.error('Error fetching news:', error);
      }
    };

    const fetchComments = async () => {
      try {
        const response = await axios.get(`https://5491b775-be59-4e18-9b88-488fde3a90ba-00-191uhpbmd3ymd.pike.replit.dev/api/comments/news/${id}`);
        setComments(response.data);
      } catch (error) {
        toast.error('Error fetching comments');
        console.error('Error fetching comments:', error);
      }
    };

    fetchNews();
    fetchComments();
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please log in to comment');
      return;
    }
    try {
      const response = await axios.post(
        'https://5491b775-be59-4e18-9b88-488fde3a90ba-00-191uhpbmd3ymd.pike.replit.dev/api/comments',
        { newsId: id, content: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComments([...comments, response.data]);
      setNewComment('');
      toast.success('Comment added!');
    } catch (error) {
      toast.error('Error adding comment');
      console.error('Error adding comment:', error);
    }
  };

  const handleCommentDelete = async (commentId) => {
    try {
      await axios.delete(`https://5491b775-be59-4e18-9b88-488fde3a90ba-00-191uhpbmd3ymd.pike.replit.dev/api/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComments(comments.filter(comment => comment._id !== commentId));
      toast.success('Comment deleted!');
    } catch (error) {
      toast.error('Error deleting comment');
      console.error('Error deleting comment:', error);
    }
  };

  if (!news) return <div>Loading...</div>;

  const shareUrl = encodeURIComponent(news.link);
  const title = encodeURIComponent(news.title);

  return (
    <div className="news-card">
      <h2>{news.title}</h2>
      <p>{news.description}</p>
      <p>
        स्रोत: {news.source} | <a href={news.link} target="_blank" rel="noopener noreferrer">मूल लेख</a>
      </p>
      <p>वेरिफिकेशन: {news.verified ? `Verified by ${news.verificationSource}` : 'Not Verified'}</p>
      <div className="social-share">
        <a href={`https://api.whatsapp.com/send?text=${title}%20${shareUrl}`} target="_blank" rel="noopener noreferrer">
          <FaWhatsapp />
        </a>
        <a href={`https://twitter.com/intent/tweet?text=${title}&url=${shareUrl}`} target="_blank" rel="noopener noreferrer">
          <FaTwitter />
        </a>
        <a href={`https://t.me/share/url?url=${shareUrl}&text=${title}`} target="_blank" rel="noopener noreferrer">
          <FaTelegram />
        </a>
      </div>
      <div className="comments-section">
        <h3>कमेंट्स</h3>
        {user ? (
          <form onSubmit={handleCommentSubmit}>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="आपका कमेंट..."
              required
            />
            <button type="submit">कमेंट करें</button>
          </form>
        ) : (
          <p>कमेंट करने के लिए लॉगिन करें।</p>
        )}
        <div className="comments-list">
          {comments.map(comment => (
            <div key={comment._id} className="comment">
              <p><strong>{comment.userId.username}</strong>: {comment.content}</p>
              {(user && (comment.userId._id === user.id || ['Owner', 'Admin'].includes(user.role))) && (
                <button onClick={() => handleCommentDelete(comment._id)}>डिलीट</button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default NewsDetail;