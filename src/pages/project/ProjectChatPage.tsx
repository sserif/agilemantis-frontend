import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import LoadingIndicator from '../../components/common/LoadingIndicator';

const ProjectChatPage: React.FC = () => {
  const { teamId, projectId } = useParams<{ teamId: string; projectId: string }>();
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Placeholder project data
  const project = {
    id: projectId,
    name: 'Project Alpha',
  };

  // Placeholder chat messages
  const [messages] = useState([
    {
      id: '1',
      type: 'user',
      content: 'Can you help me understand the project structure?',
      timestamp: '10:30 AM',
      user: 'You',
    },
    {
      id: '2',
      type: 'ai',
      content: 'I\'d be happy to help! Based on the files in your project, I can see you have a React application with TypeScript. The main components appear to be organized in a standard structure with separate folders for components, pages, and utilities. Would you like me to explain any specific part in more detail?',
      timestamp: '10:31 AM',
      user: 'AI Assistant',
    },
    {
      id: '3',
      type: 'user',
      content: 'What files should I look at first to understand the authentication flow?',
      timestamp: '10:32 AM',
      user: 'You',
    },
    {
      id: '4',
      type: 'ai',
      content: 'For understanding the authentication flow, I recommend starting with these files:\n\n1. `src/context/AuthContext.tsx` - Contains the authentication state management\n2. `src/pages/auth/LoginPage.tsx` - The login component\n3. `src/api/auth.ts` - API calls for authentication\n\nThese files will give you a good overview of how user authentication is handled in the application.',
      timestamp: '10:33 AM',
      user: 'AI Assistant',
    },
  ]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsLoading(true);
    // Simulate AI response
    setTimeout(() => {
      setIsLoading(false);
      setMessage('');
    }, 1000);
  };

  const handleFileAttach = () => {
    console.log('File attachment - will be implemented in future story');
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {project.name} Chat
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Ask questions about your project files and get AI-powered insights
            </p>
          </div>

          {/* Quick Navigation */}
          <div className="flex space-x-4">
            <Link
              to={`/teams/${teamId}/projects/${projectId}`}
              className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Overview
            </Link>
            <Link
              to={`/teams/${teamId}/projects/${projectId}/chat`}
              className="px-4 py-2 text-sm font-medium text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900 rounded-lg"
            >
              Chat
            </Link>
            <Link
              to={`/teams/${teamId}/projects/${projectId}/files`}
              className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Files
            </Link>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Main Chat */}
        <div className="flex-1 flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-3xl flex ${msg.type === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start space-x-3`}>
                  <div className="flex-shrink-0">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${msg.type === 'user'
                      ? 'bg-primary-600'
                      : 'bg-primary-600'
                      }`}>
                      {msg.type === 'user' ? 'Y' : 'AI'}
                    </div>
                  </div>
                  <div className={`flex flex-col ${msg.type === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`px-4 py-2 rounded-lg ${msg.type === 'user'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                      }`}>
                      <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {msg.user} • {msg.timestamp}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-3xl flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white text-sm font-medium">
                      AI
                    </div>
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-lg">
                    <LoadingIndicator size="sm" text="" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="flex-shrink-0 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
            <form onSubmit={handleSendMessage} className="flex space-x-4">
              <button
                type="button"
                onClick={handleFileAttach}
                className="flex-shrink-0 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd"></path>
                </svg>
              </button>
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ask a question about your project..."
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 pr-12"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={!message.trim() || isLoading}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path>
                  </svg>
                </button>
              </div>
            </form>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              AI responses are based on your project files and context. File attachment feature coming soon.
            </p>
          </div>
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
                23 files available for context
              </p>
            </div>
          </div>

          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
              Suggested Questions
            </h4>
            <div className="space-y-2">
              {[
                'What is the overall architecture?',
                'How do I run this project?',
                'What are the main dependencies?',
                'How is error handling implemented?',
              ].map((question, index) => (
                <button
                  key={index}
                  onClick={() => setMessage(question)}
                  className="w-full text-left p-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-white dark:hover:bg-gray-800 rounded border border-gray-200 dark:border-gray-700"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectChatPage;
