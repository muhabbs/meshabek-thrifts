import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client.js";
import ErrorState from "../components/ErrorState.jsx";
import LoadingState from "../components/LoadingState.jsx";
import ProductCard from "../components/ProductCard.jsx";
import { categories } from "../utils/format.js";

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/products/featured")
      .then(({ data }) => setFeatured(data))
      .catch(() => setError("Could not load featured products."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <section className="relative overflow-hidden border-b border-ink/10">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1800&q=80"
            alt="Vintage fashion editorial"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/45 to-transparent" />
        </div>
        <div className="container-page relative flex min-h-[calc(100vh-5rem)] items-center py-20">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="max-w-2xl text-linen">
            <span className="inline-flex items-center gap-2 rounded-full border border-linen/20 bg-linen/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em]">
              <Sparkles size={15} /> Egyptian thrift curated weekly
            </span>
            <h1 className="mt-6 font-display text-5xl font-black leading-[1.02] sm:text-6xl lg:text-7xl">Meshabek Store</h1>
            <p className="mt-6 max-w-xl text-base leading-8 text-linen/82 sm:text-lg">
              Premium vintage clothing, washed denim, cozy knits, and one-off streetwear pieces selected for people who dress with memory and edge.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/products" className="btn-primary bg-linen text-ink hover:bg-gold">
                Shop collection <ArrowRight size={18} />
              </Link>
              <Link to="/about" className="btn-secondary border-linen/30 bg-transparent text-linen hover:border-linen hover:text-linen">
                Our story
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="container-page py-16">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="label">Featured pieces</p>
            <h2 className="font-display text-4xl font-black">Fresh from the rack</h2>
          </div>
          <Link to="/products" className="btn-secondary">
            View all <ArrowRight size={18} />
          </Link>
        </div>
        <div className="mt-8">
          {loading && <LoadingState label="Loading featured products" />}
          {error && <ErrorState message={error} />}
          {!loading && !error && <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{featured.slice(0, 8).map((product) => <ProductCard key={product._id} product={product} />)}</div>}
        </div>
      </section>

      <section className="bg-ink py-16 text-linen">
        <div className="container-page">
          <p className="label text-gold">Categories</p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
            {categories.map((category) => (
              <Link key={category} to={`/products?category=${category}`} className="rounded-lg border border-linen/10 bg-linen/5 p-5 font-display text-2xl font-black transition hover:bg-linen hover:text-ink">
                {category}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page grid gap-10 py-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <img
          src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80"
          alt="Fashion store"
          className="aspect-[4/5] w-full rounded-lg object-cover shadow-soft"
        />
        <div>
          <p className="label">New arrivals every drop</p>
          <h2 className="font-display text-4xl font-black">Vintage without the dusty feeling.</h2>
          <p className="mt-5 text-base leading-8 text-ink/68">
            Meshabek Store sources expressive secondhand pieces, cleans and checks every item, then drops them online with clear sizing, stock, and fair prices in EGP.
          </p>
          <Link to="/products?sort=newest" className="btn-primary mt-8">
            Explore new arrivals <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </>
  );
};

export default Home;
