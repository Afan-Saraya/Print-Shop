import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper";
import ProductItem from "../products/page1/product-item";
import ErrorMsg from "../common/error-msg";
import { HomeNewArrivalPrdLoader } from "../loader";

// Mock related products
const mockRelatedProducts = [
  { _id: "2", title: "Print na forexu", price: 32, discount: 0, img: "/assets/img/product/print-forexu.jpg", category: { name: "Printing" }, description: "Visokokvalitetni print na forexu sa oštrim bojama i detaljima. Forex je lagana i čvrsta pjena idealna za unutarnje i vanjske primjene. Savršena za izloge, reklamne panele, izložbe i dekoraciju. Otporna na vlagu i UV zrake sa dugotrajnom bojom.", reviews: [], status: "in-stock" },
  { _id: "3", title: "PVC Kartice", price: 42, discount: 0, img: "/assets/img/product/pvc-kartice.jpg", category: { name: "Cards" }, description: "Trajne PVC kartice za različite namjene i aplikacije. Koriste se kao članarine, pristupne kartice, kartice lojalnosti i identifikacijske kartice. Otporne na vodu, mehaničke oštete i vremenske uslove. Dostupne sa magnetnom trakom, čipom ili bez dodatnih funkcija.", reviews: [], status: "in-stock" },
  { _id: "4", title: "Vizit kartice", price: 25, discount: 0, img: "/assets/img/product/vizit-kartice.jpg", category: { name: "Cards" }, description: "Profesionalne vizit kartice sa premium kvalitetom ispisa. Štampane na kvalitetnom kartonu sa mogućnošću različitih završnih obrada. Idealne za poslovne susrete, konferencije i mreženje. Dostupne sa standardnim ili prilagođenim dizajnom.", reviews: [], status: "in-stock" },
  { _id: "5", title: "Laser graviranje", price: 49, discount: 0, img: "/assets/img/product/laser-graviranje.jpg", category: { name: "Engraving" }, description: "Precizno laser graviranje na različitim materijalima kao što su drvo, metal, staklo, kožu i plastiku. Omogućava detaljne i trajne gravure sa visokom rezolucijom. Idealno za personalizaciju proizvoda, suvenire i korporativne poklone. Brz proces sa mogućnošću masovne proizvodnje.", reviews: [], status: "in-stock" },
];

// slider setting
const slider_setting = {
  slidesPerView: 4,
  spaceBetween: 24,
  navigation: {
    nextEl: ".tp-related-slider-button-next",
    prevEl: ".tp-related-slider-button-prev",
  },
  autoplay: {
    delay: 5000,
  },
  breakpoints: {
    1200: {
      slidesPerView: 4,
    },
    992: {
      slidesPerView: 3,
    },
    768: {
      slidesPerView: 2,
    },
    576: {
      slidesPerView: 2,
    },
    0: {
      slidesPerView: 1,
    },
  },
};

const RelatedProducts = ({id}) => {
  const products = { data: mockRelatedProducts };
  const isError = false;
  const isLoading = false;
  // decide what to render
  let content = null;

  if (isLoading) {
    content = <HomeNewArrivalPrdLoader loading={isLoading}/>;
  }
  if (!isLoading && isError) {
    content = <ErrorMsg msg="There was an error" />;
  }
  if (!isLoading && !isError && products?.data?.length === 0) {
    content = <ErrorMsg msg="No Products found!" />;
  }
  if (!isLoading && !isError && products?.data?.length > 0) {
    const product_items = products.data;
    content = (
      <Swiper
        {...slider_setting}
        modules={[Autoplay, Navigation]}
        className="tp-product-related-slider-active swiper-container mb-10"
      >
        {product_items.map((item) => (
          <SwiperSlide key={item._id}>
            <ProductItem product={item} primary_style={true} />
          </SwiperSlide>
        ))}
      </Swiper>
    );
  }
  return (
    <div className="tp-product-related-slider">
      {content}
    </div>
  );
};

export default RelatedProducts;
