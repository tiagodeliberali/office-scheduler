import { useState } from "react";
import { ISlot } from "./BaseSlot";
import { Stack } from "@fluentui/react/lib/Stack";
import { format } from "date-fns";
import {
  DocumentCard,
  DocumentCardTitle,
  DocumentCardLogo,
  IDocumentCardLogoProps,
} from "@fluentui/react/lib/DocumentCard";

type IEmptySlotProps = {
  slot: ISlot;
  onSchedule: any;
};

export default function EmptySlot({ slot, onSchedule }: IEmptySlotProps) {
  const [show, setShow] = useState<boolean>(false);

  const logoProps: IDocumentCardLogoProps = {
    logoIcon: "calendar",
    styles: {
      root: {
        color: "lightgray",
        fontSize: 20,
        paddingRight: 0,
      },
    },
  };

  const onMouseEnter = () => {
    setShow(true);
  };

  const onMouseLeave = () => {
    setShow(false);
  };

  return (
    <DocumentCard
      styles={{ root: { width: 320 } }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={() => onSchedule(slot)}
    >
      <Stack>
        <Stack horizontal>
          <DocumentCardLogo {...logoProps} />
          <Stack.Item styles={{ root: { paddingTop: 8, paddingLeft: 0 } }}>
            <DocumentCardTitle
              styles={{ root: { paddingBottom: 0 } }}
              title={
                format(slot.startDate, "HH:mm") +
                "-" +
                format(slot.endDate, "HH:mm")
              }
            />
          </Stack.Item>
        </Stack>
      </Stack>
    </DocumentCard>
  );
}
