import { ISlot } from './Slot';
import { AttendeeArrayCard } from '../customer/AttendeeCard'

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

type IEmptySlotProps = {
    slot: ISlot
}

const iconClass = mergeStyles({
    fontSize: 30,
    margin: '0 25px',
});
const classNames = mergeStyleSets({
    deepSkyBlue: [{ color: 'deepskyblue' }, iconClass],
});

export default function EmptySlot({ slot }: IEmptySlotProps) {
    const { T } = useT();

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
                    <AttendeeArrayCard people={slot.event?.attendees} />
                </Stack.Item>

                <Stack.Item styles={stackItemStyles}>
                    <DocumentOverview person={slot.event?.attendees && slot.event?.attendees[0]} />
                </Stack.Item>
            </Stack>
        </DocumentCard>
    );
}