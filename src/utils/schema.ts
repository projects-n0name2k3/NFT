import * as z from "zod";

const organizerProfileSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  bio: z
    .string()
    .min(10, { message: "Bio must be at least 10 characters." })
    .max(500, { message: "Bio cannot exceed 500 characters." })
    .optional(),
  phone: z.string().optional(),
  website: z
    .string()
    .url({ message: "Please enter a valid URL." })
    .optional()
    .or(z.literal("")),
  x: z
    .string()
    .url({ message: "Please enter a valid URL." })
    .optional()
    .or(z.literal("")),
  instagram: z
    .string()
    .url({ message: "Please enter a valid URL." })
    .optional()
    .or(z.literal("")),
  facebook: z
    .string()
    .url({ message: "Please enter a valid URL." })
    .optional()
    .or(z.literal("")),
  discord: z
    .string()
    .url({ message: "Please enter a valid URL." })
    .optional()
    .or(z.literal("")),
  telegram: z
    .string()
    .url({ message: "Please enter a valid URL." })
    .optional()
    .or(z.literal("")),
});

const EventInfoFormSchema = z.object({
  name: z.string().min(2, "Event name must be at least 2 characters"),
  eventStartDate: z.string(),
  eventEndDate: z.string(),
  eventStartTime: z.string(),
  eventEndTime: z.string(),
  venue: z.string().min(2, "Venue must be at least 2 characters"),
  location: z.object({
    name: z.string().min(2, "Location name must be at least 2 characters"),
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
  }),
  description: z.string().optional(),
  artists: z
    .array(
      z.object({
        name: z.string().optional(),
        walletAddress: z
          .string()
          .optional()
          .refine(
            (val) => {
              if (!val) return true;
              // Ethereum/Metamask address validation (0x followed by 40 hex chars)
              const ethRegex = /^0x[a-fA-F0-9]{40}$/;
              // Coinbase address validation
              const coinbaseRegex = /^(ethereum:|0x)[a-fA-F0-9]{40}$/;
              return ethRegex.test(val) || coinbaseRegex.test(val);
            },
            {
              message: "Please enter a valid wallet address",
            }
          ),
        class: z.string().optional(),
      })
    )
    .optional(),
  ticketStartDate: z.string().optional(),
  ticketEndDate: z.string().optional(),
  ticketStartTime: z.string().optional(),
  ticketEndTime: z.string().optional(),
  tiers: z
    .array(
      z.object({
        name: z.string().min(1),
        price: z.number().min(1),
        quantity: z.number().min(1),
        royaltyTicketTier: z.number().min(1),
        description: z.string().min(2),
      })
    )
    .optional(),
  maxTicketPerWallet: z.number().int().positive().optional(),
});

const EventPromotionFormSchema = z.object({
  description: z.string().min(2, "Description is required"),
  artists: z
    .array(
      z.object({
        name: z.string().min(1, "Artist name is required"),
        walletAddress: z
          .string()
          .min(40, "Please enter a valid wallet address")
          .refine(
            (val) => {
              if (!val) return true;
              // Ethereum/Metamask address validation (0x followed by 40 hex chars)
              const ethRegex = /^0x[a-fA-F0-9]{40}$/;
              // Coinbase address validation
              const coinbaseRegex = /^(ethereum:|0x)[a-fA-F0-9]{40}$/;
              return ethRegex.test(val) || coinbaseRegex.test(val);
            },
            {
              message: "Please enter a valid wallet address",
            }
          ),
        class: z.string().min(1, "Artist class is required"),
      })
    )
    .min(1, "At least one artist is required"),
  ticketStartDate: z.string().optional(),
  ticketEndDate: z.string().optional(),
  ticketStartTime: z.string().optional(),
  ticketEndTime: z.string().optional(),
  tiers: z
    .array(
      z.object({
        name: z.string().min(1),
        price: z.number().min(1),
        quantity: z.number().min(1),
        royaltyTicketTier: z.number().min(1),
        description: z.string().min(2),
      })
    )
    .optional(),
  maxTicketPerWallet: z.number().int().positive().optional(),
});

const EventTicketFormSchema = z.object({
  tiers: z
    .array(
      z.object({
        name: z.string().min(1),
        price: z.number().min(1),
        quantity: z.number().min(1),
        royaltyTicketTier: z.number().min(1),
        description: z.string().min(2),
      })
    )
    .min(1),
  maxTicketPerWallet: z.number().int().positive().optional(),
});

const EventRuleFormSchema = z.object({
  maxTicketPerWallet: z.number(),
});

export {
  organizerProfileSchema,
  EventInfoFormSchema,
  EventPromotionFormSchema,
  EventTicketFormSchema,
  EventRuleFormSchema,
};
