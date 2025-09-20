import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useProject } from '../../context/ProjectContext';
import { useTeam } from '../../context/TeamContext';
import LoadingIndicator from '../../components/common/LoadingIndicator';
import { ProjectHeader } from '../../components/project';
import { ChatBubble, ChatInput } from '../../components/chat';
import { chatApi } from '../../api/chat';
import { ChatMessage } from '../../types/project';
import { ChatResponse } from '../../types/chat';

const ProjectChatPage: React.FC = () => {
  const { teamId, projectId } = useParams<{ teamId: string; projectId: string }>();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [currentThreadId, setCurrentThreadId] = useState<string | undefined>();
  const [error, setError] = useState<string | undefined>();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { projects, fetchProjects, isLoading: projectsLoading } = useProject();
  const { teams } = useTeam();

  // Find the current project
  const project = projects.find(p => p.id === projectId && p.teamId === teamId);
  const team = teams.find(t => t.id === teamId);

  // Load projects for this team if not already loaded
  useEffect(() => {
    if (teamId && (!projects.some(p => p.teamId === teamId))) {
      fetchProjects(teamId);
    }
  }, [teamId, projects]); // Removed fetchProjects from dependencies

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Initialize with welcome message
  useEffect(() => {
    if (project && messages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: 'welcome',
        projectId: project.id,
        userId: 'system',
        content: `Hello! I'm your AI assistant for the "${project.name}" project. I have access to all your project files and can help you understand the codebase, answer questions, and provide insights. What would you like to know?`,
        type: 'agent',
        createdAt: new Date().toISOString(),
      };
      setMessages([welcomeMessage]);
    }
  }, [project, messages.length]);

  const handleSendMessage = async (messageContent: string) => {
    if (!teamId || !projectId || !messageContent.trim()) return;

    // Create user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      projectId: projectId,
      userId: 'current-user', // This would come from auth context in real app
      content: messageContent.trim(),
      type: 'user',
      createdAt: new Date().toISOString(),
    };

    // Add user message to chat
    setMessages(prev => [...prev, userMessage]);
    setError(undefined);
    setIsLoading(true);
    setIsTyping(true);

    try {
      console.log('Sending message to AI:', { teamId, projectId, message: messageContent, threadId: currentThreadId });
      
      // Call the chat API
      const response: ChatResponse = await chatApi.sendMessage(teamId, projectId, {
        message: messageContent,
        threadId: currentThreadId,
      });

      console.log('Chat API response:', response);

      // Validate response structure
      if (!response || typeof response !== 'object') {
        throw new Error('Invalid response format from chat API');
      }

      if (!response.response || !response.threadId) {
        throw new Error('Missing required fields in chat response');
      }

      // Update thread ID if this is a new thread
      if (response.isNewThread || !currentThreadId) {
        setCurrentThreadId(response.threadId);
      }

      // Create AI response message
      const aiMessage: ChatMessage = {
        id: Date.now().toString() + '_ai',
        projectId: projectId,
        userId: 'ai-assistant',
        content: response.response,
        type: 'agent',
        createdAt: response.generatedAt || new Date().toISOString(),
      };

      // Add AI response to chat
      setMessages(prev => [...prev, aiMessage]);

    } catch (error: any) {
      console.error('Failed to send chat message:', error);
      
      // Get a user-friendly error message
      let errorText = 'Sorry, I encountered an error while processing your message. Please try again.';
      
      if (error?.message) {
        if (error.message.includes('Chat endpoint not found')) {
          errorText = '🚧 The chat feature is not available yet. The backend endpoint may still be in development.';
        } else if (error.message.includes('permission')) {
          errorText = 'You don\'t have permission to chat with this project. Please contact your team administrator.';
        } else if (error.message.includes('Invalid message')) {
          errorText = 'Invalid message format. Please check your message and try again.';
        } else {
          errorText = error.message;
        }
      }
      
      // Create error message
      const errorMessage: ChatMessage = {
        id: Date.now().toString() + '_error',
        projectId: projectId,
        userId: 'system',
        content: errorText,
        type: 'agent',
        createdAt: new Date().toISOString(),
      };

      setMessages(prev => [...prev, errorMessage]);
      setError(errorText);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  if (projectsLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingIndicator size="lg" text="Loading project chat..." />
      </div>
    );
  }

  if (!project || !team) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Project not found</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">The project you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  // Suggested questions for the sidebar
  const suggestedQuestions = [
    'What is the overall architecture of this project?',
    'How do I run and deploy this project?',
    'What are the main dependencies and their purposes?',
    'How is error handling implemented?',
    'What are the key components and their relationships?',
    'Are there any security considerations I should know about?',
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 mb-6">
        <ProjectHeader 
          project={project} 
          team={team} 
          currentTab="chat" 
          pageTitle={`${project.name} Chat`}
          pageDescription="Ask questions about your project files and get AI-powered insights"
        />
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Main Chat */}
        <div className="flex-1 flex flex-col">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50 dark:bg-gray-900">
            {messages.map((message) => (
              <ChatBubble key={message.id} message={message} />
            ))}
            
            {/* Typing Indicator */}
            {isTyping && (
              <ChatBubble isTyping={true} />
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-200 px-4 py-3 rounded">
                {error}
              </div>
            )}

            {/* Scroll anchor */}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <ChatInput
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            disabled={!project}
            placeholder="Ask a question about your project files..."
          />
        </div>

        {/* Sidebar */}
        <div className="w-80 border-l border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
            Context Files
          </h3>

          <div className="space-y-2">
            <div className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                </svg>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">All project files</span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {project.documents?.length || 0} files available for context
              </p>
            </div>
          </div>

          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
              Suggested Questions
            </h4>
            <div className="space-y-2">
              {suggestedQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleSendMessage(question)}
                  disabled={isLoading}
                  className="w-full text-left p-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-white dark:hover:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>

          {/* Thread Info */}
          {currentThreadId && (
            <div className="mt-6 p-3 bg-blue-50 dark:bg-blue-900 rounded-lg border border-blue-200 dark:border-blue-700">
              <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
                Active Conversation
              </h4>
              <p className="text-xs text-blue-700 dark:text-blue-200">
                Thread ID: {currentThreadId.slice(-8)}...
              </p>
              <p className="text-xs text-blue-600 dark:text-blue-300 mt-1">
                {messages.length} messages in this conversation
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectChatPage;
