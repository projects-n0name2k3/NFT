import { TicketCardProps } from "@/common/type";
import TicketModalNew from "@/components/TicketModalNew";

import { useState } from "react";

const TicketCard = ({
  tierName,
  saleId,
  quantity,
  id,
  eventEndDate,
  eventId,
  eventName,
  eventStartDate,
  eventThumbnailUrl,
  locationName,
  price,
  venue,
  status,
  isResale,
  createdAt,
}: TicketCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <div
        className="group flex flex-col rounded shadow cursor-pointer h-fit"
        onClick={() => setIsOpen(true)}
      >
        <div className="overflow-hidden rounded ">
          <img
            src={eventThumbnailUrl}
            alt=""
            className=" transition-transform duration-300 group-hover:scale-110 h-60 w-full object-cover"
          />
        </div>
        <div className="p-3 flex flex-col gap-2">
          <h3 className="font-medium text-gray-800">Event: {eventName}</h3>
          <h4 className="text-sm text-gray-500">Venue: {venue}</h4>
          <span className="flex items-center  text-sm text-gray-500">
            <span>
              Date:{" "}
              <span className="text-sm">
                {new Date(eventStartDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}{" "}
                -{" "}
                {new Date(eventEndDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </span>
          </span>
          <span className="text-sm text-gray-500">Price: {price} USDT</span>
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Tier: {tierName}</span>
            <span className="text-sm font-medium">{quantity} available</span>
          </div>
          {isResale && (
            <span className="text-sm text-gray-500 font-medium">
              Resale at :{" "}
              {createdAt &&
                new Date(createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  second: "2-digit",
                  minute: "2-digit",
                })}
            </span>
          )}
        </div>
      </div>
      <TicketModalNew
        id={id}
        tierName={tierName}
        quantity={quantity}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        eventId={eventId}
        eventName={eventName}
        eventStartDate={eventStartDate}
        eventEndDate={eventEndDate}
        venue={venue}
        eventThumbnailUrl={eventThumbnailUrl}
        locationName={locationName}
        price={price}
        status={status}
        saleId={saleId}
      />
    </>
  );
};

export default TicketCard;
