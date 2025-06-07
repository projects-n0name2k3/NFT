import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";

interface SearchInputProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}
const SearchInput = ({ searchTerm, setSearchTerm }: SearchInputProps) => {
  return (
    <div className="flex items-center w-full border rounded-lg px-3 py-1">
      <SearchIcon />
      <Input
        placeholder="Search by Event's name"
        className="outline-none border-none focus-visible:ring-transparent "
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
};

export default SearchInput;
