import { format } from 'date-fns';
import {
    DocumentCard,
    DocumentCardTitle,
    DocumentCardLogo,
    IDocumentCardLogoProps,
    IDocumentCardStyles,
} from '@fluentui/react/lib/DocumentCard';

import { Stack, IStackItemStyles } from '@fluentui/react/lib/Stack';
import { mergeStyles, mergeStyleSets } from '@fluentui/react/lib/Styling';

import { useT } from "talkr";
import DocumentOverview from '../document/DocumentOverview';
import ContactCard from '../contact/ContactCard';
import { Contact } from 'microsoft-graph';
import { useEffect, useState } from 'react';
import { useAppContext } from '../common/AppContext';
import { getContact } from '../contact/ContactGraphService';
import { ISlot } from './Slot';

type IScheduledSlotProps = {
    slot: ISlot
}

export default function ScheduledSlot({ slot }: IScheduledSlotProps) {
    const app = useAppContext();
    const { T } = useT();

    const [contact, setContact] = useState<Contact>();

    useEffect(() => {
        const loadEvents = async () => {
            const customerId = slot.event?.singleValueExtendedProperties && slot.event?.singleValueExtendedProperties.length > 0 && slot.event?.singleValueExtendedProperties[0].value || undefined;

            if (customerId) {
                setContact(await getContact(app.authProvider!, customerId))
            }
        };

        loadEvents();
    }, []);

    const logoProps: IDocumentCardLogoProps = {
        logoIcon: 'calendar',
        styles: {
            root: {
                color: 'deepskyblue',
                fontSize: 20,
                paddingRight: 0
            }
        }
    };

    const stackItemStyles: IStackItemStyles = {
        root: {
            padding: 16
        },
    };

    return (
        <DocumentCard>
            <Stack>
                <Stack horizontal>
                    <DocumentCardLogo {...logoProps} />
                    <Stack.Item styles={{ root: { paddingTop: 8, paddingLeft: 0 } }}>
                        <DocumentCardTitle title={format(slot.startDate, "HH:mm") + '-' + format(slot.endDate, "HH:mm")} />
                    </Stack.Item>
                </Stack>

                <Stack.Item styles={stackItemStyles}>
                    {contact && <ContactCard person={contact} />}
                    {!contact && <span>{T("scheduledSlot.userNotFound")}</span>}
                </Stack.Item>

                <Stack.Item styles={stackItemStyles}>
                    <DocumentOverview contact={contact} slot={slot} />
                </Stack.Item>
            </Stack>
        </DocumentCard>
    );
}