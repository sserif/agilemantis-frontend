import { lazy, ComponentType, LazyExoticComponent, createElement } from 'react';

/**
 * Utility function to create lazy-loaded route components with error handling
 */
export function createLazyRoute<T extends ComponentType<Record<string, unknown>>>(
  importFunction: () => Promise<{ default: T }>
): LazyExoticComponent<T> {
  return lazy(() =>
    importFunction().catch((error) => {
      console.error('Failed to load route component:', error);
      // Return a fallback component in case of loading failure
      return {
        default: (() =>
          createElement('div', { className: 'min-h-screen flex items-center justify-center' },
            createElement('div', { className: 'text-center' },
              createElement('h2', { className: 'text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2' },
                'Failed to load page'
              ),
              createElement('p', { className: 'text-gray-600 dark:text-gray-400 mb-4' },
                'There was an error loading this page. Please try refreshing.'
              ),
              createElement('button', {
                className: 'btn btn-primary',
                onClick: () => window.location.reload()
              }, 'Refresh Page')
            )
          )
        ) as unknown as T,
      };
    })
  );
}

/**
 * Preload a lazy component
 */
export function preloadRoute(lazyComponent: LazyExoticComponent<ComponentType<Record<string, unknown>>>): void {
  // Trigger the import to preload the component
  try {
    const payload = (lazyComponent as unknown as Record<string, unknown>)._payload;
    if (payload && typeof payload === 'object') {
      const payloadObj = payload as Record<string, unknown>;
      payloadObj._result = payloadObj._result || Promise.resolve();
    }
  } catch (error) {
    // Silently fail if unable to preload
    console.debug('Unable to preload component:', error);
  }
}

export default createLazyRoute;
