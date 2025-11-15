import './ListingDetails.css';
import React from 'react';
import ImageSlideshow from '../components/ImageSlideshow';
import GuestPrompt from '../components/GuestPrompt';
import Footer from '../Footer';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Container, Loader, Modal, Checkbox, Button, Menu, ActionIcon, Progress } from '@mantine/core';
import { api } from '../services/api';
import { notifications } from '@mantine/notifications';
import { IconDots, IconEdit, IconTrash, IconArrowUp, IconArrowDown } from '@tabler/icons-react';

function ListingDetails() {
  const { id } = useParams();
  const { isAuthenticated, requireAuth, user } = useAuth();

  const [listing, setListing] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [comments, setComments] = React.useState([]);
  const [similarListings, setSimilarListings] = React.useState([]);
  const [slideshowOpen, setSlideshowOpen] = React.useState(false);
  const [slideshowIndex, setSlideshowIndex] = React.useState(0);
  const [commentText, setCommentText] = React.useState('');
  const [voteStatus, setVoteStatus] = React.useState(null); // 'upvote', 'downvote', or null
  const [upvotes, setUpvotes] = React.useState(0);
  const [downvotes, setDownvotes] = React.useState(0);
  const [saved, setSaved] = React.useState(false);
  const [guestPromptOpen, setGuestPromptOpen] = React.useState(false);
  const [guestAction, setGuestAction] = React.useState('');
  const [collectionsModalOpen, setCollectionsModalOpen] = React.useState(false);
  const [collections, setCollections] = React.useState([]);
  const [selectedCollections, setSelectedCollections] = React.useState(new Set());
  const [replyingTo, setReplyingTo] = React.useState(null);
  const [replyText, setReplyText] = React.useState('');
  const [replies, setReplies] = React.useState({});
  const textareaRef = React.useRef(null);
<<<<<<< HEAD
  const navigate = useNavigate();
  const [editingCommentId, setEditingCommentId] = React.useState(null);
  const [editCommentText, setEditCommentText] = React.useState('');
=======
  const replyTextareaRef = React.useRef(null);
>>>>>>> a0e5c64b837678430da68eaf1ccb551a38b333c0

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
        
        // Fetch replies for each comment
        const repliesMap = {};
        for (const comment of commentsData) {
          try {
            const commentReplies = await api.getCommentReplies(comment.id);
            repliesMap[comment.id] = commentReplies || [];
          } catch (err) {
            console.error(`Failed to fetch replies for comment ${comment.id}:`, err);
            repliesMap[comment.id] = [];
          }
        }
        setReplies(repliesMap);
        
        // Fetch similar listings (from same world, excluding current)
        const allListings = await api.getListings({ limit: 20 });
        const similar = allListings
          .filter(l => l.id !== parseInt(id))
          .slice(0, 4);
        setSimilarListings(similar);
        
        // Get vote stats and status
        setUpvotes(data.upvotes || 0);
        setDownvotes(data.downvotes || 0);
        
        if (isAuthenticated) {
          try {
            const voteData = await api.getVoteStatus(id);
            setVoteStatus(voteData.voteType); // 'upvote', 'downvote', or null
          } catch (err) {
            console.log('Error fetching vote status:', err);
          }
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
    return 'listing-gallery-grid-quad'; // 4 images in 2x2 grid
  };

  const openSlideshow = idx => {
    setSlideshowIndex(idx);
    setSlideshowOpen(true);
  };

  const handleUpvote = async () => {
    if (!requireAuth(() => {
      setGuestAction('vote on this design');
      setGuestPromptOpen(true);
    })) return;
    
    try {
      if (voteStatus === 'upvote') {
        // Remove upvote
        await api.removeVote(id);
        setVoteStatus(null);
        setUpvotes(prev => prev - 1);
        notifications.show({
          message: 'Vote removed',
          color: 'gray',
        });
      } else {
        // Add or change to upvote
        await api.upvoteListing(id);
        if (voteStatus === 'downvote') {
          setDownvotes(prev => prev - 1);
        }
        setVoteStatus('upvote');
        setUpvotes(prev => prev + (voteStatus === 'downvote' ? 1 : 1));
        notifications.show({
          message: 'Upvoted!',
          color: 'green',
        });
      }
    } catch (error) {
      console.error('Failed to update vote:', error);
      notifications.show({
        title: 'Error',
        message: 'Failed to update vote',
        color: 'red',
      });
    }
  };

  const handleDownvote = async () => {
    if (!requireAuth(() => {
      setGuestAction('vote on this design');
      setGuestPromptOpen(true);
    })) return;
    
    try {
      if (voteStatus === 'downvote') {
        // Remove downvote
        await api.removeVote(id);
        setVoteStatus(null);
        setDownvotes(prev => prev - 1);
        notifications.show({
          message: 'Vote removed',
          color: 'gray',
        });
      } else {
        // Add or change to downvote
        await api.downvoteListing(id);
        if (voteStatus === 'upvote') {
          setUpvotes(prev => prev - 1);
        }
        setVoteStatus('downvote');
        setDownvotes(prev => prev + (voteStatus === 'upvote' ? 1 : 1));
        notifications.show({
          message: 'Downvoted',
          color: 'orange',
        });
      }
    } catch (error) {
      console.error('Failed to update vote:', error);
      notifications.show({
        title: 'Error',
        message: 'Failed to update vote',
        color: 'red',
      });
    }
  };

  const handleSave = async () => {
    if (!requireAuth(() => {
      setGuestAction('save this listing');
      setGuestPromptOpen(true);
    })) return;
    try {
      // Open modal with user's collections and membership state
      const data = await api.getCollectionsForListing(id);
      setCollections(data);
      const initial = new Set(data.filter(c => c.has_listing).map(c => c.id));
      setSelectedCollections(initial);
      setSaved(initial.size > 0);
      setCollectionsModalOpen(true);
    } catch (e) {
      console.error('Failed to load collections:', e);
      notifications.show({ title: 'Error', message: 'Failed to load collections', color: 'red' });
    }
  };

  const handleShare = () => {
    // Share doesn't require auth
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied to clipboard!');
  };

  const handleDeleteListing = async () => {
    if (!window.confirm('Are you sure you want to delete this listing? This action cannot be undone.')) {
      return;
    }

    try {
      await api.deleteListing(id);
      notifications.show({
        title: 'Success',
        message: 'Listing deleted successfully',
        color: 'green',
      });
      navigate('/profile');
    } catch (error) {
      console.error('Failed to delete listing:', error);
      notifications.show({
        title: 'Error',
        message: 'Failed to delete listing',
        color: 'red',
      });
    }
  };

  const handleEditListing = () => {
    navigate(`/listing/${id}/edit`);
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    try {
      await api.deleteComment(commentId);
      notifications.show({
        message: 'Comment deleted successfully',
        color: 'green',
      });
      // Refresh comments
      const updatedComments = await api.getComments(id);
      setComments(updatedComments);
    } catch (error) {
      console.error('Failed to delete comment:', error);
      notifications.show({
        title: 'Error',
        message: 'Failed to delete comment',
        color: 'red',
      });
    }
  };

  const handleEditComment = (comment) => {
    setEditingCommentId(comment.id);
    setEditCommentText(comment.content);
  };

  const handleSaveEditComment = async (commentId) => {
    if (!editCommentText.trim()) {
      notifications.show({
        message: 'Comment cannot be empty',
        color: 'red',
      });
      return;
    }

    try {
      await api.updateComment(commentId, editCommentText);
      notifications.show({
        message: 'Comment updated successfully',
        color: 'green',
      });
      setEditingCommentId(null);
      setEditCommentText('');
      // Refresh comments
      const updatedComments = await api.getComments(id);
      setComments(updatedComments);
    } catch (error) {
      console.error('Failed to update comment:', error);
      notifications.show({
        title: 'Error',
        message: 'Failed to update comment',
        color: 'red',
      });
    }
  };

  const handleCancelEditComment = () => {
    setEditingCommentId(null);
    setEditCommentText('');
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
        console.error('Failed to post comment:', error);
        notifications.show({
          title: 'Error',
          message: 'Failed to post comment',
          color: 'red',
        });
      }
    }
  };

  const handleReplySubmit = async (commentId) => {
    if (!requireAuth(() => {
      setGuestAction('reply to this comment');
      setGuestPromptOpen(true);
    })) return;
    
    if (replyText.trim()) {
      try {
        const newReply = await api.createReply(commentId, replyText);
        setReplies(prev => ({
          ...prev,
          [commentId]: [...(prev[commentId] || []), newReply]
        }));
        setReplyText('');
        setReplyingTo(null);
        notifications.show({
          message: 'Reply posted successfully',
          color: 'green',
        });
      } catch (error) {
        notifications.show({
          title: 'Error',
          message: 'Failed to post reply',
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
                {(() => {
                  const galleryCount = images.length - 1;
                  
                  if (galleryCount === 1) {
                    // Single image
                    return (
                      <img
                        src={images[1]}
                        alt="Gallery 1"
                        className="listing-gallery-thumb"
                        tabIndex={0}
                        onClick={() => openSlideshow(1)}
                      />
                    );
                  } else if (galleryCount === 2) {
                    // Two images in 1 column 2 rows
                    return images.slice(1, 3).map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt={`Gallery ${idx + 1}`}
                        className="listing-gallery-thumb"
                        tabIndex={0}
                        onClick={() => openSlideshow(idx + 1)}
                      />
                    ));
                  } else if (galleryCount === 3) {
                    // Two images with +1 overlay on second
                    return (
                      <>
                        <img
                          src={images[1]}
                          alt="Gallery 1"
                          className="listing-gallery-thumb"
                          tabIndex={0}
                          onClick={() => openSlideshow(1)}
                        />
                        <div 
                          className="listing-gallery-thumb gallery-more"
                          tabIndex={0}
                          onClick={() => openSlideshow(2)}
                        >
                          <img
                            src={images[2]}
                            alt="Gallery 2"
                            className="gallery-more-bg"
                          />
                          <div className="gallery-more-overlay">
                            +1
                          </div>
                        </div>
                      </>
                    );
                  } else {
                    // 4 images in 2x2 grid
                    return images.slice(1, 5).map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt={`Gallery ${idx + 1}`}
                        className="listing-gallery-thumb"
                        tabIndex={0}
                        onClick={() => openSlideshow(idx + 1)}
                      />
                    ));
                  }
                })()}
              </div>
            )}
          </div>
        </Container>
        
        <div className="listing-header">
          <h1 className="listing-title">{listing.title}</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {isAuthenticated && user?.id === listing.owner_id && (
              <Menu shadow="md" width={200}>
                <Menu.Target>
                  <ActionIcon variant="subtle" color="gray" size="lg">
                    <IconDots size={20} />
                  </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item 
                    leftSection={<IconEdit size={16} />}
                    onClick={handleEditListing}
                  >
                    Edit Listing
                  </Menu.Item>
                  <Menu.Item 
                    leftSection={<IconTrash size={16} />}
                    color="red"
                    onClick={handleDeleteListing}
                  >
                    Delete Listing
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            )}
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

          <div className="listing-vote-section">
            <div className="vote-info-box">
              <div className="vote-percentage-large">
                {upvotes + downvotes > 0 ? Math.round((upvotes / (upvotes + downvotes)) * 100) : 0}%
              </div>
              <Progress 
                value={upvotes + downvotes > 0 ? (upvotes / (upvotes + downvotes)) * 100 : 0} 
                size="md" 
                color={upvotes + downvotes > 0 && (upvotes / (upvotes + downvotes)) * 100 >= 70 ? 'green' : upvotes + downvotes > 0 && (upvotes / (upvotes + downvotes)) * 100 >= 40 ? 'yellow' : 'red'}
                style={{ width: '100%', marginTop: '0.5rem' }}
              />
              <div className="vote-counts">
                {upvotes} upvotes · {downvotes} downvotes
              </div>
            </div>
          </div>

          <div className="listing-actions-row">
            <Link to={`/profile/${listing.owner.username}`} className="listing-user-info">
              <img src={listing.owner.avatar_url} alt={listing.owner.username} className="listing-user-avatar" />
              <span className="listing-user-name">{listing.owner.username}</span>
            </Link>
            <div className="listing-actions">
              <button 
                className="action-btn-with-count" 
                onClick={handleUpvote} 
                style={{ color: voteStatus === 'upvote' ? '#51cf66' : 'inherit' }}
              >
                <IconArrowUp size={28} stroke={1.5} />
                <span className="action-count">{upvotes}</span>
              </button>
              <button 
                className="action-btn-with-count" 
                onClick={handleDownvote} 
                style={{ color: voteStatus === 'downvote' ? '#ff6b6b' : 'inherit' }}
              >
                <IconArrowDown size={28} stroke={1.5} />
                <span className="action-count">{downvotes}</span>
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
              {saved && (
                <span style={{ marginLeft: '8px', fontSize: '0.9rem', color: '#1971c2' }}>Saved</span>
              )}
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
                    {comment.user?.avatar_url ? (
                      <img 
                        src={comment.user.avatar_url} 
                        alt={comment.user.username} 
                        className="comment-avatar" 
                      />
                    ) : (
                      <div className="comment-avatar-placeholder">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                          <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                      </div>
                    )}
                    <div className="comment-content">
                      <div className="comment-header">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span className="comment-author">{comment.user?.username || 'Anonymous'}</span>
                          <span className="comment-meta">
                            {new Date(comment.created_at).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric',
                              year: new Date(comment.created_at).getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
                            })}
                          </span>
                        </div>
                        {isAuthenticated && user?.id === comment.user_id && (
                          <Menu shadow="md" width={180}>
                            <Menu.Target>
                              <ActionIcon variant="subtle" color="gray" size="sm">
                                <IconDots size={16} />
                              </ActionIcon>
                            </Menu.Target>
                            <Menu.Dropdown>
                              <Menu.Item 
                                leftSection={<IconEdit size={14} />}
                                onClick={() => handleEditComment(comment)}
                              >
                                Edit Comment
                              </Menu.Item>
                              <Menu.Item 
                                leftSection={<IconTrash size={14} />}
                                color="red"
                                onClick={() => handleDeleteComment(comment.id)}
                              >
                                Delete Comment
                              </Menu.Item>
                            </Menu.Dropdown>
                          </Menu>
                        )}
                      </div>
                      {editingCommentId === comment.id ? (
                        <div style={{ marginTop: '0.5rem' }}>
                          <textarea
                            className="comment-input"
                            value={editCommentText}
                            onChange={(e) => setEditCommentText(e.target.value)}
                            rows={3}
                            style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem' }}
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === 'Escape') {
                                handleCancelEditComment();
                              }
                            }}
                          />
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <Button size="xs" onClick={() => handleSaveEditComment(comment.id)}>
                              Save
                            </Button>
                            <Button size="xs" variant="outline" onClick={handleCancelEditComment}>
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="comment-text">{comment.content}</div>
                      )}
                      <div className="comment-actions">
                        <button 
                          className="comment-action-btn"
                          onClick={async () => {
                            if (!requireAuth(() => {
                              setGuestAction('like this comment');
                              setGuestPromptOpen(true);
                            })) return;
                            
                            try {
                              await api.likeComment(comment.id);
                              // Refresh comments
                              const updatedComments = await api.getComments(id);
                              setComments(updatedComments);
                            } catch (error) {
                              console.error('Failed to like comment:', error);
                            }
                          }}
                        >
                          <svg width="14" height="14" viewBox="2 0 20 16" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 15C12 15 5 10.36 5 6.5C5 4.02 7.02 2 9.5 2C10.88 2 12.13 2.81 13 4.08C13.87 2.81 15.12 2 16.5 2C18.98 2 21 4.02 21 6.5C21 10.36 14 15 14 15H12Z" />
                          </svg>
                          {comment.likes_count || 0}
                        </button>
                        <button 
                          className="comment-action-btn"
                          onClick={() => {
                            if (!requireAuth(() => {
                              setGuestAction('reply to this comment');
                              setGuestPromptOpen(true);
                            })) return;
                            setReplyingTo(replyingTo === comment.id ? null : comment.id);
                            setReplyText('');
                          }}
                        >
                          Reply
                        </button>
                      </div>
                      
                      {/* Reply input */}
                      {replyingTo === comment.id && (
                        <div className="comment-input-wrapper" style={{ marginTop: '0.75rem' }}>
                          <div className="comment-input-box">
                            <textarea 
                              ref={replyTextareaRef}
                              className="comment-input" 
                              placeholder={`Reply to ${comment.user?.username || 'comment'}...`}
                              rows="1"
                              value={replyText}
                              onChange={(e) => {
                                setReplyText(e.target.value);
                                e.target.style.height = 'auto';
                                e.target.style.height = e.target.scrollHeight + 'px';
                              }}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                  e.preventDefault();
                                  handleReplySubmit(comment.id);
                                }
                              }}
                              autoFocus
                            ></textarea>
                            <button 
                              className="comment-send-btn"
                              onClick={() => handleReplySubmit(comment.id)}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="22" y1="2" x2="11" y2="13"></line>
                                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                              </svg>
                            </button>
                          </div>
                        </div>
                      )}
                      
                      {/* Display replies */}
                      {replies[comment.id] && replies[comment.id].length > 0 && (
                        <div style={{ marginTop: '1rem', marginLeft: '2.5rem', borderLeft: '2px solid #e0e0e0', paddingLeft: '1rem' }}>
                          {replies[comment.id].map((reply) => (
                            <div key={reply.id} className="comment" style={{ marginBottom: '0.75rem' }}>
                              {reply.user?.avatar_url ? (
                                <img 
                                  src={reply.user.avatar_url} 
                                  alt={reply.user.username} 
                                  className="comment-avatar" 
                                  style={{ width: '32px', height: '32px' }}
                                />
                              ) : (
                                <div className="comment-avatar-placeholder" style={{ width: '32px', height: '32px', minWidth: '32px' }}>
                                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="12" cy="7" r="4"></circle>
                                  </svg>
                                </div>
                              )}
                              <div className="comment-content">
                                <div className="comment-header">
                                  <span className="comment-author">{reply.user?.username || 'Anonymous'}</span>
                                  <span className="comment-meta">
                                    {new Date(reply.created_at).toLocaleDateString('en-US', { 
                                      month: 'short', 
                                      day: 'numeric',
                                      year: new Date(reply.created_at).getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
                                    })}
                                  </span>
                                </div>
                                <div className="comment-text">{reply.content}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
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
        <Modal opened={collectionsModalOpen} onClose={() => setCollectionsModalOpen(false)} title="Save to collections">
          {collections.length === 0 ? (
            <p style={{ color: '#666' }}>You have no collections yet.</p>
          ) : (
            <div style={{ display: 'grid', gap: '0.6rem' }}>
              {collections.map((c) => (
                <div key={c.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Checkbox
                    label={c.name}
                    checked={selectedCollections.has(c.id)}
                    onChange={(e) => {
                      const checked = e.currentTarget.checked;
                      setSelectedCollections(prev => {
                        const next = new Set(prev);
                        if (checked) next.add(c.id); else next.delete(c.id);
                        return next;
                      });
                    }}
                  />
                </div>
              ))}
              <Button
                style={{ marginTop: '0.8rem', backgroundColor: 'rgba(31, 96, 3, 0.8)' }}
                onClick={async () => {
                  // Apply diff
                  const current = new Set(collections.filter(c => c.has_listing).map(c => c.id));
                  const desired = selectedCollections;
                  const toAdd = [...desired].filter(id2 => !current.has(id2));
                  const toRemove = [...current].filter(id2 => !desired.has(id2));
                  try {
                    // Execute sequentially to keep it simple
                    for (const cid of toAdd) {
                      await api.addListingToCollection(cid, id);
                    }
                    for (const cid of toRemove) {
                      await api.removeListingFromCollection(cid, id);
                    }
                    // Update local states
                    setCollections(prev => prev.map(c => ({ ...c, has_listing: desired.has(c.id) })));
                    setSaved(desired.size > 0);
                    notifications.show({ message: 'Collections updated', color: 'green' });
                    setCollectionsModalOpen(false);
                  } catch (err) {
                    console.error('Failed to update collections:', err);
                    notifications.show({ title: 'Error', message: 'Failed to update collections', color: 'red' });
                  }
                }}
              >
                Confirm
              </Button>
            </div>
          )}
        </Modal>
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
