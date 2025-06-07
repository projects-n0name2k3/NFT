/* eslint-disable @typescript-eslint/no-explicit-any */
import { DateFilterProps, EventProps, TicketCardProps } from "@/common/type";
import ApplyButton from "@/components/ApplyButton";
import EventCard from "@/components/EventCard";
import DateTimeSection from "@/components/organizer/DateTimeSection";
import PriceFilter from "@/components/PriceFilter";
import TicketCard from "@/components/TicketCard";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface CardContainerProps {
  tickets?: TicketCardProps[];
  events?: EventProps[];
  isShowFilter?: boolean;
  filterPrice?: { min: number; max: number };
  setFilterPrice?: (value: { min: number; max: number }) => void;
  filterDate?: DateFilterProps;
  updateField?: (name: string, value: string) => void;
  onSubmit?: () => void;
  onClear?: () => void;
  infinityRef?: any;
  isLoading?: boolean;
  isError?: Error | null;
  isFetchingNextPage?: boolean;
  isMarketplace?: boolean;
  isSuccess?: boolean;
  isResale?: boolean;
}

const CardContainer = ({
  tickets,
  events,
  isShowFilter,
  filterPrice,
  filterDate,
  setFilterPrice,
  updateField,
  onSubmit,
  onClear,
  infinityRef,
  isLoading,
  isError,
  isFetchingNextPage,
  isMarketplace = false,
  isSuccess,
  isResale = false,
}: CardContainerProps) => {
  return (
    <div className="flex gap-2 relative w-full">
      {!tickets && (
        <div
          className={` border shadow rounded h-[600px] text-nowrap sticky top-40 transition-all duration-300 ease-in-out flex flex-col md:block hidden gap-4 ${
            isShowFilter
              ? "w-[300px] min-w-[300px] opacity-100 left-0 "
              : "w-0 min-w-[0px] opacity-0 -left-10"
          }`}
        >
          <Accordion
            type="multiple"
            className="p-2"
            defaultValue={["item-1", "item-2"]}
          >
            <AccordionItem value="item-1">
              <AccordionTrigger className="hover:no-underline">
                Filter by Price
              </AccordionTrigger>
              <AccordionContent>
                <div className="p-3 flex flex-col gap-4">
                  {setFilterPrice && (
                    <PriceFilter
                      filterPrice={filterPrice}
                      setFilterPrice={setFilterPrice}
                    />
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
            {filterDate && (
              <AccordionItem value="item-2">
                <AccordionTrigger className="hover:no-underline">
                  Filter by Date
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-col items-center gap-4">
                    <DateTimeSection
                      title="Start date"
                      date={filterDate.startDate}
                      dateField="eventStartDate"
                      updateField={updateField}
                    />
                    <DateTimeSection
                      title="End date"
                      date={filterDate.endDate}
                      dateField="eventEndDate"
                      updateField={updateField}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}
          </Accordion>
          <div className="p-3">
            <ApplyButton
              label="Apply"
              secondaryLabel="Clear"
              onSubmit={onSubmit}
              onClear={onClear}
            />
          </div>
        </div>
      )}

      <div
        className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full duration-300 ${
          isShowFilter ? "ml-[0px]" : "ml-0"
        }`}
      >
        {tickets &&
          tickets.map((ticket) => (
            <TicketCard
              id={ticket.id}
              key={ticket.id}
              tierName={ticket.tierName}
              quantity={ticket.quantity}
              eventId={ticket.eventId}
              eventName={ticket.eventName}
              eventStartDate={ticket.eventStartDate}
              eventEndDate={ticket.eventEndDate}
              venue={ticket.venue}
              eventThumbnailUrl={ticket.eventThumbnailUrl}
              locationName={ticket.locationName}
              price={ticket.price}
              createdAt={ticket.createdAt}
              status={ticket.status}
              saleId={ticket.sale_id}
              isResale={isResale}
            />
          ))}
        {events && events.length > 0
          ? events.map((event) => (
              <EventCard
                key={event.id}
                id={event.id}
                name={event.name}
                eventEndDate={event.eventEndDate}
                eventStartDate={event.eventStartDate}
                location={event.location}
                venue={event.venue}
                organizerName={event.organizerName}
                organizerThumbnailUrl={event.organizerThumbnailUrl}
                eventThumbnailUrl={event.eventThumbnailUrl}
                minPrice={event.minPrice}
                maxPrice={event.maxPrice}
                isMarketplace={isMarketplace}
              />
            ))
          : isSuccess && (
              <div className="col-span-full text-center py-8">
                No events found
              </div>
            )}
        {isLoading &&
          !isSuccess &&
          !isError &&
          Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="animate-pulse bg-gray-200 rounded-lg h-96 w-full"
            ></div>
          ))}
        {isError &&
          Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="animate-pulse bg-gray-200 rounded-lg h-96 w-full"
            ></div>
          ))}
        {isFetchingNextPage && (
          <div className="col-span-full text-center py-4">Loading more...</div>
        )}
        <div ref={infinityRef} className="h-10 w-full col-span-full" />
      </div>
    </div>
  );
};

export default CardContainer;
