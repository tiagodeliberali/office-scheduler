import { Client, PageCollection } from "@microsoft/microsoft-graph-client";
import { AuthCodeMSALBrowserAuthenticationProvider } from "@microsoft/microsoft-graph-client/authProviders/authCodeMsalBrowser";
import { Notebook, Contact, OnenoteSection } from "microsoft-graph";
import { ensureClient } from "../common/GraphService";
import { updateArrayOfSessions } from "../contact/ContactGraphService";

let cachedGraphClient: Client | undefined = undefined;
let cachedPromiseNotebook: Promise<Notebook> | undefined = undefined;

const buildDisplayName = (contact: Contact): string =>
  contact.displayName!.substring(0, 50);

async function getOrCreateNotebooksSingleton(
  authProvider: AuthCodeMSALBrowserAuthenticationProvider
): Promise<Notebook> {
  // since we have many calls to this function,
  // we can cache it
  if (!cachedPromiseNotebook) {
    cachedPromiseNotebook = getOrCreateNotebooks(authProvider);
  }

  return cachedPromiseNotebook;
}

async function getOrCreateNotebooks(
  authProvider: AuthCodeMSALBrowserAuthenticationProvider
): Promise<Notebook> {
  cachedGraphClient = ensureClient(authProvider, cachedGraphClient);

  const response: PageCollection = await cachedGraphClient!
    .api("/me/onenote/notebooks")
    .filter(`displayName eq 'VirtualOffice'`)
    .select("id,displayName")
    .top(1)
    .get();

  if (response.value.length === 0) {
    return createNotebook(authProvider, {
      displayName: "VirtualOffice",
      isShared: false,
    });
  } else {
    return response.value[0];
  }
}

async function createNotebook(
  authProvider: AuthCodeMSALBrowserAuthenticationProvider,
  notebook: Notebook
): Promise<Notebook> {
  cachedGraphClient = ensureClient(authProvider, cachedGraphClient);

  return await cachedGraphClient!.api("/me/onenote/notebooks").post(notebook);
}

export async function initializeContactSection(
  authProvider: AuthCodeMSALBrowserAuthenticationProvider,
  contact: Contact,
  pageContent: string
): Promise<Contact> {
  cachedGraphClient = ensureClient(authProvider, cachedGraphClient);

  const section = await loadOrCreateSection(
    authProvider,
    buildDisplayName(contact)
  );

  await cachedGraphClient!
    .api(`/me/onenote/sections/${section.id}/pages`)
    .header("Content-type", "application/xhtml+xml")
    .post(pageContent);

  return updateArrayOfSessions(authProvider, contact, ["anamnesis"]);
}

async function loadOrCreateSection(
  authProvider: AuthCodeMSALBrowserAuthenticationProvider,
  sectionName: string
): Promise<OnenoteSection> {
  const notebook = await getOrCreateNotebooksSingleton(authProvider);

  const sectionResponse: PageCollection = await cachedGraphClient!
    .api(`/me/onenote/notebooks/${notebook.id}/sections`)
    .filter(`displayName eq '${sectionName}'`)
    .select("id,displayName")
    .top(1)
    .get();

  return sectionResponse && sectionResponse.value.length > 0
    ? sectionResponse.value[0]
    : await cachedGraphClient!
        .api(`/me/onenote/notebooks/${notebook.id}/sections`)
        .post({
          displayName: sectionName,
        });
}

export async function addContactSession(
  authProvider: AuthCodeMSALBrowserAuthenticationProvider,
  contact: Contact,
  session: string,
  pageContent: string
): Promise<Contact> {
  const sessions =
    (contact?.multiValueExtendedProperties &&
      contact?.multiValueExtendedProperties.length > 0 &&
      contact?.multiValueExtendedProperties[0].value) ||
    [];

  // avoid duplicated sessions
  if (sessions.some((x) => x === session)) {
    return contact;
  }

  const section = await loadOrCreateSection(
    authProvider,
    buildDisplayName(contact)
  );

  await cachedGraphClient!
    .api(`/me/onenote/sections/${section.id}/pages`)
    .header("Content-type", "application/xhtml+xml")
    .post(pageContent);

  return await updateArrayOfSessions(authProvider, contact, [
    ...sessions,
    session,
  ]);
}
