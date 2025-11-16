import './Explore.css';
import Footer from '../Footer';
import { useAuth } from '../contexts/AuthContext';
import { useParams, useNavigate } from 'react-router-dom';
import { Paper, Text, Title, Avatar, Button, Tabs, Loader } from '@mantine/core';
import { IconSettings, IconMessage } from '@tabler/icons-react';
import ListingCard from '../components/ListingCard';
import CollectionCover from '../components/CollectionCover';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { useState, useEffect } from 'react';
import { notifications } from '@mantine/notifications';

function Profile() {
  const { user, isAuthenticated } = useAuth();
  const { username } = useParams();
  const navigate = useNavigate();
  const isOwnProfile = !username || (isAuthenticated && user?.username === username);

  const [profileUser, setProfileUser] = useState(user);
  const [userListings, setUserListings] = useState([]);
  const [userCollections, setUserCollections] = useState([]);
  const [upvotedListings, setUpvotedListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        
        // Fetch user profile if viewing another user
        if (!isOwnProfile && username) {
          const userData = await api.getUserProfile(username);
          setProfileUser(userData);
        } else {
          setProfileUser(user);
        }

        // Fetch user's listings
        if (isOwnProfile) {
          const listings = await api.getMyListings();
          setUserListings(listings);
          
          // Fetch collections
          const collections = await api.getCollections();
          setUserCollections(collections);
          
          // Fetch upvoted listings
          const upvoted = await api.getMyUpvotedListings();
          setUpvotedListings(upvoted);
        } else if (username) {
          // Fetch other user's listings
          const listings = await api.getUserListings(username);
          setUserListings(listings);
          
          // Fetch public collections
          const collections = await api.getUserCollections(username);
          setUserCollections(collections);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        notifications.show({
          title: 'Error',
          message: 'Failed to load profile data',
          color: 'red',
        });
      } finally {
        setLoading(false);
      }
    };

    if (user || username) {
      fetchProfileData();
    }
  }, [username, isOwnProfile, user]);

  if (loading) {
    return (
      <main className="explore-main" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <Loader size="lg" />
      </main>
    );
  }

  return (
    <main className="explore-main">
      <Paper shadow="md" p="xl" radius="md" withBorder style={{ marginBottom: '2rem', marginTop: '4.2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1rem' }}>
          <Avatar 
            src={profileUser?.avatar_url} 
            size={100} 
            radius="md"
          />
          <div style={{ flex: 1 }}>
            <Title order={2}>{profileUser?.username || 'User'}</Title>
            <Text c="dimmed" size="sm">{profileUser?.bio || 'No bio available'}</Text>
            <div style={{ display: 'flex', gap: '2rem', marginTop: '0.5rem' }}>
              <Text size="sm"><strong>{userListings.length}</strong> Listings</Text>
              <Text size="sm"><strong>{userCollections.length}</strong> Collections</Text>
            </div>
          </div>
          {isOwnProfile ? (
            <Button leftSection={<IconSettings size={18} />} component={Link} to="/settings" style={{ backgroundColor: 'rgba(31, 96, 3, 0.8)' }}>
              Edit Profile
            </Button>
          ) : (
            <Button 
              leftSection={<IconMessage size={18} />} 
              onClick={async () => {
                try {
                  const conversation = await api.getOrCreateConversation(profileUser.id);
                  navigate(`/messages?userId=${profileUser.id}`);
                } catch (error) {
                  console.error('Failed to start conversation:', error);
                }
              }}
              style={{ backgroundColor: 'rgba(31, 96, 3, 0.8)' }}
            >
              Send Message
            </Button>
          )}
        </div>
      </Paper>

      <Tabs defaultValue="listings" color="rgba(31, 96, 3, 0.8)">
        <Tabs.List>
          <Tabs.Tab value="listings">Listings</Tabs.Tab>
          <Tabs.Tab value="collections">Collections</Tabs.Tab>
          {isOwnProfile && <Tabs.Tab value="upvoted">Upvoted</Tabs.Tab>}
        </Tabs.List>

        <Tabs.Panel value="listings" pt="xl">
          {userListings.length === 0 ? (
            <Paper shadow="sm" p="xl" radius="md" withBorder style={{ textAlign: 'center' }}>
              <Text c="dimmed">No listings yet</Text>
            </Paper>
          ) : (
            <div className="listing-grid-responsive">
              {userListings.map(listing => (
                <Link key={listing.id} to={`/listing/${listing.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <ListingCard listing={listing} />
                </Link>
              ))}
            </div>
          )}
        </Tabs.Panel>

        <Tabs.Panel value="collections" pt="xl">
          {userCollections.length === 0 ? (
            <Paper shadow="sm" p="xl" radius="md" withBorder style={{ textAlign: 'center' }}>
              <Text c="dimmed">No public collections yet</Text>
            </Paper>
          ) : (
            <div className="listing-grid-responsive">
              {userCollections.map(collection => (
                <Link key={collection.id} to={`/collection/${collection.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <CollectionCover collection={collection} />
                </Link>
              ))}
            </div>
          )}
        </Tabs.Panel>

        {isOwnProfile && (
          <Tabs.Panel value="upvoted" pt="xl">
            {upvotedListings.length === 0 ? (
              <Paper shadow="sm" p="xl" radius="md" withBorder style={{ textAlign: 'center' }}>
                <Text c="dimmed">No upvoted designs yet</Text>
              </Paper>
            ) : (
              <div className="listing-grid-responsive">
                {upvotedListings.map(listing => (
                  <Link key={listing.id} to={`/listing/${listing.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <ListingCard listing={listing} />
                  </Link>
                ))}
              </div>
            )}
          </Tabs.Panel>
        )}
      </Tabs>

      <Footer />
    </main>
  );
}

export default Profile;
