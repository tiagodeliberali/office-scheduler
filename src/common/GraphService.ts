import { Client } from '@microsoft/microsoft-graph-client';
import { AuthCodeMSALBrowserAuthenticationProvider } from '@microsoft/microsoft-graph-client/authProviders/authCodeMsalBrowser';
import { User } from 'microsoft-graph';

export function ensureClient(authProvider: AuthCodeMSALBrowserAuthenticationProvider, graphClient: Client | undefined) {
    if (!graphClient) {
        return Client.initWithMiddleware({
            authProvider: authProvider
        });
    }

    return graphClient;
}

let cachedGraphClient: Client | undefined = undefined;

export async function getUser(authProvider: AuthCodeMSALBrowserAuthenticationProvider): Promise<User> {
    cachedGraphClient = ensureClient(authProvider, cachedGraphClient);

    // Return the /me API endpoint result as a User object
    const user: User = await cachedGraphClient!.api('/me')
        // Only retrieve the specific fields needed
        .select('displayName,mail,mailboxSettings,userPrincipalName')
        .get();

    return user;
}
