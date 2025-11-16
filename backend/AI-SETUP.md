# AI Assistant Setup

## Required Environment Variables

Add these to your `backend/.env` file:

```env
# OpenAI Configuration
OPENAI_API_KEY=sk-...your-key-here...
AI_MODEL=gpt-4o-mini

# Optional: Skip rate limiting in development (set to 'true')
RATE_LIMIT_SKIP=false
```

## Getting Your OpenAI API Key

1. Go to https://platform.openai.com/
2. Sign in or create an account
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key and add it to your `.env` file

**Important**: Never commit your API key to git. The `.env` file is already in `.gitignore`.

## Model Options

- `gpt-4o-mini` (recommended for hackathon): Fast, affordable, good quality
- `gpt-4o`: Higher quality, slower, more expensive
- `gpt-3.5-turbo`: Fastest, cheapest, lower quality

## Rate Limiting

The AI endpoint is rate-limited to **30 requests per hour per user** to prevent abuse and control costs.

To disable rate limiting during development:
```env
RATE_LIMIT_SKIP=true
```

## Installing Dependencies

Run this in the `backend/` directory:

```bash
npm install
```

This will install:
- `openai` - OpenAI SDK
- `express-rate-limit` - Rate limiting middleware

## Testing the AI Endpoint

After starting the backend server, test the health check:

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

## API Usage

### POST /api/ai/chat

**Headers:**
```
Authorization: Bearer <your-jwt-token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "messages": [
    {
      "role": "user",
      "content": "Suggest a color palette for a cozy living room"
    }
  ],
  "context": {
    "type": "listing",
    "listingId": 123
  }
}
```

**Response:**
```json
{
  "message": "Here's a cozy living room palette:\n\n**Warm Neutrals:**\n- Cream walls (#F5F5DC)\n- Soft taupe sofa...",
  "timestamp": "2025-11-16T10:30:00.000Z"
}
```

### Context Types

**Listing Context:**
```json
{
  "type": "listing",
  "listingId": 123
}
```

**Profile Context:**
```json
{
  "type": "profile",
  "username": "john_doe"
}
```

**No Context:**
```json
{
  "messages": [...]
}
```

## Cost Management

- Each chat request costs approximately $0.0001-0.0005 (with gpt-4o-mini)
- Monitor usage at https://platform.openai.com/usage
- Set spending limits in your OpenAI account settings
- The rate limiter helps control costs by limiting requests

## Troubleshooting

**"AI service authentication failed"**
- Check that `OPENAI_API_KEY` is set correctly in `.env`
- Verify the key is active at https://platform.openai.com/

**"AI service rate limit reached"**
- You've hit OpenAI's rate limits (not the app's)
- Wait a moment and try again
- Consider upgrading your OpenAI plan

**"Too many AI requests"**
- User has exceeded 30 requests/hour
- Wait 1 hour or set `RATE_LIMIT_SKIP=true` for development

**Health check shows "configured: false"**
- `OPENAI_API_KEY` is missing from `.env`
- Check that `.env` file exists and is in the `backend/` directory
