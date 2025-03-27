import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { InventoryRow } from "./InventoryRow";
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationNext, PaginationLink, PaginationEllipsis } from "@/components/ui/pagination";
import { useInventoryProductsContext } from "../../context/InventoryProductsContext";
import { ArrowUpDown, Trash2  } from 'lucide-react';
import { useState } from "react";

export function InventoryTable() {
  const { products, loading, error, currentPage, totalPages, setCurrentPage } = useInventoryProductsContext();
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);

  if (loading) return <p>Loading products...</p>;
  if (error) return <p>Error: {error}</p>;

    // ✅ Check if all products are selected
  const allSelected = selectedProductIds.length === products.length && products.length > 0;
  const anySelected = selectedProductIds.length > 0;

   // ✅ Handle "Select All" checkbox toggle
   const handleSelectAll = (checked: boolean) => {
    setSelectedProductIds(checked ? products.map((product) => product.id) : []);
  };

  // ✅ Handle individual row selection
  const handleSelectRow = (productId: string, checked: boolean) => {
    setSelectedProductIds((prev) =>
      checked ? [...prev, productId] : prev.filter((id) => id !== productId)
    );
  };

  // ✅ Batch Delete Function
  const handleBatchDelete = () => {
    if (!anySelected) return;
    const confirmed = window.confirm(`Are you sure you want to delete ${selectedProductIds.length} items?`);
    if (confirmed) {
      console.log("Deleting products:", selectedProductIds);
      // 🔹 Add API call or state update logic here
      setSelectedProductIds([]); // Clear selection after deletion
    }
  };

  return (
    <div className="shadow-md rounded-lg overflow-hidden backdrop-blur-3xl">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
          <TableHead className="text-secondary-lighter pl-4">
          <Checkbox
               checked={allSelected}
               onCheckedChange={handleSelectAll}
               aria-label="Select all"
               className="border-secondary-lighter border-2"
              />
            </TableHead>
            <TableHead className="text-secondary-lighter">Product Information</TableHead>
            {/* ✅ Price Column with Sorting */}
            <TableHead className="text-secondary-lighter">
              <div className="flex items-center gap-2">
                <ArrowUpDown className="w-4 h-4"/>
                <span>Price</span>
              </div>
            </TableHead>

            {/* ✅ Stock Column with Sorting */}
            <TableHead className="text-secondary-lighter">
              <div className="flex items-center gap-2">
                <ArrowUpDown className="w-4 h-4"/>
                <span>Stock</span>
              </div>
            </TableHead>
            <TableHead className="text-secondary-lighter">Status</TableHead>
             {/* ✅ Actions + Batch Delete Icon */}
            <TableHead className="text-secondary-lighter flex items-center justify-between">
              <span>Actions</span>
              {anySelected && (
                <button onClick={handleBatchDelete} className="text-error transition-opacity hover:opacity-80">
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {products.map((product) => (
            <InventoryRow key={product.id} product={product} isSelected={selectedProductIds.includes(product.id)}
            onSelectChange={handleSelectRow} />
          ))}
        </TableBody>
      </Table>

{/* ✅ Pagination */}
{totalPages > 1 && (
  <Pagination className="mt-4 mb-4 text-secondary-lighter [&_a[aria-current='page']]:bg-[--secondary-light-05] [&_a[aria-current='page']]:text-[--highlight]">
    <PaginationContent>
      
      {/* 🔹 Always Render "Previous" but Disable on First Page */}
      <PaginationItem>
        <PaginationPrevious 
          onClick={currentPage === 1 ? undefined : () => setCurrentPage(currentPage - 1)} 
          className={currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""}
        />
      </PaginationItem>

      {/* Page 1 */}
      <PaginationItem>
        <PaginationLink 
          onClick={() => setCurrentPage(1)} 
          isActive={currentPage === 1}
        >
          1
        </PaginationLink>
      </PaginationItem>

      {/* Ellipsis if needed */}
      {currentPage > 3 && <PaginationEllipsis />}

      {/* Previous Page (before current) */}
      {currentPage > 2 && (
        <PaginationItem>
          <PaginationLink onClick={() => setCurrentPage(currentPage - 1)}>
            {currentPage - 1}
          </PaginationLink>
        </PaginationItem>
      )}

      {/* Current Page */}
      {currentPage !== 1 && currentPage !== totalPages && (
        <PaginationItem>
          <PaginationLink isActive>{currentPage}</PaginationLink>
        </PaginationItem>
      )}

      {/* Next Page (after current) */}
      {currentPage < totalPages - 1 && (
        <PaginationItem>
          <PaginationLink onClick={() => setCurrentPage(currentPage + 1)}>
            {currentPage + 1}
          </PaginationLink>
        </PaginationItem>
      )}

      {/* Ellipsis if needed */}
      {currentPage < totalPages - 2 && <PaginationEllipsis />}

      {/* Last Page */}
      <PaginationItem>
        <PaginationLink 
          onClick={() => setCurrentPage(totalPages)} 
          isActive={currentPage === totalPages}
        >
          {totalPages}
        </PaginationLink>
      </PaginationItem>

      {/* 🔹 Always Render "Next" but Disable on Last Page */}
      <PaginationItem>
        <PaginationNext 
          onClick={currentPage === totalPages ? undefined : () => setCurrentPage(currentPage + 1)} 
          className={currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""}
        />
      </PaginationItem>

    </PaginationContent>
  </Pagination>
)}

    </div>
  );
}
