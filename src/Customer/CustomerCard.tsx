import { Stack, IStackStyles, IStackTokens, IStackItemStyles } from '@fluentui/react/lib/Stack';
import { mergeStyles, mergeStyleSets } from '@fluentui/react/lib/Styling';

import { useT } from "talkr";
import { Attendee, NullableOption, ResponseStatus } from 'microsoft-graph';
import { Persona, PersonaPresence, PersonaSize } from '@fluentui/react';
import { ResponseType } from '@microsoft/microsoft-graph-client';

type ICustomerArrayCardProps = {
    people: NullableOption<Attendee[]> | undefined
}

type ICustomerCardProps = {
    person: Attendee | undefined
}

const iconClass = mergeStyles({
    fontSize: 30,
    margin: '0 25px',
});

const classNames = mergeStyleSets({
    lightgray: [{ color: 'lightgray' }, iconClass],
});

export function CustomerArrayCard({ people }: ICustomerArrayCardProps) {
    const { T } = useT();

    return (
        <div>
            {people?.map(person => <CustomerCard person={person} />)}
        </div>
    );
}

const buildPresence = (status: ResponseStatus): PersonaPresence => {
    if (status.response == 'accepted') {
        return PersonaPresence.online;
    } else if (status.response == 'declined') {
        return PersonaPresence.blocked;
    }

    return PersonaPresence.away;
}

export default function CustomerCard({ person }: ICustomerCardProps) {
    const { T } = useT();

    const stackItemStyles: IStackItemStyles = {
        root: {
            paddingTop: 16,
            paddingRight: 108,
        },
    };

    return (
        <Persona
            text={person?.emailAddress?.name!}
            secondaryText={person?.emailAddress?.address!}
            presence={buildPresence(person?.status!)}
            size={PersonaSize.size40} />
    );
}