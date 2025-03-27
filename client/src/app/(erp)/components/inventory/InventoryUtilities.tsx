import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Filter, Search, ChevronDown, PlusSquare } from "lucide-react";
import { useInventoryProductsContext } from "../../context/InventoryProductsContext";
import { useState, useEffect } from "react";
import { AddNewItemModal } from "../subcomponents/AddNewItemModal"; // ✅ Import modal

export function InventoryUtilities() {
  const { filter, setFilter, searchTerm, setSearchTerm, sort, setSort, refetch } = useInventoryProductsContext();
  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);
  const [isModalOpen, setIsModalOpen] = useState(false); // ✅ Modal state

  // Debounce search input to avoid excessive API calls
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchTerm(debouncedSearch);
    }, 300);
    return () => clearTimeout(handler);
  }, [debouncedSearch]);

  return (
    <div className="flex items-center justify-between p-2 rounded-xl shadow-md backdrop-blur-3xl">
      {/* Left Side: Filter, Search, Sort */}
      <div className="flex items-center gap-3">
        
        {/* Filter Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="flex items-center gap-2 text-secondary-lighter bg-transparent shadow-none hover:bg-[--primary-15] hover:shadow-md">
              <Filter className="w-4 h-4" />
              {filter === "all" ? "All Products" : filter === "In Stock" ? "In Stock" : "Out of Stock"}
              <ChevronDown className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={() => setFilter("all")}>All Products</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilter("In Stock")}>In Stock</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilter("Out of Stock")}>Out of Stock</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Search Input */}
        <div className="relative text-secondary-lighter">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-secondary-lighter" />
          <Input
            placeholder="Search"
            value={debouncedSearch}
            onChange={(e) => setDebouncedSearch(e.target.value)}
            className="pl-10 w-60 text-secondary-lighter bg-[--secondary-light-01] border-none placeholder:text-[--secondary-lighter]"
          />
        </div>

        {/* Sort Button */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="flex items-center gap-2 text-secondary-lighter bg-transparent shadow-none hover:bg-[--primary-15] hover:shadow-md hover:text-secondary-lighter">
              Sort
              <ChevronDown className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={() => setSort("priceAsc")}>Price: Low to High</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSort("priceDesc")}>Price: High to Low</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSort("stockAsc")}>Stock: Low to High</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSort("stockDesc")}>Stock: High to Low</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Right Side: Add New Item */}
      <Button variant="default" className="bg-accent-50 flex items-center gap-2 hover:bg-[--highlight]"  onClick={() => setIsModalOpen(true)}>
        <PlusSquare className="w-4 h-4" />
        Add New Item
      </Button>

       {/* ✅ Render Modal */}
       <AddNewItemModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
