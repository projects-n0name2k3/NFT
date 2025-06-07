/* eslint-disable @typescript-eslint/no-explicit-any */
interface ImageCardProps {
  image: string;
  classname?: string;
}

interface CardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}
interface UpdateImageParams {
  thumbnailUrl?: File;
  coverPhotoUrl?: File;
  role: string | undefined;
  name?: string;
  bio?: string;
}

interface TierProps {
  name: string;
  price: number;
  quantity: number;
  royaltyTicketTier: number;
  description: string;
  minResalePrice?: number;
  maxResalePrice?: number;
}

interface EventProps {
  id: string;
  name: string;
  eventStartDate: string;
  eventEndDate: string;
  eventThumbnailUrl: string;
  location: {
    latitude: number;
    longitude: number;
    locationName: string;
  };
  venue: string;
  minPrice: number;
  maxPrice: number;
  organizerName: string;
  organizerThumbnailUrl: string | null;
  isMarketplace?: boolean;
}

interface TicketProps {
  id: string;
  eventName: string;
  tierName: string;
  quantity: number;
  eventThumbnailUrl: string;
}

interface User {
  id: string;
  createdAt: string;
  updatedAt: string;
  walletAddress: string;
  name: string;
  thumbnailUrl: string;
  coverPhotoUrl: string;
  role: string;
  organizerId?: string;
  email?: string;
  phoneNumber?: string | null;
  bio?: string | null;
  facebookLink?: string | null;
  telegramLink?: string | null;
  instagramLink?: string | null;
  xLink?: string | null;
  discordLink?: string | null;
  websiteLink?: string | null;
}

interface OrganizerProfile {
  name: string;
  phoneNumber: string;
  bio: string;
  coverPhotoImage?: string | File;
  thumbnailImage?: string | File;
  facebookLink: string | null;
  telegramLink: string | null;
  instagramLink: string | null;
  xLink: string | null;
  discordLink: string | null;
  websiteLink: string | null;
}

interface DateFilterProps {
  startDate: Date | null;
  endDate: Date | null;
}

interface StepProps {
  path: string;
  label: string;
  schema: any; // Replace 'any' with the actual type of your schema if available
}

interface EventTier {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  price: number;
  totalSupply: number;
  availableSupply: number;
  maxResalePrice: number;
  minResalePrice: number;
  royaltyPercentage: number;
  description: string;
}

interface EventArtist {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  walletAddress: string;
}

interface EventArtistClass {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  royaltyPercentage: string;
  artists: EventArtist[];
}

interface EventUser {
  id: string;
  createdAt: string;
  updatedAt: string;
  walletAddress: string;
  name: string;
  thumbnailUrl: string;
  coverPhotoUrl: string;
  role: string;
}

interface EventDetails {
  id: string;
  createdAt: string;
  updatedAt: string;
  onChainId: string | null;
  transactionHash: string | null;
  thumbnailUrl: string;
  coverPhotoUrl: string;
  name: string;
  venue: string;
  sellStartDate: string;
  sellEndDate: string;
  eventStartDate: string;
  eventEndDate: string;
  description: string;
  status: string;
  seatmapUrl: string;
  eventMetadataUrl: string | null;
  ticketMetadataUrl: string | null;
  searchVector: string;
  maxPerUser: number;
  artistClasses: EventArtistClass[];
  ticketTiers: EventTier[];
  organizer: EventUser;
  location: {
    latitude: number;
    longitude: number;
    locationName: string;
  };
}

interface ArtistProps {
  name: string;
  walletAddress: string;
  class: string;
}

interface ArtistClassGroup {
  name: string;
  artistCount: number;
  royaltyPercent?: number;
  artists: Array<{
    name: string;
    walletAddress: string;
    class: string;
  }>;
}

interface LocationProps {
  name: string;
  latitude: number;
  longitude: number;
}

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
}

interface TicketCardProps {
  id: string;
  sale_id?: number;
  saleId?: number;
  quantity: number;
  eventId: string;
  eventName: string;
  eventStartDate: string;
  eventEndDate: string;
  venue: string;
  eventThumbnailUrl: string;
  locationName: string;
  price: number;
  tierName: string;
  resaleStatus?: "Pending" | "Open" | "Cancelled" | "Closed";
  isMarketplace?: boolean;
  createdAt?: string;
  status?: string;
  isResale?: boolean;
}

export type {
  ImageCardProps,
  CardProps,
  TierProps,
  UpdateImageParams,
  User,
  OrganizerProfile,
  DateFilterProps,
  StepProps,
  TicketProps,
  EventProps,
  EventTier,
  EventDetails,
  EventFormState,
  ArtistProps,
  ArtistClassGroup,
  LocationProps,
  TicketCardProps,
};
