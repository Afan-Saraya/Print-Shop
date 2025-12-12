import React from 'react';
// internal
import SEO from '@/components/seo';
import HeaderTwo from '@/layout/headers/header-2';
import Footer from '@/layout/footers/footer';
import Wrapper from '@/layout/wrapper';
import ErrorMsg from '@/components/common/error-msg';
import ProductDetailsBreadcrumb from '@/components/breadcrumb/product-details-breadcrumb';
import ProductDetailsArea from '@/components/product-details/product-details-area';
import PrdDetailsLoader from '@/components/loader/prd-details-loader';

// Mock products data
const mockProducts = {
  "1": { _id: "1", title: "Flejeri i Brošure", price: 28, discount: 9.68, img: "/assets/img/product/flejeri-brosure.jpg", category: { name: "Printing" }, description: "Profesionalno dizajnirani flejeri i brošure za vašu promociju. Idealni za predstavljanje proizvoda, usluga ili događaja. Dostupni u različitim formatima i sa mogućnošću prilagođavanja dizajna prema vašim potrebama. Štampani na kvalitetnom papiru sa živim bojama i oštrim detaljima.", reviews: [], status: "in-stock" },
  "2": { _id: "2", title: "Print na forexu", price: 32, discount: 0, img: "/assets/img/product/print-forexu.jpg", category: { name: "Printing" }, description: "Visokokvalitetni print na forexu sa oštrim bojama i detaljima. Forex je lagana i čvrsta pjena idealna za unutarnje i vanjske primjene. Savršena za izloge, reklamne panele, izložbe i dekoraciju. Otporna na vlagu i UV zrake sa dugotrajnom bojom.", reviews: [], status: "in-stock" },
  "3": { _id: "3", title: "PVC Kartice", price: 42, discount: 0, img: "/assets/img/product/pvc-kartice.jpg", category: { name: "Cards" }, description: "Trajne PVC kartice za različite namjene i aplikacije. Koriste se kao članarine, pristupne kartice, kartice lojalnosti i identifikacijske kartice. Otporne na vodu, mehaničke oštete i vremenske uslove. Dostupne sa magnetnom trakom, čipom ili bez dodatnih funkcija.", reviews: [], status: "in-stock" },
  "4": { _id: "4", title: "Vizit kartice", price: 25, discount: 0, img: "/assets/img/product/vizit-kartice.jpg", category: { name: "Cards" }, description: "Profesionalne vizit kartice sa premium kvalitetom ispisa. Štampane na kvalitetnom kartonu sa mogućnošću različitih završnih obrada. Idealne za poslovne susrete, konferencije i mreženje. Dostupne sa standardnim ili prilagođenim dizajnom.", reviews: [], status: "in-stock" },
  "5": { _id: "5", title: "Laser graviranje", price: 49, discount: 0, img: "/assets/img/product/laser-graviranje.jpg", category: { name: "Engraving" }, description: "Precizno laser graviranje na različitim materijalima kao što su drvo, metal, staklo, kožu i plastiku. Omogućava detaljne i trajne gravure sa visokom rezolucijom. Idealno za personalizaciju proizvoda, suvenire i korporativne poklone. Brz proces sa mogućnošću masovne proizvodnje.", reviews: [], status: "in-stock" },
  "6": { _id: "6", title: "Barrisol", price: 112, discount: 6.67, img: "/assets/img/product/barrisol.jpg", category: { name: "Ceilings" }, description: "Premium Barrisol stropovi sa modernim dizajnom i trajnošću. Fleksibilna PVC membrana koja se montira na specijalnu aluminijumsku strukturu. Dostupna u različitim bojama i završnim obradama. Idealna za moderne interijere sa mogućnošću integracije rasvjete i ventilacije.", reviews: [], status: "in-stock" },
  "7": { _id: "7", title: "3D elementi i oznake", price: 85, discount: 0, img: "/assets/img/product/3d-elementi.jpg", category: { name: "3D" }, description: "Trodimenzionalni elementi i oznake za atraktivnu vizuelnu prezentaciju. Koriste se za fasade, unutarnje dekoracije i branding. Dostupni u različitim materijalima kao što su akril, metal i drvo. Mogu biti osvijetljeni LED diodama za dodatni efekt.", reviews: [], status: "in-stock" },
  "8": { _id: "8", title: "CNC Reklame", price: 50, discount: 0, img: "/assets/img/product/cnc-reklame.jpg", category: { name: "Signage" }, description: "Precizno rezane CNC reklame za profesionalan izgled. Koriste se za vanjsku i unutarnju upotrebu sa mogućnošću različitih materijala. Dostupne sa ili bez osvijetljenja. Idealne za branding, signalizaciju i dekoraciju poslovnih prostora.", reviews: [], status: "in-stock" },
  "9": { _id: "9", title: "Canvas", price: 70, discount: 0, img: "/assets/img/product/canvas.jpg", category: { name: "Printing" }, description: "Kvalitetni canvas printovi za dekoraciju prostora. Štampani na premium canvas materijalu sa profesionalnom tehnikom. Dostupni u različitim veličinama i formatima. Idealni za dnevne sobe, kancelarije, galerije i javne prostore sa mogućnošću prilagođavanja dizajna.", reviews: [], status: "in-stock" },
  "10": { _id: "10", title: "Vrećica Non-Woven", price: 2.35, discount: 0, img: "/assets/img/product/vrecica-nonwoven.jpg", category: { name: "Bags" }, description: "Ekološke non-woven vrećice za promociju i pakovanje. Izrađene od reciklabilnog materijala sa mogućnošću štampanja logotipa. Čvrste i izdržljive sa ergonomskim ručkama. Idealne za trgovine, promocije i kao korporativni pokloni.", reviews: [], status: "in-stock" },
  "11": { _id: "11", title: "Hemijska olovka Start 0.7mm", price: 0.90, discount: 0, img: "/assets/img/product/hemijska-olovka.jpg", category: { name: "Stationery" }, description: "Kvalitetna hemijska olovka sa glatkim pisanjem i 0.7mm vrhom. Ergonomski dizajn za udobno pisanje tijekom cijelog dana. Dostupna u različitim bojama tinte. Idealna za kancelarije, škole i kao korporativni poklon sa mogućnošću gravure.", reviews: [], status: "in-stock" },
  "12": { _id: "12", title: "Drvena olovka Perga", price: 0.50, discount: 0, img: "/assets/img/product/drvena-olovka.jpg", category: { name: "Stationery" }, description: "Ekološka drvena olovka sa prirodnim izgledom i osjetajem. Izrađena od održivog drva sa mogućnošću štampanja imena ili logotipa. Idealna za promocije, škole i kao ekološki poklon. Dostupna sa različitim vrstama drva i završnih obrada.", reviews: [], status: "in-stock" },
  "13": { _id: "13", title: "Bedž Ovalni 32x45 MM", price: 4, discount: 0, img: "/assets/img/product/bedz-ovalni.jpg", category: { name: "Badges" }, description: "Ovalni bedževi za identifikaciju i promociju sa dimenzijama 32x45 mm. Dostupni sa sigurnosnom iglom ili magnetom na poleđini. Idealni za događaje, konferencije i kao korporativni identifikatori. Mogu se štampati sa logotipom ili tekstom.", reviews: [], status: "in-stock" },
  "14": { _id: "14", title: "Bedž Okrugli 50 MM", price: 6, discount: 0, img: "/assets/img/product/bedz-okrugli.jpg", category: { name: "Badges" }, description: "Okrugli bedževi sa visokom vidljivošću i promjerom od 50 mm. Dostupni sa različitim vrstama pričvršćivanja kao što su igla, magnet ili klip. Idealni za promocije, događaje i kao korporativni identifikatori. Mogu se štampati sa živim bojama i detaljima.", reviews: [], status: "in-stock" },
  "15": { _id: "15", title: "Strukturirane tapete", price: 70, discount: 0, img: "/assets/img/product/strukturirane-tapete.jpg", category: { name: "Wallpaper" }, description: "Moderne strukturirane tapete za elegantan izgled interijera. Dostupne u različitim teksturama i bojama sa mogućnošću prilagođavanja. Otporne na vlagu i lako se čiste. Idealne za dnevne sobe, spavaće sobe, kancelarije i javne prostore.", reviews: [], status: "in-stock" },
  "16": { _id: "16", title: "Samoljepljive tapete", price: 60, discount: 0, img: "/assets/img/product/samoljepljive-tapete.jpg", category: { name: "Wallpaper" }, description: "Praktične samoljepljive tapete za brzu instalaciju bez potrebe za ljepilom. Dostupne u različitim dizajnima i bojama. Lako se postavljaju i uklanjaju bez oštećenja zida. Idealne za privremene promjene ili kao privremena dekoracija.", reviews: [], status: "in-stock" },
  "17": { _id: "17", title: "Majica Basic", price: 16, discount: 0, img: "/assets/img/product/majica-basic.jpg", category: { name: "Apparel" }, description: "Klasična majica sa udobnim fitom i kvalitetnom tkaninom od 100% pamuka. Dostupna u različitim veličinama i bojama. Idealna za svakodnevnu upotrebu sa mogućnošću štampanja logotipa ili dizajna. Izdržljiva i lako se pere.", reviews: [], status: "in-stock" },
  "18": { _id: "18", title: "Majica Polo Muška", price: 14.61, discount: 2.6, img: "/assets/img/product/majica-polo.jpg", category: { name: "Apparel" }, description: "Elegantna muška polo majica za poslovne prilike i casual nošenje. Izrađena od kvalitetnog pamuka sa mogućnošću štampanja logotipa. Dostupna u različitim bojama i veličinama. Idealna za korporativne uniforme i promocije.", reviews: [], status: "in-stock" },
  "19": { _id: "19", title: "Kačket HC-601", price: 8, discount: 0, img: "/assets/img/product/kacket.jpg", category: { name: "Apparel" }, description: "Moderan kačket sa ergonomskim dizajnom i mogućnošću štampanja logotipa. Dostupan u različitim bojama sa kvalitetnom tkaninom. Idealan za promocije, sportske događaje i kao korporativni poklon. Udoban za nošenje tijekom cijelog dana.", reviews: [], status: "in-stock" },
  "20": { _id: "20", title: "Upaljač BUDGET", price: 1.10, discount: 0, img: "/assets/img/product/upaljac.jpg", category: { name: "Gifts" }, description: "Praktičan upaljač za svakodnevnu upotrebu sa mogućnošću štampanja logotipa. Dostupan u različitim bojama. Idealan kao korporativni poklon ili promocijski artikal. Pouzdan i dugotrajan sa mogućnošću punjenja.", reviews: [], status: "in-stock" },
  "21": { _id: "21", title: "Kalendar Priroda 6+1 B3", price: 7, discount: 0, img: "/assets/img/product/kalendar.jpg", category: { name: "Gifts" }, description: "Lijepi kalendar sa motivima prirode za kancelariju i dom. Format B3 sa mogućnošću štampanja logotipa ili poruke. Dostupan sa 6 mjeseci plus 1 dodatni mjesec. Idealan kao korporativni poklon sa mogućnošću prilagođavanja dizajna.", reviews: [], status: "in-stock" },
  "22": { _id: "22", title: "Rokovnici, olovke, USB stick-ovi, upaljaci", price: 7, discount: 0, img: "/assets/img/product/rokovnici-set.jpg", category: { name: "Gifts" }, description: "Kompletan set poslovnih poklona i promocijskih artikala sa rokovnicima, olovkama, USB stick-ovima i upaljačima. Dostupan sa mogućnošću štampanja logotipa na svaki artikal. Idealan za korporativne poklone, promocije i događaje. Pakovan u atraktivnu kutiju.", reviews: [], status: "in-stock" },
  "23": { _id: "23", title: "Koverte", price: 3, discount: 0, img: "/assets/img/product/koverte.jpg", category: { name: "Stationery" }, description: "Profesionalne koverte za poslovnu korespondenciju sa mogućnošću štampanja logotipa. Dostupne u različitim veličinama i kvalitetama papira. Idealne za pisma, pozivnice i poslovnu komunikaciju. Dostupne sa ili bez prozora za adresu.", reviews: [], status: "in-stock" },
};

const ProductDetailsPage = ({ query }) => {
  const product = mockProducts[query.id];
  const isLoading = false;
  const isError = !product;
  // decide what to render
  let content = null;
  if (isLoading) {
    content = <PrdDetailsLoader loading={isLoading}/>;
  }
  if (!isLoading && isError) {
    content = <ErrorMsg msg="There was an error" />;
  }
  if (!isLoading && !isError && product) {
    content = (
      <>
        <ProductDetailsBreadcrumb category={product.category.name} title={product.title} />
        <ProductDetailsArea productItem={product} />
      </>
    );
  }
  return (
    <Wrapper>
      <SEO pageTitle="Product Details" />
      <HeaderTwo style_2={true} />
      {content}
      <Footer primary_style={true} />
    </Wrapper>
  );
};

export default ProductDetailsPage;

export const getServerSideProps = async (context) => {
  const { query } = context;

  return {
    props: {
      query,
    },
  };
};
