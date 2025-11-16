# AI Assistant Setup & Testing Guide

## ✅ What's Been Implemented

### Backend
- ✅ AI service with OpenAI integration (`backend/src/services/aiService.js`)
- ✅ AI controller with validation and context enrichment (`backend/src/controllers/aiController.js`)
- ✅ AI routes with rate limiting (30 req/hour) (`backend/src/routes/aiRoutes.js`)
- ✅ Wired into server at `/api/ai`
- ✅ Dependencies installed: `openai`, `express-rate-limit`

### Frontend
- ✅ AI Assistant modal component (`HouseGig/src/components/AIAssistant.jsx`)
- ✅ AI API methods in api.js (`sendAIMessage`, `checkAIHealth`)
- ✅ Global AI button in Header (purple sparkles icon)
- ✅ Context-aware "Ask AI" button on ListingDetails page
- ✅ Context-aware "Ask AI" button on Profile page (for other users)
- ✅ LocalStorage persistence (last 10 messages)
- ✅ Quick prompt suggestions
- ✅ Rate limit tracking display

## 🚀 Setup Steps

### 1. Get OpenAI API Key

1. Go to https://platform.openai.com/
2. Sign in or create account
3. Go to API Keys section: https://platform.openai.com/api-keys
4. Click "Create new secret key"
5. Copy the key (starts with `sk-...`)

### 2. Configure Backend Environment

Edit `backend/.env` and add:

```env
# OpenAI Configuration
OPENAI_API_KEY=sk-proj-...your-key-here...
AI_MODEL=gpt-4o-mini

# Optional: Disable rate limiting for testing
RATE_LIMIT_SKIP=false
```

**Important**: 
- Use `gpt-4o-mini` for cost-effective hackathon demo (fast, cheap, good quality)
- Alternative: `gpt-4o` (higher quality, slower, more expensive)
- Set `RATE_LIMIT_SKIP=true` only for local development testing

### 3. Start Backend

```bash
cd backend
npm install  # Already done if you see this
npm start
```

Expected output:
```
Server running on port 5000
```

### 4. Test Backend Health

Open a new terminal and run:

```bash
curl http://localhost:5000/api/ai/health
```

Expected response:
```json
{
  "status": "ok",
  "service": "AI Assistant",
  "configured": true,
  "model": "gpt-4o-mini"
}
```

If `"configured": false`, check that `OPENAI_API_KEY` is set correctly in `backend/.env`.

### 5. Start Frontend

```bash
cd HouseGig
npm start  # or npm run dev
```

## 🧪 Testing the AI Assistant

### Test 1: Global AI Assistant

1. Start the app and log in
2. Click the **purple sparkles icon** in the header
3. Try a prompt: `"Suggest a color palette for a cozy living room"`
4. Should receive a structured response with colors and tips

### Test 2: Context-Aware on Listing

1. Navigate to any listing (`/listing/{id}`)
2. Click **"Ask AI"** button near the title
3. Notice the blue context badge: "I have context about this listing"
4. Try: `"What design improvements would you suggest?"`
5. AI should reference the listing's title, style, and details

### Test 3: Context-Aware on Profile

1. Navigate to another user's profile (`/profile/{username}`)
2. Click **"Ask AI"** button
3. Context badge shows: "I have context about {username}'s profile"
4. Try: `"Summarize this creator's style and suggest complementary ideas"`
5. AI should reference the user's bio and listing count

### Test 4: Quick Prompts

1. Open AI assistant (no existing messages)
2. Click one of the suggestion buttons:
   - "Suggest a color palette for a cozy living room"
   - "Help me plan a small garden layout"
   - "Budget-friendly bathroom renovation ideas"
   - "Tips for better lighting in my space"
3. Should send that prompt automatically

### Test 5: Multi-Turn Conversation

1. Ask: `"I want to redesign my bedroom"`
2. AI responds with questions/suggestions
3. Follow up: `"I prefer Scandinavian style, budget $800"`
4. AI should remember the context and provide refined advice
5. Messages persist in localStorage (survive page refresh)

### Test 6: Rate Limiting

1. Make multiple requests in quick succession
2. After 30 requests in one hour, should see:
   - Orange notification: "Rate Limit Reached"
   - Error message in chat
3. Counter at bottom shows: `"X / 30 requests this hour"`

## 🐛 Troubleshooting

### "AI service authentication failed"
- Check `OPENAI_API_KEY` in `backend/.env`
- Verify key is valid at https://platform.openai.com/
- Make sure there are no extra spaces or quotes around the key

### "Cannot connect to server"
- Ensure backend is running on port 5000 (or your configured port)
- Check `VITE_API_BASE_URL` in `HouseGig/.env` matches your backend URL
- Default should be: `VITE_API_BASE_URL=http://localhost:5000/api`

### "Failed to get AI response"
- Check browser console for detailed error
- Check backend terminal for error logs
- Verify you have internet connection (API calls go to OpenAI)
- Check OpenAI account has credits: https://platform.openai.com/usage

### AI responses are slow
- Using `gpt-4o-mini` is fastest (recommended)
- Network latency can affect response time
- Responses typically take 2-5 seconds

### Rate limit errors appear immediately
- Set `RATE_LIMIT_SKIP=true` in `backend/.env` for testing
- Restart backend after changing `.env`
- Remember to set back to `false` for production

### Context not working
- Check that listing/profile data is loaded before opening AI
- Look for blue "I have context..." badge in AI modal
- Check browser console for context object being passed

## 💰 Cost Management

### Estimated Costs (with gpt-4o-mini)
- Per message: ~$0.0001-0.0003
- 100 messages: ~$0.01-0.03
- 1000 messages: ~$0.10-0.30

### Cost Control Tips
- Rate limiter is set to 30 req/hour/user
- Each conversation limited to last 10 messages (reduces tokens)
- Long messages are truncated to 3000 chars
- Monitor usage at: https://platform.openai.com/usage
- Set spending limits in OpenAI account settings

## 📋 Demo Script for Hackathon

### Scenario 1: General Design Help
1. Open AI from header
2. "I'm redesigning my living room. It's 4x5 meters, north-facing, gets little natural light. Budget is $1200. Suggest a cozy modern style."
3. Show structured response with palette, furniture, lighting, budget

### Scenario 2: Listing-Specific Advice
1. Go to a fantasy listing (e.g., mystical forest cottage)
2. Click "Ask AI"
3. "What magical elements would enhance this design? Stay under 500 gold pieces."
4. AI uses listing context to give tailored fantasy design advice

### Scenario 3: Creator Style Analysis
1. Go to a user's profile with several listings
2. Click "Ask AI"
3. "Analyze this creator's design patterns and suggest 2 complementary room concepts"
4. AI references their bio and listing count in response

### Scenario 4: Multi-Turn Refinement
1. "Plan a small urban garden, 3x3 meters, partial shade"
2. AI suggests plants and layout
3. "Make it low-maintenance, I travel often"
4. AI refines recommendations based on context
5. "What about adding a small water feature?"
6. AI adds water feature suggestions with budget

## 🎯 Key Features to Highlight

1. **Context-Aware**: Uses listing and profile data for relevant advice
2. **Persistent**: Conversations saved locally, survive refresh
3. **Rate-Limited**: 30 req/hour prevents abuse
4. **Quick Prompts**: Helpful suggestions for common tasks
5. **Multi-Turn**: Remembers conversation context
6. **Practical**: Budget-aware, actionable recommendations
7. **Structured**: Responses organized with sections and bullets
8. **Fast**: Using gpt-4o-mini for quick responses

## 📝 Next Steps (if time allows)

- [ ] Add streaming responses for better UX
- [ ] Add image upload for vision analysis
- [ ] Add image generation for mood boards
- [ ] Add "Copy" button for responses
- [ ] Add export chat as PDF
- [ ] Add feedback thumbs up/down
- [ ] Show typing indicator animation
- [ ] Add suggested follow-up questions

---

**Everything is now ready to test!** Start both servers and try the demo scenarios above.
