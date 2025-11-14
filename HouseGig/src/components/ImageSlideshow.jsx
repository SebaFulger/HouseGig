import React from 'react';
import './ImageSlideshow.css';

export default function ImageSlideshow({ images, initialIndex = 0, onClose }) {
  const [current, setCurrent] = React.useState(initialIndex);
  const [zoomed, setZoomed] = React.useState(false);
  const [origin, setOrigin] = React.useState({ x: 50, y: 50 });

  const prev = () => setCurrent((c) => (c === 0 ? images.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === images.length - 1 ? 0 : c + 1));

  const toggleZoom = () => setZoomed((z) => !z);
  const handleMouseMove = (e) => {
    if (!zoomed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    const clamp = (v) => Math.max(0, Math.min(100, v));
    setOrigin({ x: clamp(x), y: clamp(y) });
  };
  const handleMouseLeave = () => {
    if (!zoomed) return;
    setOrigin({ x: 50, y: 50 });
  };

  React.useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [images.length]);

  return (
    <div className="slideshow-backdrop" onClick={onClose}>
      <div className="slideshow-modal" onClick={e => e.stopPropagation()}>
        <button className="slideshow-close" onClick={onClose}>&times;</button>
        <div
          className={`slideshow-image-wrap${zoomed ? ' zoomed' : ''}`}
          onClick={toggleZoom}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <img
            src={images[current]}
            alt="Slideshow"
            className="slideshow-image"
            style={{
              transformOrigin: `${origin.x}% ${origin.y}%`,
              transform: zoomed ? 'scale(2)' : 'scale(1)'
            }}
          />
        </div>
      </div>
      <div className="slideshow-footer" onClick={e => e.stopPropagation()}>
        <button className="slideshow-nav prev" onClick={prev} aria-label="Previous slide">&lt;</button>
        <span className="slideshow-caption">{current + 1} / {images.length}</span>
        <button className="slideshow-nav next" onClick={next} aria-label="Next slide">&gt;</button>
      </div>
    </div>
  );
}
