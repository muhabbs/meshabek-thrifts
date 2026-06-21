export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#1f1b16",
        espresso: "#3a2a1f",
        parchment: "#f7f0e6",
        linen: "#fffaf3",
        rust: "#a94f32",
        olive: "#5d6446",
        gold: "#c59645"
      },
      fontFamily: {
        display: ["Playfair Display", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"]
      },
      boxShadow: {
        soft: "0 18px 55px rgba(31, 27, 22, 0.12)"
      }
    }
  },
  plugins: []
};
