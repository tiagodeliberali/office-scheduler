import { useEffect, useState } from 'react';
import { Stack, IStackStyles, IStackTokens, IStackItemStyles } from '@fluentui/react/lib/Stack';
import { findIana } from "windows-iana";
import { Event } from 'microsoft-graph';
import { getUserCalendar } from '../common/GraphService';
import { useAppContext } from '../common/AppContext';
import { AuthenticatedTemplate, UnauthenticatedTemplate } from '@azure/msal-react';
import { endOfWeek, startOfWeek } from 'date-fns/esm';
import { zonedTimeToUtc } from 'date-fns-tz';
import { PrimaryButton } from '@fluentui/react/lib/Button';
import CalendarRow from './CalendarRow';

export default function Calendar() {
    const app = useAppContext();

    const [events, setEvents] = useState<Event[]>();
    const [startDate, setStartDate] = useState<Date>();
    const [endDate, setEndDate] = useState<Date>();

    useEffect(() => {
        const loadEvents = async () => {
            if (app.user && !events) {
                try {
                    const ianaTimeZones = findIana(app.user?.timeZone!);
                    const timezone = ianaTimeZones[0].valueOf();

                    const now = new Date();
                    const start = zonedTimeToUtc(startOfWeek(now), timezone);
                    const end = zonedTimeToUtc(endOfWeek(now), timezone);
                    setStartDate(start);
                    setEndDate(end);

                    const events = await getUserCalendar(app.authProvider!, timezone, start!, end!);
                    setEvents(events);
                } catch (err: any) {
                    app.displayError!(err.message);
                }
            }
        };

        loadEvents();
    }, [app.user]);

    const dayGapStackTokens: IStackTokens = {
        childrenGap: 10,
        padding: 10,
    };

    return (
        <>
            <AuthenticatedTemplate>
                Start: {startDate?.toISOString()}
                <br /> End: {endDate?.toISOString()}
                <Stack horizontal>
                    <Stack tokens={dayGapStackTokens}>
                        {events?.map(event => <CalendarRow event={event} />)}
                    </Stack>
                    <Stack tokens={dayGapStackTokens}>
                        {events?.map(event => <CalendarRow event={event} />)}
                    </Stack>
                    <Stack tokens={dayGapStackTokens}>
                        {events?.map(event => <CalendarRow event={event} />)}
                    </Stack>
                    <Stack tokens={dayGapStackTokens}>
                        {events?.map(event => <CalendarRow event={event} />)}
                    </Stack>
                    <Stack tokens={dayGapStackTokens}>
                        {events?.map(event => <CalendarRow event={event} />)}
                    </Stack>
                </Stack>
                {/* <pre><code>{JSON.stringify(events, null, 2)}</code></pre> */}
            </AuthenticatedTemplate>
            <UnauthenticatedTemplate>
                <PrimaryButton color="primary" onClick={app.signIn!} text="Click here to sign in" />
            </UnauthenticatedTemplate>
        </>
    );
}