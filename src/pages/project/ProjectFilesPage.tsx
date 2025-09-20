import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useProject } from '../../context/ProjectContext';
import { useTeam } from '../../context/TeamContext';
import { documentsApi } from '../../api/documents';
import LoadingIndicator from '../../components/common/LoadingIndicator';
import { StatusIndicator } from '../../components/common/StatusIndicator';
import { useDocumentStatusPolling } from '../../hooks/useDocumentStatusPolling';
import { ProjectDocument } from '../../types/project';
import { ProjectHeader } from '../../components/project';

const ProjectFilesPage: React.FC = () => {
  const { teamId, projectId } = useParams<{ teamId: string; projectId: string }>();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [documents, setDocuments] = useState<ProjectDocument[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoadingDocuments, setIsLoadingDocuments] = useState(false);
  const [pollingDocuments, setPollingDocuments] = useState<Set<string>>(new Set());
  const fileInputRef = useRef<HTMLInputElement>(null);
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
  }, [teamId, fetchProjects]); // Use fetchProjects in deps but it should be stable

  // Load documents for the project
  useEffect(() => {
    const loadDocuments = async () => {
      if (teamId && projectId) {
        setIsLoadingDocuments(true);
        try {
          console.log('Loading documents for:', { teamId, projectId });
          const response = await documentsApi.getDocuments(teamId, projectId);
          console.log('Documents API response:', response);
          
          // Handle different response formats
          let documentsData: ProjectDocument[] = [];
          
          console.log('Parsing response structure:', { 
            responseType: typeof response, 
            hasSuccess: 'success' in (response || {}),
            hasData: 'data' in (response || {}),
            hasDocuments: 'documents' in (response || {}),
            responseKeys: response ? Object.keys(response) : []
          });
          
          if (response && typeof response === 'object') {
            // Check if response directly has documents property (direct API response)
            if ('documents' in response && Array.isArray(response.documents)) {
              documentsData = response.documents.map((doc: any) => ({
                id: doc.fileId || doc.id,
                name: doc.fileName || doc.name,
                size: doc.fileSizeBytes || doc.size,
                type: doc.contentType || doc.type || 'unknown',
                url: doc.url || '',
                uploadedBy: doc.uploadedBy || 'Unknown',
                uploadedAt: doc.uploadedAt || new Date().toISOString(),
                content: doc.content,
                metadata: doc.metadata
              }));
              console.log('Found documents directly in response:', documentsData.length);
            }
            // Check if response has success and data properties (wrapped response)
            else if ('success' in response && response.success && 'data' in response) {
              if (response.data && typeof response.data === 'object' && 'documents' in response.data) {
                documentsData = Array.isArray(response.data.documents) ? response.data.documents.map((doc: any) => ({
                  id: doc.fileId || doc.id,
                  name: doc.fileName || doc.name,
                  size: doc.fileSizeBytes || doc.size,
                  type: doc.contentType || doc.type || 'unknown',
                  url: doc.url || '',
                  uploadedBy: doc.uploadedBy || 'Unknown',
                  uploadedAt: doc.uploadedAt || new Date().toISOString(),
                  content: doc.content,
                  metadata: doc.metadata
                })) : [];
                console.log('Found documents in response.data.documents:', documentsData.length);
              } else if (Array.isArray(response.data)) {
                documentsData = response.data.map((doc: any) => ({
                  id: doc.fileId || doc.id,
                  name: doc.fileName || doc.name,
                  size: doc.fileSizeBytes || doc.size,
                  type: doc.contentType || doc.type || 'unknown',
                  url: doc.url || '',
                  uploadedBy: doc.uploadedBy || 'Unknown',
                  uploadedAt: doc.uploadedAt || new Date().toISOString(),
                  content: doc.content,
                  metadata: doc.metadata
                }));
                console.log('Found documents in response.data:', documentsData.length);
              }
            }
            // Check if response has data property but no success flag
            else if ('data' in response && response.data && typeof response.data === 'object') {
              if ('documents' in response.data && Array.isArray(response.data.documents)) {
                documentsData = response.data.documents.map((doc: any) => ({
                  id: doc.fileId || doc.id,
                  name: doc.fileName || doc.name,
                  size: doc.fileSizeBytes || doc.size,
                  type: doc.contentType || doc.type || 'unknown',
                  url: doc.url || '',
                  uploadedBy: doc.uploadedBy || 'Unknown',
                  uploadedAt: doc.uploadedAt || new Date().toISOString(),
                  content: doc.content,
                  metadata: doc.metadata,
                  processingStatus: doc.processingStatus || 'completed'
                }));
                console.log('Found documents in response.data.documents (no success):', documentsData.length);
              } else if (Array.isArray(response.data)) {
                documentsData = response.data.map((doc: any) => ({
                  id: doc.fileId || doc.id,
                  name: doc.fileName || doc.name,
                  size: doc.fileSizeBytes || doc.size,
                  type: doc.contentType || doc.type || 'unknown',
                  url: doc.url || '',
                  uploadedBy: doc.uploadedBy || 'Unknown',
                  uploadedAt: doc.uploadedAt || new Date().toISOString(),
                  content: doc.content,
                  metadata: doc.metadata,
                  processingStatus: doc.processingStatus || 'completed'
                }));
                console.log('Found documents in response.data (no success):', documentsData.length);
              }
            }
            // Direct array response
            else if (Array.isArray(response)) {
              documentsData = response.map((doc: any) => ({
                id: doc.fileId || doc.id,
                name: doc.fileName || doc.name,
                size: doc.fileSizeBytes || doc.size,
                type: doc.contentType || doc.type || 'unknown',
                url: doc.url || '',
                uploadedBy: doc.uploadedBy || 'Unknown',
                uploadedAt: doc.uploadedAt || new Date().toISOString(),
                content: doc.content,
                metadata: doc.metadata,
                processingStatus: doc.processingStatus || 'completed'
              }));
              console.log('Found documents as direct array:', documentsData.length);
            }
          }
          
          console.log('Setting documents:', documentsData);
          setDocuments(documentsData);
        } catch (error) {
          console.error('Failed to load documents:', error);
          // Set empty array on error to show "no files" state
          setDocuments([]);
        } finally {
          setIsLoadingDocuments(false);
        }
      }
    };

    loadDocuments();
    }, [teamId, projectId]);

  // Function to start polling for a document's status
  const startDocumentPolling = (documentId: string) => {
    if (!teamId || !projectId) return;
    
    console.log('Starting status polling for document:', documentId);
    setPollingDocuments(prev => new Set(prev).add(documentId));

    const pollStatus = async () => {
      try {
        const response = await documentsApi.getDocumentStatus(teamId, projectId, documentId);
        console.log('Status polling response:', response);
        
        // Handle different response formats - check if status is directly on response or nested in data
        let statusData;
        if (response.data && typeof response.data === 'object' && 'status' in response.data) {
          statusData = response.data;
        } else if (response && typeof response === 'object' && 'status' in response) {
          statusData = response;
        } else {
          console.error('Unexpected status response format:', response);
          return false;
        }
        
        console.log('Extracted status data:', statusData);
        
        // Map backend status to frontend status
        let frontendStatus: 'processing' | 'failed' | 'completed';
        if (statusData.status === 'processed' || statusData.status === 'completed') {
          frontendStatus = 'completed';
        } else if (statusData.status === 'failed' || statusData.status === 'error') {
          frontendStatus = 'failed';
        } else {
          frontendStatus = 'processing';
        }
        
        // Update the document's status
        setDocuments(prev => prev.map(doc => 
          doc.id === documentId 
            ? { ...doc, processingStatus: frontendStatus }
            : doc
        ));

        // If completed or failed, stop polling
        if (frontendStatus === 'completed' || frontendStatus === 'failed') {
          setPollingDocuments(prev => {
            const newSet = new Set(prev);
            newSet.delete(documentId);
            return newSet;
          });
          return false; // Stop polling
        }
        
        return true; // Continue polling
      } catch (error) {
        console.error('Error polling document status:', error);
        setPollingDocuments(prev => {
          const newSet = new Set(prev);
          newSet.delete(documentId);
          return newSet;
        });
        return false; // Stop polling on error
      }
    };

    // Start polling
    const interval = setInterval(async () => {
      const shouldContinue = await pollStatus();
      if (!shouldContinue) {
        clearInterval(interval);
      }
    }, 2000);

    // Initial poll
    pollStatus();

    // Cleanup after 1 minute
    setTimeout(() => {
      clearInterval(interval);
      setPollingDocuments(prev => {
        const newSet = new Set(prev);
        newSet.delete(documentId);
        return newSet;
      });
    }, 60000);
  };

  if (projectsLoading || isLoadingDocuments) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingIndicator size="lg" text="Loading project files..." />
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

  // Use documents state with search filtering
  const files = documents.filter(doc => 
    searchQuery === '' || doc.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Debug logging
  console.log('Component state:', {
    documents: documents.length,
    files: files.length,
    searchQuery,
    isLoadingDocuments,
    teamId,
    projectId,
    documentsRaw: documents
  });

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !teamId || !projectId) return;

    // File size validation (50MB limit)
    const maxSize = 50 * 1024 * 1024; // 50MB in bytes
    if (file.size > maxSize) {
      alert(`File size too large. Maximum allowed size is 50MB. Your file is ${formatFileSize(file.size)}.`);
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    try {
      console.log('Uploading file:', { fileName: file.name, fileSize: file.size, fileType: file.type });
      
      const response = await documentsApi.uploadDocument(teamId, projectId, { 
        file,
        onProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percentage);
          }
        }
      });
      console.log('Upload API response:', response);
      
      // Based on Swagger docs, the API returns UploadDocumentResponse directly
      let newDocument: ProjectDocument | null = null;
      
      if (response && typeof response === 'object') {
        // Handle both wrapped and direct response formats
        const uploadResponse = response.data || response;
        
        if (uploadResponse && (uploadResponse.fileId || uploadResponse.fileName)) {
          newDocument = {
            id: uploadResponse.fileId,
            name: uploadResponse.fileName,
            size: uploadResponse.fileSizeBytes || file.size,
            type: uploadResponse.contentType || file.type,
            url: uploadResponse.url || '',
            uploadedBy: uploadResponse.uploadedBy || 'Unknown',
            uploadedAt: uploadResponse.uploadedAt || new Date().toISOString(),
            content: uploadResponse.content,
            metadata: uploadResponse.metadata,
            processingStatus: 'processing' // Start with processing status
          };
          
          console.log('Mapped upload response to document:', newDocument);
        }
      }
      
      if (newDocument) {
        console.log('Adding new document to list:', newDocument);
        setDocuments(prev => [...prev, newDocument!]);
        
        // Start polling for document processing status
        startDocumentPolling(newDocument.id);
        
        // Show success message
        const successMsg = `✅ File "${newDocument.name}" (${formatFileSize(newDocument.size)}) uploaded successfully! Processing...`;
        console.log(successMsg);
      } else {
        console.warn('Upload response did not contain expected document data:', response);
        alert('File uploaded but could not be displayed. Please refresh the page.');
      }
    } catch (error) {
      console.error('Failed to upload file:', error);
      
      // More detailed error handling
      if (error instanceof Error) {
        if (error.message.includes('timeout')) {
          alert(`❌ Upload timeout: File upload took too long. This usually happens with large files or slow internet connection. Please try again with a smaller file or check your connection.`);
        } else {
          alert(`❌ Failed to upload file: ${error.message}`);
        }
      } else {
        alert('❌ Failed to upload file. Please try again.');
      }
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDownload = async (fileId: string) => {
    if (!teamId || !projectId) return;
    
    try {
      const blob = await documentsApi.downloadDocument(teamId, projectId, fileId);
      const fileDocument = documents.find(doc => doc.id === fileId);
      const filename = fileDocument?.name || 'download';
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = window.document.createElement('a');
      link.href = url;
      link.download = filename;
      window.document.body.appendChild(link);
      link.click();
      
      // Cleanup
      window.URL.revokeObjectURL(url);
      window.document.body.removeChild(link);
    } catch (error) {
      console.error('Failed to download file:', error);
      alert('Failed to download file. Please try again.');
    }
  };

  const handleDelete = async (fileId: string) => {
    if (!window.confirm('Are you sure you want to delete this file?')) return;
    if (!teamId || !projectId) return;

    try {
      console.log('Deleting document:', fileId);
      const response = await documentsApi.deleteDocument(teamId, projectId, fileId);
      console.log('Delete response:', response);
      
      // Remove from local state regardless of response format
      setDocuments(prev => prev.filter(doc => doc.id !== fileId));
      
      // Show success message
      alert('✅ File deleted successfully!');
    } catch (error) {
      console.error('Failed to delete file:', error);
      if (error instanceof Error) {
        alert(`❌ Failed to delete file: ${error.message}`);
      } else {
        alert('❌ Failed to delete file. Please try again.');
      }
    }
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return (
          <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd"></path>
          </svg>
        );
      case 'sketch':
        return (
          <svg className="w-8 h-8 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd"></path>
          </svg>
        );
      case 'markdown':
        return (
          <svg className="w-8 h-8 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd"></path>
          </svg>
        );
      case 'powerpoint':
        return (
          <svg className="w-8 h-8 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd"></path>
          </svg>
        );
      case 'sql':
        return (
          <svg className="w-8 h-8 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd"></path>
          </svg>
        );
      default:
        return (
          <svg className="w-8 h-8 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd"></path>
          </svg>
        );
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <>
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        className="hidden"
        multiple={false}
        accept=".pdf,.doc,.docx,.txt,.md,.csv,.xlsx,.xls,.ppt,.pptx,.jpg,.jpeg,.png,.gif,.svg,.zip,.rar,.json,.xml,.html,.css,.js,.ts,.py,.sql"
      />
      
      {/* Project Header */}
      <ProjectHeader 
        project={project} 
        team={team} 
        currentTab="files" 
        pageTitle={`${project.name} Files`}
        pageDescription="Manage and organize your project files"
        actionButton={
          <button
            onClick={handleFileUpload}
            disabled={isUploading}
            className={`btn ${isUploading ? 'btn-secondary' : 'btn-primary'} ${isUploading ? 'cursor-not-allowed opacity-75' : ''}`}
          >
            {isUploading ? (
              <>
                <LoadingIndicator size="sm" text="" className="mr-2" />
                Uploading... {uploadProgress > 0 && `${uploadProgress}%`}
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                </svg>
                Upload Files
              </>
            )}
          </button>
        }
      />

      {/* Toolbar */}
      <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {files.length} documents {searchQuery && files.length !== documents.length && `(filtered from ${documents.length})`}
          </span>

          <div className="h-4 border-l border-gray-300 dark:border-gray-600"></div>

          <input
            type="text"
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded ${viewMode === 'list'
                ? 'bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400'
                : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
              }`}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path>
            </svg>
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded ${viewMode === 'grid'
                ? 'bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400'
                : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
              }`}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
            </svg>
          </button>
        </div>
      </div>

      {/* Files List */}
      {files.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No files</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Get started by uploading files to your project using the upload button above.</p>
        </div>
      ) : viewMode === 'list' ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Size
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Uploaded By
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Modified
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {files.map((file) => (
                <tr key={file.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 mr-3">
                        {getFileIcon(file.type)}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {file.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {formatFileSize(file.size)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusIndicator 
                      status={file.processingStatus || 'completed'} 
                      showLabel={false}
                      className="inline-flex"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {file.uploadedBy}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(file.uploadedAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleDownload(file.id)}
                        className="text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-300"
                      >
                        Download
                      </button>
                      <button
                        onClick={() => handleDelete(file.id)}
                        className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {files.map((file) => (
            <div key={file.id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:border-primary-300 dark:hover:border-primary-600 transition-colors duration-200">
              <div className="flex flex-col items-center text-center">
                <div className="mb-3">
                  {getFileIcon(file.type)}
                </div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate w-full mb-1">
                  {file.name}
                </h3>
                <div className="flex items-center justify-center mb-2">
                  <StatusIndicator 
                    status={file.processingStatus || 'completed'}
                    showLabel={false}
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  {formatFileSize(file.size)}
                </p>
                <div className="flex space-x-1 w-full">
                  <button
                    onClick={() => handleDownload(file.id)}
                    className="flex-1 text-xs btn btn-primary"
                  >
                    Download
                  </button>
                  <button
                    onClick={() => handleDelete(file.id)}
                    className="px-2 text-xs text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                  >
                    ×
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default ProjectFilesPage;
