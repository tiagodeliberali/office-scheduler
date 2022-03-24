import { useEffect, useState, useReducer } from 'react';
import { Stack, IStackStyles, IStackTokens, IStackItemStyles } from '@fluentui/react/lib/Stack';
import { useAppContext } from '../common/AppContext';
import { parseISO, isSameDay, format } from 'date-fns/esm';
import { useT } from "talkr";
import { Contact } from 'microsoft-graph';
import { initializeCustomerSection, addCustomerSession } from './DocumentGraphService';
import { PrimaryButton } from '@fluentui/react';
import { ISlot } from '../slot/Slot';


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
        const updatedContact = await initializeCustomerSection(app.authProvider!, contact!, T("documentoverview.anamnese")?.toString()!);
        updateSessions(updatedContact)
    }

    const confirmSession = async () => {
        const updatedContact = await addCustomerSession(
            app.authProvider!,
            contact!,
            slot.startDate.toISOString(),
            T("documentoverview.newsession", {
                date: format(slot.startDate, "dd/MM/yyyy"),
                startTime: format(slot.startDate, "HH:mm"),
                endTime: format(slot.endDate, "HH:mm"),
            })?.toString()!)
        updateSessions(updatedContact)
    }

    return (
        <Stack>
            {!sessions && <PrimaryButton text={T("documentoverview.createinitialcontent")?.toString()} onClick={initializeAnamnese} />}
            {sessions && !containsTodaySession(sessions, slot) && <PrimaryButton text={T("documentoverview.confirmsession")?.toString()} onClick={confirmSession} />}
            {sessions && containsTodaySession(sessions, slot) && <pre><code>{JSON.stringify(sessions, null, 2)}</code></pre>}

        </Stack>
    );
}