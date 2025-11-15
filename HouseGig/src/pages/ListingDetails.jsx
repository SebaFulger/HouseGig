import './ListingDetails.css';
import React from 'react';
import ImageSlideshow from '../components/ImageSlideshow';
import GuestPrompt from '../components/GuestPrompt';
import Footer from '../Footer';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Container, Loader } from '@mantine/core';
import { api } from '../services/api';
import { notifications } from '@mantine/notifications';

function ListingDetails() {
  const { id } = useParams();
  const { isAuthenticated, requireAuth } = useAuth();

  const [listing, setListing] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [comments, setComments] = React.useState([]);
  const [similarListings, setSimilarListings] = React.useState([]);
  const [slideshowOpen, setSlideshowOpen] = React.useState(false);
  const [slideshowIndex, setSlideshowIndex] = React.useState(0);
  const [commentText, setCommentText] = React.useState('');
  const [liked, setLiked] = React.useState(false);
  const [saved, setSaved] = React.useState(false);
  const [guestPromptOpen, setGuestPromptOpen] = React.useState(false);
  const [guestAction, setGuestAction] = React.useState('');
  const textareaRef = React.useRef(null);

  // Fetch listing data
  React.useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const data = await api.getListing(id);
        setListing(data);
        
        // Fetch comments
        const commentsData = await api.getComments(id);
        setComments(commentsData);
        
        // Fetch similar listings (from same world, excluding current)
        const allListings = await api.getListings({ limit: 20 });
        const similar = allListings
          .filter(l => l.id !== parseInt(id))
          .slice(0, 4);
        setSimilarListings(similar);
        
        // Check if liked
        if (isAuthenticated) {
          const likedStatus = await api.checkIfLiked(id);
          setLiked(likedStatus.isLiked);
        }
      } catch (error) {
        console.error('Error fetching listing:', error);
        notifications.show({
          title: 'Error',
          message: 'Failed to load listing',
          color: 'red',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchListing();
    window.scrollTo(0, 0);
  }, [id, isAuthenticated]);

  if (loading) {
    return (
      <main className="explore-main" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <Loader size="lg" />
      </main>
    );
  }

  if (!listing) {
    return (
      <main className="explore-main">
        <h2 className="explore-title">Listing Not Found</h2>
        <p>Sorry, this listing does not exist.</p>
      </main>
    );
  }

  // Collect all available images
  const images = [listing.main_image_url];
  if (listing.gallery_image_urls && listing.gallery_image_urls.length > 0) {
    images.push(...listing.gallery_image_urls);
  }
  
  // Get grid class based on number of images
  const getGalleryGridClass = () => {
    const galleryCount = images.length - 1; // Minus 1 for main image
    if (galleryCount === 0) return 'listing-gallery-grid-empty';
    if (galleryCount === 1) return 'listing-gallery-grid-single';
    if (galleryCount === 2) return 'listing-gallery-grid-double';
    if (galleryCount === 3) return 'listing-gallery-grid-triple';
    return 'listing-gallery-grid'; // 4+ images
  };

  const openSlideshow = idx => {
    setSlideshowIndex(idx);
    setSlideshowOpen(true);
  };

  const handleLike = async () => {
    if (!requireAuth(() => {
      setGuestAction('like this listing');
      setGuestPromptOpen(true);
    })) return;
    
    try {
      if (liked) {
        await api.unlikeListing(id);
        setLiked(false);
        notifications.show({
          message: 'Removed from likes',
          color: 'gray',
        });
      } else {
        await api.likeListing(id);
        setLiked(true);
        notifications.show({
          message: 'Added to likes',
          color: 'green',
        });
      }
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to update like status',
        color: 'red',
      });
    }
  };

  const handleSave = async () => {
    if (!requireAuth(() => {
      setGuestAction('save this listing');
      setGuestPromptOpen(true);
    })) return;
    
    setSaved(!saved);
    notifications.show({
      message: saved ? 'Removed from collection' : 'Saved to collection',
      color: saved ? 'gray' : 'green',
    });
  };

  const handleShare = () => {
    // Share doesn't require auth
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied to clipboard!');
  };

  const handleCommentSubmit = async () => {
    if (!requireAuth(() => {
      setGuestAction('post a comment');
      setGuestPromptOpen(true);
    })) return;
    
    if (commentText.trim()) {
      try {
        const newComment = await api.createComment(id, commentText);
        setComments([...comments, newComment]);
        setCommentText('');
        if (textareaRef.current) {
          textareaRef.current.style.height = 'auto';
        }
        notifications.show({
          message: 'Comment posted successfully',
          color: 'green',
        });
      } catch (error) {
        notifications.show({
          title: 'Error',
          message: 'Failed to post comment',
          color: 'red',
        });
      }
    }
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
            {images.length > 1 && (
              <div className={getGalleryGridClass()}>
                {images.slice(1, 5).map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`Gallery ${idx + 1}`}
                    className="listing-gallery-thumb"
                    tabIndex={0}
                    onClick={() => openSlideshow(idx + 1)}
                  />
                ))}
                {images.length > 5 && (
                  <div 
                    className="listing-gallery-thumb gallery-more"
                    tabIndex={0}
                    onClick={() => openSlideshow(5)}
                  >
                    <img
                      src={images[5]}
                      alt="Gallery 5"
                      className="gallery-more-bg"
                    />
                    <div className="gallery-more-overlay">
                      +{images.length - 5}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </Container>
        
        <div className="listing-header">
          <h1 className="listing-title">{listing.title}</h1>
          <div className="listing-views">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
            <span>{listing.views || 0} views</span>
          </div>
        </div>

        <div className="listing-details-box">
          <div className="listing-info-columns">
            <div className="listing-info-column">
              <div className="listing-info-item"><b>World:</b> {listing.world}</div>
              <div className="listing-info-item"><b>Price:</b> {listing.price}</div>
            </div>
            <div className="listing-info-column">
              <div className="listing-info-item"><b>Owner:</b> {listing.owner.username}</div>
            </div>
          </div>
          
          <div className="listing-description">
            <h3>Description</h3>
            <p>{listing.description || 'No description available.'}</p>
          </div>

          <div className="listing-actions-row">
            <Link to={`/profile/${listing.owner.id}`} className="listing-user-info">
              <img src={listing.owner.avatar_url} alt={listing.owner.username} className="listing-user-avatar" />
              <span className="listing-user-name">{listing.owner.username}</span>
            </Link>
            <div className="listing-actions">
              <button className="action-btn-with-count" onClick={handleLike} style={{ color: liked ? '#e25555' : 'inherit' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill={liked ? '#e25555' : 'none'} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
                <span className="action-count">{listing.likes + (liked ? 1 : 0)}</span>
              </button>
              <button className="action-btn-with-count" onClick={() => {
                const commentsSection = document.querySelector('.comments-section');
                commentsSection?.scrollIntoView({ behavior: 'smooth' });
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                <span className="action-count">{comments.length}</span>
              </button>
              <button className="action-btn-with-count" onClick={handleSave} style={{ color: saved ? '#1971c2' : 'inherit' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill={saved ? '#1971c2' : 'none'} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                </svg>
              </button>
              <button className="action-btn-with-count" onClick={handleShare}>
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="18" cy="5" r="3"></circle>
                  <circle cx="6" cy="12" r="3"></circle>
                  <circle cx="18" cy="19" r="3"></circle>
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="content-with-sidebar">
          <div className="comments-section">
            <h2>Comments</h2>
            <div className="comment-input-wrapper">
              <div className="comment-input-box">
                <textarea 
                  ref={textareaRef}
                  className="comment-input" 
                  placeholder="Write a comment..." 
                  rows="1"
                  value={commentText}
                  onChange={(e) => {
                    setCommentText(e.target.value);
                    // Auto-resize textarea
                    e.target.style.height = 'auto';
                    e.target.style.height = e.target.scrollHeight + 'px';
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleCommentSubmit();
                    }
                  }}
                ></textarea>
                <button 
                  className="comment-send-btn"
                  onClick={handleCommentSubmit}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                  </svg>
                </button>
              </div>
            </div>
            <div className="comments-list">
              {comments.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#666', padding: '2rem' }}>
                  No comments yet. Be the first to comment!
                </p>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="comment">
                    <img 
                      src={comment.user?.avatar_url || 'https://randomuser.me/api/portraits/men/1.jpg'} 
                      alt={comment.user?.username || 'User'} 
                      className="comment-avatar" 
                    />
                    <div className="comment-content">
                      <div className="comment-header">
                        <span className="comment-author">{comment.user?.username || 'Anonymous'}</span>
                        <span className="comment-meta">
                          {new Date(comment.created_at).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric',
                            year: new Date(comment.created_at).getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
                          })}
                        </span>
                      </div>
                      <div className="comment-text">{comment.content}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {similarListings.length > 0 && (
            <div className="similar-listings">
              <h2 className="similar-listings-header">More Listings</h2>
              <div className="similar-listings-grid">
                {similarListings.map(similarListing => (
                  <Link key={similarListing.id} to={`/listing/${similarListing.id}`} className="similar-listing-card">
                    <img src={similarListing.main_image_url} alt={similarListing.title} className="similar-listing-image" />
                    <div className="similar-listing-info">
                      <div className="similar-listing-title">{similarListing.title}</div>
                      <div className="similar-listing-meta">
                        <span className="similar-listing-price">{similarListing.price}</span>
                        <span className="similar-listing-owner">{similarListing.owner?.username || 'Unknown'}</span>
                      </div>
                      <div className="similar-listing-stats">
                        <span style={{display: 'flex', alignItems: 'center', gap: '0.3rem'}}>
                          <svg width="16" height="16" viewBox="2 0 20 16" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 15C12 15 5 10.36 5 6.5C5 4.02 7.02 2 9.5 2C10.88 2 12.13 2.81 13 4.08C13.87 2.81 15.12 2 16.5 2C18.98 2 21 4.02 21 6.5C21 10.36 14 15 14 15H12Z" />
                          </svg>
                          {similarListing.likes || 0}
                        </span>
                        <span style={{display: 'flex', alignItems: 'center', gap: '0.3rem'}}>
                          <svg width="18" height="16" viewBox="0 0 24 18" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="9" r="3.5"/><path d="M22 9c0 4-4.5 8-10 8S2 13 2 9 6.5 1 12 1s10 4 10 8z"/>
                          </svg>
                          {similarListing.views || 0}
                        </span>
                        <span style={{display: 'flex', alignItems: 'center', gap: '0.3rem'}}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                          </svg>
                          {similarListing.comment_count || 0}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        <Footer />
        {slideshowOpen && (
          <ImageSlideshow
            images={images}
            initialIndex={slideshowIndex}
            onClose={() => setSlideshowOpen(false)}
          />
        )}
        <GuestPrompt 
          opened={guestPromptOpen} 
          onClose={() => setGuestPromptOpen(false)} 
          action={guestAction}
        />
      </main>
    </>
  );
}

export default ListingDetails;
