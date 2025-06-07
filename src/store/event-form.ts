import {
  ArtistClassGroup,
  ArtistProps,
  LocationProps,
  TierProps,
} from "@/common/type";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface EventFormState {
  name: string;
  eventStartDate: string;
  eventStartTime: string;
  eventEndDate: string;
  eventEndTime: string;
  venue: string;
  location: LocationProps;
  thumbnail?: string;
  coverPhoto?: string;
  description?: string;
  artists?: ArtistProps[];
  seatMap?: string;
  ticketStartDate: string;
  ticketStartTime: string;
  ticketEndDate: string;
  ticketEndTime: string;
  tiers?: TierProps[];
  artistClasses?: ArtistClassGroup[];
  maxTicketPerWallet: number;
  previewThumbnail?: string;
  previewCoverPhoto?: string;
  previewSeatMap?: string;

  // Actions
  updateField: (
    field: string,
    value:
      | string
      | ArtistProps[]
      | TierProps[]
      | string
      | ArrayBuffer
      | null
      | File
      | number
  ) => void;
  addTier: () => void;
  updateArtistClasses: () => void;
  updateTier: (index: number, field: string, value: string | number) => void;
  updateLocation: (location: LocationProps) => void;
  updateRoyaltyPercent: (className: string, percent: number) => void;
  updateForm: (
    data: Partial<
      Omit<EventFormState, "updateField" | "updateForm" | "resetForm">
    >
  ) => void;
  resetForm: () => void;
  resetImage: () => void;
}

const initialState = {
  name: "",
  eventStartDate: "",
  eventStartTime: "00:00",
  eventEndDate: "",
  eventEndTime: "01:00",
  venue: "",
  thumbnail: "",
  coverPhoto: "",
  description: "",
  artists: [],
  seatMap: "",
  location: {
    name: "",
    latitude: 0,
    longitude: 0,
  },
  ticketStartDate: "",
  ticketStartTime: "",
  ticketEndDate: "",
  ticketEndTime: "",
  tiers: [],
  maxTicketPerWallet: 1,
  previewThumbnail: "",
  previewCoverPhoto: "",
  previewSeatMap: "",
  artistClasses: [],
};

export const useEventFormStore = create<EventFormState>()(
  persist(
    (set) => ({
      ...initialState,

      updateField: (field, value) =>
        set((state) => ({ ...state, [field]: value })),

      updateArtistClasses: () =>
        set((state) => {
          const classMap: Record<string, ArtistClassGroup> = {};

          // Create a map of existing royalty percentages
          const existingRoyaltyPercentages: Record<string, number> = {};
          state.artistClasses?.forEach((classGroup) => {
            existingRoyaltyPercentages[classGroup.name] =
              classGroup.royaltyPercent || 0;
          });

          state.artists?.forEach((artist) => {
            if (!artist.class) return;

            if (!classMap[artist.class]) {
              classMap[artist.class] = {
                name: artist.class,
                artistCount: 0,
                artists: [],
                // Use existing royalty percent if available, otherwise default to 0
                royaltyPercent: existingRoyaltyPercentages[artist.class] || 0,
              };
            }

            classMap[artist.class].artists.push(artist);
            classMap[artist.class].artistCount += 1;
          });

          return { ...state, artistClasses: Object.values(classMap) };
        }),
      addTier: () =>
        set((state) => {
          const newTier = {
            name: "",
            price: 0,
            quantity: 0,
            royaltyTicketTier: 0,
            description: "",
          };
          return { ...state, tiers: [...(state.tiers || []), newTier] };
        }),
      updateTier: (index, field, value) =>
        set((state) => {
          const updatedTiers = state.tiers?.map((tier, i) =>
            i === index ? { ...tier, [field]: value } : tier
          );
          return { ...state, tiers: updatedTiers };
        }),
      updateLocation: (location) => set((state) => ({ ...state, location })),
      updateRoyaltyPercent: (className, percent) =>
        set((state) => {
          console.log(className, percent);
          const updatedClasses = state.artistClasses?.map((classGroup) =>
            classGroup.name === className
              ? { ...classGroup, royaltyPercent: percent }
              : classGroup
          );
          return { ...state, artistClasses: updatedClasses };
        }),

      updateForm: (data) => set((state) => ({ ...state, ...data })),

      resetForm: () => set(initialState),
      resetImage: () =>
        set((state) => ({
          ...state,
          thumbnail: "",
          coverPhoto: "",
          seatMap: "",
          previewThumbnail: "",
          previewCoverPhoto: "",
          previewSeatMap: "",
        })),
    }),
    {
      name: "event-form-storage",
    }
  )
);
