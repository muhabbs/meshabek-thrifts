import { ImagePlus, Pencil, Plus, Trash2, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import api from "../../api/client.js";
import ErrorState from "../../components/ErrorState.jsx";
import LoadingState from "../../components/LoadingState.jsx";
import { categories, formatCurrency, sizes as sizeOptions } from "../../utils/format.js";

const emptyForm = {
  name: "",
  description: "",
  price: "",
  images: "",
  category: "Hoodies",
  featured: false,
  sizes: [{ label: "M", stock: 1 }]
};

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [files, setFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const sortedProducts = useMemo(() => [...products].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)), [products]);

  const load = () => {
    setLoading(true);
    api
      .get("/products")
      .then(({ data }) => setProducts(data))
      .catch(() => setError("Could not load products."))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openCreate = () => {
    setEditing(null);
    setFiles([]);
    setForm(emptyForm);
    setFormOpen(true);
  };

  const openEdit = (product) => {
    setEditing(product);
    setFiles([]);
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      images: product.images.join("\n"),
      category: product.category,
      featured: product.featured,
      sizes: product.sizes?.length ? product.sizes : [{ label: "M", stock: 1 }]
    });
    setFormOpen(true);
  };

  const updateField = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const updateSize = (index, key, value) => {
    setForm((current) => ({
      ...current,
      sizes: current.sizes.map((size, currentIndex) => (currentIndex === index ? { ...size, [key]: key === "stock" ? Number(value) : value } : size))
    }));
  };

  const addSize = () => setForm((current) => ({ ...current, sizes: [...current.sizes, { label: "L", stock: 1 }] }));
  const removeSize = (index) => setForm((current) => ({ ...current, sizes: current.sizes.filter((_, currentIndex) => currentIndex !== index) }));

  const uploadFiles = async () => {
    if (!files.length) return [];
    const payload = new FormData();
    files.forEach((file) => payload.append("images", file));
    const { data } = await api.post("/upload/images", payload, { headers: { "Content-Type": "multipart/form-data" } });
    return data;
  };

  const submit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      const uploadedImages = await uploadFiles();
      const imageUrls = form.images
        .split(/\n|,/)
        .map((image) => image.trim())
        .filter(Boolean)
        .concat(uploadedImages);

      if (imageUrls.length === 0) {
        toast.error("Add at least one product image.");
        setSubmitting(false);
        return;
      }

      const payload = {
        ...form,
        price: Number(form.price),
        images: imageUrls,
        sizes: form.sizes.filter((size) => size.label).map((size) => ({ label: size.label, stock: Number(size.stock || 0) }))
      };

      const request = editing ? api.put(`/products/${editing._id}`, payload) : api.post("/products", payload);
      const { data } = await request;

      setProducts((current) => (editing ? current.map((product) => (product._id === data._id ? data : product)) : [data, ...current]));
      toast.success(editing ? "Product updated." : "Product created.");
      setFormOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not save product.");
    } finally {
      setSubmitting(false);
    }
  };

  const removeProduct = async (product) => {
    if (!window.confirm(`Delete ${product.name}?`)) return;
    try {
      await api.delete(`/products/${product._id}`);
      setProducts((current) => current.filter((item) => item._id !== product._id));
      toast.success("Product deleted.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not delete product.");
    }
  };

  if (loading) return <LoadingState label="Loading products" />;
  if (error) return <ErrorState message={error} />;

  return (
    <div>
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="font-display text-4xl font-black">Products</h1>
          <p className="mt-2 text-sm text-ink/60">Stock automatically controls sold-out status.</p>
        </div>
        <button className="btn-primary" onClick={openCreate}>
          <Plus size={18} /> Add product
        </button>
      </div>

      {formOpen && (
        <form onSubmit={submit} className="mt-6 rounded-lg border border-ink/10 bg-linen p-5 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-display text-2xl font-black">{editing ? "Edit product" : "New product"}</h2>
            <button type="button" className="rounded-full border border-ink/10 p-2" onClick={() => setFormOpen(false)} aria-label="Close form">
              <X size={18} />
            </button>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            <label>
              <span className="label">Name</span>
              <input className="input" value={form.name} onChange={(event) => updateField("name", event.target.value)} required />
            </label>
            <label>
              <span className="label">Price EGP</span>
              <input className="input" type="number" min="0" value={form.price} onChange={(event) => updateField("price", event.target.value)} required />
            </label>
            <label>
              <span className="label">Category</span>
              <select className="input" value={form.category} onChange={(event) => updateField("category", event.target.value)}>
                {categories.map((category) => <option key={category}>{category}</option>)}
              </select>
            </label>
            <label className="flex items-center gap-3 rounded-xl border border-ink/10 bg-white px-4 py-3">
              <input type="checkbox" checked={form.featured} onChange={(event) => updateField("featured", event.target.checked)} />
              <span className="text-sm font-bold">Featured on home page</span>
            </label>
            <label className="lg:col-span-2">
              <span className="label">Description</span>
              <textarea className="input min-h-28" value={form.description} onChange={(event) => updateField("description", event.target.value)} required />
            </label>
            <label className="lg:col-span-2">
              <span className="label">Image URLs</span>
              <textarea className="input min-h-24" placeholder="One URL per line" value={form.images} onChange={(event) => updateField("images", event.target.value)} />
            </label>
            <label className="lg:col-span-2">
              <span className="label">Upload images to Cloudinary</span>
              <div className="flex items-center gap-3 rounded-xl border border-dashed border-ink/20 bg-white p-4">
                <ImagePlus className="text-rust" size={22} />
                <input type="file" multiple accept="image/*" onChange={(event) => setFiles(Array.from(event.target.files || []))} />
              </div>
            </label>
          </div>

          <div className="mt-5">
            <div className="flex items-center justify-between">
              <span className="label mb-0">Sizes and stock</span>
              <button type="button" className="btn-secondary py-2" onClick={addSize}>Add size</button>
            </div>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              {form.sizes.map((size, index) => (
                <div key={`${size.label}-${index}`} className="grid grid-cols-[1fr_1fr_auto] gap-2">
                  <select className="input" value={size.label} onChange={(event) => updateSize(index, "label", event.target.value)}>
                    {sizeOptions.map((option) => <option key={option}>{option}</option>)}
                  </select>
                  <input className="input" type="number" min="0" value={size.stock} onChange={(event) => updateSize(index, "stock", event.target.value)} />
                  <button type="button" className="rounded-xl border border-ink/10 px-3 text-rust" onClick={() => removeSize(index)} aria-label="Remove size">
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button className="btn-primary mt-6" disabled={submitting}>{submitting ? "Saving..." : "Save product"}</button>
        </form>
      )}

      <div className="mt-6 overflow-hidden rounded-lg border border-ink/10 bg-linen">
        <div className="hidden grid-cols-[5rem_1.5fr_1fr_1fr_1fr_auto] gap-4 border-b border-ink/10 px-4 py-3 text-xs font-black uppercase tracking-[0.16em] text-ink/45 lg:grid">
          <span>Image</span><span>Name</span><span>Category</span><span>Price</span><span>Stock</span><span>Actions</span>
        </div>
        {sortedProducts.map((product) => (
          <div key={product._id} className="grid gap-4 border-b border-ink/10 p-4 last:border-b-0 lg:grid-cols-[5rem_1.5fr_1fr_1fr_1fr_auto] lg:items-center">
            <img src={product.images[0]} alt={product.name} className="h-20 w-20 rounded-lg object-cover" />
            <div>
              <p className="font-bold">{product.name}</p>
              {product.soldOut && <span className="mt-2 inline-flex rounded-full bg-rust px-2 py-1 text-xs font-bold text-white">Sold Out</span>}
            </div>
            <p className="text-sm">{product.category}</p>
            <p className="font-bold">{formatCurrency(product.price)}</p>
            <p className="text-sm">{product.stock} item(s)</p>
            <div className="flex gap-2">
              <button className="rounded-full border border-ink/10 p-2" onClick={() => openEdit(product)} aria-label="Edit product"><Pencil size={17} /></button>
              <button className="rounded-full border border-ink/10 p-2 text-rust" onClick={() => removeProduct(product)} aria-label="Delete product"><Trash2 size={17} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminProducts;
