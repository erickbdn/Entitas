import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useInventoryProductsContext } from "../../context/InventoryProductsContext";
import { X } from "lucide-react" // Optional: Use an icon library

interface EditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    id: string;
    name: string;
    price: number;
    stock: number;
    status: string;
    imageUrl: string;
    sku: string;
    availability: boolean;
  } | null;
}

export function EditProductModal({ isOpen, onClose, product }: EditProductModalProps) {
  const { updateProduct } = useInventoryProductsContext();
  const [formData, setFormData] = useState<EditProductModalProps["product"]>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFormData(product);
  }, [product]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!formData) return;
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!formData) return;

    setLoading(true);
    await updateProduct(formData.id, {
      ...formData,
      price: parseFloat(String(formData.price)),
      stock: parseInt(String(formData.stock)),
    });
    setLoading(false);
    onClose();
  };

  if (!formData) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="p-6 p-6 bg-[--secondary-light-01] shadow-lg rounded-lg backdrop-blur-3xl border-0">
        <DialogHeader>
          <DialogTitle className="text-secondary-lighter">Edit Product</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">

          <div className="space-y-1">
            <label className="text-sm font-medium text-secondary-lighter">Product Name</label>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="border-0 border-b border-[--secondary-light-05] text-secondary-lighter rounded-none placeholder:text-[--secondary-light-05]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-secondary-lighter">SKU</label>
            <Input
              name="sku"
              value={formData.sku}
              onChange={handleChange}
              className="border-0 border-b border-[--secondary-light-05] text-secondary-lighter rounded-none placeholder:text-[--secondary-light-05]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-secondary-lighter">Price</label>
            <Input
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              className="border-0 border-b border-[--secondary-light-05] text-secondary-lighter rounded-none placeholder:text-[--secondary-light-05]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-secondary-lighter">Stock</label>
            <Input
              name="stock"
              type="number"
              value={formData.stock}
              onChange={handleChange}
              className="border-0 border-b border-[--secondary-light-05] text-secondary-lighter rounded-none placeholder:text-[--secondary-light-05]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-secondary-lighter">Image URL</label>
            <Input
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              className="border-0 border-b border-[--secondary-light-05] text-secondary-lighter rounded-none placeholder:text-[--secondary-light-05]"
            />
          </div>

          {/* ✅ Availability Switch (styled like InventoryRow) */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-sm font-medium text-secondary-lighter">Availability</span>
            <Switch
              checked={formData.availability}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, availability: Boolean(checked) })
              }
              className="data-[state=unchecked]:bg-[--secondary-light-01] data-[state=checked]:bg-[--secondary-light-01]"
              thumbColor={formData.availability ? "bg-success" : "bg-error"}
            />
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="default" onClick={handleSubmit} disabled={loading}>
            {loading ? "Updating..." : "Update"}
          </Button>
        </DialogFooter>
        <DialogClose asChild>
      <button
        className="absolute right-4 top-4 opacity-100 text-secondary-lighter hover:text-[--secondary-lighter] hover:opacity-100 transition-opacity"
        aria-label="Close"
      >
        <X className="h-4 w-4" />
      </button>
    </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
