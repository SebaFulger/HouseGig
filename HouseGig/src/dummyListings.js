// Dummy listings for use in Explore and ListingDetails
const listings = [
  {
    id: 1,
    title: 'Sky Castle',
    world: 'Cloud Realm',
    price: '1200 Gold',
    main_image_url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
    owner: {
      username: 'Aetheria',
      avatar_url: 'https://randomuser.me/api/portraits/women/44.jpg'
    },
    likes: 23,
    liked: false,
    description: 'A majestic castle floating among the clouds.'
  },
  {
    id: 2,
    title: 'Enchanted Treehouse',
    world: 'Mystic Woods',
    price: '800 Gold',
    main_image_url: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=600&q=80',
    owner: {
      username: 'Sylva',
      avatar_url: 'https://randomuser.me/api/portraits/men/32.jpg'
    },
    likes: 15,
    liked: false,
    description: 'A magical treehouse with glowing lanterns.'
  },
  {
    id: 3,
    title: 'Crystal Lake Cabin',
    world: 'Frost Valley',
    price: '950 Gold',
    main_image_url: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=600&q=80',
    owner: {
      username: 'Glacia',
      avatar_url: 'https://randomuser.me/api/portraits/women/65.jpg'
    },
    likes: 31,
    liked: false,
    description: 'A cozy cabin by a shimmering crystal lake.'
  },
  {
    id: 4,
    title: 'Dragon Peak Tower',
    world: 'Volcanic Isles',
    price: '1500 Gold',
    main_image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=600&q=80',
    owner: {
      username: 'Drakonis',
      avatar_url: 'https://randomuser.me/api/portraits/men/15.jpg'
    },
    likes: 42,
    liked: false,
    description: 'A towering structure with dragon\'s hoard inside.'
  },
  {
    id: 5,
    title: 'Moonlight Manor',
    world: 'Silver Vale',
    price: '1100 Gold',
    main_image_url: 'https://images.unsplash.com/photo-1505228395891-9a51e7e86e81?auto=format&fit=crop&w=600&q=80',
    owner: {
      username: 'Lunara',
      avatar_url: 'https://randomuser.me/api/portraits/women/30.jpg'
    },
    likes: 28,
    liked: false,
    description: 'An elegant manor that glows under moonlight.'
  },
  {
    id: 6,
    title: 'Ancient Temple Ruins',
    world: 'Lost Kingdom',
    price: '850 Gold',
    main_image_url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80',
    owner: {
      username: 'Archaeus',
      avatar_url: 'https://randomuser.me/api/portraits/men/42.jpg'
    },
    likes: 19,
    liked: false,
    description: 'Mysterious ruins filled with ancient treasures.'
  },
  {
    id: 7,
    title: 'Floating Isle Observatory',
    world: 'Celestial Heights',
    price: '1350 Gold',
    main_image_url: 'https://images.unsplash.com/photo-1506381773649-6e0ee8d70d46?auto=format&fit=crop&w=600&q=80',
    owner: {
      username: 'Stellaris',
      avatar_url: 'https://randomuser.me/api/portraits/women/58.jpg'
    },
    likes: 37,
    liked: false,
    description: 'An observatory suspended in the sky for stargazing.'
  },
  {
    id: 8,
    title: 'Underwater Palace',
    world: 'Aquamarine Deep',
    price: '1600 Gold',
    main_image_url: 'https://images.unsplash.com/photo-1508606401543-557f1cfd4c3a?auto=format&fit=crop&w=600&q=80',
    owner: {
      username: 'Nerida',
      avatar_url: 'https://randomuser.me/api/portraits/women/73.jpg'
    },
    likes: 45,
    liked: false,
    description: 'A breathtaking palace beneath the ocean waves.'
  },
  {
    id: 9,
    title: 'Emerald Garden Estate',
    world: 'Verdant Fields',
    price: '950 Gold',
    main_image_url: 'https://images.unsplash.com/photo-1469022563149-aa64dbd37dae?auto=format&fit=crop&w=600&q=80',
    owner: {
      username: 'Verdania',
      avatar_url: 'https://randomuser.me/api/portraits/women/21.jpg'
    },
    likes: 26,
    liked: false,
    description: 'A lush garden estate with emerald fountains.'
  },
  {
    id: 10,
    title: 'Crimson Keep',
    world: 'Blood Rock',
    price: '1250 Gold',
    main_image_url: 'https://images.unsplash.com/photo-1510315170289-48a05b41e6f9?auto=format&fit=crop&w=600&q=80',
    owner: {
      username: 'Ravenna',
      avatar_url: 'https://randomuser.me/api/portraits/women/41.jpg'
    },
    likes: 33,
    liked: false,
    description: 'A formidable keep carved from crimson stone.'
  },
  {
    id: 11,
    title: 'Golden Pagoda',
    world: 'Eastern Mystique',
    price: '1180 Gold',
    main_image_url: 'https://images.unsplash.com/photo-1518162592292-c923ccc27c42?auto=format&fit=crop&w=600&q=80',
    owner: {
      username: 'Aurion',
      avatar_url: 'https://randomuser.me/api/portraits/men/67.jpg'
    },
    likes: 29,
    liked: false,
    description: 'A stunning pagoda covered in shimmering gold.'
  },
  {
    id: 12,
    title: 'Ice Palace Fortress',
    world: 'Frozen North',
    price: '1400 Gold',
    main_image_url: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?auto=format&fit=crop&w=600&q=80',
    owner: {
      username: 'Frostine',
      avatar_url: 'https://randomuser.me/api/portraits/women/5.jpg'
    },
    likes: 51,
    liked: false,
    description: 'A magnificent fortress made entirely of enchanted ice.'
  },
  {
    id: 13,
    title: 'Shadowveil Manor',
    world: 'Obsidian Vale',
    price: '1050 Gold',
    main_image_url: 'https://images.unsplash.com/photo-1518495285542-4542c06a5117?auto=format&fit=crop&w=600&q=80',
    owner: {
      username: 'Nightshade',
      avatar_url: 'https://randomuser.me/api/portraits/men/54.jpg'
    },
    likes: 22,
    liked: false,
    description: 'A mysterious manor shrouded in perpetual shadow.'
  },
  {
    id: 14,
    title: 'Phoenix Rising Tower',
    world: 'Flame Realm',
    price: '1300 Gold',
    main_image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=600&q=80',
    owner: {
      username: 'Pyros',
      avatar_url: 'https://randomuser.me/api/portraits/men/24.jpg'
    },
    likes: 40,
    liked: false,
    description: 'A tower that rises from flames and never burns.'
  },
  {
    id: 15,
    title: 'Starlight Haven',
    world: 'Cosmic Haven',
    price: '1425 Gold',
    main_image_url: 'https://images.unsplash.com/photo-1518066000714-58c45f1b773c?auto=format&fit=crop&w=600&q=80',
    owner: {
      username: 'Cosmara',
      avatar_url: 'https://randomuser.me/api/portraits/women/80.jpg'
    },
    likes: 48,
    liked: false,
    description: 'A heavenly retreat that glows with stellar light.'
  },
  {
    id: 16,
    title: 'Windmill Cottage',
    world: 'Pastoral Breeze',
    price: '700 Gold',
    main_image_url: 'https://images.unsplash.com/photo-1570129477492-45a003537e1f?auto=format&fit=crop&w=600&q=80',
    owner: {
      username: 'Zephyr',
      avatar_url: 'https://randomuser.me/api/portraits/men/11.jpg'
    },
    likes: 18,
    liked: false,
    description: 'A charming cottage with an ancient windmill.'
  }
];

export default listings;
