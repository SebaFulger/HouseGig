// /backend/scripts/insertDemoData.js
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// Demo users for all 10 categories (20 users)
const demoUsers = [
  // Featured Designs
  {
    email: 'featured1@example.com',
    password: 'password123',
    username: 'featuredluxe',
    bio: 'Curator of the world’s most stunning homes.',
    avatar_url: 'https://randomuser.me/api/portraits/men/11.jpg'
  },
  {
    email: 'featured2@example.com',
    password: 'password123',
    username: 'showcasequeen',
    bio: 'Passionate about architectural masterpieces.',
    avatar_url: 'https://randomuser.me/api/portraits/women/12.jpg'
  },
  // Recently Added
  {
    email: 'recent1@example.com',
    password: 'password123',
    username: 'freshfinds',
    bio: 'Always on the lookout for new designs.',
    avatar_url: 'https://randomuser.me/api/portraits/men/13.jpg'
  },
  {
    email: 'recent2@example.com',
    password: 'password123',
    username: 'trendsetter',
    bio: 'Spotting the latest in home design.',
    avatar_url: 'https://randomuser.me/api/portraits/women/14.jpg'
  },
  // Classical
  {
    email: 'classical1@example.com',
    password: 'password123',
    username: 'classicist',
    bio: 'Lover of timeless architecture.',
    avatar_url: 'https://randomuser.me/api/portraits/men/15.jpg'
  },
  {
    email: 'classical2@example.com',
    password: 'password123',
    username: 'heritagehome',
    bio: 'Preserving the beauty of the past.',
    avatar_url: 'https://randomuser.me/api/portraits/women/16.jpg'
  },
  // Brutalist
  {
    email: 'brutalist1@example.com',
    password: 'password123',
    username: 'brutalbeauty',
    bio: 'Bold lines and concrete dreams.',
    avatar_url: 'https://randomuser.me/api/portraits/men/17.jpg'
  },
  {
    email: 'brutalist2@example.com',
    password: 'password123',
    username: 'rawform',
    bio: 'Finding elegance in the raw.',
    avatar_url: 'https://randomuser.me/api/portraits/women/18.jpg'
  },
  // France
  {
    email: 'france1@example.com',
    password: 'password123',
    username: 'parisianstyle',
    bio: 'Inspired by French elegance.',
    avatar_url: 'https://randomuser.me/api/portraits/men/19.jpg'
  },
  {
    email: 'france2@example.com',
    password: 'password123',
    username: 'chateauqueen',
    bio: 'Dreaming of chateaux and vineyards.',
    avatar_url: 'https://randomuser.me/api/portraits/women/20.jpg'
  },
  // United States
  {
    email: 'usa1@example.com',
    password: 'password123',
    username: 'americandream',
    bio: 'Exploring the diversity of US homes.',
    avatar_url: 'https://randomuser.me/api/portraits/men/21.jpg'
  },
  {
    email: 'usa2@example.com',
    password: 'password123',
    username: 'coasttocoast',
    bio: 'From sea to shining sea.',
    avatar_url: 'https://randomuser.me/api/portraits/women/22.jpg'
  },
  // Art Nouveau
  {
    email: 'artnouveau1@example.com',
    password: 'password123',
    username: 'nouveaunick',
    bio: 'Curves, nature, and beauty.',
    avatar_url: 'https://randomuser.me/api/portraits/men/23.jpg'
  },
  {
    email: 'artnouveau2@example.com',
    password: 'password123',
    username: 'artnouveaustar',
    bio: 'Living in a world of art.',
    avatar_url: 'https://randomuser.me/api/portraits/women/24.jpg'
  },
  // Romania
  {
    email: 'romania1@example.com',
    password: 'password123',
    username: 'transylvanianguy',
    bio: 'From castles to countryside.',
    avatar_url: 'https://randomuser.me/api/portraits/men/25.jpg'
  },
  {
    email: 'romania2@example.com',
    password: 'password123',
    username: 'carpathianqueen',
    bio: 'Romanian roots, modern dreams.',
    avatar_url: 'https://randomuser.me/api/portraits/women/26.jpg'
  },
  // Gardens
  {
    email: 'gardens1@example.com',
    password: 'password123',
    username: 'greenthumb',
    bio: 'Nature is the best designer.',
    avatar_url: 'https://randomuser.me/api/portraits/men/27.jpg'
  },
  {
    email: 'gardens2@example.com',
    password: 'password123',
    username: 'gardenmuse',
    bio: 'Inspired by botanical beauty.',
    avatar_url: 'https://randomuser.me/api/portraits/women/28.jpg'
  },
  // From Popular Culture
  {
    email: 'popculture1@example.com',
    password: 'password123',
    username: 'popfanatic',
    bio: 'Avid fan of pop culture architecture.',
    avatar_url: 'https://randomuser.me/api/portraits/men/1.jpg'
  },
  {
    email: 'popculture2@example.com',
    password: 'password123',
    username: 'culturedreamer',
    bio: 'Exploring the world of fictional homes.',
    avatar_url: 'https://randomuser.me/api/portraits/women/2.jpg'
  }
];

// 80 demo designs, 8 per category, half assigned to each category's user
const demoDesigns = [
  // Featured Designs
  {
    title: 'Skyline Penthouse',
    region: 'New York',
    property_type: 'Penthouse',
    description: 'A luxurious penthouse with panoramic city views, modern interiors, and a private rooftop garden. The epitome of urban sophistication.',
    images: [
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
      'https://images.unsplash.com/photo-1464983953574-0892a716854b',
      'https://images.unsplash.com/photo-1501594907352-04cda38ebc29',
      'https://images.unsplash.com/photo-1465101046530-73398c7f28ca',
      'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd'
    ],
    category: 'Featured Designs',
    owner_email: 'featured1@example.com'
  },
  {
    title: 'Coastal Retreat',
    region: 'California',
    property_type: 'Villa',
    description: 'A serene villa perched above the Pacific, blending indoor and outdoor living with floor-to-ceiling windows and natural materials.',
    images: [
      'https://images.unsplash.com/photo-1465101046530-73398c7f28ca',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
      'https://images.unsplash.com/photo-1464983953574-0892a716854b',
      'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd',
      'https://images.unsplash.com/photo-1501594907352-04cda38ebc29'
    ],
    category: 'Featured Designs',
    owner_email: 'featured1@example.com'
  },
  {
    title: 'Mountain Lodge',
    region: 'Colorado',
    property_type: 'Lodge',
    description: 'A rustic yet elegant lodge nestled in the Rockies, featuring exposed beams, stone fireplaces, and breathtaking mountain views.',
    images: [
      'https://images.unsplash.com/photo-1464983953574-0892a716854b',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
      'https://images.unsplash.com/photo-1465101046530-73398c7f28ca',
      'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd',
      'https://images.unsplash.com/photo-1465101178521-c1a9136a3b99'
    ],
    category: 'Featured Designs',
    owner_email: 'featured1@example.com'
  },
  {
    title: 'Urban Loft',
    region: 'Chicago',
    property_type: 'Loft',
    description: 'A spacious loft with exposed brick, industrial accents, and an open floor plan, perfect for modern city living.',
    images: [
      'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd',
      'https://images.unsplash.com/photo-1465101046530-73398c7f28ca',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
      'https://images.unsplash.com/photo-1464983953574-0892a716854b',
      'https://images.unsplash.com/photo-1501594907352-04cda38ebc29'
    ],
    category: 'Featured Designs',
    owner_email: 'featured1@example.com'
  },
  {
    title: 'Lake House Escape',
    region: 'Minnesota',
    property_type: 'Lake House',
    description: 'A tranquil lake house with a wraparound deck, private dock, and large windows to soak in the water views.',
    images: [
      'https://images.unsplash.com/photo-1465101178521-c1a9136a3b99',
      'https://images.unsplash.com/photo-1464983953574-0892a716854b',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
      'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd',
      'https://images.unsplash.com/photo-1465101046530-73398c7f28ca'
    ],
    category: 'Featured Designs',
    owner_email: 'featured2@example.com'
  },
  {
    title: 'Desert Modern',
    region: 'Arizona',
    property_type: 'Modern Home',
    description: 'A striking modern home set in the desert, with clean lines, sustainable materials, and a seamless connection to the landscape.',
    images: [
      'https://images.unsplash.com/photo-1501594907352-04cda38ebc29',
      'https://images.unsplash.com/photo-1465101046530-73398c7f28ca',
      'https://images.unsplash.com/photo-1464983953574-0892a716854b',
      'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb'
    ],
    category: 'Featured Designs',
    owner_email: 'featured2@example.com'
  },
  {
    title: 'Forest Hideaway',
    region: 'Oregon',
    property_type: 'Cabin',
    description: 'A cozy cabin surrounded by towering pines, featuring natural wood interiors and a stone fireplace for ultimate relaxation.',
    images: [
      'https://images.unsplash.com/photo-1465101046530-73398c7f28ca',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
      'https://images.unsplash.com/photo-1464983953574-0892a716854b',
      'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd',
      'https://images.unsplash.com/photo-1501594907352-04cda38ebc29'
    ],
    category: 'Featured Designs',
    owner_email: 'featured2@example.com'
  },
  {
    title: 'Island Villa',
    region: 'Hawaii',
    property_type: 'Villa',
    description: 'A tropical villa with open-air living spaces, infinity pool, and lush gardens, offering the ultimate island lifestyle.',
    images: [
      'https://images.unsplash.com/photo-1464983953574-0892a716854b',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
      'https://images.unsplash.com/photo-1465101046530-73398c7f28ca',
      'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd',
      'https://images.unsplash.com/photo-1465101178521-c1a9136a3b99'
    ],
    category: 'Featured Designs',
    owner_email: 'featured2@example.com'
  },
  // ...repeat this pattern for all other categories, 4 designs per user, 8 per category, 10 categories total...
  // From Popular Culture
  {
    title: 'Wayne Manor',
    region: 'Gotham',
    property_type: 'Mansion',
    description: 'The iconic residence of Bruce Wayne, featuring gothic architecture, sprawling grounds, and secret passages leading to the Batcave. Wayne Manor is a symbol of both opulence and mystery, blending classic design with hidden technology.',
    images: [
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
      'https://images.unsplash.com/photo-1464983953574-0892a716854b',
      'https://images.unsplash.com/photo-1501594907352-04cda38ebc29',
      'https://images.unsplash.com/photo-1465101046530-73398c7f28ca',
      'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd',
      'https://images.unsplash.com/photo-1465101178521-c1a9136a3b99'
    ],
    category: 'From Popular Culture',
    owner_email: 'popculture1@example.com'
  },
  // ...remaining 7 designs for From Popular Culture, 4 for popculture1, 4 for popculture2
];

async function main() {
  // 1. Register users in Auth and insert into profiles
  for (const user of demoUsers) {
    // Register user in Auth
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email: user.email,
      password: user.password,
      user_metadata: { username: user.username }
    });
    if (authError) {
      console.error(`Error creating user ${user.email}:`, authError.message);
      continue;
    }
    const userId = authUser.user.id;
    // Insert into profiles
    const { error: profileError } = await supabase.from('profiles').upsert({
      id: userId,
      username: user.username,
      bio: user.bio,
      avatar_url: user.avatar_url
    });
    if (profileError) {
      console.error(`Error inserting profile for ${user.email}:`, profileError.message);
    }
    user.id = userId; // Save for design insertion
  }

  // 2. Insert designs
  for (const design of demoDesigns) {
    // Find owner_id by email
    const owner = demoUsers.find(u => u.email === design.owner_email);
    if (!owner || !owner.id) {
      console.error(`Owner not found for design: ${design.title}`);
      continue;
    }
    const { error: designError } = await supabase.from('listings').insert({
      title: design.title,
      region: design.region,
      property_type: design.property_type,
      description: design.description,
      images: design.images,
      category: design.category,
      owner_id: owner.id
    });
    if (designError) {
      console.error(`Error inserting design ${design.title}:`, designError.message);
    }
  }
  console.log('Demo data insertion complete.');
}

main();
