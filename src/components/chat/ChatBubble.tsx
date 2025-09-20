import React from 'react';
import { ChatMessage } from '../../types/project';
import { TypingIndicator, MarkdownRenderer } from '../common';

interface ChatBubbleProps {
  message?: ChatMessage;
  isTyping?: boolean;
  className?: string;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ 
  message, 
  isTyping = false, 
  className = '' 
}) => {
  // Handle typing indicator for AI
  if (isTyping) {
    return (
      <div className={`flex items-start space-x-3 ${className}`}>
        <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
          AI
        </div>
        <div className="flex-1">
          <div className="bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-3 max-w-md">
            <TypingIndicator />
          </div>
        </div>
      </div>
    );
  }

  if (!message) return null;

  const isUser = message.type === 'user';

  return (
    <div className={`flex items-start space-x-3 ${isUser ? 'flex-row-reverse space-x-reverse' : ''} ${className}`}>
      {/* Avatar */}
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold ${
        isUser 
          ? 'bg-green-600' 
          : 'bg-blue-600'
      }`}>
        {isUser ? 'U' : 'AI'}
      </div>
      
      {/* Message Content */}
      <div className="flex-1 max-w-3xl">
        <div className={`rounded-lg px-4 py-3 ${
          isUser 
            ? 'bg-green-600 text-white' 
            : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
        }`}>
          {isUser ? (
            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
          ) : (
            <div className="text-sm">
              <MarkdownRenderer content={message.content} />
            </div>
          )}
        </div>
        
        {/* Timestamp */}
        <div className={`text-xs text-gray-500 dark:text-gray-400 mt-1 ${
          isUser ? 'text-right' : 'text-left'
        }`}>
          {new Date(message.createdAt).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </div>
      </div>
    </div>
  );
};

export default ChatBubble;