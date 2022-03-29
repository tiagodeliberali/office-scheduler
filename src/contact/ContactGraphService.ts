import { Client, PageCollection, PageIterator } from '@microsoft/microsoft-graph-client';
import { AuthCodeMSALBrowserAuthenticationProvider } from '@microsoft/microsoft-graph-client/authProviders/authCodeMsalBrowser';
import { Contact } from 'microsoft-graph';
import { ensureClient } from '../common/GraphService';

let cachedGraphClient: Client | undefined = undefined;

const SESSIONS_FIELD_NAME = 'StringArray {d8fb8e2b-cc76-47f1-b95f-578b4b150bb6} Name Sessions'

export async function getContactList(
    authProvider: AuthCodeMSALBrowserAuthenticationProvider,
    name: string): Promise<Contact[]> {
    cachedGraphClient = ensureClient(authProvider, cachedGraphClient);

    var response: PageCollection = await cachedGraphClient!
        .api('/me/contacts')
        .expand(`multiValueExtendedProperties($filter=id eq '${SESSIONS_FIELD_NAME}')`)
        .filter(`contains(displayName,'${name}')`)
        .select('birthday,children,companyName,displayName,emailAddresses,givenName,surname,homeAddress,mobilePhone,personalNotes,profession,spouseName,photo')
        .orderby('displayName')
        .top(5)
        .get();

    return response.value;
}

export async function getContact(
    authProvider: AuthCodeMSALBrowserAuthenticationProvider,
    id: string): Promise<Contact | undefined> {
    cachedGraphClient = ensureClient(authProvider, cachedGraphClient);

    var response: Contact | undefined = await cachedGraphClient!
        .api(`/me/contacts/${id}`)
        .expand(`multiValueExtendedProperties($filter=id eq '${SESSIONS_FIELD_NAME}')`)
        .select('birthday,children,companyName,displayName,emailAddresses,givenName,surname,homeAddress,mobilePhone,personalNotes,profession,spouseName,photo')
        .get();

    return response;
}

export async function createContact(
    authProvider: AuthCodeMSALBrowserAuthenticationProvider,
    newContact: Contact): Promise<Contact> {
    cachedGraphClient = ensureClient(authProvider, cachedGraphClient);

    return await cachedGraphClient!
        .api('/me/contacts')
        .post(newContact);
}

export async function updateArrayOfSessions(authProvider: AuthCodeMSALBrowserAuthenticationProvider, contact: Contact, sessions: string[]): Promise<Contact> {
    cachedGraphClient = ensureClient(authProvider, cachedGraphClient);

    await cachedGraphClient!
        .api(`/me/contacts/${contact.id}`)
        .patch({
            "multiValueExtendedProperties": [
                {
                    id: SESSIONS_FIELD_NAME,
                    value: sessions
                }
            ]
        });

    contact.multiValueExtendedProperties = [
        {
            id: SESSIONS_FIELD_NAME,
            value: sessions
        }
    ]

    return contact;
}
