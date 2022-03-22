import { Stack, IStackStyles, IStackTokens, IStackItemStyles } from '@fluentui/react/lib/Stack';
import { useT } from "talkr";
import { Attendee, NullableOption, ResponseStatus } from 'microsoft-graph';
import { Persona, PersonaPresence, PersonaSize } from '@fluentui/react';
import { TextField } from '@fluentui/react/lib/TextField';
import { CommandButton } from '@fluentui/react/lib/Button';


type ISelectCustomerProps = {

}

export default function SelectCustomer(props: ISelectCustomerProps) {
    const { T } = useT();

    const stackItemStyles: IStackItemStyles = {
        root: {
            paddingTop: 16,
            paddingRight: 108,
        },
    };

    return (
        <div>
            <TextField label={T("selectcustomer.search")?.toString()} />

            <CommandButton
                text={T("selectcustomer.newcustomer")?.toString()!}
                iconProps={{ iconName: 'Add' }}
            />
        </div>
    );
}

