import { useState } from "react";

const PriceFilter = ({ priceFilterValues, maxPrice }) => {
  const { priceValue, handleChanges } = priceFilterValues;
  
  const handleMinChange = (e) => {
    const newMin = Number(e.target.value);
    if (newMin <= priceValue[1]) {
      handleChanges([newMin, priceValue[1]]);
    }
  };

  const handleMaxChange = (e) => {
    const newMax = Number(e.target.value);
    if (newMax >= priceValue[0]) {
      handleChanges([priceValue[0], newMax]);
    }
  };

  return (
    <>
      <div className="tp-shop-widget mb-35">
        <h3 className="tp-shop-widget-title no-border">Price Filter</h3>

        <div className="tp-shop-widget-content">
          <div className="tp-shop-widget-filter">
            <div id="slider-range" className="mb-10">
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <input
                  type="range"
                  min={0}
                  max={maxPrice}
                  value={priceValue[0]}
                  onChange={handleMinChange}
                  style={{ flex: 1 }}
                />
                <input
                  type="range"
                  min={0}
                  max={maxPrice}
                  value={priceValue[1]}
                  onChange={handleMaxChange}
                  style={{ flex: 1 }}
                />
              </div>
            </div>
            <div className="tp-shop-widget-filter-info d-flex align-items-center justify-content-between">
              <span className="input-range">
                ${priceValue[0]} - ${priceValue[1]}
              </span>
              <button className="tp-shop-widget-filter-btn" type="button">
                Filter
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PriceFilter;
