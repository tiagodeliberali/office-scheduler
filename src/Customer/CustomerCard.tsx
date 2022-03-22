import { Stack, IStackStyles, IStackTokens, IStackItemStyles } from '@fluentui/react/lib/Stack';
import { useT } from "talkr";
import { Attendee, NullableOption, ResponseStatus } from 'microsoft-graph';
import { Persona, PersonaPresence, PersonaSize } from '@fluentui/react';


type ICustomerArrayCardProps = {
    people: NullableOption<Attendee[]> | undefined
}

export function CustomerArrayCard({ people }: ICustomerArrayCardProps) {
    const { T } = useT();

    return (
        <div>
            {people?.map(person => <CustomerCard person={person} />)}
        </div>
    );
}

type ICustomerCardProps = {
    person: Attendee | undefined
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

const buildPresence = (status: ResponseStatus): PersonaPresence => {
    if (status.response == 'accepted') {
        return PersonaPresence.online;
    } else if (status.response == 'declined') {
        return PersonaPresence.blocked;
    }

    return PersonaPresence.away;
}
