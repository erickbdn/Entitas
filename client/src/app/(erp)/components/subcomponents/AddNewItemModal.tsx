import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react"; // Optional: Use an icon library
import { useInventoryProductsContext } from "../../context/InventoryProductsContext";

export function AddNewItemModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { refetch, addProduct } = useInventoryProductsContext();
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
    sku: "",
    status: "In Stock",
    imageUrl: "",
  });
  const [loading, setLoading] = useState(false);

  // 🔹 Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🔹 Handle form submit
  const handleSubmit = async () => {
    try {
      setLoading(true);
  
      await addProduct({
        name: formData.name,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        sku: formData.sku,
        status: formData.status,
        imageUrl: formData.imageUrl,
      });
  
      refetch(); // ✅ Refresh list
      onClose(); // ✅ Close modal
    } catch (error) {
      console.error("Error adding product:", error);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="p-6 bg-[--secondary-light-01] shadow-lg rounded-lg backdrop-blur-3xl border-0">
        <DialogHeader>
          <DialogTitle className="text-secondary-lighter">Add New Item</DialogTitle>
        </DialogHeader>

        {/* 🔹 Input Fields */}
        <div className="space-y-4">
          <Input
            name="name"
            placeholder="Product Name"
            value={formData.name}
            onChange={handleChange}
            className="border-0 border-b border-[--secondary-light-05] text-secondary-lighter rounded-none placeholder:text-[--secondary-light-05]"
          />
          <Input
            name="price"
            type="number"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
            className="border-0 border-b border-[--secondary-light-05] text-secondary-lighter rounded-none placeholder:text-[--secondary-light-05]"
          />
          <Input
            name="stock"
            type="number"
            placeholder="Stock"
            value={formData.stock}
            onChange={handleChange}
            className="border-0 border-b border-[--secondary-light-05] text-secondary-lighter rounded-none placeholder:text-[--secondary-light-05]"
          />
          <Input
            name="sku"
            placeholder="SKU"
            value={formData.sku}
            onChange={handleChange}
            className="border-0 border-b border-[--secondary-light-05] text-secondary-lighter rounded-none placeholder:text-[--secondary-light-05]"
          />
          <Input
            name="imageUrl"
            placeholder="Image URL"
            value={formData.imageUrl}
            onChange={handleChange}
            className="border-0 border-b border-[--secondary-light-05] text-secondary-lighter rounded-none placeholder:text-[--secondary-light-05]"
          />
        </div>

        {/* 🔹 Footer Buttons */}
        <DialogFooter className="mt-4 flex justify-end space-x-3">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="default" onClick={handleSubmit} disabled={loading}>
            {loading ? "Adding..." : "Add Item"}
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
