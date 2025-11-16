
import './Explore.css';
import CategoryCarousel from '../components/CategoryCarousel';
import Footer from '../Footer';
import { useCallback, useEffect, useState } from 'react';
import { api } from '../services/api';
import { Loader } from '@mantine/core';

function Explore() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchListingsAsync = useCallback(async () => {
    try {
      const fetchedListings = await api.getListings();
      setListings(fetchedListings);
    } catch (error) {
      console.error('Failed to fetch listings:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { 
    fetchListingsAsync();
  }, [fetchListingsAsync]);
  
  // Categorize listings - for now we'll use placeholder categories
  // Later this will be based on tags from the backend
  const categorizeListings = () => {
    if (listings.length === 0) return [];
    
    const categories = [
      { title: 'Featured Listings', filter: () => true, isMain: true },
      { title: 'Recently Added', filter: () => true },
      { title: 'Classical', filter: (l) => l.property_type?.toLowerCase().includes('classical') || l.region?.toLowerCase().includes('classical') || l.title?.toLowerCase().includes('classical') || l.description?.toLowerCase().includes('classical') },
      { title: 'Brutalist', filter: (l) => l.property_type?.toLowerCase().includes('brutalist') || l.region?.toLowerCase().includes('brutalist') || l.title?.toLowerCase().includes('brutalist') || l.description?.toLowerCase().includes('brutalist') },
      { title: 'France', filter: (l) => l.region?.toLowerCase().includes('france') || l.region?.toLowerCase().includes('french') || l.title?.toLowerCase().includes('france') || l.description?.toLowerCase().includes('france') },
      { title: 'United States', filter: (l) => l.region?.toLowerCase().includes('united states') || l.region?.toLowerCase().includes('usa') || l.region?.toLowerCase().includes('america') || l.title?.toLowerCase().includes('america') || l.description?.toLowerCase().includes('america') },
      { title: 'Art Nouveau', filter: (l) => l.property_type?.toLowerCase().includes('art nouveau') || l.region?.toLowerCase().includes('art nouveau') || l.title?.toLowerCase().includes('art nouveau') || l.description?.toLowerCase().includes('art nouveau') },
      { title: 'Romania', filter: (l) => l.region?.toLowerCase().includes('romania') || l.region?.toLowerCase().includes('romanian') || l.title?.toLowerCase().includes('romania') || l.description?.toLowerCase().includes('romania') },
      { title: 'Gardens', filter: (l) => l.property_type?.toLowerCase().includes('garden') || l.title?.toLowerCase().includes('garden') || l.description?.toLowerCase().includes('garden') },
      { title: 'From Popular Culture', filter: (l) => l.description?.toLowerCase().includes('movie') || l.description?.toLowerCase().includes('film') || l.description?.toLowerCase().includes('tv') || l.description?.toLowerCase().includes('game') || l.description?.toLowerCase().includes('book') || l.title?.toLowerCase().includes('movie') || l.title?.toLowerCase().includes('film') },
    ];

    return categories.map(cat => ({
      title: cat.title,
      listings: listings.filter(cat.filter).slice(0, 20), // Show up to 20 items per category
      isMain: cat.isMain
    })).filter(cat => cat.listings.length > 0); // Only show categories with listings
  };

  const categories = categorizeListings();

  if (loading) {
    return (
      <main className="explore-main">
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
          <Loader size="xl" type="dots" color="rgba(31, 96, 3, 0.8)" />
        </div>
      </main>
    );
  }

  return (
    <main className="explore-main">
      {categories.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#666', padding: '2rem' }}>
          No listings available yet. Be the first to create one!
        </p>
      ) : (
        <div className="categories-container">
          {categories.map((category, index) => (
            <CategoryCarousel 
              key={index}
              title={category.title}
              listings={category.listings}
              isMain={category.isMain}
            />
          ))}
        </div>
      )}
      <Footer />
    </main>
  );
}

export default Explore;
