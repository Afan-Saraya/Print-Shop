import React from "react";

const HeaderCategory = ({ isCategoryActive, categoryType = "electronics" }) => {
  return <ul className={isCategoryActive ? "active" : ""}></ul>;
};

export default HeaderCategory;
