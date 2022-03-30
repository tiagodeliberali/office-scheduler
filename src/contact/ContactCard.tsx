import { Stack } from "@fluentui/react/lib/Stack";
import { Contact } from "microsoft-graph";
import { Persona, PersonaSize } from "@fluentui/react";

type IContactCardProps = {
  contact: Contact | undefined;
};

export default function ContactCard({ contact }: IContactCardProps) {
  return (
    <Stack>
      {contact?.emailAddresses &&
        contact?.emailAddresses.map((email) => (
          <Persona
            text={contact.displayName || ""}
            secondaryText={email.address || ""}
            size={PersonaSize.size40}
          />
        ))}
    </Stack>
  );
}
