import { add, format, getDay, parseISO } from 'date-fns';
import {
    DocumentCard,
    DocumentCardActivity,
    DocumentCardTitle,
    DocumentCardLogo,
    DocumentCardStatus,
    IDocumentCardLogoProps,
    IDocumentCardActivityPerson,
    IDocumentCardStyles,
} from '@fluentui/react/lib/DocumentCard';

import { Stack, IStackStyles, IStackTokens, IStackItemStyles } from '@fluentui/react/lib/Stack';
import { mergeStyles, mergeStyleSets } from '@fluentui/react/lib/Styling';

import { useT } from "talkr";
import DocumentOverview from '../document/DocumentOverview';
import ContactCard from '../customer/ContactCard';
import { Contact } from 'microsoft-graph';
import { useEffect, useState } from 'react';
import { useAppContext } from '../common/AppContext';
import { getContact } from '../customer/ContactGraphService';
import { ISlot } from './Slot';

type IScheduledSlotProps = {
    slot: ISlot
}

const iconClass = mergeStyles({
    fontSize: 30,
    margin: '0 25px',
});
const classNames = mergeStyleSets({
    deepSkyBlue: [{ color: 'deepskyblue' }, iconClass],
});

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
        className: classNames.deepSkyBlue
    };

    const cardStyles: IDocumentCardStyles = {
        root: { display: 'inline-block', marginRight: 20, width: 320 },
    };

    const stackHeaderItemStyles: IStackItemStyles = {
        root: {
            paddingTop: 16,
            paddingRight: 108,
        },
    };

    const stackItemStyles: IStackItemStyles = {
        root: {
            padding: 16
        },
    };

    return (
        <DocumentCard
            styles={cardStyles}
        >
            <Stack>
                <Stack horizontal>
                    <Stack.Item align="center" styles={stackHeaderItemStyles}>
                        <DocumentCardTitle title={format(slot.startDate, "HH:mm") + '-' + format(slot.endDate, "HH:mm")} />
                    </Stack.Item>
                    <DocumentCardLogo {...logoProps} />
                </Stack>

                <Stack.Item styles={stackItemStyles}>
                    {contact && <ContactCard person={contact} />}
                    {!contact && <span>{T("scheduledslot.usernotfound")}</span>}
                </Stack.Item>

                <Stack.Item styles={stackItemStyles}>
                    <DocumentOverview contact={contact} slot={slot} />
                </Stack.Item>
            </Stack>
        </DocumentCard>
    );
}