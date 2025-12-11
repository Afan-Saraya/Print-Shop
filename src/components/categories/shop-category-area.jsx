import React from "react";
import { useRouter } from "next/router";

// Hardkodirane kategorije za gift shop sa modelima
const hardcoded_categories = [
  { id: 1, parent: 'Majice', products_count: 5, model: '/shirt/scene.gltf' },
  { id: 2, parent: 'Kape', products_count: 3, model: '/cap/scene.gltf' },
  { id: 3, parent: 'Šolje', products_count: 4, model: '/cup/scene.gltf' },
  { id: 4, parent: 'Olovke', products_count: 6, model: '/pen/scene.gltf' },
  { id: 5, parent: 'Kesice i Cekeri', products_count: 3, model: '/bag/scene.gltf' },
  { id: 6, parent: 'Privjesci', products_count: 2, model: '/pendants/scene.gltf' },
];

const ShopCategoryArea = () => {
  const router = useRouter();
  // handle category route - otvori editor sa odabranim modelom
  const handleCategoryRoute = (model) => {
    router.push(`/editor?model=${encodeURIComponent(model)}&fromCategory=true`);
  };

  // Koristi hardkodirane kategorije umjesto API-ja
  const category_items = hardcoded_categories;
  const content = category_items.map((item) => (
    <div key={item.id} className="col-lg-3 col-sm-6">
      <div
        className="tp-category-main-box mb-25 p-relative fix"
        style={{ backgroundColor: "#F3F5F7", cursor: "pointer" }}
        onClick={() => handleCategoryRoute(item.model)}
      >
        <div className="tp-category-main-content">
          <h3
            className="tp-category-main-title pb-1"
          >
            <a className="cursor-pointer">{item.parent}</a>
          </h3>
          
        </div>
      </div>
    </div>
  ));
  return (
    <>
      <section className="tp-category-area pb-120">
        <div className="container">
          <div className="row">{content}</div>
        </div>
      </section>
    </>
  );
};

export default ShopCategoryArea;
