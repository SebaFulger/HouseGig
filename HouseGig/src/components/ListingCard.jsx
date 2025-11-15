import './ListingCard.css';
import { useEffect, useRef, useState } from 'react';

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
      } catch (e) {
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

  return (
    <div className="listing-card" style={{
      boxShadow: `0 2px 8px 0 rgba(0,0,0,0.08), 0 8px 16px ${avgColor}`
    }}>
      <img ref={imgRef} src={listing.main_image_url} alt={listing.title} className="listing-image" crossOrigin="anonymous" />
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
          <div className="listing-stats" style={{alignItems: 'center', gap: '0.5rem'}}>
            <span className="view-count" style={{color: 'inherit', display: 'inline-flex', alignItems: 'center', minHeight: 0, gap: '0.2rem'}}>
              <svg width="18" height="16" viewBox="0 0 24 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{verticalAlign: 'middle', transform: 'translateY(1px)'}}><circle cx="12" cy="9" r="3.5"/><path d="M22 9c0 4-4.5 8-10 8S2 13 2 9 6.5 1 12 1s10 4 10 8z"/></svg>
              {listing.views || 0}
            </span>
            <span className="like-count" style={{color: 'inherit', display: 'inline-flex', alignItems: 'center', minHeight: 0, gap: '0.2rem'}}>
              <svg width="16" height="16" viewBox="2 0 20 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{verticalAlign: 'middle', transform: 'translateY(1px)'}}>
                <path d="M12 15C12 15 5 10.36 5 6.5C5 4.02 7.02 2 9.5 2C10.88 2 12.13 2.81 13 4.08C13.87 2.81 15.12 2 16.5 2C18.98 2 21 4.02 21 6.5C21 10.36 14 15 14 15H12Z" />
              </svg>
              {listing.likes}
            </span>
            <span className="comment-count" style={{color: 'inherit', display: 'inline-flex', alignItems: 'center', minHeight: 0, gap: '0.2rem', marginLeft: '0.3rem'}}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{verticalAlign: 'middle', transform: 'translateY(1px)'}}>
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              {listing.comments || 12}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ListingCard;
