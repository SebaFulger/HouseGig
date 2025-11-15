import { Modal, Button, Text, Title } from '@mantine/core';
import { Link } from 'react-router-dom';

function GuestPrompt({ opened, onClose, action = 'perform this action' }) {
  return (
    <Modal opened={opened} onClose={onClose} title="Login Required" centered>
      <div style={{ padding: '1rem 0' }}>
        <Title order={4} mb="md">Sign in to continue</Title>
        <Text size="sm" c="dimmed" mb="xl">
          You need to be logged in to {action}.
        </Text>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Button component={Link} to="/auth" fullWidth onClick={onClose}>
            Login / Sign Up
          </Button>
          <Button variant="subtle" fullWidth onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default GuestPrompt;
