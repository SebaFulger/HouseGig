import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testDeleteUser() {
  // Get a test user ID (replace with actual user ID to test)
  const { data: users, error: listError } = await supabase.auth.admin.listUsers();
  
  if (listError) {
    console.error('Error listing users:', listError);
    return;
  }
  
  console.log('Found users:', users.users.length);
  if (users.users.length > 0) {
    const testUser = users.users[0];
    console.log('Test user:', testUser.id, testUser.email);
    
    // Try to delete
    console.log('\nAttempting to delete user...');
    const { error: deleteError } = await supabase.auth.admin.deleteUser(testUser.id);
    
    if (deleteError) {
      console.error('Delete error:', deleteError);
      console.error('Error details:', JSON.stringify(deleteError, null, 2));
    } else {
      console.log('Delete successful!');
    }
  }
}

testDeleteUser().then(() => {
  console.log('\nTest complete');
  process.exit(0);
});
