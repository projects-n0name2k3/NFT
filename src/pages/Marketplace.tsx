import { DateFilterProps } from "@/common/type";
import CardContainer from "@/components/CardContainer";
import FilterButton from "@/components/FilterButton";
import PriceFilter from "@/components/PriceFilter";
import { Input } from "@/components/ui/input";
import useDebounce from "@/hooks/useDebounce";
import api from "@/lib/axios";
import { useInfiniteQuery } from "@tanstack/react-query";
import { ListFilter, SearchIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { toast } from "sonner";

const Marketplace = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [isOpenFilterDrawer, setIsOpenFilterDrawer] = useState(false);

  // These will be draft filter values that don't trigger refetching
  const [draftFilterPrice, setDraftFilterPrice] = useState({
    min: 0,
    max: 0,
  });

  // These are the applied filter values used in the query
  const [appliedFilterPrice, setAppliedFilterPrice] = useState({
    min: 0,
    max: 0,
  });

  const [isShowFilter, setIsShowFilter] = useState(true);

  // Draft date values that don't trigger refetching
  const [draftFilterDate, setDraftFilterDate] = useState<DateFilterProps>({
    startDate: null,
    endDate: null,
  });

  // Applied date values used in the query
  const [appliedFilterDate, setAppliedFilterDate] = useState<DateFilterProps>({
    startDate: null,
    endDate: null,
  });

  // Filter key to trigger refetch only when explicitly applied
  const [filterKey, setFilterKey] = useState(0);

  const updateField = (field: string, value: string) => {
    if (field === "eventStartDate") {
      const startDate = new Date(value);
      startDate.setHours(0, 0, 0, 0);
      // If we already have an end date, make sure start date is not after it
      if (draftFilterDate.endDate && startDate > draftFilterDate.endDate) {
        toast.error("Start date cannot be after end date");
        return;
      }
      setDraftFilterDate({ ...draftFilterDate, startDate });
    } else if (field === "eventEndDate") {
      const endDate = new Date(value);
      endDate.setHours(23, 59, 59, 999);
      // Make sure end date is not before start date
      if (draftFilterDate.startDate && endDate < draftFilterDate.startDate) {
        toast.error("End date cannot be before start date");
        return;
      }
      setDraftFilterDate({ ...draftFilterDate, endDate });
    }
  };

  const handleFilter = () => {
    // Apply the draft filters to the applied filters
    setAppliedFilterPrice(draftFilterPrice);
    setAppliedFilterDate(draftFilterDate);

    // Create URLSearchParams object with current URL parameters
    const searchParams = new URLSearchParams(window.location.search);

    // Add price filter parameters only if they have non-zero values
    if (draftFilterPrice.min > 0) {
      searchParams.set("minPrice", draftFilterPrice.min.toString());
    } else {
      searchParams.delete("minPrice");
    }

    if (draftFilterPrice.max > 0) {
      searchParams.set("maxPrice", draftFilterPrice.max.toString());
    } else {
      searchParams.delete("maxPrice");
    }

    // Use timestamp format for dates in search params
    if (draftFilterDate.startDate) {
      searchParams.set(
        "startDate",
        draftFilterDate.startDate.getTime().toString()
      );
    } else {
      searchParams.delete("startDate");
    }

    if (draftFilterDate.endDate) {
      searchParams.set("endDate", draftFilterDate.endDate.getTime().toString());
    } else {
      searchParams.delete("endDate");
    }

    // Update URL without reloading the page
    const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
    window.history.pushState({ path: newUrl }, "", newUrl);
    toast.success("Filters applied successfully");

    // Increment filter key to force a query refetch
    setFilterKey((prev) => prev + 1);
  };

  const { ref, inView } = useInView({
    threshold: 0,
  });

  async function fetchEvents({ pageParam = 1 }) {
    // Build query parameters object
    const params = new URLSearchParams();

    // Only add parameters if they have meaningful values
    params.append("value", debouncedSearchTerm);
    params.append("page", pageParam.toString());
    params.append("limit", "8");

    if (appliedFilterPrice.min > 0) {
      params.append("minPrice", appliedFilterPrice.min.toString());
    }

    if (appliedFilterPrice.max > 0) {
      params.append("maxPrice", appliedFilterPrice.max.toString());
    }

    if (appliedFilterDate.startDate) {
      params.append(
        "startDate",
        appliedFilterDate.startDate.getTime().toString()
      );
    }

    if (appliedFilterDate.endDate) {
      params.append("endDate", appliedFilterDate.endDate.getTime().toString());
    }

    const { data } = await api.get(`/marketplace?${params.toString()}`);
    return {
      events: data.data.events,
      totalPages: data.data.totalPages,
      currentPage: pageParam,
    };
  }

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
    isSuccess,
  } = useInfiniteQuery({
    queryKey: [
      "marketplace",
      debouncedSearchTerm,
      filterKey, // This ensures we only refetch when filterKey changes
    ],
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

  useEffect(() => {
    // Load filters from URL parameters on component mount
    const searchParams = new URLSearchParams(window.location.search);

    // Load price filters
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");

    const newFilterPrice = {
      min: minPrice ? parseInt(minPrice) : 0,
      max: maxPrice ? parseInt(maxPrice) : 0,
    };

    if (minPrice || maxPrice) {
      setDraftFilterPrice(newFilterPrice);
      setAppliedFilterPrice(newFilterPrice);
      setIsShowFilter(true);
    }

    // Load date filters - using timestamp format
    const startDateParam = searchParams.get("startDate");
    const endDateParam = searchParams.get("endDate");

    let startDate = null;
    let endDate = null;

    if (startDateParam) {
      // Parse as timestamp (milliseconds since epoch)
      startDate = new Date(parseInt(startDateParam));
    }

    if (endDateParam) {
      // Parse as timestamp (milliseconds since epoch)
      endDate = new Date(parseInt(endDateParam));
    }

    const newFilterDate = {
      startDate,
      endDate,
    };

    if (startDateParam || endDateParam) {
      setDraftFilterDate(newFilterDate);
      setAppliedFilterDate(newFilterDate);
      setIsShowFilter(true);
    }
  }, []);

  const handleClear = () => {
    // Clear URL parameters
    window.history.pushState({}, "", window.location.pathname);

    // Reset both draft and applied filters
    const emptyPrice = { min: 0, max: 0 };
    const emptyDate = { startDate: null, endDate: null };

    setDraftFilterPrice(emptyPrice);
    setAppliedFilterPrice(emptyPrice);
    setDraftFilterDate(emptyDate);
    setAppliedFilterDate(emptyDate);

    // Increment filter key to force a query refetch
    setFilterKey((prev) => prev + 1);
  };

  useEffect(() => {
    if (debouncedSearchTerm) {
      console.log(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);

  const events = data?.pages.flatMap((page) => page.events) || [];

  return (
    <div className="flex flex-col gap-4 min-h-screen">
      <div className="py-2 w-full sticky mt-20 top-20 z-20  bg-white">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center w-full border rounded-lg px-3 py-1">
            <SearchIcon />
            <Input
              placeholder="Search by name"
              className="outline-none border-none focus-visible:ring-transparent "
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <FilterButton
            icon={<ListFilter />}
            setIsOpen={setIsOpenFilterDrawer}
            isOpen={isOpenFilterDrawer}
            title="Filter"
            description="Filter by price"
            setIsShowFilter={setIsShowFilter}
            isShowFilter={isShowFilter}
          >
            <h4 className="text-start font-semibold text-lg">Price</h4>
            <PriceFilter
              filterPrice={draftFilterPrice}
              setFilterPrice={setDraftFilterPrice}
            />
          </FilterButton>
        </div>
      </div>
      <CardContainer
        events={events}
        isShowFilter={isShowFilter}
        filterPrice={draftFilterPrice}
        setFilterPrice={setDraftFilterPrice}
        filterDate={draftFilterDate}
        updateField={updateField}
        onSubmit={handleFilter}
        onClear={handleClear}
        infinityRef={ref}
        isLoading={isLoading}
        isError={error}
        isFetchingNextPage={isFetchingNextPage}
        isMarketplace={true}
        isSuccess={isSuccess}
      />
    </div>
  );
};

export default Marketplace;
