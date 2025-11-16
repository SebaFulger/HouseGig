import * as aiService from '../services/aiService.js';
import * as listingService from '../services/listingService.js';
import * as userService from '../services/userService.js';

/**
 * Handle chat request
 */
export const chat = async (req, res, next) => {
  try {
    const { messages, context } = req.body;

    // Validate messages
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ 
        error: 'Messages must be a non-empty array' 
      });
    }

    // Validate message format
    const isValidMessages = messages.every(msg => 
      msg.role && 
      msg.content && 
      ['user', 'assistant', 'system'].includes(msg.role)
    );

    if (!isValidMessages) {
      return res.status(400).json({ 
        error: 'Invalid message format. Each message must have role and content.' 
      });
    }

    // Check for inappropriate content in user messages
    const userMessages = messages.filter(msg => msg.role === 'user');
    for (const msg of userMessages) {
      if (aiService.containsInappropriateContent(msg.content)) {
        return res.status(400).json({ 
          error: 'Please keep the conversation focused on design topics.' 
        });
      }
    }

    // Sanitize user messages
    const sanitizedMessages = messages.map(msg => ({
      role: msg.role,
      content: aiService.sanitizeInput(msg.content)
    }));

    // Enrich context if provided
    let enrichedContext = null;
    if (context) {
      enrichedContext = await enrichContext(context);
    }

    // Get AI response
    const response = await aiService.chat(sanitizedMessages, enrichedContext);

    res.json({ 
      message: response,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('AI Controller Error:', error);
    
    if (error.statusCode) {
      return res.status(error.statusCode).json({ 
        error: error.message 
      });
    }

    next(error);
  }
};

/**
 * Enrich context by fetching full listing or profile data
 * @param {Object} context - Context with type and identifier
 * @returns {Object} - Enriched context
 */
const enrichContext = async (context) => {
  try {
    if (context.type === 'listing' && context.listingId) {
      // Fetch full listing details
      const listing = await listingService.getListingService(context.listingId);
      
      return {
        type: 'listing',
        title: listing.title,
        description: listing.description,
        property_type: listing.property_type,
        region: listing.region,
        price: listing.price,
        world: listing.world,
        rarity: listing.rarity,
        magic_level: listing.magic_level,
        owner: listing.owner
      };
    }

    if (context.type === 'profile' && context.username) {
      // Fetch profile details
      const profile = await userService.getUserProfileService(context.username);
      
      // Optionally fetch listing count
      let listingsCount = 0;
      try {
        const listings = await listingService.getListingsByUsernameService(context.username, 1, 0);
        listingsCount = listings.length;
      } catch (e) {
        // Ignore if we can't get listings
      }

      return {
        type: 'profile',
        username: profile.username,
        bio: profile.bio,
        listingsCount
      };
    }

    // If context type is unknown or data is missing, return as-is
    return context;

  } catch (error) {
    console.error('Error enriching context:', error);
    // Return original context if enrichment fails
    return context;
  }
};

/**
 * Health check for AI service
 */
export const healthCheck = async (req, res) => {
  try {
    const hasApiKey = !!process.env.OPENAI_API_KEY;
    const model = process.env.AI_MODEL || 'gpt-4o-mini';

    res.json({
      status: 'ok',
      service: 'AI Assistant',
      configured: hasApiKey,
      model: model
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'AI service health check failed'
    });
  }
};
