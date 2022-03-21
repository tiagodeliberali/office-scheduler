import { useEffect, useState } from 'react';
import { findIana } from "windows-iana";
import { Event } from 'microsoft-graph';
import { AuthenticatedTemplate, UnauthenticatedTemplate } from '@azure/msal-react';

import { Stack } from '@fluentui/react/lib/Stack';
import { PrimaryButton } from '@fluentui/react/lib/Button';

import { getUserCalendar } from '../common/GraphService';
import { useAppContext } from '../common/AppContext';

import WeekDay from './WeekDay'
import { buildEmptyWeek, IWeek, mergeEvents, newDateOnTimeZone } from './CalendarService';
import { format } from 'date-fns/esm';

import { Text, ITextProps } from '@fluentui/react/lib/Text';

export default function Calendar() {
    const app = useAppContext();

    const [events, setEvents] = useState<Event[]>();
    const [week, setWeek] = useState<IWeek>();

    useEffect(() => {
        const loadEvents = async () => {
            if (app.user && !events) {
                try {
                    const ianaTimeZones = findIana(app.user?.timeZone!);
                    const timezone = ianaTimeZones[0].valueOf();

                    const emptyWeek = buildEmptyWeek(newDateOnTimeZone(timezone));
                    const events = await getUserCalendar(app.authProvider!, timezone, emptyWeek.startDate!, emptyWeek.endDate!);
                    const mergedWeek = mergeEvents(emptyWeek, events);

                    setWeek(mergedWeek);
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
                <Text variant='xxLarge' nowrap block>
                    {week?.startDate && format(week?.startDate, "MMM/yyyy")}
                </Text>

                <Stack horizontal>
                    {week?.days.map(day => <WeekDay day={day} />)}
                </Stack>
                {/* <pre><code>{JSON.stringify(events, null, 2)}</code></pre> */}
            </AuthenticatedTemplate>
            <UnauthenticatedTemplate>
                <PrimaryButton color="primary" onClick={app.signIn!} text="Click here to sign in" />
            </UnauthenticatedTemplate>
        </>
    );
}

