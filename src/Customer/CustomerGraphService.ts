import { Client, PageCollection, PageIterator } from '@microsoft/microsoft-graph-client';
import { AuthCodeMSALBrowserAuthenticationProvider } from '@microsoft/microsoft-graph-client/authProviders/authCodeMsalBrowser';
import { Contact } from 'microsoft-graph';
import { ensureClient } from '../common/GraphService';

let cachedGraphClient: Client | undefined = undefined;

export async function getContactList(
    authProvider: AuthCodeMSALBrowserAuthenticationProvider,
    name: string): Promise<Contact[]> {
    cachedGraphClient = ensureClient(authProvider, cachedGraphClient);

    var response: PageCollection = await cachedGraphClient!
        .api('/me/contacts')
        .filter(`contains(displayName,'${name}')`)
        .select('birthday,children,companyName,displayName,emailAddresses,givenName,surname,homeAddress,mobilePhone,personalNotes,profession,spouseName,photo')
        .orderby('displayName')
        .top(25)
        .get();

    if (response["@odata.nextLink"]) {
        var contacts: Contact[] = [];

        var pageIterator = new PageIterator(cachedGraphClient!, response, (event) => {
            contacts.push(event);
            return true;
        });

        await pageIterator.iterate();

        return contacts;
    } else {
        return response.value;
    }
}

export async function createContact(authProvider: AuthCodeMSALBrowserAuthenticationProvider,
    newContact: Contact): Promise<Contact> {
    cachedGraphClient = ensureClient(authProvider, cachedGraphClient);

    return await cachedGraphClient!
        .api('/me/contacts')
        .post(newContact);
}
