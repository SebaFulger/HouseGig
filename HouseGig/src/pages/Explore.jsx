
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
    const categories = [
      { title: 'Featured Listings', filter: () => true, isMain: true },
      { title: 'Recently Added', filter: () => true },
      { title: 'Skyblock Properties', filter: (l) => l.world?.toLowerCase().includes('skyblock') || l.world?.toLowerCase().includes('sky') },
      { title: 'Creative Builds', filter: (l) => l.world?.toLowerCase().includes('creative') || l.property_type?.toLowerCase().includes('creative') },
      { title: 'Survival Homes', filter: (l) => l.world?.toLowerCase().includes('survival') },
      { title: 'Castles & Fortresses', filter: (l) => l.property_type?.toLowerCase().includes('castle') || l.property_type?.toLowerCase().includes('fortress') },
      { title: 'Modern Architecture', filter: (l) => l.property_type?.toLowerCase().includes('modern') || l.title?.toLowerCase().includes('modern') },
      { title: 'Farms & Agriculture', filter: (l) => l.property_type?.toLowerCase().includes('farm') || l.title?.toLowerCase().includes('farm') },
      { title: 'Rare Properties', filter: (l) => l.rarity?.toLowerCase().includes('rare') || l.rarity?.toLowerCase().includes('legendary') },
      { title: 'High Magic Level', filter: (l) => l.magic_level >= 7 },
      { title: 'Budget Friendly', filter: (l) => {
        const priceStr = l.price?.toLowerCase() || '';
        return priceStr.includes('100') || priceStr.includes('200') || priceStr.includes('300');
      }},
      { title: 'Premium Listings', filter: (l) => {
        const priceStr = l.price?.toLowerCase() || '';
        return priceStr.includes('1000000') || priceStr.includes('million');
      }},
    ];

    return categories.map(cat => ({
      title: cat.title,
      listings: listings.filter(cat.filter).slice(0, 20) // Show up to 20 items per category
    })).filter(cat => cat.listings.length > 0); // Only show categories with listings
  };

  const categories = categorizeListings();

  if (loading) {
    return (
      <main className="explore-main">
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
          <Loader size="xl" />
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
