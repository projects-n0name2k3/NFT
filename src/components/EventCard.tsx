import { EventProps } from "@/common/type";
import { Card } from "@/components/ui/card";
import { dateFormat } from "@/utils/dateFormat";
import { formatMoney } from "@/utils/formatMoney";
import { MapPinIcon, ClockIcon, HomeIcon } from "lucide-react";
import { useNavigate } from "react-router";

const EventCard = ({
  eventEndDate,
  eventStartDate,
  id,
  location,
  maxPrice,
  minPrice,
  name,
  organizerName,
  organizerThumbnailUrl,
  eventThumbnailUrl,
  venue,
  isMarketplace = false,
}: EventProps) => {
  const navigate = useNavigate();
  return (
    <Card
      className="group flex flex-col rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer h-fit overflow-hidden"
      onClick={() => {
        if (isMarketplace) {
          navigate(`/marketplace/${id}`);
        } else {
          navigate(`/event/${id}`);
        }
      }}
    >
      <div className="relative overflow-hidden h-64">
        <img
          src={eventThumbnailUrl}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute bottom-0 right-0 bg-black bg-opacity-70 text-white px-3 py-1 rounded-tl-md">
          {minPrice === maxPrice
            ? `${formatMoney(minPrice)} USDT`
            : `${formatMoney(minPrice)} - ${maxPrice} USDT`}
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">
          {name}
        </h3>
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2">
            {organizerThumbnailUrl && (
              <img
                src={organizerThumbnailUrl}
                alt={organizerName}
                className="h-6 w-6 rounded-full object-cover"
              />
            )}
            <span className="text-sm text-gray-600">{organizerName}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-3 text-sm text-gray-600">
          <MapPinIcon className="h-4 w-4 text-gray-500 flex-shrink-0" />
          <span className="line-clamp-1">{location.locationName}</span>
        </div>

        <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
          <HomeIcon className="h-4 w-4 text-gray-500" />
          <span className="line-clamp-1">{venue}</span>
        </div>

        <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
          <ClockIcon className="h-4 w-4 text-gray-500" />
          <span>
            {dateFormat(eventStartDate)} - {dateFormat(eventEndDate)}
          </span>
        </div>
      </div>
    </Card>
  );
};

export default EventCard;
