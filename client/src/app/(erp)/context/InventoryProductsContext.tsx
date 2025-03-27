import { createContext, useContext, useState } from "react";
import { getAuth } from "firebase/auth";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

// Product Data Structure
interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  status: string;
  imageUrl: string;
  sku: string;
  availability: boolean;
}

// Filter & Sort Options
type FilterType = "all" | "In Stock" | "Out of Stock";
type SortType = "priceAsc" | "priceDesc" | "stockAsc" | "stockDesc";

// Context Type
interface InventoryProductsContextType {
  products: Product[];
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
  loading: boolean;
  error: string | null;
  refetch: () => void;
  filter: FilterType;
  setFilter: (filter: FilterType) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  sort: SortType;
  setSort: (sort: SortType) => void;
}

// Context
const InventoryProductsContext = createContext<InventoryProductsContextType | undefined>(undefined);

// Fetch Products with Pagination, Filters, and Sorting
async function fetchProducts(page: number, filter: FilterType, search: string, sort: SortType) {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");

  const token = await user.getIdToken();
  
  const params = new URLSearchParams({
    page: String(page),
    limit: "10",
    filter,
    search,
    sort,
  });

  const response = await axios.get(`http://localhost:3001/api/inventory-products?${params.toString()}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (response.data.error) throw new Error(response.data.error);
  return response.data;
}

// Provider Component
export function InventoryProductsProvider({ children }: React.PropsWithChildren<{}>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState<FilterType>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sort, setSort] = useState<SortType>("priceAsc");

  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["inventoryProducts", currentPage, filter, searchTerm, sort],
    queryFn: () => fetchProducts(currentPage, filter, searchTerm, sort),
    staleTime: 5000, 
  });

  return (
    <InventoryProductsContext.Provider
      value={{
        products: data?.products || [],
        currentPage,
        totalPages: data?.totalPages || 1,
        setCurrentPage,
        loading: isLoading,
        error: error ? error.message : null,
        refetch,
        filter,
        setFilter,
        searchTerm,
        setSearchTerm,
        sort,
        setSort,
      }}
    >
      {children}
    </InventoryProductsContext.Provider>
  );
}

// Hook to use inventory products
export function useInventoryProductsContext() {
  const context = useContext(InventoryProductsContext);
  if (!context) {
    throw new Error("useInventoryProductsContext must be used within an InventoryProductsProvider");
  }
  return context;
}
