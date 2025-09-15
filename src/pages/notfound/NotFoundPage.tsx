import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full space-y-8 text-center">
        {/* 404 Illustration */}
        <div className="space-y-4">
          <div className="text-6xl font-bold text-blue-600 dark:text-blue-400">
            404
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Page Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Sorry, we couldn't find the page you're looking for. It might have been moved, deleted, or you entered the wrong URL.
          </p>
        </div>

        {/* Illustration */}
        <div className="flex justify-center">
          <div className="w-64 h-64 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-full flex items-center justify-center">
            <div className="text-8xl opacity-50">
              🔍
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Go to Dashboard
            </Link>
            <button
              onClick={handleGoBack}
              className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
            >
              Go Back
            </button>
          </div>

          {/* Helpful Links */}
          <div className="text-sm text-gray-500 dark:text-gray-400">
            <p className="mb-2">Try these helpful links:</p>
            <div className="space-x-4">
              <Link
                to="/dashboard"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Dashboard
              </Link>
              <Link
                to="/teams"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Teams
              </Link>
              <Link
                to="/settings"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Settings
              </Link>
            </div>
          </div>
        </div>

        {/* Support Information */}
        <div className="pt-8 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Still having trouble? {' '}
            <a
              href="mailto:support@agilemantis.com"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
