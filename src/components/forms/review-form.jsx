import React,{useState} from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { Rating } from "react-simple-star-rating";
import * as Yup from "yup";
// internal
import ErrorMsg from "../common/error-msg";
import { notifyError, notifySuccess } from "@/utils/toast";

// schema
const schema = Yup.object().shape({
  name: Yup.string().required().label("Name"),
  email: Yup.string().required().email().label("Email"),
  comment: Yup.string().required().label("Comment"),
});

const ReviewForm = ({product_id}) => {
  const [rating, setRating] = useState(0);

  // Catch Rating value
  const handleRating = (rate) => {
    setRating(rate)
  }

   // react hook form
   const {register,handleSubmit,formState: { errors },reset} = useForm({
    resolver: yupResolver(schema),
  });
  // on submit
  const onSubmit = (data) => {
    console.log('Review submitted:', { productId: product_id, rating, ...data });
    notifySuccess("Review submitted successfully!");
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="tp-product-details-review-form-rating d-flex align-items-center">
        <p>Vaša ocjena :</p>
        <div className="tp-product-details-review-form-rating-icon d-flex align-items-center">
          <Rating onClick={handleRating} allowFraction size={16} initialValue={rating} />
        </div>
      </div>
      <div className="tp-product-details-review-input-wrapper">
        <div className="tp-product-details-review-input-box">
          <div className="tp-product-details-review-input">
            <textarea
            {...register("comment", { required: `Komentar je obavezan!` })}
              id="comment"
              name="comment"
              placeholder="Napišite vašu recenziju ovdje..."
            />
          </div>
          <div className="tp-product-details-review-input-title">
            <label htmlFor="msg">Vaša recenzija</label>
          </div>
          <ErrorMsg msg={errors.name?.comment} />
        </div>
        <div className="tp-product-details-review-input-box">
          <div className="tp-product-details-review-input">
            <input
            {...register("name", { required: `Ime je obavezno!` })}
              name="name"
              id="name"
              type="text"
              placeholder="Vaše ime"
            />
          </div>
          <div className="tp-product-details-review-input-title">
            <label htmlFor="name">Vaše ime</label>
          </div>
          <ErrorMsg msg={errors.name?.name} />
        </div>
        <div className="tp-product-details-review-input-box">
          <div className="tp-product-details-review-input">
            <input
            {...register("email", { required: `Email je obavezan!` })}
              name="email"
              id="email"
              type="email"
              placeholder="vasa@email.com"
            />
          </div>
          <div className="tp-product-details-review-input-title">
            <label htmlFor="email">Vaš email</label>
          </div>
          <ErrorMsg msg={errors.name?.email} />
        </div>
      </div>
      <div className="tp-product-details-review-btn-wrapper">
        <button type="submit" className="tp-product-details-review-btn">Pošalji</button>
      </div>
    </form>
  );
};

export default ReviewForm;
