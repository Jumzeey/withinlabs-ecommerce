# 🛍️ E-Commerce Product Listing App

![Project Screenshot](./screenshot.png)

A **Next.js**-based product listing application with server-side rendering, filtering, and cart functionality.

---

## ✨ Features

- 🚀 Server-side rendered product listings  
- 🔍 Product search and filtering  
- 🛒 Persistent cart functionality  
- 📱 Responsive design  
- ⚡ Optimized performance  

---

## 🏗️ Architecture Overview

### 🧰 Tech Stack

- **Framework**: Next.js (App Router)  
- **Styling**: Tailwind CSS  
- **State Management**: React Context API  
- **Mock API**: JSON Server  
- **Types**: TypeScript  

### 📁 Directory Structure

```
ecommerce-app/
├── app/
│   ├── page.tsx               # Main product listing
│   ├── products/
│   │   └── [id]/page.tsx      # Product detail pages
│   └── components/            # Reusable components
├── lib/
│   └── api.ts                 # API client
├── context/
│   └── CartContext.tsx        # Cart state management
├── public/
└── README.md
```

---

## 🧠 Key Decisions

### 1. Data Fetching Strategy

```ts
// Example of server-side data fetching
export async function getServerSideProps() {
  const products = await fetchProducts();
  return { props: { products } };
}
```

**Rationale**:
- Enables SEO-friendly server rendering  
- Provides fresh data on each request  
- Simplifies initial page load performance  

### 2. State Management

```ts
// Context provider with localStorage persistence
export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const saved = typeof window !== 'undefined' 
      ? localStorage.getItem('cart') 
      : null;
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);
}
```

**Benefits**:
- No external dependencies  
- Persists cart between sessions  
- Simple API for components  

---

## ⚖️ Trade-offs

| Decision                     | Benefit             | Drawback                   |
|-----------------------------|---------------------|----------------------------|
| SSR over Static Generation  | Real-time data      | Slower TTFB                |
| Client-side cart            | Simple implementation | Not cross-device         |
| Basic pagination            | Easy to implement   | Full page reloads          |

---

## 🚀 Getting Started

### 🔧 Prerequisites

- Node.js 16+  
- npm or yarn  

### 🛠️ Installation

Clone the repository:

```bash
git clone https://github.com/your-username/ecommerce-app.git
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Start JSON Server (in a separate terminal):

```bash
npm run server
```

---

## 🔮 Future Improvements

### 🔥 High Priority

- Add loading skeletons  
- Implement debounced search  
- Cart validation against inventory  

### ✨ Nice-to-have

- Infinite scroll pagination  
- User authentication  
- Checkout flow  

---

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run end-to-end tests
npm run test:e2e
```

---

## 🤝 Contributing

1. Fork the project  
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)  
3. Commit your changes (`git commit -m 'Add some amazing feature'`)  
4. Push to the branch (`git push origin feature/AmazingFeature`)  
5. Open a Pull Request  

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.
