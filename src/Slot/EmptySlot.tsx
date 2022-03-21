import { ISlot } from './Slot';

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

type IEmptySlotProps = {
    slot: ISlot
}

const iconClass = mergeStyles({
    fontSize: 30,
    margin: '0 25px',
});

const classNames = mergeStyleSets({
    lightgray: [{ color: 'lightgray' }, iconClass],
});

export default function EmptySlot({ slot }: IEmptySlotProps) {
    const { T } = useT();

    const logoProps: IDocumentCardLogoProps = {
        logoIcon: 'calendar',
        className: classNames.lightgray
    };

    const cardStyles: IDocumentCardStyles = {
        root: { display: 'inline-block', marginRight: 20, width: 320 },
    };

    const stackItemStyles: IStackItemStyles = {
        root: {
            paddingTop: 16,
            paddingRight: 108,
        },
    };

    return (
        <DocumentCard
            styles={cardStyles}
        >
            <Stack>
                <Stack horizontal>
                    <Stack.Item align="center" styles={stackItemStyles}>
                        <DocumentCardTitle title={format(slot.startDate, "HH:mm") + '-' + format(slot.endDate, "HH:mm")} />
                    </Stack.Item>
                    <DocumentCardLogo {...logoProps} />
                </Stack>


                <DocumentCardStatus statusIcon="add" status={T("slot.empty")?.toString()!} />
            </Stack>
        </DocumentCard>
    );
}