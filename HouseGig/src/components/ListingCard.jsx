import './ListingCard.css';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Progress } from '@mantine/core';

function ListingCard({ listing }) {
  const imgRef = useRef(null);
  const [avgColor, setAvgColor] = useState('rgba(0, 0, 0, 0)');

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    const getAverageColor = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      ctx.drawImage(img, 0, 0);

      try {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        let r = 0, g = 0, b = 0, count = 0;

        for (let i = 0; i < data.length; i += 4) {
          r += data[i];
          g += data[i + 1];
          b += data[i + 2];
          count++;
        }

        r = Math.floor(r / count);
        g = Math.floor(g / count);
        b = Math.floor(b / count);

        setAvgColor(`rgba(${r}, ${g}, ${b}, 0.15)`);
      } catch {
        // CORS error or other issues
        setAvgColor('rgba(0, 0, 0, 0)');
      }
    };

    if (img.complete) {
      getAverageColor();
    } else {
      img.addEventListener('load', getAverageColor);
      return () => img.removeEventListener('load', getAverageColor);
    }
  }, [listing.main_image_url]);

  // Calculate vote percentage
  const upvotes = listing.upvotes || 0;
  const downvotes = listing.downvotes || 0;
  const totalVotes = upvotes + downvotes;
  const votePercentage = totalVotes > 0 ? Math.round((upvotes / totalVotes) * 100) : 0;

  return (
    <div className="listing-card" style={{
      boxShadow: `0 2px 8px 0 rgba(0,0,0,0.08), 0 8px 16px ${avgColor}`
    }}>
      <img ref={imgRef} src={listing.main_image_url} alt={listing.title} className="listing-image" crossOrigin="anonymous" />
      <div className="listing-info">
        <h3 className="listing-title">{listing.title}</h3>
        <p className="listing-description">
          {listing.description || 'No description available'}
        </p>
        <div className="vote-section">
          <Progress 
            value={votePercentage} 
            size="xs" 
            color={votePercentage >= 70 ? 'green' : votePercentage >= 40 ? 'yellow' : 'red'}
            style={{ width: '30px' }}
          />
          <span className="vote-percentage">{votePercentage}%</span>
        </div>
        <div className="listing-footer">
          <Link 
            to={`/profile/${listing.owner?.username || ''}`} 
            className="listing-owner"
            onClick={(e) => e.stopPropagation()}
            style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            {listing.owner?.avatar_url ? (
              <img src={listing.owner.avatar_url} alt={listing.owner?.username || 'User'} className="owner-avatar" />
            ) : (
              <div className="owner-avatar" style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                backgroundColor: 'var(--card-bg)',
                color: 'var(--muted)',
                border: '2px solid var(--border)'
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
            )}
            <span className="owner-username">{listing.owner?.username || 'Unknown User'}</span>
          </Link>
          <div className="listing-stats" style={{alignItems: 'center', gap: '0.5rem'}}>
            <span className="comment-count" style={{color: 'inherit', display: 'inline-flex', alignItems: 'center', minHeight: 0, gap: '0.2rem'}}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{verticalAlign: 'middle', transform: 'translateY(1px)'}}>
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              {listing.comments || 0}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ListingCard;
