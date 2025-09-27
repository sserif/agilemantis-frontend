# Auth0 Organization Selection - Universal Login Approach

## Overview
Instead of building a custom organization selector, we're using Auth0's Universal Login interface to handle organization selection. This provides a native, secure, and consistent experience.

## Configuration

### Auth0 Dashboard Setup
1. **Enable Organizations**: Go to Auth0 Dashboard → Organizations
2. **Configure Universal Login**: Go to Branding → Universal Login
3. **Organization Selection**: Ensure "Show Organization Selection" is enabled
4. **Application Settings**: Make sure your application is associated with the organizations

### Code Configuration
```typescript
const auth0Config: Auth0ProviderOptions = {
  domain,
  clientId,
  authorizationParams: {
    redirect_uri: redirectUri,
    scope: 'openid profile email',
    prompt: 'select_account', // Shows Auth0's account/org selection UI
    organization: 'prompt', // Tells Auth0 to prompt for organization
    ...(audience && { audience: audience }),
  },
  cacheLocation: 'localstorage',
  useRefreshTokens: true,
};
```

## How It Works

1. **User clicks login** → Redirects to Auth0 Universal Login
2. **Auth0 shows organization selector** → User picks their organization
3. **User authenticates** → Auth0 handles everything
4. **Token includes organization context** → Your app receives org-aware tokens
5. **Token refresh preserves organization** → Automatic organization context

## Benefits

✅ **Native Auth0 UI** - Consistent with Auth0 branding and UX patterns
✅ **Secure** - Organization selection happens on Auth0's secure domain  
✅ **No Custom Code** - Eliminates need for custom organization selector
✅ **Automatic Token Refresh** - Organization context preserved in refreshed tokens
✅ **Multi-Organization Support** - Users can switch between organizations
✅ **Admin Control** - Organization access controlled in Auth0 dashboard

## User Experience

1. User visits your app and clicks login
2. Redirected to Auth0 login page
3. Auth0 shows available organizations (if user belongs to multiple)
4. User selects organization and completes authentication
5. Redirected back to your app with organization context
6. All subsequent API calls include organization information

## Troubleshooting

**Issue**: "parameter organization is required"
**Solution**: This configuration resolves it by letting Auth0 handle organization selection

**Issue**: User sees no organization selector
**Solution**: Check Auth0 dashboard organization settings and ensure Universal Login is configured

**Issue**: Token refresh fails
**Solution**: Token refresh automatically preserves organization context - no additional code needed

## Testing

1. **Create test organizations** in Auth0 dashboard
2. **Add test users** to different organizations  
3. **Test login flow** - should see organization selection
4. **Verify tokens** - should include organization claims
5. **Test token refresh** - organization context should persist