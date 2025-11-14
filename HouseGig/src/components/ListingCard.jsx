import './ListingCard.css';
import { useState } from 'react';

function ListingCard({ listing }) {
  const [liked, setLiked] = useState(listing.liked);
  const [likes, setLikes] = useState(listing.likes);

  const handleLike = () => {
    if (liked) {
      setLiked(false);
      setLikes(likes - 1);
    } else {
      setLiked(true);
      setLikes(likes + 1);
    }
  };

  return (
    <div className="listing-card">
      <img src={listing.main_image_url} alt={listing.title} className="listing-image" />
      <div className="listing-info">
        <h3 className="listing-title">{listing.title}</h3>
        <div className="listing-meta">
          <span>{listing.world}</span>
          <span className="listing-price">{listing.price}</span>
        </div>
        <div className="listing-footer">
          <div className="listing-owner">
            <img src={listing.owner.avatar_url} alt={listing.owner.username} className="owner-avatar" />
            <span className="owner-username">{listing.owner.username}</span>
          </div>
          <button className={`like-btn${liked ? ' liked' : ''}`} onClick={handleLike} aria-label="Like">
            <span className="like-count">{likes}</span>
            <svg width="22" height="22" viewBox="0 0 24 24" fill={liked ? '#f59f00' : 'none'} stroke={liked ? '#f59f00' : '#222'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginLeft: '0.5rem'}}><polygon points="12 2 15.09 10.26 24 10.26 17.55 16.5 19.64 24.76 12 19.5 4.36 24.76 6.45 16.5 0 10.26 8.91 10.26 12 2"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ListingCard;
