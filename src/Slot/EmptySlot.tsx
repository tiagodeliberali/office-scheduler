import { useEffect, useState } from 'react';
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

import { CommandButton } from '@fluentui/react/lib/Button';

import { Stack, IStackStyles, IStackTokens, IStackItemStyles } from '@fluentui/react/lib/Stack';
import { mergeStyles, mergeStyleSets } from '@fluentui/react/lib/Styling';

import { useT } from "talkr";
import { IIconProps } from '@fluentui/react';

type IEmptySlotProps = {
    slot: ISlot,
    onSchedule: any
}

const iconClass = mergeStyles({
    fontSize: 30,
    margin: '0 25px',
});

const classNames = mergeStyleSets({
    lightgray: [{ color: 'lightgray' }, iconClass],
});

export default function EmptySlot({ slot, onSchedule }: IEmptySlotProps) {
    const { T } = useT();

    const [show, setShow] = useState<boolean>(false);

    const logoProps: IDocumentCardLogoProps = {
        logoIcon: 'calendar',
        className: classNames.lightgray
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
            paddingTop: 0,
            paddingLeft: 16,
            paddingBottom: 16,
        },
    };

    const onMouseEnter = () => {
        setShow(true);
    }

    const onMouseLeave = () => {
        setShow(false);
    }

    const addIcon: IIconProps = { iconName: 'Add' };

    return (
        <DocumentCard
            styles={cardStyles}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            <Stack>
                <Stack horizontal>
                    <Stack.Item align="center" styles={stackHeaderItemStyles}>
                        <DocumentCardTitle title={format(slot.startDate, "HH:mm") + '-' + format(slot.endDate, "HH:mm")} />
                    </Stack.Item>
                    <DocumentCardLogo {...logoProps} />
                </Stack>
                {show && <Stack.Item styles={stackItemStyles}>
                    <CommandButton
                        text={T("slot.empty")?.toString()!}
                        iconProps={addIcon}
                        onClick={() => onSchedule(slot)}
                    />
                </Stack.Item>}
            </Stack>
        </DocumentCard>
    );
}