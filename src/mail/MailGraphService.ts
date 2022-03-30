import { Client, PageCollection } from "@microsoft/microsoft-graph-client";
import { AuthCodeMSALBrowserAuthenticationProvider } from "@microsoft/microsoft-graph-client/authProviders/authCodeMsalBrowser";
import { Message, Contact } from "microsoft-graph";
import { ensureClient } from "../common/GraphService";

let cachedGraphClient: Client | undefined = undefined;

export async function getLastContactMails(
  authProvider: AuthCodeMSALBrowserAuthenticationProvider,
  contact: Contact,
  qtd: number
): Promise<Message[]> {
  const contactEmail =
    contact.emailAddresses &&
    contact.emailAddresses.length > 0 &&
    contact.emailAddresses[0].address;

  if (!contactEmail) {
    return [];
  }

  cachedGraphClient = ensureClient(authProvider, cachedGraphClient);

  const response: PageCollection = await cachedGraphClient!
    .api("/me/messages")
    .search(`"from:${contactEmail}"`)
    .select("subject,sentDateTime,uniqueBody,isRead,hasAttachments")
    .top(qtd)
    .get();

  return response.value;
}
