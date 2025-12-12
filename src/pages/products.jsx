import React, { useState } from "react";
import SEO from "@/components/seo";
import Wrapper from "@/layout/wrapper";
import HeaderTwo from "@/layout/headers/header-2";
import ShopBreadcrumb from "@/components/breadcrumb/shop-breadcrumb";
import ShopHiddenSidebarArea from "@/components/shop/shop-hidden-sidebar-area";
import ShopFilterOffCanvas from "@/components/common/shop-filter-offcanvas";
import Footer from "@/layout/footers/footer";

// Mock products data
const mockProducts = [
  { _id: "1", name: "Flejeri i Brošure", title: "Flejeri i Brošure", price: 28, discount: 9.68, createdAt: new Date(), img: "/assets/img/product/flejeri-brosure.jpg", tags: ["sale"], reviews: [], status: "in-stock", description: "Profesionalno dizajnirani flejeri i brošure za vašu promociju. Idealni za predstavljanje proizvoda, usluga ili događaja. Dostupni u različitim formatima i sa mogućnošću prilagođavanja dizajna prema vašim potrebama. Štampani na kvalitetnom papiru sa živim bojama i oštrim detaljima." },
  { _id: "2", name: "Print na forexu", title: "Print na forexu", price: 32, discount: 0, createdAt: new Date(), img: "/assets/img/product/print-forexu.jpg", tags: ["new"], reviews: [], status: "in-stock", description: "Visokokvalitetni print na forexu sa oštrim bojama i detaljima. Forex je lagana i čvrsta pjena idealna za unutarnje i vanjske primjene. Savršena za izloge, reklamne panele, izložbe i dekoraciju. Otporna na vlagu i UV zrake sa dugotrajnom bojom." },
  { _id: "3", name: "PVC Kartice", title: "PVC Kartice", price: 42, discount: 0, createdAt: new Date(), img: "/assets/img/product/pvc-kartice.jpg", tags: ["new"], reviews: [], status: "in-stock", description: "Trajne PVC kartice za različite namjene i aplikacije. Koriste se kao članarine, pristupne kartice, kartice lojalnosti i identifikacijske kartice. Otporne na vodu, mehaničke oštete i vremenske uslove. Dostupne sa magnetnom trakom, čipom ili bez dodatnih funkcija." },
  { _id: "4", name: "Vizit kartice", title: "Vizit kartice", price: 25, discount: 0, createdAt: new Date(), img: "/assets/img/product/vizit-kartice.jpg", tags: ["new"], reviews: [], status: "in-stock", description: "Profesionalne vizit kartice sa premium kvalitetom ispisa. Štampane na kvalitetnom kartonu sa mogućnošću različitih završnih obrada. Idealne za poslovne susrete, konferencije i mreženje. Dostupne sa standardnim ili prilagođenim dizajnom." },
  { _id: "5", name: "Laser graviranje", title: "Laser graviranje", price: 49, discount: 0, createdAt: new Date(), img: "/assets/img/product/laser-graviranje.jpg", tags: ["hot"], reviews: [], status: "in-stock", description: "Precizno laser graviranje na različitim materijalima kao što su drvo, metal, staklo, kožu i plastiku. Omogućava detaljne i trajne gravure sa visokom rezolucijom. Idealno za personalizaciju proizvoda, suvenire i korporativne poklone. Brz proces sa mogućnošću masovne proizvodnje." },
  { _id: "6", name: "Barrisol", title: "Barrisol", price: 112, discount: 6.67, createdAt: new Date(), img: "/assets/img/product/barrisol.jpg", tags: ["sale"], reviews: [], status: "in-stock", description: "Premium Barrisol stropovi sa modernim dizajnom i trajnošću. Fleksibilna PVC membrana koja se montira na specijalnu aluminijumsku strukturu. Dostupna u različitim bojama i završnim obradama. Idealna za moderne interijere sa mogućnošću integracije rasvjete i ventilacije." },
  { _id: "7", name: "3D elementi i oznake", title: "3D elementi i oznake", price: 85, discount: 0, createdAt: new Date(), img: "/assets/img/product/3d-elementi.jpg", tags: ["new"], reviews: [], status: "in-stock", description: "Trodimenzionalni elementi i oznake za atraktivnu vizuelnu prezentaciju. Koriste se za fasade, unutarnje dekoracije i branding. Dostupni u različitim materijalima kao što su akril, metal i drvo. Mogu biti osvijetljeni LED diodama za dodatni efekt." },
  { _id: "8", name: "CNC Reklame", title: "CNC Reklame", price: 50, discount: 0, createdAt: new Date(), img: "/assets/img/product/cnc-reklame.jpg", tags: ["new"], reviews: [], status: "in-stock", description: "Precizno rezane CNC reklame za profesionalan izgled. Koriste se za vanjsku i unutarnju upotrebu sa mogućnošću različitih materijala. Dostupne sa ili bez osvijetljenja. Idealne za branding, signalizaciju i dekoraciju poslovnih prostora." },
  { _id: "9", name: "Canvas", title: "Canvas", price: 70, discount: 0, createdAt: new Date(), img: "/assets/img/product/canvas.jpg", tags: ["new"], reviews: [], status: "in-stock", description: "Kvalitetni canvas printovi za dekoraciju prostora. Štampani na premium canvas materijalu sa profesionalnom tehnikom. Dostupni u različitim veličinama i formatima. Idealni za dnevne sobe, kancelarije, galerije i javne prostore sa mogućnošću prilagođavanja dizajna." },
  { _id: "10", name: "Vrećica Non-Woven", title: "Vrećica Non-Woven", price: 2.35, discount: 0, createdAt: new Date(), img: "/assets/img/product/vrecica-nonwoven.jpg", tags: ["new"], reviews: [], status: "in-stock", description: "Ekološke non-woven vrećice za promociju i pakovanje. Izrađene od reciklabilnog materijala sa mogućnošću štampanja logotipa. Čvrste i izdržljive sa ergonomskim ručkama. Idealne za trgovine, promocije i kao korporativni pokloni." },
  { _id: "11", name: "Hemijska olovka Start 0.7mm", title: "Hemijska olovka Start 0.7mm", price: 0.90, discount: 0, createdAt: new Date(), img: "/assets/img/product/hemijska-olovka.jpg", tags: ["new"], reviews: [], status: "in-stock", description: "Kvalitetna hemijska olovka sa glatkim pisanjem i 0.7mm vrhom. Ergonomski dizajn za udobno pisanje tijekom cijelog dana. Dostupna u različitim bojama tinte. Idealna za kancelarije, škole i kao korporativni poklon sa mogućnošću gravure." },
  { _id: "12", name: "Drvena olovka Perga", title: "Drvena olovka Perga", price: 0.50, discount: 0, createdAt: new Date(), img: "/assets/img/product/drvena-olovka.jpg", tags: ["new"], reviews: [], status: "in-stock", description: "Ekološka drvena olovka sa prirodnim izgledom i osjetajem. Izrađena od održivog drva sa mogućnošću štampanja imena ili logotipa. Idealna za promocije, škole i kao ekološki poklon. Dostupna sa različitim vrstama drva i završnih obrada." },
  { _id: "13", name: "Bedž Ovalni 32x45 MM", title: "Bedž Ovalni 32x45 MM", price: 4, discount: 0, createdAt: new Date(), img: "/assets/img/product/bedz-ovalni.jpg", tags: ["new"], reviews: [], status: "in-stock", description: "Ovalni bedževi za identifikaciju i promociju sa dimenzijama 32x45 mm. Dostupni sa sigurnosnom iglom ili magnetom na poleđini. Idealni za događaje, konferencije i kao korporativni identifikatori. Mogu se štampati sa logotipom ili tekstom." },
  { _id: "14", name: "Bedž Okrugli 50 MM", title: "Bedž Okrugli 50 MM", price: 6, discount: 0, createdAt: new Date(), img: "/assets/img/product/bedz-okrugli.jpg", tags: ["new"], reviews: [], status: "in-stock", description: "Okrugli bedževi sa visokom vidljivošću i promjerom od 50 mm. Dostupni sa različitim vrstama pričvršćivanja kao što su igla, magnet ili klip. Idealni za promocije, događaje i kao korporativni identifikatori. Mogu se štampati sa živim bojama i detaljima." },
  { _id: "15", name: "Strukturirane tapete", title: "Strukturirane tapete", price: 70, discount: 0, createdAt: new Date(), img: "/assets/img/product/strukturirane-tapete.jpg", tags: ["new"], reviews: [], status: "in-stock", description: "Moderne strukturirane tapete za elegantan izgled interijera. Dostupne u različitim teksturama i bojama sa mogućnošću prilagođavanja. Otporne na vlagu i lako se čiste. Idealne za dnevne sobe, spavaće sobe, kancelarije i javne prostore." },
  { _id: "16", name: "Samoljepljive tapete", title: "Samoljepljive tapete", price: 60, discount: 0, createdAt: new Date(), img: "/assets/img/product/samoljepljive-tapete.jpg", tags: ["new"], reviews: [], status: "in-stock", description: "Praktične samoljepljive tapete za brzu instalaciju bez potrebe za ljepilom. Dostupne u različitim dizajnima i bojama. Lako se postavljaju i uklanjaju bez oštećenja zida. Idealne za privremene promjene ili kao privremena dekoracija." },
  { _id: "17", name: "Majica Basic", title: "Majica Basic", price: 16, discount: 0, createdAt: new Date(), img: "/assets/img/product/majica-basic.jpg", tags: ["new"], reviews: [], status: "in-stock", description: "Klasična majica sa udobnim fitom i kvalitetnom tkaninom od 100% pamuka. Dostupna u različitim veličinama i bojama. Idealna za svakodnevnu upotrebu sa mogućnošću štampanja logotipa ili dizajna. Izdržljiva i lako se pere." },
  { _id: "18", name: "Majica Polo Muška", title: "Majica Polo Muška", price: 14.61, discount: 2.6, createdAt: new Date(), img: "/assets/img/product/majica-polo.jpg", tags: ["sale"], reviews: [], status: "in-stock", description: "Elegantna muška polo majica za poslovne prilike i casual nošenje. Izrađena od kvalitetnog pamuka sa mogućnošću štampanja logotipa. Dostupna u različitim bojama i veličinama. Idealna za korporativne uniforme i promocije." },
  { _id: "19", name: "Kačket HC-601", title: "Kačket HC-601", price: 8, discount: 0, createdAt: new Date(), img: "/assets/img/product/kacket.jpg", tags: ["new"], reviews: [], status: "in-stock", description: "Moderan kačket sa ergonomskim dizajnom i mogućnošću štampanja logotipa. Dostupan u različitim bojama sa kvalitetnom tkaninom. Idealan za promocije, sportske događaje i kao korporativni poklon. Udoban za nošenje tijekom cijelog dana." },
  { _id: "20", name: "Upaljač BUDGET", title: "Upaljač BUDGET", price: 1.10, discount: 0, createdAt: new Date(), img: "/assets/img/product/upaljac.jpg", tags: ["new"], reviews: [], status: "in-stock", description: "Praktičan upaljač za svakodnevnu upotrebu sa mogućnošću štampanja logotipa. Dostupan u različitim bojama. Idealan kao korporativni poklon ili promocijski artikal. Pouzdan i dugotrajan sa mogućnošću punjenja." },
  { _id: "21", name: "Kalendar Priroda 6+1 B3", title: "Kalendar Priroda 6+1 B3", price: 7, discount: 0, createdAt: new Date(), img: "/assets/img/product/kalendar.jpg", tags: ["new"], reviews: [], status: "in-stock", description: "Lijepi kalendar sa motivima prirode za kancelariju i dom. Format B3 sa mogućnošću štampanja logotipa ili poruke. Dostupan sa 6 mjeseci plus 1 dodatni mjesec. Idealan kao korporativni poklon sa mogućnošću prilagođavanja dizajna." },
  { _id: "22", name: "Rokovnici, olovke, USB stick-ovi, upaljaci", title: "Rokovnici, olovke, USB stick-ovi, upaljaci", price: 7, discount: 0, createdAt: new Date(), img: "/assets/img/product/rokovnici-set.jpg", tags: ["new"], reviews: [], status: "in-stock", description: "Kompletan set poslovnih poklona i promocijskih artikala sa rokovnicima, olovkama, USB stick-ovima i upaljačima. Dostupan sa mogućnošću štampanja logotipa na svaki artikal. Idealan za korporativne poklone, promocije i događaje. Pakovan u atraktivnu kutiju." },
  { _id: "23", name: "Koverte", title: "Koverte", price: 3, discount: 0, createdAt: new Date(), img: "/assets/img/product/koverte.jpg", tags: ["new"], reviews: [], status: "in-stock", description: "Profesionalne koverte za poslovnu korespondenciju sa mogućnošću štampanja logotipa. Dostupne u različitim veličinama i kvalitetama papira. Idealne za pisma, pozivnice i poslovnu komunikaciju. Dostupne sa ili bez prozora za adresu." },
];

const ProductsPage = () => {
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
      <SEO pageTitle="Proizvodi" />
      <HeaderTwo style_2={true} />
      <ShopBreadcrumb title="Proizvodi" subtitle="Proizvodi" />
      {content}
      <Footer primary_style={true} />
    </Wrapper>
  );
};

export default ProductsPage;
