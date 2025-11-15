import './CategoryCarousel.css';
import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import ListingCard from './ListingCard';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';

function CategoryCarousel({ title, listings, isMain = false }) {
  const carouselRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollButtons = () => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    
    setCanScrollLeft(carousel.scrollLeft > 0);
    setCanScrollRight(
      carousel.scrollLeft < carousel.scrollWidth - carousel.offsetWidth - 10
    );
  };

  const scroll = (direction) => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const scrollAmount = carousel.offsetWidth * 0.8; // Scroll 80% of visible width
    const targetScroll = carousel.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);

    carousel.scrollTo({
      left: targetScroll,
      behavior: 'smooth'
    });

    // Update button states after scroll animation
    setTimeout(checkScrollButtons, 300);
  };

  if (!listings || listings.length === 0) return null;

  return (
    <div className="category-carousel-container">
      <h3 className={isMain ? "category-title-main" : "category-title"}>{title}</h3>
      <div className="category-carousel-wrapper">
        {canScrollLeft && (
          <button 
            className="carousel-nav-btn carousel-nav-left" 
            onClick={() => scroll('left')}
            aria-label="Scroll left"
          >
            <IconChevronLeft size={32} stroke={2.5} />
          </button>
        )}
        
        <div 
          className="category-carousel-track" 
          ref={carouselRef}
          onScroll={checkScrollButtons}
        >
          {listings.map(listing => (
            <div key={listing.id} className="category-carousel-item">
              <Link 
                to={`/listing/${listing.id}`} 
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <ListingCard listing={listing} />
              </Link>
            </div>
          ))}
        </div>

        {canScrollRight && (
          <button 
            className="carousel-nav-btn carousel-nav-right" 
            onClick={() => scroll('right')}
            aria-label="Scroll right"
          >
            <IconChevronRight size={32} stroke={2.5} />
          </button>
        )}
      </div>
    </div>
  );
}

export default CategoryCarousel;
