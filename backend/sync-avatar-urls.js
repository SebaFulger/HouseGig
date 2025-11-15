import { supabase } from './src/config/supabaseClient.js';

async function syncAvatarUrls() {
  try {
    console.log('Starting avatar URL sync...\n');
    
    // Get all users from auth
    const { data: { users }, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.error('Error fetching users:', authError);
      return;
    }
    
    console.log(`Found ${users.length} users\n`);
    
    // Update each user's profile with their avatar_url from metadata
    for (const user of users) {
      const avatarUrl = user.user_metadata?.avatar_url;
      
      if (avatarUrl) {
        console.log(`Syncing avatar for user ${user.email}...`);
        console.log(`  Avatar URL: ${avatarUrl}`);
        
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ avatar_url: avatarUrl })
          .eq('id', user.id);
        
        if (updateError) {
          console.error(`  Error updating profile: ${updateError.message}`);
        } else {
          console.log(`  ✓ Successfully synced avatar`);
        }
      } else {
        console.log(`User ${user.email} has no avatar_url in metadata`);
      }
      console.log('');
    }
    
    console.log('Avatar sync complete!');
    
    // Verify the results
    console.log('\nVerifying profiles table:');
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('username, avatar_url');
    
    if (profileError) {
      console.error('Error fetching profiles:', profileError);
    } else {
      console.table(profiles);
    }
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

syncAvatarUrls();
