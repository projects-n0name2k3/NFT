import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import api from "@/lib/axios";
import { dateFormat } from "@/utils/dateFormat";
import { Box, EyeIcon, SearchIcon } from "lucide-react";
import { useNavigate } from "react-router";
import { useInfiniteQuery } from "@tanstack/react-query";
import useDebounce from "@/hooks/useDebounce";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useInView } from "react-intersection-observer";
import { useDeleteDraft } from "@/hooks/useDeleteDraft";

const EventScreen = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: "200px", // Trigger loading before reaching the very bottom
  });
  async function fetchEvents({ pageParam = 1 }) {
    const { data } = await api.get(
      `/events/organizer?value=${debouncedSearchTerm}&page=${pageParam}&limit=8`
    );
    return {
      events: data.data.events,
      totalPages: data.data.totalPages,
      currentPage: pageParam,
    };
  }

  const { deleteDraft, isPending } = useDeleteDraft();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteQuery({
    queryKey: ["events", debouncedSearchTerm],
    queryFn: fetchEvents,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      // Check if there are more pages to load
      const nextPage = lastPage.currentPage + 1;
      return nextPage <= lastPage.totalPages ? nextPage : undefined;
    },
    staleTime: 0.5 * 60 * 1000, // 5 minutes
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Flatten the pages data correctly
  const events = data?.pages.flatMap((page) => page.events) || [];
  // Placeholder data for skeleton loading
  const skeletonRows = Array(5).fill(0);

  return (
    <>
      <div className="flex items-center justify-between border shadow p-4 rounded bg-white dark:bg-gray-800 dark:border-gray-700 mb-4">
        <div className="flex items-center w-1/3 border border-slate-700 rounded-lg px-3 py-1 dark:border-slate-500 dark:bg-gray-700">
          <SearchIcon className="text-gray-400 mr-2" />
          <Input
            placeholder="Search by event name"
            className="outline-none border-none focus-visible:ring-transparent dark:bg-gray-700 dark:text-gray-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button onClick={() => navigate("new/info")}>Create Event</Button>
      </div>

      {error ? (
        <div className="bg-red-100 dark:bg-red-900/30 p-4 rounded border border-red-300 dark:border-red-800 text-red-800 dark:text-red-300 mb-4">
          Failed to load events. Please try again later.
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded shadow">
          <>
            <Table>
              <TableCaption className="dark:text-gray-300">
                A list of your events.
              </TableCaption>
              <TableHeader>
                <TableRow className="dark:border-gray-700">
                  <TableHead className="w-[100px]"></TableHead>
                  <TableHead>Event Name</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>Event Venue</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-center">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  // Skeleton loading state
                  skeletonRows.map((_, index) => (
                    <TableRow
                      key={`skeleton-${index}`}
                      className="dark:border-gray-700"
                    >
                      <TableCell>
                        <Skeleton className="w-12 h-12 rounded-lg dark:bg-gray-700" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-32 dark:bg-gray-700" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-24 dark:bg-gray-700" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-24 dark:bg-gray-700" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-28 dark:bg-gray-700" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-16 dark:bg-gray-700" />
                      </TableCell>
                      <TableCell className="flex items-center justify-center gap-2">
                        <Skeleton className="h-10 w-24 dark:bg-gray-700" />
                        <Skeleton className="h-10 w-24 dark:bg-gray-700" />
                        <Skeleton className="h-10 w-24 dark:bg-gray-700" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : events ? (
                  events.map((event) => (
                    <TableRow key={event.id} className="dark:border-gray-700">
                      <TableCell>
                        <img
                          src={event.thumbnailUrl}
                          alt="event-thumbnail"
                          className="w-12 h-12 rounded-lg object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "/placeholder-image.png";
                          }}
                        />
                      </TableCell>
                      <TableCell className="font-medium dark:text-gray-200">
                        {event.name}
                      </TableCell>
                      <TableCell className="dark:text-gray-300">
                        {dateFormat(event.eventStartDate)}
                      </TableCell>
                      <TableCell className="dark:text-gray-300">
                        {dateFormat(event.eventEndDate)}
                      </TableCell>
                      <TableCell className="dark:text-gray-300">
                        {event.venue || "N/A"}
                      </TableCell>
                      <TableCell className="space-x-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs capitalize ${
                            new Date(event.eventEndDate) < new Date()
                              ? "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300"
                              : event.status === "active" ||
                                event.status === "published"
                              ? "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300"
                              : event.status === "draft"
                              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300"
                              : event.status === "pending"
                              ? "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300"
                              : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                          }`}
                        >
                          {new Date(event.eventEndDate) < new Date()
                            ? "ended"
                            : event.status}
                        </span>
                      </TableCell>
                      <TableCell className="flex items-center justify-center gap-2">
                        <Button
                          className="flex items-center gap-2 border p-3"
                          onClick={() => navigate(`${event.id}`)}
                        >
                          <EyeIcon size={18} />
                          View
                        </Button>
                        {event.status === "draft" && (
                          <div className="flex items-center gap-2">
                            <Button
                              variant="destructive"
                              className="flex items-center gap-2 border p-3"
                              onClick={() => deleteDraft(event.id)}
                              disabled={isPending}
                            >
                              <Box size={18} />
                              Delete
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow className="dark:border-gray-700">
                    <TableCell
                      colSpan={7}
                      className="text-center py-8 text-gray-500 dark:text-gray-400"
                    >
                      No events found.{" "}
                      {searchTerm && "Try a different search term or"} create a
                      new event.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            {hasNextPage && (
              <div ref={ref} className="flex justify-center py-4">
                {isFetchingNextPage ? (
                  <div className="flex items-center space-x-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                    <p className="text-sm text-muted-foreground dark:text-gray-400">
                      Loading more...
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground dark:text-gray-400">
                    Load more
                  </p>
                )}
              </div>
            )}
            {isFetchingNextPage && (
              <div className="py-4">
                {skeletonRows.slice(0, 2).map((_, index) => (
                  <TableRow
                    key={`load-more-skeleton-${index}`}
                    className="dark:border-gray-700"
                  >
                    <TableCell>
                      <Skeleton className="w-12 h-12 rounded-lg dark:bg-gray-700" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-32 dark:bg-gray-700" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-24 dark:bg-gray-700" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-24 dark:bg-gray-700" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-28 dark:bg-gray-700" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-16 dark:bg-gray-700" />
                    </TableCell>
                    <TableCell className="flex items-center justify-center gap-2">
                      <Skeleton className="h-10 w-24 dark:bg-gray-700" />
                      <Skeleton className="h-10 w-24 dark:bg-gray-700" />
                      <Skeleton className="h-10 w-24 dark:bg-gray-700" />
                    </TableCell>
                  </TableRow>
                ))}
              </div>
            )}
          </>
        </div>
      )}
    </>
  );
};

export default EventScreen;
