import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// System prompt for the design assistant
const SYSTEM_PROMPT = `You are an expert interior/exterior design and garden planning assistant for HouseGig, a platform where users share and discover home designs.

Your role:
- Provide specific, actionable, and budget-conscious design advice
- Help with color palettes, layouts, furniture placement, lighting, materials, and garden/landscaping
- When context about a listing or profile is provided, use it to give tailored recommendations
- Be practical and realistic about costs, timelines, and difficulty levels
- Structure your answers with clear sections (e.g., "Color Palette", "Key Steps", "Budget Tips")
- Keep responses scannable with bullet points and numbered steps
- If you need clarification, ask one focused question

Style guidelines:
- Be friendly, enthusiastic, and encouraging
- Use design terminology but explain jargon when needed
- Suggest 2-3 options when possible (e.g., budget/mid-range/luxury)
- Include rough cost estimates when discussing purchases
- Mention safety considerations for renovations

What to avoid:
- Don't make up specific product names or prices
- Don't provide structural engineering or electrical/plumbing advice beyond general guidance
- Keep responses under 500 words for clarity`;

/**
 * Send a chat message to the AI assistant
 * @param {Array} messages - Array of message objects with role and content
 * @param {Object} context - Optional context (listing or profile data)
 * @returns {Promise<string>} - AI response
 */
export const chat = async (messages, context = null) => {
  try {
    // Validate messages
    if (!Array.isArray(messages) || messages.length === 0) {
      throw new Error('Messages must be a non-empty array');
    }

    // Build conversation array
    const conversationMessages = [
      { role: 'system', content: SYSTEM_PROMPT }
    ];

    // Add context if provided
    if (context) {
      const contextContent = buildContextMessage(context);
      if (contextContent) {
        conversationMessages.push({
          role: 'system',
          content: `Context about the current page:\n${contextContent}`
        });
      }
    }

    // Add user messages (limit to last 10 for token management)
    const recentMessages = messages.slice(-10).map(msg => ({
      role: msg.role,
      content: String(msg.content).slice(0, 3000) // Truncate very long messages
    }));

    conversationMessages.push(...recentMessages);

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: process.env.AI_MODEL || 'gpt-4o-mini',
      messages: conversationMessages,
      temperature: 0.7,
      max_tokens: 1000,
      presence_penalty: 0.1,
      frequency_penalty: 0.1,
    });

    const assistantMessage = response.choices?.[0]?.message?.content?.trim();

    if (!assistantMessage) {
      throw new Error('No response from AI');
    }

    return assistantMessage;

  } catch (error) {
    console.error('AI Service Error:', error);

    // Handle specific OpenAI errors
    if (error.status === 401) {
      throw { statusCode: 500, message: 'AI service authentication failed' };
    }
    if (error.status === 429) {
      throw { statusCode: 429, message: 'AI service rate limit reached. Please try again in a moment.' };
    }
    if (error.status === 500 || error.status === 503) {
      throw { statusCode: 503, message: 'AI service temporarily unavailable. Please try again.' };
    }

    // Generic error
    throw { 
      statusCode: 500, 
      message: error.message || 'Failed to get AI response. Please try again.' 
    };
  }
};

/**
 * Build context message from listing or profile data
 * @param {Object} context - Context object with type and data
 * @returns {string} - Formatted context string
 */
const buildContextMessage = (context) => {
  if (!context || !context.type) return '';

  try {
    if (context.type === 'listing') {
      const parts = [];
      
      if (context.title) parts.push(`Title: ${context.title}`);
      if (context.description) parts.push(`Description: ${context.description}`);
      if (context.property_type) parts.push(`Property Type: ${context.property_type}`);
      if (context.region) parts.push(`Region/Style: ${context.region}`);
      if (context.price) parts.push(`Price: ${context.price}`);
      if (context.world) parts.push(`World: ${context.world}`);
      if (context.rarity) parts.push(`Rarity: ${context.rarity}`);
      if (context.magic_level) parts.push(`Magic Level: ${context.magic_level}`);
      
      if (context.owner) {
        parts.push(`Owner: ${context.owner.username || 'Unknown'}`);
      }

      return `This is a listing on HouseGig:\n${parts.join('\n')}`;
    }

    if (context.type === 'profile') {
      const parts = [];
      
      if (context.username) parts.push(`Username: ${context.username}`);
      if (context.bio) parts.push(`Bio: ${context.bio}`);
      if (context.listingsCount !== undefined) {
        parts.push(`Number of listings: ${context.listingsCount}`);
      }

      return `This is a user profile on HouseGig:\n${parts.join('\n')}`;
    }

    return '';
  } catch (error) {
    console.error('Error building context:', error);
    return '';
  }
};

/**
 * Basic profanity/inappropriate content filter
 * @param {string} text - Text to check
 * @returns {boolean} - True if text contains inappropriate content
 */
export const containsInappropriateContent = (text) => {
  if (!text || typeof text !== 'string') return false;

  const lowercaseText = text.toLowerCase();
  
  // Basic profanity list (expand as needed)
  const inappropriateWords = [
    'fuck', 'shit', 'damn', 'bitch', 'ass', 'dick', 'cock', 
    'porn', 'sex', 'nude', 'xxx'
  ];

  return inappropriateWords.some(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'i');
    return regex.test(lowercaseText);
  });
};

/**
 * Sanitize user input
 * @param {string} text - Text to sanitize
 * @returns {string} - Sanitized text
 */
export const sanitizeInput = (text) => {
  if (!text || typeof text !== 'string') return '';
  
  // Trim whitespace
  let sanitized = text.trim();
  
  // Limit length
  sanitized = sanitized.slice(0, 3000);
  
  // Remove excessive newlines
  sanitized = sanitized.replace(/\n{4,}/g, '\n\n\n');
  
  return sanitized;
};
