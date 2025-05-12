import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Send, Edit, Trash2, Reply } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface ChatMessage {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  is_edited: boolean;
  parent_id: string | null;
  profiles?: {
    first_name: string | null;
    last_name: string | null;
    avatar_url: string | null;
  } | null;
}

interface ChatInterfaceProps {
  groupId: string;
}

export const ChatInterface = ({ groupId }: ChatInterfaceProps) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [replyTo, setReplyTo] = useState<ChatMessage | null>(null);
  const [editMessage, setEditMessage] = useState<ChatMessage | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Fetch initial messages
  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      
      try {
        const { data, error } = await supabase
          .from('chat_messages')
          .select(`
            id,
            content,
            created_at,
            user_id,
            is_edited,
            parent_id,
            profiles:user_id(first_name, last_name, avatar_url)
          `)
          .eq('group_id', groupId)
          .order('created_at', { ascending: true });
          
        if (error) throw error;
        
        // Filter out any items with error in profiles
        const validData = data?.filter(item => 
          !item.profiles || typeof item.profiles !== 'string'
        ) as ChatMessage[];
        
        setMessages(validData || []);
      } catch (error) {
        console.error('Error fetching messages:', error);
        toast.error('Failed to load messages');
      } finally {
        setLoading(false);
      }
    };
    
    fetchMessages();
    
    // Subscribe to new messages
    const channel = supabase
      .channel('chat_messages_channel')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'chat_messages',
          filter: `group_id=eq.${groupId}`
        }, 
        async (payload) => {
          // When a new message arrives, fetch its profile data
          try {
            const { data, error } = await supabase
              .from('profiles')
              .select('first_name, last_name, avatar_url')
              .eq('id', payload.new.user_id)
              .single();
              
            if (!error && data) {
              const newMsg = {
                ...payload.new,
                profiles: data
              } as ChatMessage;
              
              setMessages(prev => [...prev, newMsg]);
            }
          } catch (err) {
            console.error('Error processing new message:', err);
          }
        }
      )
      .on('postgres_changes', 
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'chat_messages',
          filter: `group_id=eq.${groupId}`
        }, 
        (payload) => {
          setMessages(prev => 
            prev.map(msg => 
              msg.id === payload.new.id 
                ? { ...msg, ...payload.new } 
                : msg
            )
          );
        }
      )
      .on('postgres_changes', 
        { 
          event: 'DELETE', 
          schema: 'public', 
          table: 'chat_messages',
          filter: `group_id=eq.${groupId}`
        }, 
        (payload) => {
          setMessages(prev => 
            prev.filter(msg => msg.id !== payload.old.id)
          );
        }
      )
      .subscribe();
      
    // Cleanup
    return () => {
      supabase.removeChannel(channel);
    };
  }, [groupId]);
  
  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Update user activity
  useEffect(() => {
    const updateUserActivity = async () => {
      if (!user) return;
      
      try {
        const { error } = await supabase.rpc('update_user_activity', {
          user_id: user.id,
          group_id: groupId
        });
        
        if (error) console.error('Error updating user activity:', error);
      } catch (error) {
        console.error('Error updating user activity:', error);
      }
    };
    
    updateUserActivity();
  }, [user, groupId]);
  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !newMessage.trim()) return;
    
    try {
      setSending(true);
      
      // If editing an existing message
      if (editMessage) {
        const { error } = await supabase
          .from('chat_messages')
          .update({ 
            content: newMessage,
            is_edited: true,
            updated_at: new Date().toISOString()
          })
          .eq('id', editMessage.id);
          
        if (error) throw error;
        
        setEditMessage(null);
        toast.success('Message updated');
      } 
      // Sending a new message
      else {
        const { error } = await supabase
          .from('chat_messages')
          .insert({
            group_id: groupId,
            user_id: user.id,
            content: newMessage,
            parent_id: replyTo?.id || null
          });
          
        if (error) throw error;
        
        // Update messages sent count
        await supabase
          .from('user_activity')
          .upsert({
            user_id: user.id,
            messages_sent: messages.filter(m => m.user_id === user.id).length + 1,
            last_active: new Date().toISOString(),
            activity_points: messages.filter(m => m.user_id === user.id).length * 5 + 10
          });
      }
      
      setNewMessage('');
      setReplyTo(null);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };
  
  const handleEditMessage = (message: ChatMessage) => {
    setEditMessage(message);
    setNewMessage(message.content);
    setReplyTo(null);
  };
  
  const handleDeleteMessage = async (messageId: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('chat_messages')
        .delete()
        .eq('id', messageId);
        
      if (error) throw error;
      
      toast.success('Message deleted');
    } catch (error) {
      console.error('Error deleting message:', error);
      toast.error('Failed to delete message');
    }
  };
  
  const handleReply = (message: ChatMessage) => {
    setReplyTo(message);
    setEditMessage(null);
  };
  
  const cancelAction = () => {
    setEditMessage(null);
    setReplyTo(null);
    setNewMessage('');
  };
  
  const getInitials = (message: ChatMessage) => {
    if (!message.profiles) return 'U';
    const firstName = message.profiles.first_name || '';
    const lastName = message.profiles.last_name || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || 'U';
  };
  
  const getReplyMessage = (parentId: string | null) => {
    if (!parentId) return null;
    return messages.find(msg => msg.id === parentId);
  };
  
  return (
    <div className="flex flex-col h-[80vh] glass-card">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="animate-spin h-8 w-8 text-primary" />
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center text-muted-foreground h-full flex items-center justify-center">
            <p>No messages yet. Be the first to start the conversation!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => {
              const isCurrentUser = user?.id === message.user_id;
              const replyMessage = getReplyMessage(message.parent_id);
              
              return (
                <div
                  key={message.id}
                  className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div className="flex max-w-[80%]">
                    {!isCurrentUser && (
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarImage src={message.profiles?.avatar_url || ''} />
                        <AvatarFallback>{getInitials(message)}</AvatarFallback>
                      </Avatar>
                    )}
                    
                    <div>
                      {replyMessage && (
                        <div className="px-3 py-2 rounded-t-lg bg-muted/30 text-xs border-l-2 border-primary/50 ml-2 mb-1">
                          <p className="font-semibold">
                            {replyMessage.user_id === user?.id ? 'You' : 
                              `${replyMessage.profiles?.first_name || ''} ${replyMessage.profiles?.last_name || ''}`}
                          </p>
                          <p className="truncate">{replyMessage.content}</p>
                        </div>
                      )}
                      
                      <div
                        className={`px-4 py-2 rounded-lg ${
                          isCurrentUser
                            ? 'bg-primary text-primary-foreground rounded-tr-none'
                            : 'bg-muted rounded-tl-none'
                        } shadow-sm`}
                      >
                        {!isCurrentUser && (
                          <p className="font-semibold text-xs mb-1">
                            {message.profiles?.first_name || ''} {message.profiles?.last_name || ''}
                          </p>
                        )}
                        <p>{message.content}</p>
                        <div className="flex items-center justify-end gap-2 mt-1">
                          <span className="text-xs opacity-70">
                            {format(new Date(message.created_at), 'p')}
                            {message.is_edited && ' (edited)'}
                          </span>
                        </div>
                      </div>
                      
                      {isCurrentUser && (
                        <div className="flex justify-end space-x-2 mt-1">
                          <button 
                            onClick={() => handleEditMessage(message)}
                            className="text-xs opacity-70 hover:opacity-100"
                          >
                            <Edit className="h-3 w-3" />
                          </button>
                          <button 
                            onClick={() => handleDeleteMessage(message.id)}
                            className="text-xs opacity-70 hover:opacity-100"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                          <button 
                            onClick={() => handleReply(message)}
                            className="text-xs opacity-70 hover:opacity-100"
                          >
                            <Reply className="h-3 w-3" />
                          </button>
                        </div>
                      )}
                    </div>
                    
                    {isCurrentUser && (
                      <Avatar className="h-8 w-8 ml-2">
                        <AvatarImage src={message.profiles?.avatar_url || ''} />
                        <AvatarFallback>{getInitials(message)}</AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      
      {/* Action bar - shows what user is doing */}
      {(editMessage || replyTo) && (
        <div className="px-4 py-2 bg-muted/30 flex items-center justify-between">
          <div>
            {editMessage ? (
              <span>Editing message</span>
            ) : (
              <span>
                Replying to{' '}
                <strong>
                  {replyTo?.user_id === user?.id 
                    ? 'yourself' 
                    : `${replyTo?.profiles?.first_name || ''} ${replyTo?.profiles?.last_name || ''}`}
                </strong>
              </span>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={cancelAction}
          >
            Cancel
          </Button>
        </div>
      )}
      
      {/* Message input */}
      <form onSubmit={handleSendMessage} className="p-4 border-t border-border flex gap-2">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="bg-background"
          disabled={!user || sending}
        />
        <Button type="submit" disabled={!newMessage.trim() || sending || !user}>
          {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </Button>
      </form>
    </div>
  );
};
