import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Rating } from "react-simple-star-rating";
import Link from "next/link";
import { Cart, CompareThree, QuickView, Wishlist } from "@/svg";

const ProductItem = ({ product, style_2 = false }) => {
  const { _id, img, title, reviews, price, discount, tags, status } = product || {};
  const [ratingVal, setRatingVal] = useState(0);

  useEffect(() => {
    if (reviews && reviews.length > 0) {
      const rating =
        reviews.reduce((acc, review) => acc + review.rating, 0) /
        reviews.length;
      setRatingVal(rating);
    } else {
      setRatingVal(0);
    }
  }, [reviews]);


  return (
    <div className={`tp-product-item-2 ${style_2 ? "" : "mb-40"}`} style={{ border: "1px solid #e0e0e0", borderRadius: "8px", overflow: "hidden" }}>
      <div className="tp-product-thumb-2 p-relative z-index-1 fix" style={{ width: "100%", paddingBottom: "100%", position: "relative", overflow: "hidden" }}>
        <Link href={`/product-details/${_id}`} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}>
          <Image
            src={img}
            alt="product img"
            fill
            style={{ objectFit: "cover" }}
          />
        </Link>
        <div className="tp-product-badge">
          {status === 'out-of-stock' && <span className="product-hot">out-stock</span>}
        </div>
        {/* product action */}
        <div className="tp-product-action-2 tp-product-action-blackStyle">
          <div className="tp-product-action-item-2 d-flex flex-column">
            <button
              type="button"
              onClick={() => console.log('Add to cart:', product)}
              className="tp-product-action-btn-2 tp-product-add-cart-btn"
              disabled={status === 'out-of-stock'}
            >
              <Cart />
              <span className="tp-product-tooltip tp-product-tooltip-right">
                Add to Cart
              </span>
            </button>
            <button
              onClick={() => console.log('Quick view:', product)}
              className="tp-product-action-btn-2 tp-product-quick-view-btn"
            >
              <QuickView />
              <span className="tp-product-tooltip tp-product-tooltip-right">
                Quick View
              </span>
            </button>
            <button 
              disabled={status === 'out-of-stock'} 
              onClick={() => console.log('Add to wishlist:', product)} 
              className="tp-product-action-btn-2 tp-product-add-to-wishlist-btn"
            >
              <Wishlist />
              <span className="tp-product-tooltip tp-product-tooltip-right">
                Add To Wishlist
              </span>
            </button>
            <button 
              disabled={status === 'out-of-stock'} 
              onClick={() => console.log('Add to compare:', product)} 
              className="tp-product-action-btn-2 tp-product-add-to-compare-btn"
            >
              <CompareThree />
              <span className="tp-product-tooltip tp-product-tooltip-right">
                Add To Compare
              </span>
            </button>
          </div>
        </div>
      </div>
      <div className="tp-product-content-2 pt-15" style={{ padding: "10px" }}>
        <div className="tp-product-tag-2">
          {tags && tags.map((t, i) => (
            <a key={i} href="#">
              {t}
              {i < tags.length - 1 && ","}
            </a>
          ))}
        </div>
        <h3 className="tp-product-title-2">
          <Link href={`/product-details/${_id}`}>{title}</Link>
        </h3>
        <div className="tp-product-rating-icon tp-product-rating-icon-2">
          <Rating allowFraction size={16} initialValue={ratingVal} readonly={true} />
        </div>
        <div className="tp-product-price-wrapper-2">
          {discount > 0 ? (
            <>
              <span className="tp-product-price-2 new-price">
                ${price.toFixed(2)}{" "}
              </span>
              <span className="tp-product-price-2 old-price">
                {" "}${(Number(price) - (Number(price) * Number(discount)) / 100).toFixed(2)}
              </span>
            </>
          ) : (
            <span className="tp-product-price-2 new-price">
              ${price.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductItem;
