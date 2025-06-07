import { StepProps } from "@/common/type";
import {
  EventInfoFormSchema,
  EventPromotionFormSchema,
  EventRuleFormSchema,
  EventTicketFormSchema,
} from "@/utils/schema";

export const steps: StepProps[] = [
  { path: "new/info", label: "Event", schema: EventInfoFormSchema },
  {
    path: "new/promotions",
    label: "Promotions",
    schema: EventPromotionFormSchema,
  },
  { path: "new/tickets", label: "Tickets", schema: EventTicketFormSchema },
  { path: "new/rules", label: "Rules", schema: EventRuleFormSchema },
];
