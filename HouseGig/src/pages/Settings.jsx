import './Explore.css';
import Footer from '../Footer';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Paper, Title, TextInput, Textarea, Button, PasswordInput, Avatar, FileInput, Group, Divider, Text, Select, Switch } from '@mantine/core';
import { IconUser, IconLock, IconUpload, IconCheck, IconX, IconPalette } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';

function Settings() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    bio: user?.bio || '',
    avatar: null
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [language, setLanguage] = useState('en');
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });

  useEffect(() => {
    // Apply dark mode class to body
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // TODO: Update profile via API
      // await api.updateProfile(profileData);
      console.log('Updating profile:', profileData);
      
      await new Promise(resolve => setTimeout(resolve, 800));
      
      notifications.show({
        title: 'Profile Updated',
        message: 'Your profile has been successfully updated',
        color: 'green',
        icon: <IconCheck size={18} />
      });
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to update profile',
        color: 'red',
        icon: <IconX size={18} />
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      notifications.show({
        title: 'Password Mismatch',
        message: 'New passwords do not match',
        color: 'red',
        icon: <IconX size={18} />
      });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      notifications.show({
        title: 'Password Too Short',
        message: 'Password must be at least 6 characters',
        color: 'red',
        icon: <IconX size={18} />
      });
      return;
    }

    setLoading(true);
    
    try {
      // TODO: Update password via API
      // await api.updatePassword(passwordData.currentPassword, passwordData.newPassword);
      console.log('Updating password');
      
      await new Promise(resolve => setTimeout(resolve, 800));
      
      notifications.show({
        title: 'Password Updated',
        message: 'Your password has been successfully changed',
        color: 'green',
        icon: <IconCheck size={18} />
      });
      
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to update password',
        color: 'red',
        icon: <IconX size={18} />
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="explore-main">
      <h2 style={{ fontSize: '2.4rem', fontWeight: 700, lineHeight: 1.2, marginTop: '4.2rem', marginBottom: '3.5rem' }}>Settings</h2>
      
      {/* Profile Settings */}
      <Paper shadow="md" p="xl" radius="md" withBorder mb="xl">
        <Title order={3} mb="md" leftSection={<IconUser size={24} />}>
          Profile Settings
        </Title>
        
        <form onSubmit={handleProfileUpdate}>
          <Group mb="md">
            <Avatar 
              src={user?.avatar_url} 
              size={80} 
              radius="md"
            />
            <FileInput
              placeholder="Upload new avatar"
              accept="image/*"
              leftSection={<IconUpload size={18} />}
              onChange={(file) => setProfileData({ ...profileData, avatar: file })}
              style={{ flex: 1 }}
            />
          </Group>

          <TextInput
            label="Username"
            placeholder="johndoe"
            value={profileData.username}
            onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
            mb="md"
            required
          />

          <TextInput
            label="Email"
            placeholder="john@example.com"
            type="email"
            value={profileData.email}
            onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
            mb="md"
            required
          />

          <Textarea
            label="Bio"
            placeholder="Tell us about yourself..."
            value={profileData.bio}
            onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
            minRows={3}
            mb="md"
          />

          <Group justify="flex-end">
            <Button type="submit" loading={loading} leftSection={<IconCheck size={18} />} style={{ backgroundColor: 'rgba(31, 96, 3, 1)' }}>
              Save Profile
            </Button>
          </Group>
        </form>
      </Paper>

      {/* Password Settings */}
      <Paper shadow="md" p="xl" radius="md" withBorder mb="xl">
        <Title order={3} mb="md" leftSection={<IconLock size={24} />}>
          Change Password
        </Title>
        
        <form onSubmit={handlePasswordUpdate}>
          <PasswordInput
            label="Current Password"
            placeholder="Enter current password"
            value={passwordData.currentPassword}
            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
            required
            mb="md"
          />

          <PasswordInput
            label="New Password"
            placeholder="Enter new password"
            value={passwordData.newPassword}
            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
            required
            mb="md"
          />

          <PasswordInput
            label="Confirm New Password"
            placeholder="Confirm new password"
            value={passwordData.confirmPassword}
            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
            required
            mb="md"
          />

          <Group justify="flex-end">
            <Button type="submit" loading={loading} leftSection={<IconCheck size={18} />} style={{ backgroundColor: 'rgba(31, 96, 3, 0.8)' }}>
              Update Password
            </Button>
          </Group>
        </form>
      </Paper>

      {/* Appearance Settings */}
      <Paper shadow="md" p="xl" radius="md" withBorder mb="xl">
        <Title order={3} mb="md" leftSection={<IconPalette size={24} />}>
          Appearance Settings
        </Title>
        
        <Select
          label="Language"
          placeholder="Select language"
          value={language}
          onChange={setLanguage}
          data={[
            { value: 'en', label: 'English' },
            { value: 'es', label: 'Español' },
            { value: 'fr', label: 'Français' },
            { value: 'de', label: 'Deutsch' },
            { value: 'ro', label: 'Română' },
            { value: 'ja', label: '日本語' },
            { value: 'zh', label: '中文' }
          ]}
          mb="md"
        />

        <Switch
          label="Dark Mode"
          description="Switch between light and dark themes"
          checked={darkMode}
          onChange={(event) => setDarkMode(event.currentTarget.checked)}
          size="md"
        />
      </Paper>

      {/* Account Actions */}
      <Paper shadow="md" p="xl" radius="md" withBorder mb="xl">
        <Title order={3} mb="md" c="red">
          Danger Zone
        </Title>
        <Text size="sm" c="dimmed" mb="md">
          Permanently delete your account and all associated data. This action cannot be undone.
        </Text>
        <Button color="red" variant="outline">
          Delete Account
        </Button>
      </Paper>
      <Footer />
    </main>
  );
}

export default Settings;
