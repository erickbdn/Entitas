import { useState } from "react";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2, Edit, DollarSign } from "lucide-react";
import { useInventoryProductsContext } from "../../context/InventoryProductsContext";
import { EditProductModal } from "../subcomponents/EditProductModal";

interface Product {
  id: string;
  name: string;
  imageUrl: string;
  sku: string;
  price: number;
  stock: number;
  status: string;
  availability: boolean;
}

interface InventoryRowProps {
  product: Product;
  isSelected: boolean;
  onSelectChange: (productId: string, checked: boolean) => void;
}

export function InventoryRow({
  product,
  isSelected,
  onSelectChange,
}: InventoryRowProps) {
  const [isAvailable, setIsAvailable] = useState(product.availability);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { updateProduct, deleteProduct, refetch } =
    useInventoryProductsContext();

  return (
    <TableRow
      className={`border-t transition-colors group h-16 hover:bg-[--secondary-light-05] ${
        isSelected ? "bg-[--secondary-light-05]" : ""
      }`}
    >
      {/* ✅ Select Checkbox */}
      <TableCell className="h-16 px-4">
        <div className="flex items-center h-full">
          <Checkbox
            checked={isSelected}
            onCheckedChange={(checked) => onSelectChange(product.id, !!checked)}
            aria-label={`Select ${product.name}`}
            className="border-secondary-lighter border-2"
          />
        </div>
      </TableCell>

      {/* ✅ Product Info (Image + Name + SKU) */}
      <TableCell className="h-16 px-4">
        <div className="flex items-center space-x-3 h-full">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-14 h-14 rounded-md" // Image is 56x56px
          />
          <div className="flex flex-col justify-center">
            <p className="font-medium leading-none text-secondary-lighter">
              {product.name}
            </p>
            <p className="font-thin text-sm text-secondary-lighter">
              {product.sku}
            </p>
          </div>
        </div>
      </TableCell>

      {/* ✅ Price */}
      <TableCell className="h-16 px-4">
        <div className="flex items-center h-full">
          <div className="relative w-[120px]">
            {" "}
            {/* Adjusted width */}
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-lighter w-5 h-5" />
            <input
              type="number"
              defaultValue={product.price}
              onBlur={async (e) => {
                const newPrice = parseFloat(e.target.value);
                if (newPrice !== product.price) {
                  await updateProduct(product.id, { price: newPrice });
                  refetch();
                }
              }}
              className="pl-8 pr-3 w-full h-12 text-lg bg-transparent border rounded-md text-center text-secondary-lighter focus:outline-none focus:ring-1 focus:ring-gray-300"
            />
          </div>
        </div>
      </TableCell>

      {/* ✅ Stock */}
      <TableCell className="h-16 px-4">
        <div className="flex items-center h-full">
          <input
            type="number"
            defaultValue={product.stock}
            onBlur={async (e) => {
              const newStock = parseInt(e.target.value);
              if (newStock !== product.stock) {
                await updateProduct(product.id, { stock: newStock });
                refetch();
              }
            }}
            className="w-[100px] h-12 px-3 text-lg bg-transparent border rounded-md text-center text-secondary-lighter focus:outline-none focus:ring-1 focus:ring-gray-300"
          />
        </div>
      </TableCell>

      {/* ✅ Status Switch */}
      <TableCell className="h-16 px-4">
        <div className="flex items-center h-full space-x-2">
          <Switch
            checked={isAvailable}
            onCheckedChange={async (checked) => {
              setIsAvailable(checked);
              await updateProduct(product.id, { availability: checked });
              refetch(); // optional, to refresh UI after change
            }}
            className="data-[state=unchecked]:bg-[--secondary-light-01] data-[state=checked]:bg-[--secondary-light-01]"
            thumbColor={isAvailable ? "bg-success" : "bg-error"} // Change thumb color based on state
          />
          <span className="text-sm text-secondary-lighter font-medium">
            {isAvailable ? "Available" : "Unavailable"}
          </span>
        </div>
      </TableCell>

      {/* ✅ Actions (Edit) */}
      <TableCell className="h-16">
        <div className="flex items-center h-full justify-start">
          <Button
            size="default"
            className="flex items-center bg-transparent shadow-none text-secondary-lighter"
            onClick={() => setIsEditModalOpen(true)}
          >
            <Edit className="w-4 h-4 mr-1 text-secondary-lighter" /> Edit
            Details
          </Button>
        </div>
      </TableCell>

      {/* ✅ Actions (Delete) */}
      <TableCell className="h-16 px-4">
        <div className="flex items-center h-full justify-left">
          <button
            className="p-2 text-error transition-opacity opacity-0 group-hover:opacity-100"
            onClick={async () => {
              const confirmed = window.confirm(`Delete ${product.name}?`);
              if (confirmed) {
                await deleteProduct(product.id);
                refetch();
              }
            }}
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </TableCell>
      <EditProductModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        product={product}
      />
    </TableRow>
  );
}
