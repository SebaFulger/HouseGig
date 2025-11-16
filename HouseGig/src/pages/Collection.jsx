import './Explore.css';
import Footer from '../Footer';
import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Loader, Title, Text, Button, Switch, Group, Badge } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useAuth } from '../contexts/AuthContext';

function Collection() {
  const { id } = useParams();
  const { user } = useAuth();
  const [collection, setCollection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingPublic, setUpdatingPublic] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await api.getCollection(id);
        setCollection(data);
      } catch (e) {
        console.error('Failed to load collection', e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <main className="explore-main" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <Loader size="lg" type="dots" color="rgba(31, 96, 3, 0.8)" />
      </main>
    );
  }

  if (!collection) {
    return (
      <main className="explore-main">
        <Title order={3}>Collection not found</Title>
      </main>
    );
  }

  return (
    <main className="explore-main">
      <div style={{ marginTop: '4.2rem', marginBottom: '2rem' }}>
        <Group justify="space-between" align="center">
          <div>
            <Title order={2} mb="xs">{collection.name}</Title>
            <Text c="dimmed">{collection.description || 'No description'}</Text>
            {collection.owner && (
              <div style={{ marginTop: '0.5rem', fontSize: '0.95rem' }}>
                by <Link to={`/profile/${collection.owner.username}`}>{collection.owner.username}</Link>
              </div>
            )}
          </div>
          <div>
            {collection.is_public && <Badge color="green" variant="light">Public</Badge>}
          </div>
        </Group>
        {user?.id === collection.owner?.id && (
          <div style={{ marginTop: '1rem' }}>
            <Switch
              checked={!!collection.is_public}
              onChange={async (e) => {
                const next = e.currentTarget.checked;
                try {
                  setUpdatingPublic(true);
                  const updated = await api.updateCollection(id, { is_public: next });
                  setCollection(prev => ({ ...prev, is_public: updated.is_public }));
                  notifications.show({
                    title: 'Visibility updated',
                    message: updated.is_public ? 'Collection is now public' : 'Collection set to private',
                    color: 'green'
                  });
                } catch (err) {
                  console.error('Failed to update visibility', err);
                  notifications.show({
                    title: 'Update failed',
                    message: err?.message || 'Could not update collection visibility',
                    color: 'red'
                  });
                } finally {
                  setUpdatingPublic(false);
                }
              }}
              disabled={updatingPublic}
              label="Make this collection public"
            />
          </div>
        )}
      </div>

      {(!collection.listings || collection.listings.length === 0) ? (
        <Text c="dimmed" mt="lg">No listings in this collection yet.</Text>
      ) : (
        <div className="listing-grid-responsive">
          {collection.listings.map((listing) => (
            <div key={listing.id} className="listing-card" style={{ position: 'relative' }}>
              <a href={`/listing/${listing.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <img src={listing.main_image_url} alt={listing.title} className="listing-image" />
                <div className="listing-info">
                  <div className="listing-title">{listing.title}</div>
                  <div className="listing-meta">
                    <span className="listing-price">{listing.price}</span>
                    {listing.owner && (
                      <span className="listing-owner">{listing.owner.username}</span>
                    )}
                  </div>
                </div>
              </a>
              <div style={{ marginTop: '0.5rem' }}>
                <Button size="xs" variant="light" color="red" onClick={async (e) => {
                  e.preventDefault();
                  try {
                    await api.removeListingFromCollection(id, listing.id);
                    setCollection(prev => ({
                      ...prev,
                      listings: prev.listings.filter(l => l.id !== listing.id),
                      listing_count: Math.max(0, (prev.listing_count || prev.listings.length) - 1)
                    }));
                  } catch (err) {
                    console.error('Failed to remove listing', err);
                  }
                }}>Remove</Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Footer />
    </main>
  );
}

export default Collection;
