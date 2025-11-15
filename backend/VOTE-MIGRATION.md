# Vote System Migration Guide

This guide explains how to migrate from the likes system to the upvote/downvote system.

## Overview

The new voting system replaces the simple "like" functionality with an upvote/downvote system that:
- Allows users to express approval (upvote) or disapproval (downvote)
- Calculates an approval percentage for each listing
- Displays the percentage with a color-coded progress bar
- Maintains vote counts automatically via database triggers

## Migration Steps

### 1. Run the SQL Migration

Execute the SQL migration file in your Supabase SQL editor:

```bash
# File location: backend/migrate-likes-to-votes.sql
```

This will:
- Drop the old `likes` table
- Create new `votes` table with upvote/downvote support
- Add `upvotes` and `downvotes` columns to the `listings` table
- Set up Row Level Security (RLS) policies
- Create database triggers to automatically update vote counts
- Create a `vote_stats` view for easy querying

**⚠️ Warning:** This migration will delete all existing likes data. Backup your database first if you need to preserve this data.

### 2. Backend Changes

The backend has been updated with:

- **New Service:** `voteService.js` - Handles all vote operations
- **New Controller:** `voteController.js` - HTTP handlers for vote endpoints
- **New Routes:** `voteRoutes.js` - API routes for voting
- **Updated:** `server.js` - Imports vote routes instead of like routes
- **Updated:** `listingService.js` - Returns upvotes/downvotes instead of likes count

### 3. API Endpoints

#### Old (Likes System)
```
POST   /api/likes              - Like a listing
DELETE /api/likes              - Unlike a listing
GET    /api/likes/:id/count    - Get likes count
GET    /api/likes/:id/check    - Check if user liked
GET    /api/likes/my-likes     - Get user's liked listings
```

#### New (Votes System)
```
POST   /api/votes/upvote            - Upvote a listing
POST   /api/votes/downvote          - Downvote a listing
DELETE /api/votes                   - Remove vote
GET    /api/votes/:id/stats         - Get vote statistics
GET    /api/votes/:id/status        - Get user's vote status
GET    /api/votes/my-upvotes        - Get user's upvoted listings
```

### 4. Frontend Changes

#### Updated Components

1. **ListingCard.jsx**
   - Removed likes icon and count
   - Added vote percentage display
   - Added Mantine Progress bar (color-coded based on percentage)
   - Shows "(X upvotes, Y downvotes)" text

2. **ListingDetails.jsx**
   - Replaced like button with upvote/downvote buttons
   - Added vote info box with large percentage and progress bar
   - Buttons show active state with color (green for upvote, red for downvote)
   - Uses IconArrowUp and IconArrowDown from Tabler Icons

3. **Profile.jsx**
   - Changed "Liked" tab to "Upvoted"
   - Updated API call to fetch upvoted listings

4. **api.js**
   - Replaced `likeListing()` and `unlikeListing()` with voting methods
   - Added `upvoteListing()`, `downvoteListing()`, `removeVote()`
   - Added `getVoteStatus()`, `getVoteStats()`, `getMyUpvotedListings()`

### 5. Database Schema

#### New `votes` Table
```sql
id              UUID (Primary Key)
user_id         UUID (Foreign Key → auth.users)
listing_id      UUID (Foreign Key → listings)
vote_type       VARCHAR(10) ('upvote' or 'downvote')
created_at      TIMESTAMP
updated_at      TIMESTAMP
UNIQUE(user_id, listing_id)
```

#### Updated `listings` Table
```sql
-- New columns added:
upvotes         INTEGER (Default: 0)
downvotes       INTEGER (Default: 0)
```

### 6. Vote Calculation

The approval percentage is calculated as:
```
percentage = (upvotes / (upvotes + downvotes)) × 100
```

Progress bar colors:
- **Green:** ≥ 70% approval
- **Yellow:** 40-69% approval  
- **Red:** < 40% approval

### 7. How It Works

1. **User votes:** Frontend calls `/api/votes/upvote` or `/api/votes/downvote`
2. **Backend processes:** Vote is inserted/updated in `votes` table
3. **Trigger fires:** Database trigger automatically updates `listings.upvotes` or `listings.downvotes`
4. **Frontend displays:** Percentage and progress bar are calculated and shown

### 8. Testing

After migration:

1. ✅ Test upvoting a listing
2. ✅ Test downvoting a listing
3. ✅ Test removing a vote (click same button again)
4. ✅ Test switching from upvote to downvote
5. ✅ Verify vote counts update correctly
6. ✅ Check "Upvoted" tab in profile
7. ✅ Verify progress bars display correctly
8. ✅ Test as guest (should prompt to sign in)

### 9. Rollback (If Needed)

If you need to rollback:

1. Restore database from backup
2. Revert backend changes:
   - Delete `voteService.js`, `voteController.js`, `voteRoutes.js`
   - Restore `likeRoutes` in `server.js`
   - Revert `listingService.js` changes
3. Revert frontend changes in all updated files

## Benefits

- ✨ More nuanced feedback than simple likes
- 📊 Approval percentage gives quick quality indication
- 🎨 Visual progress bars improve UX
- 🔒 Automatic vote count updates via triggers
- 🚀 Better aligns with design sharing platform concept

## Notes

- Vote counts are maintained automatically - no manual updates needed
- Users can change their vote at any time
- Removing a vote returns the count to neutral
- RLS policies ensure users can only modify their own votes
- The `vote_stats` view provides pre-calculated statistics
