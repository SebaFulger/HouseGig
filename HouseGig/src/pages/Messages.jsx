import './Explore.css';
import Footer from '../Footer';
import { useAuth } from '../contexts/AuthContext';
import { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import { Loader, TextInput, ScrollArea } from '@mantine/core';
import { notifications } from '@mantine/notifications';

function Messages() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  // Fetch conversations on mount
  useEffect(() => {
    fetchConversations();
  }, []);

  // Handle deep link (e.g., from profile "Send Message" button)
  useEffect(() => {
    const userId = searchParams.get('userId');
    if (userId && conversations.length > 0) {
      // Check if conversation already exists
      const existing = conversations.find(c => 
        c.other_users.some(u => u.id === userId)
      );
      if (existing) {
        handleSelectConversation(existing.id);
      } else {
        // Create new conversation
        handleStartConversation(userId);
      }
    }
  }, [searchParams, conversations]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const data = await api.getConversations();
      setConversations(data);
    } catch (error) {
      console.error('Failed to load conversations:', error);
      notifications.show({
        title: 'Error',
        message: 'Failed to load conversations',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectConversation = async (conversationId) => {
    try {
      const conversation = await api.getConversation(conversationId);
      setSelectedConversation(conversation);
      setMessages(conversation.messages || []);
      
      // Mark as read
      await api.markConversationRead(conversationId);
      
      // Update unread count in sidebar
      setConversations(prev =>
        prev.map(c =>
          c.id === conversationId ? { ...c, unread_count: 0 } : c
        )
      );
    } catch (error) {
      console.error('Failed to load conversation:', error);
      notifications.show({
        title: 'Error',
        message: 'Failed to load conversation',
        color: 'red',
      });
    }
  };

  const handleStartConversation = async (otherUserId) => {
    try {
      const conversation = await api.getOrCreateConversation(otherUserId);
      setSelectedConversation(conversation);
      setMessages(conversation.messages || []);
      
      // Add to conversations list if new
      if (!conversations.find(c => c.id === conversation.id)) {
        setConversations(prev => [conversation, ...prev]);
      }
    } catch (error) {
      console.error('Failed to start conversation:', error);
      notifications.show({
        title: 'Error',
        message: 'Failed to start conversation',
        color: 'red',
      });
    }
  };

  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedConversation) return;

    try {
      setSending(true);
      const newMessage = await api.sendMessage(selectedConversation.id, messageText);
      setMessages(prev => [...prev, newMessage]);
      setMessageText('');
      
      // Update last message in sidebar
      setConversations(prev =>
        prev.map(c =>
          c.id === selectedConversation.id
            ? { ...c, last_message: newMessage, updated_at: newMessage.created_at }
            : c
        ).sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
      );

      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to send message',
        color: 'red',
      });
    } finally {
      setSending(false);
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <main className="explore-main" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <Loader size="lg" />
      </main>
    );
  }

  const getOtherUser = (conv) => conv.other_users?.[0];

  return (
    <main className="explore-main" style={{ paddingBottom: 0 }}>
      <div style={{ marginTop: '4.2rem', marginBottom: '1rem' }}>
        <h2 style={{ fontSize: '2.4rem', fontWeight: 700, lineHeight: 1.2, margin: 0 }}>Messages</h2>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '350px 1fr', 
        gap: '1rem', 
        height: 'calc(100vh - 200px)',
        border: '1px solid #e0e0e0',
        borderRadius: '12px',
        overflow: 'hidden',
        backgroundColor: '#fff'
      }}>
        {/* Conversations sidebar */}
        <div style={{ 
          borderRight: '1px solid #e0e0e0', 
          display: 'flex', 
          flexDirection: 'column',
          height: '100%'
        }}>
          <div style={{ padding: '1rem', borderBottom: '1px solid #e0e0e0' }}>
            <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Conversations</h3>
          </div>
          <ScrollArea style={{ flex: 1 }}>
            {conversations.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>
                <p>No conversations yet</p>
                <p style={{ fontSize: '0.9rem' }}>Visit a user's profile to start chatting</p>
              </div>
            ) : (
              conversations.map((conv) => {
                const otherUser = getOtherUser(conv);
                return (
                  <div
                    key={conv.id}
                    onClick={() => handleSelectConversation(conv.id)}
                    style={{
                      padding: '1rem',
                      cursor: 'pointer',
                      borderBottom: '1px solid #f0f0f0',
                      backgroundColor: selectedConversation?.id === conv.id ? '#f8f9fa' : 'transparent',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      if (selectedConversation?.id !== conv.id) {
                        e.currentTarget.style.backgroundColor = '#fafafa';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedConversation?.id !== conv.id) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <img
                        src={otherUser?.avatar_url || 'https://via.placeholder.com/40'}
                        alt={otherUser?.username}
                        style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '50%',
                          objectFit: 'cover'
                        }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>
                            {otherUser?.username || 'Unknown'}
                          </span>
                          {conv.unread_count > 0 && (
                            <span style={{
                              backgroundColor: '#1971c2',
                              color: '#fff',
                              borderRadius: '10px',
                              padding: '2px 8px',
                              fontSize: '0.75rem',
                              fontWeight: 600
                            }}>
                              {conv.unread_count}
                            </span>
                          )}
                        </div>
                        {conv.last_message && (
                          <div style={{
                            fontSize: '0.85rem',
                            color: '#666',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            marginTop: '0.25rem'
                          }}>
                            {conv.last_message.content}
                          </div>
                        )}
                        <div style={{ fontSize: '0.75rem', color: '#999', marginTop: '0.25rem' }}>
                          {conv.last_message ? formatTime(conv.last_message.created_at) : formatTime(conv.created_at)}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </ScrollArea>
        </div>

        {/* Messages area */}
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          {selectedConversation ? (
            <>
              {/* Header */}
              <div style={{
                padding: '1rem',
                borderBottom: '1px solid #e0e0e0',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}>
                {selectedConversation.participants
                  .filter(p => p.id !== user.id)
                  .map(p => (
                    <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <img
                        src={p.avatar_url || 'https://via.placeholder.com/40'}
                        alt={p.username}
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          objectFit: 'cover'
                        }}
                      />
                      <span style={{ fontWeight: 600, fontSize: '1.1rem' }}>{p.username}</span>
                    </div>
                  ))}
              </div>

              {/* Messages */}
              <ScrollArea style={{ flex: 1, padding: '1rem' }}>
                {messages.length === 0 ? (
                  <div style={{ textAlign: 'center', color: '#666', marginTop: '2rem' }}>
                    <p>No messages yet. Start the conversation!</p>
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isOwn = msg.sender_id === user.id;
                    return (
                      <div
                        key={msg.id}
                        style={{
                          display: 'flex',
                          justifyContent: isOwn ? 'flex-end' : 'flex-start',
                          marginBottom: '1rem'
                        }}
                      >
                        <div style={{
                          maxWidth: '70%',
                          display: 'flex',
                          gap: '0.5rem',
                          flexDirection: isOwn ? 'row-reverse' : 'row'
                        }}>
                          {!isOwn && (
                            <img
                              src={msg.sender?.avatar_url || 'https://via.placeholder.com/32'}
                              alt={msg.sender?.username}
                              style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                objectFit: 'cover'
                              }}
                            />
                          )}
                          <div>
                            <div style={{
                              backgroundColor: isOwn ? '#1971c2' : '#f1f3f5',
                              color: isOwn ? '#fff' : '#000',
                              padding: '0.75rem 1rem',
                              borderRadius: '12px',
                              wordWrap: 'break-word'
                            }}>
                              {msg.content}
                            </div>
                            <div style={{
                              fontSize: '0.75rem',
                              color: '#999',
                              marginTop: '0.25rem',
                              textAlign: isOwn ? 'right' : 'left'
                            }}>
                              {formatTime(msg.created_at)}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </ScrollArea>

              {/* Input */}
              <div style={{
                padding: '1rem',
                borderTop: '1px solid #e0e0e0',
                backgroundColor: '#fafafa'
              }}>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end' }}>
                  <textarea
                    ref={textareaRef}
                    value={messageText}
                    onChange={(e) => {
                      setMessageText(e.target.value);
                      e.target.style.height = 'auto';
                      e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder="Type a message..."
                    disabled={sending}
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                      fontSize: '0.95rem',
                      resize: 'none',
                      fontFamily: 'inherit',
                      minHeight: '44px',
                      maxHeight: '120px'
                    }}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!messageText.trim() || sending}
                    style={{
                      padding: '0.75rem 1.5rem',
                      backgroundColor: messageText.trim() && !sending ? '#1971c2' : '#ccc',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: messageText.trim() && !sending ? 'pointer' : 'not-allowed',
                      fontWeight: 600,
                      fontSize: '0.95rem',
                      height: '44px'
                    }}
                  >
                    Send
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              color: '#666'
            }}>
              <div style={{ textAlign: 'center' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ opacity: 0.3 }}>
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                <p style={{ marginTop: '1rem', fontSize: '1.1rem' }}>Select a conversation to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </main>
  );
}

export default Messages;
