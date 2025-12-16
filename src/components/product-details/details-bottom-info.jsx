import React from "react";
import Image from "next/image";
import payment_option_img from '@assets/img/product/icons/payment-option.png';

const DetailsBottomInfo = ({sku,category,tag}) => {
  return (
    <>
      {/* product-details-query */}
      <div className="tp-product-details-query">
        <div className="tp-product-details-query-item d-flex align-items-center">
          <span>SKU: </span>
          <p>{sku}</p>
        </div>
        <div className="tp-product-details-query-item d-flex align-items-center">
          <span>Category: </span>
          <p>{category}</p>
        </div>
        <div className="tp-product-details-query-item d-flex align-items-center">
          <span>Tag: </span>
          <p>{tag}</p>
        </div>
      </div>

      {/*  product-details-social*/}

      <div className="tp-product-details-social">
        <span>Share: </span>
        <a href="#">
          <i className="fa-brands fa-instagram"></i>
        </a>
        <a href="#">
          <i className="fa-brands fa-whatsapp"></i>
        </a>
        <a href="#">
          <i className="fa-brands fa-viber"></i>
        </a>
        <a href="#">
          <i className="fa-solid fa-sms"></i>
        </a>
      </div>

      {/* product-details-msg */}

      <div className="tp-product-details-msg mb-15">
        <ul>
          <li>30 days easy returns</li>
          <li>Order yours before 2.30pm for same day dispatch</li>
        </ul>
      </div>
      {/* product-details-payment */}
      <div className="tp-product-details-payment d-flex align-items-center flex-wrap justify-content-between">
        <p>
          Guaranteed safe <br /> & secure checkout
        </p>
        <div className="payment-methods d-flex align-items-center gap-2">
          <i className="fa-brands fa-cc-visa" style={{ fontSize: '32px', color: '#1A1F71' }}></i>
          <i className="fa-brands fa-cc-mastercard" style={{ fontSize: '32px', color: '#EB001B' }}></i>
        </div>
      </div>

      {/* Custom CSS to change hover colors from blue to purple */}
      <style jsx global>{`
        /* Product details hover effects - change from blue to purple */
        .tp-product-details-category span a:hover {
          color: #674AD9 !important;
        }
        
        .tp-product-details-action-sm-btn:hover {
          color: #674AD9 !important;
        }
        
        .tp-product-details-social a:hover {
          background-color: #674AD9 !important;
          border-color: #674AD9 !important;
          color: white !important;
        }
        
        .tp-product-details-quantity .tp-cart-plus:hover,
        .tp-product-details-quantity .tp-cart-minus:hover {
          color: #674AD9 !important;
        }
        
        .tp-product-details-thumb-wrapper .nav-tabs .nav-link:hover::after {
          border-color: #674AD9 !important;
        }
        
        .tp-product-details-thumb-arrow button:hover {
          background-color: #674AD9 !important;
        }
        
        .tp-product-details-thumb-video-btn:hover {
          background-color: #674AD9 !important;
        }
        
        .tp-product-details-variation-list button:hover .tp-color-variation-tootltip {
          background-color: #674AD9 !important;
        }
        
        .tp-product-details-variation-list button:hover .tp-color-variation-tootltip::before {
          border-top-color: #674AD9 !important;
        }
        
        .tp-product-details-review-remeber label a:hover {
          color: #674AD9 !important;
        }
        
        .tp-product-details-tab-nav .nav-tabs .nav-link:hover {
          color: #674AD9 !important;
        }
        
        .tp-product-details-wishlist-btn:hover {
          background-color: #674AD9 !important;
        }
        
        /* Override any remaining blue hover effects */
        a:hover {
          color: #674AD9 !important;
        }
        
        button:hover {
          color: #674AD9 !important;
        }
        
        /* Bootstrap link hover override */
        .btn-primary:hover {
          background-color: #674AD9 !important;
          border-color: #674AD9 !important;
        }
      `}</style>
    </>
  );
};

export default DetailsBottomInfo;
