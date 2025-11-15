import './ListingDetails.css';
import React from 'react';
import ImageSlideshow from '../components/ImageSlideshow';
import ScrollFooter from '../components/ScrollFooter';
import { useParams } from 'react-router-dom';
import listings from '../dummyListings';
import { Container } from '@mantine/core';

function ListingDetails() {
  const { id } = useParams();
  const listing = listings.find(l => String(l.id) === String(id));

  if (!listing) {
    return (
      <main className="explore-main">
        <h2 className="explore-title">Listing Not Found</h2>
        <p>Sorry, this listing does not exist.</p>
      </main>
    );
  }

  // For demo: use main_image_url as first, and fill up to 9 with same image (simulate multiple images)
  const images = [listing.main_image_url];
  while (images.length < 9) images.push(listing.main_image_url);

  const [slideshowOpen, setSlideshowOpen] = React.useState(false);
  const [slideshowIndex, setSlideshowIndex] = React.useState(0);

  const openSlideshow = idx => {
    setSlideshowIndex(idx);
    setSlideshowOpen(true);
  };

  return (
    <>
      <main className="listing-details-main">
        <Container size="xl" px="md">
          <div className="listing-images-section">
            <img
              src={images[0]}
              alt={listing.title}
              className="listing-main-image"
              tabIndex={0}
              onClick={() => openSlideshow(0)}
            />
            <div className="listing-gallery-grid">
              {images.slice(1, 10).map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Gallery ${idx + 1}`}
                  className="listing-gallery-thumb"
                  tabIndex={0}
                  onClick={() => openSlideshow(idx + 1)}
                />
              ))}
            </div>
          </div>
        </Container>
        <div className="listing-title">{listing.title}</div>
        <div style={{ fontSize: '1.2rem', marginBottom: 12 }}><b>World:</b> {listing.world}</div>
        <div style={{ fontSize: '1.2rem', marginBottom: 12 }}><b>Price:</b> {listing.price}</div>
        <div style={{ fontSize: '1.2rem', marginBottom: 12 }}><b>Owner:</b> {listing.owner.username}</div>
        <div style={{ fontSize: '1.2rem', marginBottom: 12 }}><b>Description:</b> {listing.description || 'No description.'}</div>
        {slideshowOpen && (
          <ImageSlideshow
            images={images}
            initialIndex={slideshowIndex}
            onClose={() => setSlideshowOpen(false)}
          />
        )}
      </main>
      <ScrollFooter />
    </>
  );
}

export default ListingDetails;
