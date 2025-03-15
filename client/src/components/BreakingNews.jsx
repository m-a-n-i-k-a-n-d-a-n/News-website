import React, { useEffect, useState } from 'react';
import axios from 'axios';

function BreakingNews() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data from Google News RSS feed (via RSS to JSON API)
  useEffect(() => {
    const fetchNews = async () => {
      try {
        // Google News RSS feed (can change topic query in URL)
        const rssUrl = 'https://news.google.com/rss'; // US Top Headlines
        const response = await axios.get(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`);
        
        // Check if the response status is 'ok' and news data is present
        if (response.data.status === 'ok' && response.data.items) {
          setNews(response.data.items); // Set the news data
        } else {
          console.error('No news items found in the response');
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching the news:', error);
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) {
    return <div>Loading breaking news...</div>;
  }

  return (
    <div className="news-container">
      <h2>Breaking News</h2>
      <div className="news-cards">
        {news.length > 0 ? (
          news.map((article, index) => (
            <div key={index} className="news-card">
              <div className="news-content">
                <h3 className="news-title">{article.title}</h3>
                <a href={article.link} target="_blank" rel="noopener noreferrer" className="source-link">
                  Read more
                </a>
                <p className="published-at">
                  Published At: {new Date(article.pubDate).toLocaleString()}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p>No breaking news available at the moment.</p>
        )}
      </div>
    </div>
  );
}

export default BreakingNews;
