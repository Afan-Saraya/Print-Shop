import React, { useState } from 'react';
import { Minus, Plus } from '@/svg';

const ProductQuantity = () => {
  const [orderQuantity, setOrderQuantity] = useState(1);
  
  // handleIncrease
  const handleIncrease = () => {
    setOrderQuantity(orderQuantity + 1);
  };
  // handleDecrease
  const handleDecrease = () => {
    if (orderQuantity > 1) {
      setOrderQuantity(orderQuantity - 1);
    }
  };
  return (
    <div className="tp-product-details-quantity">
    <div className="tp-product-quantity mb-15 mr-15">
      <span className="tp-cart-minus" onClick={handleDecrease}>
        <Minus />
      </span>
      <input className="tp-cart-input" type="text" readOnly value={orderQuantity} />
      <span className="tp-cart-plus" onClick={handleIncrease}>
        <Plus />
      </span>
    </div>
  </div>
  );
};

export default ProductQuantity;