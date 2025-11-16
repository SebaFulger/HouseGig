import React, { useState, useEffect, useRef } from 'react';
import { Modal, TextInput, Button, ActionIcon, Loader, ScrollArea, Alert } from '@mantine/core';
import { IconSparkles, IconX, IconSend, IconAlertCircle } from '@tabler/icons-react';
import { api } from '../services/api';
import { notifications } from '@mantine/notifications';
import './AIAssistant.css';

function AIAssistant({ opened, onClose, context = null, initialPrompt = null }) {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const viewport = useRef(null);

  // Load messages from localStorage on mount
  useEffect(() => {
    const savedMessages = localStorage.getItem('ai_assistant_messages');
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages);
        setMessages(parsed.slice(-10)); // Keep last 10
      } catch (e) {
        console.error('Failed to load saved messages:', e);
      }
    }
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('ai_assistant_messages', JSON.stringify(messages));
    }
  }, [messages]);

  // Handle initial prompt
  useEffect(() => {
    if (initialPrompt && messages.length === 0 && !isLoading) {
      const text = initialPrompt.trim();
      if (!text) return;

      const userMessage = { role: 'user', content: text };
      const updatedMessages = [userMessage];
      setMessages(updatedMessages);
      setIsLoading(true);
      setError(null);

      api.sendAIMessage(updatedMessages, context)
        .then(response => {
          const assistantMessage = {
            role: 'assistant',
            content: response.message
          };
          setMessages([...updatedMessages, assistantMessage]);
        })
        .catch(err => {
          console.error('AI Error:', err);
          setError(err.message || 'Failed to get response. Please try again.');
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialPrompt]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (viewport.current) {
      viewport.current.scrollTo({ top: viewport.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  const handleSendMessage = async (messageText = null) => {
    const text = messageText || inputValue.trim();
    if (!text || isLoading) return;

    const userMessage = { role: 'user', content: text };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputValue('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.sendAIMessage(updatedMessages, context);
      
      const assistantMessage = {
        role: 'assistant',
        content: response.message
      };

      setMessages([...updatedMessages, assistantMessage]);
    } catch (err) {
      console.error('AI Error:', err);
      setError(err.message || 'Failed to get response. Please try again.');
      
      // Show notification for rate limit or server errors
      if (err.message.includes('rate limit')) {
        notifications.show({
          title: 'Rate Limit Reached',
          message: 'You\'ve reached the hourly AI request limit. Try again later.',
          color: 'orange',
          icon: <IconAlertCircle />,
        });
      } else {
        notifications.show({
          title: 'Error',
          message: err.message || 'Failed to get AI response',
          color: 'red',
          icon: <IconAlertCircle />,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearChat = () => {
    setMessages([]);
    setError(null);
    localStorage.removeItem('ai_assistant_messages');
    notifications.show({
      message: 'Chat history cleared',
      color: 'gray',
    });
  };

  const quickPrompts = [
    'Suggest a color palette for a cozy living room',
    'Help me plan a small garden layout',
    'Budget-friendly bathroom renovation ideas',
    'Tips for better lighting in my space',
  ];

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <IconSparkles size={20} />
          <span>Design Assistant</span>
        </div>
      }
      size="lg"
      styles={{
        body: { height: '500px', display: 'flex', flexDirection: 'column' }
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Context Badge */}
        {context && (
          <Alert 
            icon={<IconSparkles size={16} />} 
            color="blue" 
            variant="light"
            style={{ marginBottom: '1rem' }}
          >
            {context.type === 'listing' && 'I have context about this listing'}
            {context.type === 'profile' && `I have context about ${context.username}'s profile`}
          </Alert>
        )}

        {/* Messages Area */}
        <ScrollArea 
          style={{ flex: 1, marginBottom: '1rem' }}
          viewportRef={viewport}
        >
          {messages.length === 0 && !isLoading && (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
              <IconSparkles size={40} style={{ marginBottom: '1rem', opacity: 0.5 }} />
              <p style={{ marginBottom: '1.5rem' }}>
                Hi! I'm your design assistant. I can help with:
              </p>
              <ul style={{ textAlign: 'left', maxWidth: '400px', margin: '0 auto', lineHeight: 1.8 }}>
                <li>Color palettes and style suggestions</li>
                <li>Layout and furniture placement</li>
                <li>Lighting and material recommendations</li>
                <li>Garden planning and landscaping</li>
                <li>Budget-friendly renovation ideas</li>
              </ul>
              <p style={{ marginTop: '1.5rem', fontSize: '0.9rem', color: '#888' }}>
                Try one of these prompts or ask me anything:
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
                {quickPrompts.map((prompt, idx) => (
                  <Button
                    key={idx}
                    variant="light"
                    size="xs"
                    onClick={() => handleSendMessage(prompt)}
                    style={{ textAlign: 'left', justifyContent: 'flex-start' }}
                  >
                    {prompt}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`ai-message ${msg.role}`}
              style={{
                marginBottom: '1rem',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                backgroundColor: msg.role === 'user' ? '#e7f5ff' : '#f8f9fa',
                marginLeft: msg.role === 'user' ? 'auto' : '0',
                marginRight: msg.role === 'user' ? '0' : 'auto',
                maxWidth: '85%',
              }}
            >
              <div style={{ 
                fontSize: '0.75rem', 
                fontWeight: 600, 
                marginBottom: '0.25rem',
                color: msg.role === 'user' ? '#1971c2' : '#495057'
              }}>
                {msg.role === 'user' ? 'You' : 'Assistant'}
              </div>
              <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                {msg.content}
              </div>
            </div>
          ))}

          {isLoading && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#666', padding: '1rem' }}>
              <Loader size="sm" />
              <span>Thinking...</span>
            </div>
          )}

          {error && (
            <Alert icon={<IconAlertCircle size={16} />} color="red" style={{ marginTop: '1rem' }}>
              {error}
            </Alert>
          )}
        </ScrollArea>

        {/* Input Area */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <TextInput
            placeholder="Ask about design, colors, layouts..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
            style={{ flex: 1 }}
            rightSection={
              inputValue && (
                <ActionIcon onClick={() => setInputValue('')} variant="subtle" size="sm">
                  <IconX size={14} />
                </ActionIcon>
              )
            }
          />
          <Button
            onClick={() => handleSendMessage()}
            disabled={!inputValue.trim() || isLoading}
            leftSection={<IconSend size={16} />}
          >
            Send
          </Button>
        </div>

        {/* Footer Actions */}
        <div style={{ marginTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button 
            variant="subtle" 
            size="xs" 
            onClick={handleClearChat}
            disabled={messages.length === 0}
          >
            Clear Chat
          </Button>
          <span style={{ fontSize: '0.75rem', color: '#868e96' }}>
            {messages.filter(m => m.role === 'user').length} / 30 requests this hour
          </span>
        </div>
      </div>
    </Modal>
  );
}

export default AIAssistant;
