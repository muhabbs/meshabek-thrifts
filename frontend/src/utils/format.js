export const formatCurrency = (value) =>
  new Intl.NumberFormat("en-EG", {
    style: "currency",
    currency: "EGP",
    maximumFractionDigits: 0
  }).format(value || 0);

export const categories = ["Hoodies", "Jackets", "Jeans", "Shirts", "Sweaters", "Accessories"];

export const sizes = ["S", "M", "L", "XL", "28", "30", "32", "34", "36", "One Size"];
