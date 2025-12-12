import React, { useState } from "react";
import PriceFilter from "../shop/shop-filter/price-filter";

const ShopFilterOffCanvas = ({
  all_products,
  otherProps,
  right_side = false,
}) => {
  const { priceFilterValues } = otherProps;
  const [filterSidebar, setFilterSidebar] = useState(false);

  // max price
  const maxPrice = all_products.reduce((max, product) => {
    return product.price > max ? product.price : max;
  }, 0);

  return (
    <>
      <div
        className={`tp-filter-offcanvas-area ${
          filterSidebar ? "offcanvas-opened" : ""
        }`}
      >
        <div className="tp-filter-offcanvas-wrapper">
          <div className="tp-filter-offcanvas-close">
            <button
              type="button"
              onClick={() => setFilterSidebar(false)}
              className="tp-filter-offcanvas-close-btn filter-close-btn"
            >
              <i className="fa-solid fa-xmark"></i>
              {" "}Close
            </button>
          </div>
          <div className="tp-shop-sidebar">
            <PriceFilter
              priceFilterValues={priceFilterValues}
              maxPrice={maxPrice}
            />
          </div>
        </div>
      </div>

      <div
        onClick={() => setFilterSidebar(false)}
        className={`body-overlay ${filterSidebar ? "opened" : ""}`}
      ></div>
    </>
  );
};

export default ShopFilterOffCanvas;
