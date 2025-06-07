import CardContainer from "@/components/CardContainer";
import FilterButton from "@/components/FilterButton";
import SearchInput from "@/components/profile/SearchInput";
import SortFilter from "@/components/SortFilter";
import { sortList } from "@/constants";
import useDebounce from "@/hooks/useDebounce";
import api from "@/lib/axios";
import useUserStore from "@/store/user-store";
import { useInfiniteQuery } from "@tanstack/react-query";
import { ArrowUpDown } from "lucide-react";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

const Inventory = () => {
  const { user } = useUserStore();
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const { ref, inView } = useInView({
    threshold: 0,
  });
  const [isOpenSortDrawer, setIsOpenSortDrawer] = useState(false);
  const [sortType, setSortType] = useState({
    label: sortList[0].label,
    value: sortList[0].value,
  });
  const [open, setOpen] = useState(false);
  const handleChangeSort = (item: { label: string; value: string }) => {
    setSortType(item);
    setOpen(false);
    setIsOpenSortDrawer(false);
  };
  async function fetchTickets({ pageParam = 1 }) {
    // Build query parameters object
    const params = new URLSearchParams();

    // Only add parameters if they have meaningful values
    params.append("value", encodeURIComponent(debouncedSearchTerm));
    params.append("sortType", sortType.value);
    params.append("page", pageParam.toString());
    params.append("limit", "8");

    const { data } = await api.get(`/tickets/inventory?${params.toString()}`);
    return {
      events: data.data.tickets,
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
  } = useInfiniteQuery({
    queryKey: ["tickets", debouncedSearchTerm, sortType.value],
    queryFn: fetchTickets,
    enabled: !!user,
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
  const tickets = data?.pages.flatMap((page) => page.events) || [];

  return (
    <>
      <h3 className="text-3xl font-semibold  mt-4 text-center w-full">
        Inventory
      </h3>
      <div className="p-3 w-full sticky top-16 z-20 bg-white">
        <div className="flex items-center justify-between gap-4">
          <SearchInput searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          <div className="flex items-center gap-2 flex-1 ">
            {/* Mobile */}
            <FilterButton
              title="Sort"
              description="Sort by price, date, or recently added"
              icon={<ArrowUpDown />}
              isOpen={isOpenSortDrawer}
              setIsOpen={setIsOpenSortDrawer}
              items={sortList}
              onItemClick={handleChangeSort}
            />

            {/* Desktop */}
            <SortFilter
              sortList={sortList}
              sortType={sortType.label}
              open={open}
              setOpen={setOpen}
              value={sortType.value}
              setValue={handleChangeSort}
            />
          </div>
        </div>
      </div>
      <CardContainer
        tickets={tickets}
        infinityRef={ref}
        isLoading={isLoading}
        isError={error}
        isFetchingNextPage={isFetchingNextPage}
      />
    </>
  );
};

export default Inventory;
