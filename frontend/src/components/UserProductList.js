import React from "react";
import "./UserProductList.css";

function UserProductList({ products }) {
  return (
    <div className="user-product-container">
      <h2>Available Products</h2>

      <table className="user-product-table">
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Price (Rs.)</th>
            <th>Category</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 ? (
            <tr>
              <td colSpan="3" style={{ textAlign: "center" }}>
                No products available
              </td>
            </tr>
          ) : (
            products.map((product, index) => (
              <tr key={index}>
                <td>{product.name}</td>
                <td>{product.price}</td>
                <td>{product.category}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default UserProductList;
