import React, { useState } from "react";
import SEO from "@/components/seo";
import Wrapper from "@/layout/wrapper";
import HeaderTwo from "@/layout/headers/header-2";
import ShopBreadcrumb from "@/components/breadcrumb/shop-breadcrumb";
import ShopHiddenSidebarArea from "@/components/shop/shop-hidden-sidebar-area";
import ShopFilterOffCanvas from "@/components/common/shop-filter-offcanvas";
import Footer from "@/layout/footers/footer";

const mockProducts = [
  { _id: "1", name: "Flejeri i Brošure", title: "Flejeri i Brošure", price: 28, discount: 9.68, createdAt: new Date(), img: "/assets/img/product/flejeri-brosure.jpg", tags: ["sale"], reviews: [], status: "in-stock", description: "Profesionalno dizajnirani flejeri i brošure za vašu promociju." },
  { _id: "2", name: "Print na forexu", title: "Print na forexu", price: 32, discount: 0, createdAt: new Date(), img: "/assets/img/product/print-forexu.jpg", tags: ["new"], reviews: [], status: "in-stock", description: "Visokokvalitetni print na forexu sa oštrim bojama i detaljima." },
  { _id: "3", name: "PVC Kartice", title: "PVC Kartice", price: 42, discount: 0, createdAt: new Date(), img: "/assets/img/product/pvc-kartice.jpg", tags: ["new"], reviews: [], status: "in-stock", description: "Trajne PVC kartice za različite namjene i aplikacije." },
  { _id: "4", name: "Vizit kartice", title: "Vizit kartice", price: 25, discount: 0, createdAt: new Date(), img: "/assets/img/product/vizit-kartice.jpg", tags: ["new"], reviews: [], status: "in-stock", description: "Profesionalne vizit kartice sa premium kvalitetom ispisa." },
  { _id: "5", name: "Laser graviranje", title: "Laser graviranje", price: 49, discount: 0, createdAt: new Date(), img: "/assets/img/product/laser-graviranje.jpg", tags: ["hot"], reviews: [], status: "in-stock", description: "Precizno laser graviranje na različitim materijalima." },
  { _id: "6", name: "Barrisol", title: "Barrisol", price: 112, discount: 6.67, createdAt: new Date(), img: "/assets/img/product/barrisol.jpg", tags: ["sale"], reviews: [], status: "in-stock", description: "Premium Barrisol stropovi sa modernim dizajnom i trajnošću." },
  { _id: "7", name: "3D elementi i oznake", title: "3D elementi i oznake", price: 85, discount: 0, createdAt: new Date(), img: "/assets/img/product/3d-elementi.jpg", tags: ["new"], reviews: [], status: "in-stock", description: "Trodimenzionalni elementi za atraktivnu vizuelnu prezentaciju." },
  { _id: "8", name: "CNC Reklame", title: "CNC Reklame", price: 50, discount: 0, createdAt: new Date(), img: "/assets/img/product/cnc-reklame.jpg", tags: ["new"], reviews: [], status: "in-stock", description: "Precizno rezane CNC reklame za profesionalan izgled." },
  { _id: "9", name: "Canvas", title: "Canvas", price: 70, discount: 0, createdAt: new Date(), img: "/assets/img/product/canvas.jpg", tags: ["new"], reviews: [], status: "in-stock", description: "Kvalitetni canvas printovi za dekoraciju prostora." },
  { _id: "10", name: "Vrećica Non-Woven", title: "Vrećica Non-Woven", price: 2.35, discount: 0, createdAt: new Date(), img: "/assets/img/product/vrecica-nonwoven.jpg", tags: ["new"], reviews: [], status: "in-stock", description: "Ekološke non-woven vrećice za promociju i pakovanje." },
  { _id: "11", name: "Hemijska olovka Start 0.7mm", title: "Hemijska olovka Start 0.7mm", price: 0.90, discount: 0, createdAt: new Date(), img: "/assets/img/product/hemijska-olovka.jpg", tags: ["new"], reviews: [], status: "in-stock", description: "Kvalitetna hemijska olovka sa glatkim pisanjem." },
  { _id: "12", name: "Drvena olovka Perga", title: "Drvena olovka Perga", price: 0.50, discount: 0, createdAt: new Date(), img: "/assets/img/product/drvena-olovka.jpg", tags: ["new"], reviews: [], status: "in-stock", description: "Ekološka drvena olovka sa prirodnim izgledom." },
  { _id: "13", name: "Bedž Ovalni 32x45 MM", title: "Bedž Ovalni 32x45 MM", price: 4, discount: 0, createdAt: new Date(), img: "/assets/img/product/bedz-ovalni.jpg", tags: ["new"], reviews: [], status: "in-stock", description: "Ovalni bedževi za identifikaciju i promociju." },
  { _id: "14", name: "Bedž Okrugli 50 MM", title: "Bedž Okrugli 50 MM", price: 6, discount: 0, createdAt: new Date(), img: "/assets/img/product/bedz-okrugli.jpg", tags: ["new"], reviews: [], status: "in-stock", description: "Okrugli bedževi sa visokom vidljivošću." },
  { _id: "15", name: "Strukturirane tapete", title: "Strukturirane tapete", price: 70, discount: 0, createdAt: new Date(), img: "/assets/img/product/strukturirane-tapete.jpg", tags: ["new"], reviews: [], status: "in-stock", description: "Moderne strukturirane tapete za elegantan izgled." },
  { _id: "16", name: "Samoljepljive tapete", title: "Samoljepljive tapete", price: 60, discount: 0, createdAt: new Date(), img: "/assets/img/product/samoljepljive-tapete.jpg", tags: ["new"], reviews: [], status: "in-stock", description: "Praktične samoljepljive tapete za brzu instalaciju." },
  { _id: "17", name: "Majica Basic", title: "Majica Basic", price: 16, discount: 0, createdAt: new Date(), img: "/assets/img/product/majica-basic.jpg", tags: ["new"], reviews: [], status: "in-stock", description: "Klasična majica sa udobnim fitom i kvalitetnom tkaninom." },
  { _id: "18", name: "Majica Polo Muška", title: "Majica Polo Muška", price: 14.61, discount: 2.6, createdAt: new Date(), img: "/assets/img/product/majica-polo.jpg", tags: ["sale"], reviews: [], status: "in-stock", description: "Elegantna muška polo majica za poslovne prilike." },
  { _id: "19", name: "Kačket HC-601", title: "Kačket HC-601", price: 8, discount: 0, createdAt: new Date(), img: "/assets/img/product/kacket.jpg", tags: ["new"], reviews: [], status: "in-stock", description: "Moderan kačket sa ergonomskim dizajnom." },
  { _id: "20", name: "Upaljač BUDGET", title: "Upaljač BUDGET", price: 1.10, discount: 0, createdAt: new Date(), img: "/assets/img/product/upaljac.jpg", tags: ["new"], reviews: [], status: "in-stock", description: "Praktičan upaljač za svakodnevnu upotrebu." },
  { _id: "21", name: "Kalendar Priroda 6+1 B3", title: "Kalendar Priroda 6+1 B3", price: 7, discount: 0, createdAt: new Date(), img: "/assets/img/product/kalendar.jpg", tags: ["new"], reviews: [], status: "in-stock", description: "Lijepi kalendar sa motivima prirode za kancelariju." },
  { _id: "22", name: "Rokovnici", title: "Rokovnici", price: 7, discount: 0, createdAt: new Date(), img: "/assets/img/product/rokovnici-set.jpg", tags: ["new"], reviews: [], status: "in-stock", description: "Kompletan set poslovnih poklona i promocijskih artikala." },
  { _id: "23", name: "Koverte", title: "Koverte", price: 3, discount: 0, createdAt: new Date(), img: "/assets/img/product/koverte.jpg", tags: ["new"], reviews: [], status: "in-stock", description: "Profesionalne koverte za poslovnu korespondenciju." },
];

const ShopHiddenSidebarPage = () => {
  const [selectValue, setSelectValue] = useState("");
  const [priceValue, setPriceValue] = useState([0, 300]);
  const isLoading = false;
  const isError = false;
  const products = { data: mockProducts };

  // selectHandleFilter
  const selectHandleFilter = (e) => {
    setSelectValue(e.value);
  };

  // handleChanges
  const handleChanges = (val) => {
    setPriceValue(val);
  };

  // other props
  const otherProps = {
    priceFilterValues: {
      priceValue,
      handleChanges,
    },
    selectHandleFilter,
  };

  // decide what to render
  let content = null;

  if (!isLoading && !isError && products?.data?.length > 0) {
    // products
    let product_items = products.data;
    // select short filtering
    if (selectValue) {
      if (selectValue === "Default Sorting") {
        product_items = products.data;
      } else if (selectValue === "Low to High") {
        product_items = products.data
          .slice()
          .sort((a, b) => Number(a.price) - Number(b.price));
      } else if (selectValue === "High to Low") {
        product_items = products.data
          .slice()
          .sort((a, b) => Number(b.price) - Number(a.price));
      } else if (selectValue === "New Added") {
        product_items = products.data
          .slice()
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      } else if (selectValue === "On Sale") {
        product_items = products.data.filter((p) => p.discount > 0);
      } else {
        product_items = products.data;
      }
    }

    content = (
      <>
        <ShopHiddenSidebarArea
          all_products={products.data}
          products={product_items}
          otherProps={otherProps}
        />

        <ShopFilterOffCanvas
          all_products={products.data}
          otherProps={otherProps}
        />
      </>
    );
  }

  return (
    <Wrapper>
      <SEO pageTitle="Shop" />
      <HeaderTwo style_2={true} />
      <ShopBreadcrumb title="Shop Hidden Sidebar" subtitle="Shop Hidden Sidebar" />
      {content}
      <Footer primary_style={true} />
    </Wrapper>
  );
};

export default ShopHiddenSidebarPage;
