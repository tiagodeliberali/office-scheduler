import {
    getTheme,
    mergeStyleSets,
    FontWeights,
    ContextualMenu,
    Toggle,
    Modal,
    IDragOptions,
    IIconProps,
    Stack,
    IStackProps,
    Icon
} from '@fluentui/react';
import { DefaultButton, IconButton, IButtonStyles } from '@fluentui/react/lib/Button';
import { ISlot } from '../slot/Slot';
import { format } from 'date-fns/esm';
import { useT } from "talkr";
import SelectCustomer from '../customer/SelectCustomer';

type INewEventProps = {
    isOpen: boolean
    hideModal: any,
    slot?: ISlot
}

const theme = getTheme();

const iconButtonStyles: Partial<IButtonStyles> = {
    root: {
        color: theme.palette.neutralPrimary,
        marginLeft: 'auto',
        marginTop: '4px',
        marginRight: '2px',
    },
    rootHovered: {
        color: theme.palette.neutralDark,
    },
};

const contentStyles = mergeStyleSets({
    container: {
        display: 'flex',
        flexFlow: 'column nowrap',
        alignItems: 'stretch',
    },
    header: [
        {
            flex: '1 1 auto',
            borderTop: `4px solid ${theme.palette.themePrimary}`,
            color: theme.palette.neutralPrimary,
            display: 'flex',
            alignItems: 'top',
            fontWeight: FontWeights.semibold,
            padding: '0px 12px 14px 24px',
        },
    ],
    title: [
        theme.fonts.xxLarge,
        {
            alignItems: 'center',
            fontWeight: FontWeights.semibold,
            padding: '12px 0px 0px 0px',
        },
    ],
    subheader: [
        theme.fonts.large,
        {
            alignItems: 'center',
            fontWeight: FontWeights.semibold,
            padding: '6px 12px 0px 0px',
        },
    ],
    body: {
        flex: '4 4 auto',
        padding: '0 24px 24px 24px',
        overflowY: 'hidden',
        selectors: {
            p: { margin: '14px 0' },
            'p:first-child': { marginTop: 0 },
            'p:last-child': { marginBottom: 0 },
        },
    },
});

export default function NewEvent({ isOpen, hideModal, slot }: INewEventProps) {
    const { T } = useT();

    return (<Modal
        isOpen={isOpen}
        onDismiss={hideModal}
        isBlocking={false}
        containerClassName={contentStyles.container}
    >
        <div className={contentStyles.header}>
            <div>
                <div className={contentStyles.title}>
                    <Icon
                        styles={iconButtonStyles}
                        iconName='calendar'
                    /> <span>{slot && format(slot.startDate, "dd/MM")}</span>
                </div>
                <div className={contentStyles.subheader}>
                    <Icon
                        styles={iconButtonStyles}
                        iconName='clock'
                    /> <span>{slot && format(slot.startDate, "HH:mm")}</span> - <span>{slot && format(slot.endDate, "HH:mm")}</span>
                </div>
            </div>
            <IconButton
                styles={iconButtonStyles}
                iconProps={{ iconName: 'Cancel' }}
                ariaLabel={T("newevent.close")?.toString()}
                onClick={hideModal}
            />
        </div>

        <div className={contentStyles.body}>
            <SelectCustomer />
        </div>
    </Modal>)
}