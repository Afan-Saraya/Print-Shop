import React from "react";
import ErrorMsg from "../common/error-msg";

const OfferCouponArea = () => {
  const content = <ErrorMsg msg="No Coupons found!" />;

  return (
    <>
      <div className="tp-coupon-area pb-120">
        <div className="container">
          <div className="row">{content}</div>
        </div>
      </div>
    </>
  );
};

export default OfferCouponArea;
