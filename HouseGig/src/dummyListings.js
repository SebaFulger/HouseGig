// Dummy listings for use in Explore and ListingDetails
const listings = [
  {
    id: 1,
    title: 'Sky Castle',
    world: 'Cloud Realm',
    price: '1200 Gold',
    main_image_url: 'https://picsum.photos/seed/skycastle/800/600',
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
    main_image_url: 'https://picsum.photos/seed/treehouse/800/600',
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
    main_image_url: 'https://picsum.photos/seed/lakecabin/800/600',
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
    main_image_url: 'https://picsum.photos/seed/dragontower/800/600',
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
    main_image_url: 'https://picsum.photos/seed/moonmanor/800/600',
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
    main_image_url: 'https://picsum.photos/seed/templeruins/800/600',
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
    main_image_url: 'https://picsum.photos/seed/observatory/800/600',
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
    main_image_url: 'https://picsum.photos/seed/underwater/800/600',
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
    main_image_url: 'https://picsum.photos/seed/garden/800/600',
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
    main_image_url: 'https://picsum.photos/seed/crimsonkeep/800/600',
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
    main_image_url: 'https://picsum.photos/seed/pagoda/800/600',
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
    main_image_url: 'https://picsum.photos/seed/icepalace/800/600',
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
    main_image_url: 'https://picsum.photos/seed/shadowmanor/800/600',
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
    main_image_url: 'https://picsum.photos/seed/phoenixtower/800/600',
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
    main_image_url: 'https://picsum.photos/seed/starlight/800/600',
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
    main_image_url: 'https://picsum.photos/seed/windmill/800/600',
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
