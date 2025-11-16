import jwt from 'jsonwebtoken';
import { supabase } from '../config/supabaseClient.js';

export const registerService = async (email, password, username) => {
  // Use Supabase Auth to create user
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true, // Auto-confirm email
    user_metadata: {
      username
    }
  });

  if (authError) {
    console.log('Registration error:', authError);
    if (authError.message.includes('already registered')) {
      throw { statusCode: 409, message: 'Email already taken' };
    }
    throw { statusCode: 400, message: authError.message || 'Failed to create user' };
  }

  const user = authData.user;

  return generateToken({
    id: user.id,
    email: user.email,
    username: user.user_metadata?.username || username,
    avatar_url: user.user_metadata?.avatar_url || null,
    bio: user.user_metadata?.bio || null
  });
};

export const loginService = async (email, password) => {
  // Use Supabase Auth to sign in
  const { data, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (authError) {
    console.log('Login error:', email, authError);
    throw { statusCode: 401, message: 'Invalid credentials' };
  }

  const user = data.user;
  
  // Get username from profiles table first (source of truth)
  let username = user.user_metadata?.username;
  const { data: profile } = await supabase
    .from('profiles')
    .select('username')
    .eq('id', user.id)
    .single();
  
  if (profile?.username) {
    username = profile.username;
  }

  return generateToken({
    id: user.id,
    email: user.email,
    username: username || 'User',
    avatar_url: user.user_metadata?.avatar_url || null,
    bio: user.user_metadata?.bio || null
  });
};

const generateToken = (user) => {
  const token = jwt.sign(
    { id: user.id, email: user.email, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRATION }
  );

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
      avatar_url: user.avatar_url,
      bio: user.bio
    }
  };
};
