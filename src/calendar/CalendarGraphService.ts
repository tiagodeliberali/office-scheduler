import { Client, GraphRequestOptions, PageCollection, PageIterator } from '@microsoft/microsoft-graph-client';
import { AuthCodeMSALBrowserAuthenticationProvider } from '@microsoft/microsoft-graph-client/authProviders/authCodeMsalBrowser';
import { Event } from 'microsoft-graph';
import { ensureClient } from '../common/GraphService';

let cachedGraphClient: Client | undefined = undefined;

export async function getUserCalendar(
    authProvider: AuthCodeMSALBrowserAuthenticationProvider,
    timeZone: string,
    startDateTime: Date,
    endDateTime: Date): Promise<Event[]> {
    cachedGraphClient = ensureClient(authProvider, cachedGraphClient);

    // GET /me/calendarview?startDateTime=''&endDateTime=''
    // &$select=subject,organizer,start,end
    // &$orderby=start/dateTime
    // &$top=50
    var response: PageCollection = await cachedGraphClient!
        .api('/me/calendarview')
        .header('Prefer', `outlook.timezone="${timeZone}"`)
        .query({ startDateTime: startDateTime.toISOString(), endDateTime: endDateTime.toISOString() })
        .select('attendees,subject,organizer,start,end,bodyPreview,body,location,id,isCancelled,recurrence')
        .orderby('start/dateTime')
        .top(25)
        .get();

    if (response["@odata.nextLink"]) {
        // Presence of the nextLink property indicates more results are available
        // Use a page iterator to get all results
        var events: Event[] = [];

        // Must include the time zone header in page
        // requests too
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
    newEvent: Event): Promise<Event> {
    cachedGraphClient = ensureClient(authProvider, cachedGraphClient);

    // POST /me/events
    // JSON representation of the new event is sent in the
    // request body
    return await cachedGraphClient!
        .api('/me/events')
        .post(newEvent);
}
