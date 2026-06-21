import { Search, SlidersHorizontal } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/client.js";
import ErrorState from "../components/ErrorState.jsx";
import LoadingState from "../components/LoadingState.jsx";
import ProductCard from "../components/ProductCard.jsx";
import { categories, sizes } from "../utils/format.js";

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    category: searchParams.get("category") || "",
    size: searchParams.get("size") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    sort: searchParams.get("sort") || "newest"
  });

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => value && params.set(key, value));
    return params.toString();
  }, [filters]);

  useEffect(() => {
    setSearchParams(queryString);
    setLoading(true);
    setError("");
    api
      .get(`/products?${queryString}`)
      .then(({ data }) => setProducts(data))
      .catch(() => setError("Could not load products."))
      .finally(() => setLoading(false));
  }, [queryString, setSearchParams]);

  const updateFilter = (key, value) => setFilters((current) => ({ ...current, [key]: value }));

  return (
    <section className="container-page py-10">
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <p className="label">Shop thrift</p>
          <h1 className="font-display text-5xl font-black">All products</h1>
        </div>
        <p className="text-sm font-bold text-ink/60">{products.length} item(s)</p>
      </div>

      <div className="mt-8 rounded-lg border border-ink/10 bg-linen p-4 shadow-sm">
        <div className="grid gap-3 lg:grid-cols-[1.4fr_repeat(5,1fr)]">
          <label className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/35" size={18} />
            <input className="input pl-10" placeholder="Search jackets, jeans..." value={filters.search} onChange={(event) => updateFilter("search", event.target.value)} />
          </label>
          <select className="input" value={filters.category} onChange={(event) => updateFilter("category", event.target.value)}>
            <option value="">All categories</option>
            {categories.map((category) => (
              <option key={category}>{category}</option>
            ))}
          </select>
          <select className="input" value={filters.size} onChange={(event) => updateFilter("size", event.target.value)}>
            <option value="">All sizes</option>
            {sizes.map((size) => (
              <option key={size}>{size}</option>
            ))}
          </select>
          <input className="input" type="number" min="0" placeholder="Min EGP" value={filters.minPrice} onChange={(event) => updateFilter("minPrice", event.target.value)} />
          <input className="input" type="number" min="0" placeholder="Max EGP" value={filters.maxPrice} onChange={(event) => updateFilter("maxPrice", event.target.value)} />
          <select className="input" value={filters.sort} onChange={(event) => updateFilter("sort", event.target.value)}>
            <option value="newest">Newest</option>
            <option value="priceAsc">Price low</option>
            <option value="priceDesc">Price high</option>
            <option value="name">Name</option>
          </select>
        </div>
        <div className="mt-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-ink/45">
          <SlidersHorizontal size={15} /> Filters update instantly
        </div>
      </div>

      <div className="mt-8">
        {loading && <LoadingState label="Loading products" />}
        {error && <ErrorState message={error} />}
        {!loading && !error && products.length === 0 && <ErrorState message="No products are available yet." />}
        {!loading && !error && products.length > 0 && <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{products.map((product) => <ProductCard key={product._id} product={product} />)}</div>}
      </div>
    </section>
  );
};

export default Products;
