import { Contact } from "microsoft-graph";
import { Persona, PersonaSize } from "@fluentui/react";

type IContactCardProps = {
  contact: Contact | undefined;
};

export default function ContactCard({ contact }: IContactCardProps) {
  const firstEmail =
    contact?.emailAddresses &&
    contact?.emailAddresses.length > 0 &&
    contact?.emailAddresses[0].address;

  return (
    <Persona
      text={contact?.displayName || ""}
      secondaryText={firstEmail || ""}
      size={PersonaSize.size40}
    />
  );
}
