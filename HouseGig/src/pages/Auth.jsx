import './Explore.css';
import Footer from '../Footer';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { TextInput, PasswordInput, Button, Paper, Title, Text, Anchor } from '@mantine/core';

function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const backgroundImage = 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1920';

  // Redirect if already logged in
  if (isAuthenticated) {
    navigate('/');
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        if (username.length < 3) {
          setError('Username must be at least 3 characters');
          setLoading(false);
          return;
        }
        await register(email, password, username);
      }
      navigate('/');
    } catch (err) {
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="explore-main" style={{ 
      position: 'relative',
      minHeight: '100vh',
      padding: 0,
      margin: 0
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        minHeight: '100%',
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: 'blur(6px)',
        transform: 'scale(1.1)',
        zIndex: 0
      }} />
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        minHeight: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        transform: 'scale(1.1)',
        zIndex: 1
      }} />
      <div style={{ maxWidth: 420, margin: '0 auto', paddingTop: '4.2rem', paddingLeft: '1rem', paddingRight: '1rem', position: 'relative', zIndex: 2 }}>
        <Paper shadow="md" p="xl" radius="md" withBorder>
          <Title order={2} mb="md" ta="center">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </Title>
          <Text c="dimmed" size="sm" ta="center" mb="xl">
            {isLogin ? 'Sign in to your account' : 'Register to start exploring'}
          </Text>

          <form onSubmit={handleSubmit}>
            <TextInput
              label="Email"
              placeholder="your@email.com"
              required
              mb="md"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
            />

            {!isLogin && (
              <TextInput
                label="Username"
                placeholder="Choose a username"
                required
                mb="md"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                minLength={3}
              />
            )}

            <PasswordInput
              label="Password"
              placeholder="Your password"
              required
              mb="md"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              // minLength={6}
              
            />

            {error && (
              <Text c="red" size="sm" mb="md">
                {error}
              </Text>
            )}

            <Button fullWidth type="submit" loading={loading} mb="md" style={{ backgroundColor: 'rgba(31, 96, 3, 0.8)' }}>
              {isLogin ? 'Sign In' : 'Sign Up'}
            </Button>

            <Text ta="center" size="sm">
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
              <Anchor component="button" type="button" onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }} style={{ color: 'rgba(31, 96, 3, 0.8)' }}>
                {isLogin ? 'Sign up' : 'Sign in'}
              </Anchor>
            </Text>
          </form>
        </Paper>

        <Paper shadow="sm" p="md" radius="md" mt="md" withBorder>
          <Text size="sm" c="dimmed" ta="center">
            <strong>Guest Mode:</strong> You can browse listings without an account. Sign up to create listings, save favorites, and comment.
          </Text>
        </Paper>
      </div>
      <Footer />
    </main>
  );
}

export default Auth;
