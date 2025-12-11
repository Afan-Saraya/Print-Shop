import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useRouter } from "next/router";
// internal
import { CloseEye, OpenEye } from "@/svg";
import ErrorMsg from "../common/error-msg";

// schema
const schema = Yup.object().shape({
  name: Yup.string().required().label("Ime"),
  email: Yup.string().required().email().label("Email"),
  subject: Yup.string().required().label("Predmet"),
  message: Yup.string().required().label("Poruka"),
  remember: Yup.bool()
    .oneOf([true], "Morate se složiti sa uslovima korišćenja da biste nastavili.")
    .label("Uslovi korišćenja"),
});

const ContactForm = () => {

    // react hook form
    const {register,handleSubmit,formState: { errors },reset} = useForm({
      resolver: yupResolver(schema),
    });
    // on submit
    const onSubmit = (data) => {
      if(data){
        notifySuccess('Poruka je uspješno poslana!');
      }

      reset();
    };

  return (
    <form onSubmit={handleSubmit(onSubmit)} id="contact-form">
      <div className="tp-contact-input-wrapper">
        <div className="tp-contact-input-box">
          <div className="tp-contact-input">
            <input {...register("name", { required: `Ime je obavezno!` })} name="name" id="name" type="text" placeholder="Tvoje Ime" />
          </div>
          <div className="tp-contact-input-title">
            <label htmlFor="name">Tvoje Ime</label>
          </div>
          <ErrorMsg msg={errors.name?.message} />
        </div>
        <div className="tp-contact-input-box">
          <div className="tp-contact-input">
            <input {...register("email", { required: `Email je obavezan!` })} name="email" id="email" type="email" placeholder="tvoj@email.com" />
          </div>
          <div className="tp-contact-input-title">
            <label htmlFor="email">Tvoj Email</label>
          </div>
          <ErrorMsg msg={errors.email?.message} />
        </div>
        <div className="tp-contact-input-box">
          <div className="tp-contact-input">
            <input {...register("subject", { required: `Predmet je obavezan!` })} name="subject" id="subject" type="text" placeholder="Napiši predmet" />
          </div>
          <div className="tp-contact-input-title">
            <label htmlFor="subject">Predmet</label>
          </div>
          <ErrorMsg msg={errors.subject?.message} />
        </div>
        <div className="tp-contact-input-box">
          <div className="tp-contact-input">
            <textarea {...register("message", { required: `Poruka je obavezna!` })} id="message" name="message" placeholder="Napiši svoju poruku ovdje..."/>
          </div>
          <div className="tp-contact-input-title">
            <label htmlFor="message">Tvoja Poruka</label>
          </div>
          <ErrorMsg msg={errors.message?.message} />
        </div>
      </div>
      <div className="tp-contact-suggetions mb-20">
        <div className="tp-contact-remeber">
          <input  {...register("remember", {required: `Uslovi korišćenja su obavezni!`})} name="remember" id="remember" type="checkbox" />
          <label htmlFor="remember">Spremi moje ime, email i web stranicu u ovaj preglednik za sljedeći put kada komentiram.</label>
          <ErrorMsg msg={errors.remember?.message} />
        </div>
      </div>
      <div className="tp-contact-btn">
        <button type="submit">Pošalji Poruku</button>
      </div>
    </form>
  );
};

export default ContactForm;