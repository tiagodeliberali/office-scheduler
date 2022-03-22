import { useEffect, useState, useReducer } from 'react';
import { findIana } from "windows-iana";
import { Event } from 'microsoft-graph';
import { AuthenticatedTemplate, UnauthenticatedTemplate } from '@azure/msal-react';

import { Stack } from '@fluentui/react/lib/Stack';
import { PrimaryButton } from '@fluentui/react/lib/Button';

import { getUserCalendar } from './CalendarGraphService';
import { useAppContext } from '../common/AppContext';
import NewEvent from './NewEvent'

import WeekDay from './WeekDay'
import { buildEmptyWeek, IWeek, mergeEvents, newDateOnTimeZone } from './CalendarService';
import { format } from 'date-fns/esm';

import { Text, ITextProps } from '@fluentui/react/lib/Text';
import { ISlot } from '../slot/Slot';

export default function Calendar() {
    const app = useAppContext();

    const [events, setEvents] = useState<Event[]>();
    const [week, setWeek] = useState<IWeek>();
    const [modalState, dispatchModal] = useReducer(modalReducer, modalInitialState);

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
                    {week?.days.map(day => <WeekDay day={day} onSchedule={(slot: ISlot) => dispatchModal({ type: "OPEN_MODAL", slot: slot })} />)}
                </Stack>

                <NewEvent isOpen={modalState.isOpen} hideModal={() => dispatchModal({ type: "CLOSE_MODAL" })} slot={modalState.slot} />
                {/* <pre><code>{JSON.stringify(events, null, 2)}</code></pre> */}
            </AuthenticatedTemplate>
            <UnauthenticatedTemplate>
                <PrimaryButton color="primary" onClick={app.signIn!} text="Click here to sign in" />
            </UnauthenticatedTemplate>
        </>
    );
}

type IModalData = {
    isOpen: boolean,
    slot?: ISlot,
}

type IAction = {
    type: string,
    slot?: ISlot
}

const modalInitialState: IModalData = {
    isOpen: false,
};

const modalReducer = (state: IModalData, action: IAction): IModalData => {
    switch (action.type) {

        case "CLOSE_MODAL":
            return {
                isOpen: false,
                slot: undefined,
            };

        case "OPEN_MODAL":
            return {
                isOpen: true,
                slot: action.slot!,
            };

        default:
            return state;
    }
}

