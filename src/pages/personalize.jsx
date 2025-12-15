import React from 'react';
import SEO from '@/components/seo';
import HeaderTwo from '@/layout/headers/header-2';
import Footer from '@/layout/footers/footer';
import Wrapper from '@/layout/wrapper';
import ShopBreadcrumb from '@/components/breadcrumb/shop-breadcrumb';
import ShopCategoryArea from '@/components/categories/shop-category-area';

const PersonalizePage = () => {
  return (
    <Wrapper>
      <SEO pageTitle="Personalizuj Svoje Proizvode" />
      <HeaderTwo style_2={true} />
      <ShopBreadcrumb title="Personalizuj Svoje Proizvode" subtitle="Odaberi Materijal i Personalizuj" />
      <ShopCategoryArea/>
      <Footer primary_style={true} />
    </Wrapper>
  );
};

export default PersonalizePage;
