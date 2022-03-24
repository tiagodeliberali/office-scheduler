import { useEffect, useState } from 'react';
import { Stack } from '@fluentui/react/lib/Stack';
import { useAppContext } from '../common/AppContext';
import { parseISO, isSameDay, format } from 'date-fns/esm';
import { useT } from "talkr";
import { Contact } from 'microsoft-graph';
import { initializeContactSection, addContactSession } from './DocumentGraphService';
import { DefaultButton } from '@fluentui/react';
import { ISlot } from '../slot/Slot';
import SessionsOverview from './SessionsOverview';

type IDocumentOverviewProps = {
    contact: Contact | undefined,
    slot: ISlot
}

const containsTodaySession = (sessions: string[], slot: ISlot): boolean => {
    return sessions && sessions.some(x => isSameDay(slot.startDate, parseISO(x)))
}

export default function DocumentOverview({ contact, slot }: IDocumentOverviewProps) {
    const app = useAppContext();
    const { T } = useT();

    const [sessions, setSessions] = useState<string[] | undefined>();

    const updateSessions = (c: Contact | undefined) => setSessions(c?.multiValueExtendedProperties && c?.multiValueExtendedProperties.length > 0 && c?.multiValueExtendedProperties[0].value || undefined);

    useEffect(() => {
        const loadSessions = async () => {
            updateSessions(contact)
        };

        loadSessions();
    }, [contact]);

    const initializeAnamnese = async () => {
        const updatedContact = await initializeContactSection(app.authProvider!, contact!, T("documentOverview.anamnese")?.toString()!);
        updateSessions(updatedContact)
    }

    const confirmSession = async () => {
        const updatedContact = await addContactSession(
            app.authProvider!,
            contact!,
            slot.startDate.toISOString(),
            T("documentOverview.newsession", {
                date: format(slot.startDate, "dd/MM/yyyy"),
                startTime: format(slot.startDate, "HH:mm"),
                endTime: format(slot.endDate, "HH:mm"),
            })?.toString()!)
        updateSessions(updatedContact)
    }

    return (
        <Stack>
            <SessionsOverview sessions={sessions || []} />
            {!sessions && <DefaultButton text={T("documentOverview.createInitialContent")?.toString()} onClick={initializeAnamnese} />}
            {sessions && !containsTodaySession(sessions, slot) && <DefaultButton text={T("documentOverview.confirmSession")?.toString()} onClick={confirmSession} />}
            {sessions && containsTodaySession(sessions, slot) && <DefaultButton text={T("documentOverview.sessionConfirmed")?.toString()} disabled={true} />}
        </Stack>
    );
}