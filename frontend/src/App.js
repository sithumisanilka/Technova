import React, { useState } from "react";
import ProductList from "../src/components/ProductList";   // Admin view
import UserProductList from "../src/components/UserProductList"; // User view

function App() {
  // Shared product state (so both admin & user can see products)
  const [products, setProducts] = useState([]);

  return (
    <div className="App">
      <h1 style={{ textAlign: "center", margin: "20px 0" }}>
        🛒 Product Management System
      </h1>

      {/* Admin Section */}
      <section style={{ marginBottom: "40px" }}>
        <h2 style={{ textAlign: "center" }}>Admin Panel</h2>
        <ProductList products={products} setProducts={setProducts} />
      </section>

      <hr />

      {/* User Section */}
      <section>
        <h2 style={{ textAlign: "center" }}>User View</h2>
        <UserProductList products={products} />
      </section>
    </div>
  );
}

export default App;
