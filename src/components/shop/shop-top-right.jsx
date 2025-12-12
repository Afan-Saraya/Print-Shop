import React from "react";

const ShopTopRight = ({selectHandleFilter}) => {
  return (
    <div className="tp-shop-top-right d-sm-flex align-items-center justify-content-xl-end">
      <div className="tp-shop-top-select">
        <select 
          onChange={(e) => selectHandleFilter({ value: e.target.value })}
          className="form-select"
          defaultValue="Default Sorting"
        >
          <option value="Default Sorting">Default Sorting</option>
          <option value="Low to High">Low to High</option>
          <option value="High to Low">High to Low</option>
          <option value="New Added">New Added</option>
          <option value="On Sale">On Sale</option>
        </select>
      </div>
    </div>
  );
};

export default ShopTopRight;
