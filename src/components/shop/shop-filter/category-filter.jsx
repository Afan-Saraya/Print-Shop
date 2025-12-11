import React from "react";

const CategoryFilter = ({setCurrPage,shop_right=false}) => {
  return (
    <>
      <div className="tp-shop-widget mb-50">
        <h3 className="tp-shop-widget-title">Categories</h3>
        <div className="tp-shop-widget-content">
          <div className="tp-shop-widget-categories">
            <ul></ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default CategoryFilter;
