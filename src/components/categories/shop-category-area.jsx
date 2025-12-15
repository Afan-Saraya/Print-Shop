import React from "react";
import { useRouter } from "next/router";
import ModelViewer from "@/components/ModelViewer";

// Hardkodirane kategorije za gift shop sa modelima i fiksnim bojama
const hardcoded_categories = [
  { id: 1, parent: 'Majice', products_count: 5, model: '/shirt/scene.gltf', zoom: 2.5, color: '#00008B' }, // Dark blue
  { id: 2, parent: 'Kape', products_count: 3, model: '/cap/scene.gltf', zoom: 1.5, color: '#000000' }, // Black
  { id: 3, parent: 'Šolje', products_count: 4, model: '/cup/scene.gltf', zoom: 0.15, color: '#FFFFFF' }, // White
  { id: 4, parent: 'Olovke', products_count: 6, model: '/pen/scene.gltf', zoom: 0.1, color: '#FF0000' }, // Red
  { id: 5, parent: 'Kesice i Cekeri', products_count: 3, model: '/bag/scene.gltf', zoom: 1.25, color: '#D2B48C' }, // Tan/Skin color
  { id: 6, parent: 'Privjesci', products_count: 2, model: '/pendants/scene.gltf', zoom: 4, color: '#FF8C00' }, // Orange
  { id: 7, parent: 'Bedževi', products_count: 2, model: '/badge/scene.gltf', zoom: 0.3, color: '#FFFF00' }, // Yellow
  { id: 8, parent: 'Upaljači', products_count: 1, model: '/lighter/scene.gltf', zoom: 0.008, color: '#800080' }, // Purple
  { id: 9, parent: 'Rokovnici', products_count: 1, model: '/agenda/scene.gltf', zoom: 0.01024, color: '#008000' }, // Green
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
        style={{ 
          backgroundColor: "#F3F5F7", 
          cursor: "pointer",
          position: "relative",
          overflow: "hidden",
          height: "300px"
        }}
        onClick={() => handleCategoryRoute(item.model)}
      >
        {/* 3D Model Background */}
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 1,
          opacity: 0.7
        }}>
          <ModelViewer modelPath={item.model} zoom={item.zoom} autoRotate={true} modelColor={item.color} showShadow={false} verticalOffset={item.model.includes('/badge/') ? 0.9 : item.model.includes('/agenda/') ? 0.5 : 0} rotationX={item.model.includes('/agenda/') ? Math.PI / 2 : 0} />
        </div>

        {/* Content Overlay */}
        <div className="tp-category-main-content" style={{
          position: "absolute",
          zIndex: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          width: "100%",
          bottom: 0,
          left: 0
        }}>
          <h3
            className="tp-category-main-title pb-1"
            style={{
              color: "white",
              textShadow: "2px 2px 4px rgba(0, 0, 0, 0.7)",
              margin: 0,
              position: "absolute",
              bottom: "20px",
              left: "50%",
              transform: "translateX(-50%)",
              textAlign: "center"
            }}
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
