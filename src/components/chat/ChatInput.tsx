import React, { useState, KeyboardEvent } from 'react';
import { Button } from '../common';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

export const ChatInput: React.FC<ChatInputProps> = ({ 
  onSendMessage, 
  isLoading = false, 
  disabled = false,
  placeholder = "Ask a question about your project...",
  className = '' 
}) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    const trimmedMessage = message.trim();
    if (trimmedMessage && !isLoading && !disabled) {
      onSendMessage(trimmedMessage);
      setMessage('');
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const isMessageValid = message.trim().length > 0 && message.trim().length <= 4000;

  return (
    <div className={`border-t border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800 ${className}`}>
      <div className="flex space-x-3">
        {/* Message Input */}
        <div className="flex-1">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            disabled={disabled || isLoading}
            rows={1}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 
                     placeholder-gray-500 dark:placeholder-gray-400
                     resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 
                     focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ minHeight: '44px', maxHeight: '120px' }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = 'auto';
              target.style.height = Math.min(target.scrollHeight, 120) + 'px';
            }}
          />
          
          {/* Character count */}
          <div className="flex justify-between items-center mt-2">
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {message.length}/4000
            </div>
            {message.length > 4000 && (
              <div className="text-xs text-red-500">
                Message too long
              </div>
            )}
          </div>
        </div>
        
        {/* Send Button */}
        <div className="flex-shrink-0">
          <Button
            onClick={handleSend}
            disabled={!isMessageValid || isLoading || disabled}
            className={`h-11 px-6 ${
              isMessageValid && !isLoading && !disabled
                ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Sending...</span>
              </div>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
              </svg>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;