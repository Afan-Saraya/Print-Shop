const MobileCategory = ({ isCategoryActive, categoryType }) => {
  return <ul className={isCategoryActive ? "active" : ""}></ul>;
};

export default MobileCategory;
