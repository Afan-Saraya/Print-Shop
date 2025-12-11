import React from "react";
import ErrorMsg from "../common/error-msg";

const CouponArea = () => {
  const content = <ErrorMsg msg="Nema dostupnih kupona!" />;
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

export default CouponArea;
