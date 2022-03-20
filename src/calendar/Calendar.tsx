import { useEffect, useState } from 'react';
import { NavLink as RouterNavLink } from 'react-router-dom';
import { findIana } from "windows-iana";
import { Event } from 'microsoft-graph';
import { getUserWeekCalendar } from '../common/GraphService';
import { useAppContext } from '../common/AppContext';
import { AuthenticatedTemplate, UnauthenticatedTemplate } from '@azure/msal-react';
import { add, format, getDay, parseISO } from 'date-fns';
import { endOfWeek, startOfWeek } from 'date-fns/esm';
import { PrimaryButton } from '@fluentui/react/lib/Button';
import CalendarRow from './CalendarRow';

export default function Calendar() {
    const app = useAppContext();

    const [events, setEvents] = useState<Event[]>();

    useEffect(() => {
        const loadEvents = async () => {
            if (app.user && !events) {
                try {
                    const ianaTimeZones = findIana(app.user?.timeZone!);
                    const events = await getUserWeekCalendar(app.authProvider!, ianaTimeZones[0].valueOf());
                    setEvents(events);
                } catch (err: any) {
                    app.displayError!(err.message);
                }
            }
        };

        loadEvents();
    }, [app.user]);

    return (
        <>
            <AuthenticatedTemplate>
                {events?.map(event => <CalendarRow event={event} />)}
                {/* <pre><code>{JSON.stringify(events, null, 2)}</code></pre> */}
            </AuthenticatedTemplate>
            <UnauthenticatedTemplate>
                <PrimaryButton color="primary" onClick={app.signIn!} text="Click here to sign in" />
            </UnauthenticatedTemplate>
        </>
    );
}