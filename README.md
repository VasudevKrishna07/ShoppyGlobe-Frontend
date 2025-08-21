https://github.com/VasudevKrishna07/ShoppyGlobe

# 🛍️ ShoppyGlobe

ShoppyGlobe is a modern React + Redux Toolkit e‑commerce demo app that fetches products from the **DummyJSON API** and showcases them in a responsive UI with search, categories, sorting, a cart system, and persistent state.

---

## 🚀 Features

- **React 18 + Vite** fast frontend.
- **Redux Toolkit** for state management.
- **Redux Persist** to keep products and cart across page reloads.
- **DummyJSON API** as a live products backend:
  - Fetches on page load for Shop and Home Pages.
  - Stores in Redux to avoid duplicate API calls.
- **Global Search** shared between Header and Product List.
- **Category filter** + Sorting by price, name, rating.
- **Popular Products** section on Home.
- Product Detail page with related items.
- Responsive UI built with **Tailwind CSS**.
- Local/remote assets for hero, banners, 404 page.

---

## 🗂 Folder Structure

src/
assets/ # App images (hero, sale banner, etc.)
components/ # Reusable UI parts (Header, Footer, ProductItem, etc.)
pages/ # Route pages (Home, Shop, CartPage, Checkout, About, ProductPage)
redux/ # Redux slices, store config
App.jsx # Main router layout
main.jsx # App entry point
public/
assets/ # Publicly served images (alternative to src/assets)

## ⚙️ Tech Stack

- **React 18**
- **Redux Toolkit**
- **React Router DOM**
- **Redux Persist**
- **Tailwind CSS**
- **Vite**
- **DummyJSON API** — `https://dummyjson.com/products`


## 📦 Installation

Clone repo
git clone https://github.com/yourusername/shoppyglobe.git
cd shoppyglobe

Install dependencies
npm install

Start development server
npm run dev


## 🌐 API

We use [DummyJSON Products API](https://dummyjson.com/products) to load dummy product data.

In `src/redux/productsSlice.js`:

export const fetchProducts = createAsyncThunk(
'products/fetchProducts',
async (_, { rejectWithValue }) => {
try {
const res = await fetch('https://dummyjson.com/products?limit=30');
if (!res.ok) throw new Error('Failed to fetch products');
const data = await res.json();
return data.products;
} catch (err) {
return rejectWithValue(err.message);
}
}
);


## 💾 State Persistence

`Redux Persist` stores the `products` and `cart` slices in `localStorage`, so:

- Products remain instantly available on page refresh.
- Cart persists for the whole session (and beyond).

Store configuration example (`src/redux/store.js`):

const productsPersistConfig = {
key: 'products',
storage,
blacklist: ['status', 'error', 'searchTerm', 'selectedCategory', 'sortBy', 'sortOrder']
};

const persistedProductsReducer = persistReducer(productsPersistConfig, productsReducer);

export const store = configureStore({
reducer: {
products: persistedProductsReducer,
cart: cartReducer,
},
// middleware...
});

export const persistor = persistStore(store);


## 🖼 Assets

- Place local images inside `src/assets` and **import them** in components:

import saleBanner from '../assets/sale-banner.webp';

<img src={saleBanner} alt="Sale Banner" />;

text

- Or use `public/assets` for static files and link as:

<img src="/assets/sale-banner.webp" alt="Sale Banner" /> ```
Product images are provided by DummyJSON in the thumbnail field.

🛣 Routes
/ → Home (Hero, Categories, Popular Products)

/shop → All products (with controls: search, category, sort)

/category/:category → Filtered products

/product/:id → Product detail

/cart → Shopping cart

/checkout → Checkout

/about → About page

* → Not Found page

🧑‍💻 Author
Anmol Shukla — GitHub

📄 License
MIT License