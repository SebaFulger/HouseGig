import './Explore.css';
import Footer from '../Footer';
import { useAuth } from '../contexts/AuthContext';
import { Button, Paper, Text, Title } from '@mantine/core';
import { IconBookmark, IconPlus } from '@tabler/icons-react';

function Collections() {
  const { user } = useAuth();
  
  // TODO: Fetch collections from API
  const collections = [];

  return (
    <main className="explore-main">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4.2rem', marginBottom: '3.5rem' }}>
        <h2 style={{ fontSize: '2.4rem', fontWeight: 700, lineHeight: 1.2, margin: 0 }}>My Collections</h2>
        <Button leftSection={<IconPlus size={18} />} style={{ backgroundColor: 'rgba(31, 96, 3, 0.8)' }}>
          New Collection
        </Button>
      </div>

      {collections.length === 0 ? (
        <Paper shadow="sm" p="xl" radius="md" withBorder style={{ textAlign: 'center', marginTop: '3rem' }}>
          <IconBookmark size={64} style={{ opacity: 0.3, marginBottom: '1rem' }} />
          <Title order={3} mb="md">No Collections Yet</Title>
          <Text c="dimmed" mb="xl">
            Start organizing your favorite listings by creating your first collection!
          </Text>
          <Button style={{ backgroundColor: 'rgba(31, 96, 3, 0.8)' }}>Create Collection</Button>
        </Paper>
      ) : (
        <div className="listing-grid-responsive">
          {/* TODO: Render collections here */}
        </div>
      )}

    </main>
  );
}

export default Collections;
