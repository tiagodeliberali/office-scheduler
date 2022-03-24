import { Client, GraphRequestOptions, PageCollection, PageIterator } from '@microsoft/microsoft-graph-client';
import { AuthCodeMSALBrowserAuthenticationProvider } from '@microsoft/microsoft-graph-client/authProviders/authCodeMsalBrowser';
import { Contact, Event } from 'microsoft-graph';
import { ensureClient } from '../common/GraphService';

let cachedGraphClient: Client | undefined = undefined;

const CONTACTID_FIELD_NAME = 'String {4fa5d502-de1e-434e-9b07-cb3334aff457} Name ContactId'

export async function getUserCalendar(
    authProvider: AuthCodeMSALBrowserAuthenticationProvider,
    timeZone: string,
    startDateTime: Date,
    endDateTime: Date): Promise<Event[]> {
    cachedGraphClient = ensureClient(authProvider, cachedGraphClient);

    var response: PageCollection = await cachedGraphClient!
        .api('/me/calendarview')
        .header('Prefer', `outlook.timezone="${timeZone}"`)
        .expand(`singleValueExtendedProperties($filter=id eq '${CONTACTID_FIELD_NAME}')`)
        .query({ startDateTime: startDateTime.toISOString(), endDateTime: endDateTime.toISOString(), isCancelled: 'false' })
        .select('attendees,subject,organizer,start,end,bodyPreview,body,location,id,isCancelled,recurrence,singleValueExtendedProperties')
        .orderby('start/dateTime')
        .top(25)
        .get();

    if (response["@odata.nextLink"]) {
        var events: Event[] = [];

        var options: GraphRequestOptions = {
            headers: { 'Prefer': `outlook.timezone="${timeZone}"` }
        };

        var pageIterator = new PageIterator(cachedGraphClient!, response, (event) => {
            events.push(event);
            return true;
        }, options);

        await pageIterator.iterate();

        return events;
    } else {

        return response.value;
    }
}

export async function createEvent(authProvider: AuthCodeMSALBrowserAuthenticationProvider,
    newEvent: Event,
    contact: Contact): Promise<Event> {
    cachedGraphClient = ensureClient(authProvider, cachedGraphClient);

    newEvent.singleValueExtendedProperties = [{
        id: CONTACTID_FIELD_NAME,
        value: contact.id
    }]

    const event = await cachedGraphClient!
        .api('/me/events')
        .post(newEvent);

    // since it is not returned on the POST, we need to add manually
    event.singleValueExtendedProperties = [{
        id: CONTACTID_FIELD_NAME,
        value: contact.id
    }]

    return event;
}
