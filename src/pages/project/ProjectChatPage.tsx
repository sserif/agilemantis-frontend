import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useProject } from '../../context/ProjectContext';
import { useTeam } from '../../context/TeamContext';
import LoadingIndicator from '../../components/common/LoadingIndicator';
import { ProjectHeader, ProjectThreads } from '../../components/project';
import { ChatBubble, ChatInput } from '../../components/chat';
import { chatApi } from '../../api/chat';
import { threadsApi } from '../../api/threads';
import { runsApi } from '../../api/runs';
import { ChatMessage, ThreadMessage, RunStatus } from '../../types/project';
import { ChatResponse } from '../../types/chat';

const ProjectChatPage: React.FC = () => {
  const { teamId, projectId } = useParams<{ teamId: string; projectId: string }>();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [currentThreadId, setCurrentThreadId] = useState<string | undefined>();
  const [selectedThreadId, setSelectedThreadId] = useState<string | undefined>();
  const [isLoadingThread, setIsLoadingThread] = useState(false);
  const [isCreatingRun, setIsCreatingRun] = useState(false);
  const [currentRunId, setCurrentRunId] = useState<string | undefined>();
  const [runStatus, setRunStatus] = useState<RunStatus | undefined>();
  const [isFirstMessageInThread, setIsFirstMessageInThread] = useState(false);
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

  // Initialize with welcome message only when no thread is selected
  useEffect(() => {
    if (project && messages.length === 0 && !selectedThreadId && !isLoadingThread) {
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
  }, [project, messages.length, selectedThreadId, isLoadingThread]);

  // Handle thread selection from the threads widget
  const handleThreadSelect = async (threadId: string) => {
    if (threadId === selectedThreadId) return; // Already selected
    if (!teamId || !projectId) return;
    
    // Set selected thread and start loading
    setSelectedThreadId(threadId);
    setIsLoadingThread(true);
    setError(undefined);
    setIsFirstMessageInThread(true); // Mark that the next message will be the first in this thread
    
    try {
      // Fetch thread details with all messages
      const threadDetails = await threadsApi.getThreadDetails(teamId, projectId, threadId);
      
      // Convert ThreadMessage[] to ChatMessage[] format
      const threadMessages: ChatMessage[] = threadDetails.messages.map((msg: ThreadMessage) => ({
        id: msg.messageId,
        projectId: projectId,
        userId: msg.userId || 'assistant',
        content: msg.content,
        type: msg.role === 'user' ? 'user' : 'agent' as 'user' | 'agent',
        createdAt: msg.createdAt,
      }));
      
      // Set the thread messages and update current thread ID
      setMessages(threadMessages);
      setCurrentThreadId(threadId);
      
    } catch (error: any) {
      console.error('Error loading thread details:', error);
      setError(error.message || 'Failed to load thread messages');
      
      // Show error message
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        projectId: projectId,
        userId: 'system',
        content: `Failed to load thread messages: ${error.message || 'Unknown error'}`,
        type: 'agent',
        createdAt: new Date().toISOString(),
      };
      setMessages([errorMessage]);
    } finally {
      setIsLoadingThread(false);
    }
  };

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
      // Use selectedThreadId if available, otherwise currentThreadId
      const threadId = selectedThreadId || currentThreadId;
      
      // Check if this is the first message in an existing thread (thread continuation)
      if (isFirstMessageInThread && selectedThreadId) {
        console.log('Creating run for existing thread:', { teamId, projectId, threadId: selectedThreadId, message: messageContent });
        
        // Step 1: Create a run for the existing thread
        setIsCreatingRun(true);
        setRunStatus('queued');
        
        const runResponse = await runsApi.createAndMonitorRun(
          teamId,
          projectId,
          selectedThreadId,
          {
            message: messageContent,
            instructions: 'Provide detailed explanations with code examples where applicable.'
          },
          {
            maxAttempts: 30,
            pollInterval: 2000,
            onStatusUpdate: (status, runData) => {
              console.log(`Run ${runData.runId} status: ${status}`);
              setRunStatus(status);
            }
          }
        );

        console.log('Run completed:', runResponse);
        
        // Step 2: Once run is completed, fetch updated thread messages
        const threadDetails = await threadsApi.getThreadDetails(teamId, projectId, selectedThreadId);
        
        // Convert ThreadMessage[] to ChatMessage[] format
        const threadMessages: ChatMessage[] = threadDetails.messages.map((msg: ThreadMessage) => ({
          id: msg.messageId,
          projectId: projectId,
          userId: msg.userId || 'assistant',
          content: msg.content,
          type: msg.role === 'user' ? 'user' : 'agent' as 'user' | 'agent',
          createdAt: msg.createdAt,
        }));
        
        // Update messages and thread state
        setMessages(threadMessages);
        setCurrentThreadId(selectedThreadId);
        setCurrentRunId(runResponse.runId);
        setIsFirstMessageInThread(false); // No longer first message
        
      } else {
        // Normal chat flow for new threads or continuation after run is established
        console.log('Sending message to AI:', { teamId, projectId, message: messageContent, threadId });
        
        const response: ChatResponse = await chatApi.sendMessage(teamId, projectId, {
          message: messageContent,
          threadId,
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
        if (response.isNewThread || !threadId) {
          setCurrentThreadId(response.threadId);
          setSelectedThreadId(response.threadId);
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
      }

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
      setIsCreatingRun(false);
      
      // If we have a run ID and it completed successfully, show completion briefly
      if (currentRunId && !error) {
        setRunStatus('completed');
        setTimeout(() => {
          setRunStatus(undefined);
          setCurrentRunId(undefined);
        }, 2000);
      } else {
        // Clear immediately if there was an error or no run
        setRunStatus(undefined);
        setCurrentRunId(undefined);
      }
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

  return (
    <div className="h-full flex flex-col -m-4 lg:-m-6" style={{ height: 'calc(100vh - 4rem)' }}>
      {/* Header */}
      <div className="flex-shrink-0 p-4 lg:p-6 pb-2">
        <ProjectHeader 
          project={project} 
          team={team} 
          currentTab="chat" 
          pageTitle={`${project.name} Chat`}
          pageDescription="Ask questions about your project files and get AI-powered insights"
        />
      </div>

      {/* Chat Area - Takes remaining height */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* Main Chat Container */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Messages Area - Scrollable */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6 bg-gray-50 dark:bg-gray-900">
            {/* Thread Context Indicator */}
            {selectedThreadId && !isLoadingThread && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
                <div className="flex items-center space-x-2 text-blue-700 dark:text-blue-300">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd"></path>
                  </svg>
                  <span className="text-sm font-medium">
                    Viewing thread: {selectedThreadId.slice(-8)}
                  </span>
                  <button
                    onClick={() => {
                      setSelectedThreadId(undefined);
                      setMessages([]);
                      setCurrentThreadId(undefined);
                      setIsFirstMessageInThread(false);
                    }}
                    className="ml-auto text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 text-sm"
                  >
                    Start new conversation
                  </button>
                </div>
              </div>
            )}

            {/* Run Status Indicator */}
            {(isCreatingRun || runStatus) && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-4">
                <div className="flex items-center space-x-2 text-yellow-700 dark:text-yellow-300">
                  {runStatus === 'queued' && (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="text-sm font-medium">⏳ Your request is queued...</span>
                    </>
                  )}
                  {runStatus === 'in_progress' && (
                    <>
                      <svg className="w-4 h-4 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"></path>
                      </svg>
                      <span className="text-sm font-medium">🤖 Assistant is processing your request...</span>
                    </>
                  )}
                  {runStatus === 'completed' && (
                    <>
                      <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                      </svg>
                      <span className="text-sm font-medium text-green-600">✅ Response ready!</span>
                    </>
                  )}
                  {runStatus === 'failed' && (
                    <>
                      <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path>
                      </svg>
                      <span className="text-sm font-medium text-red-600">❌ Something went wrong</span>
                    </>
                  )}
                  {runStatus === 'expired' && (
                    <>
                      <svg className="w-4 h-4 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"></path>
                      </svg>
                      <span className="text-sm font-medium text-orange-600">⏰ Request timed out</span>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Thread Loading Indicator */}
            {isLoadingThread && (
              <div className="flex justify-center items-center py-8">
                <LoadingIndicator size="md" text="Loading thread messages..." />
              </div>
            )}

            {/* Messages */}
            {!isLoadingThread && messages.map((message) => (
              <ChatBubble key={message.id} message={message} />
            ))}
            
            {/* Typing Indicator */}
            {!isLoadingThread && isTyping && (
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

          {/* Fixed Input Area at Bottom */}
          <div className="flex-shrink-0 border-t border-gray-200 dark:border-gray-700">
            <ChatInput
              onSendMessage={handleSendMessage}
              isLoading={isLoading || isCreatingRun || runStatus === 'queued' || runStatus === 'in_progress'}
              disabled={!project || isCreatingRun || runStatus === 'queued' || runStatus === 'in_progress'}
              placeholder={
                runStatus === 'queued' || runStatus === 'in_progress' 
                  ? "Please wait for the assistant to finish processing..." 
                  : selectedThreadId 
                    ? "Continue the conversation..." 
                    : "Ask a question about your project files..."
              }
            />
          </div>
        </div>

        {/* Project Threads Sidebar - Fixed width and scrollable */}
        <div className="flex-shrink-0">
          <ProjectThreads
            teamId={teamId!}
            projectId={projectId!}
            currentThreadId={selectedThreadId}
            onThreadSelect={handleThreadSelect}
            className="h-full"
          />
        </div>
      </div>
    </div>
  );
};

export default ProjectChatPage;
