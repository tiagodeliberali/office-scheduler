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

    const user: User = await cachedGraphClient!.api('/me')
        .select('displayName,mail,mailboxSettings,userPrincipalName')
        .get();

    return user;
}
