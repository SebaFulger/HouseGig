
import './ListingCarousel.css';
import { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';


function ListingCarousel({ listings }) {
  const carouselRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  // Show first 8 listings as featured
  const featured = listings.slice(0, 8);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    let scrollAmount = 2; // px per frame (increased speed)
    let req;
    function step() {
      if (!isHovered) {
        carousel.scrollLeft += scrollAmount;
        // Loop back to start if at end
        if (carousel.scrollLeft + carousel.offsetWidth >= carousel.scrollWidth - 2) {
          carousel.scrollLeft = 0;
        }
      }
      req = requestAnimationFrame(step);
    }
    req = requestAnimationFrame(step);
    return () => cancelAnimationFrame(req);
  }, [isHovered]);

  return (
    <div className="carousel-wrapper">
      <div
        className="carousel"
        ref={carouselRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {featured.map(listing => (
          <Link
            to={`/listing/${listing.id}`}
            className="carousel-card"
            key={listing.id}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <img src={listing.main_image_url} alt={listing.title} className="carousel-image" />
            <div className="carousel-info">
              <h4 className="carousel-title">{listing.title}</h4>
              {listing.region && <div className="carousel-world">{listing.region}</div>}
              {listing.property_type && <div className="carousel-price">{listing.property_type}</div>}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default ListingCarousel;
