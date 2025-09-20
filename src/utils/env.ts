interface EnvironmentConfig {
  appTitle: string;
  apiBaseUrl: string;
  auth0Domain: string;
  auth0ClientId: string;
  auth0Audience?: string;
  auth0RedirectUri: string;
  environment: 'development' | 'production' | 'test';
  logLevel: 'debug' | 'info' | 'warn' | 'error';
}

class Environment {
  private config: EnvironmentConfig;

  constructor() {
    this.config = {
      appTitle: this.getEnvVar('VITE_APP_TITLE', 'Agile Mantis'),
      apiBaseUrl: this.getEnvVar('VITE_API_BASE_URL', 'https://mantis-api.azurewebsites.net/api'),
      auth0Domain: this.getEnvVar('VITE_AUTH0_DOMAIN'),
      auth0ClientId: this.getEnvVar('VITE_AUTH0_CLIENT_ID'),
      auth0Audience: this.getOptionalEnvVar('VITE_AUTH0_AUDIENCE'),
      auth0RedirectUri: this.getEnvVar('VITE_AUTH0_REDIRECT_URI', 'http://localhost:5173/callback'),
      environment: this.getEnvVar('VITE_ENVIRONMENT', 'development') as EnvironmentConfig['environment'],
      logLevel: this.getEnvVar('VITE_LOG_LEVEL', 'info') as EnvironmentConfig['logLevel'],
    };

    this.validateRequiredVars();
  }

  private getEnvVar(key: string, defaultValue?: string): string {
    const value = import.meta.env[key] || defaultValue;
    if (!value) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
    return value;
  }

  private getOptionalEnvVar(key: string): string | undefined {
    return import.meta.env[key] || undefined;
  }

  private validateRequiredVars(): void {
    const requiredVars = [
      'auth0Domain',
      'auth0ClientId',
    ];

    const missing = requiredVars.filter(key => !this.config[key as keyof EnvironmentConfig]);

    if (missing.length > 0) {
      console.warn(`Missing environment variables: ${missing.join(', ')}`);
      console.warn('Some features may not work correctly.');
    }
  }

  get(): EnvironmentConfig {
    return { ...this.config };
  }

  get apiBaseUrl(): string {
    return this.config.apiBaseUrl;
  }

  get appTitle(): string {
    return this.config.appTitle;
  }

  get auth0Domain(): string {
    return this.config.auth0Domain;
  }

  get auth0ClientId(): string {
    return this.config.auth0ClientId;
  }

  get auth0Audience(): string | undefined {
    return this.config.auth0Audience;
  }

  get auth0RedirectUri(): string {
    return this.config.auth0RedirectUri;
  }

  get environment(): EnvironmentConfig['environment'] {
    return this.config.environment;
  }

  get logLevel(): EnvironmentConfig['logLevel'] {
    return this.config.logLevel;
  }

  isDevelopment(): boolean {
    return this.config.environment === 'development';
  }

  isProduction(): boolean {
    return this.config.environment === 'production';
  }

  isTest(): boolean {
    return this.config.environment === 'test';
  }
}

export const env = new Environment();
export default env;