import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
// internal
import logo_white from '@assets/img/logo/logo.png';
import logo_dark from '@assets/img/logo/logo.png';
import { CartTwo, Menu, Wishlist } from '@/svg';
import Menus from './header-com/menus';
import OffCanvas from '@/components/common/off-canvas';

const HeaderThree = () => {
  const [isOffCanvasOpen, setIsCanvasOpen] = useState(false);
  return (
    <>
      <header>
        <div id="header-sticky" className="tp-header-area tp-header-style-transparent-white tp-header-transparent tp-header-sticky has-dark-logo tp-header-height">
          <div className="tp-header-bottom-3 pl-35 pr-35">
            <div className="container-fluid">
              <div className="row align-items-center">
                <div className="col-xl-2 col-lg-2 col-6">
                  <div className="logo">
                    <Link href="/">
                      <Image className="logo-light" src={logo_white} alt="logo" />
                      <Image className="logo-dark" src={logo_dark} alt="logo" />
                    </Link>
                  </div>
                </div>
                <div className="col-xl-8 col-lg-8 d-none d-lg-block">
                  <div className="main-menu menu-style-3 p-relative d-flex align-items-center justify-content-center">
                    <nav className="tp-main-menu-content">
                      <Menus />
                    </nav>
                  </div>
                </div>
                <div className="col-xl-2 col-lg-2 col-6">
                  <div className="tp-header-action d-flex align-items-center justify-content-end ml-50">
                    <div className="tp-header-action-item d-none d-sm-block" style={{ opacity: 0.5, cursor: 'not-allowed' }}>
                      <button className="tp-header-action-btn" disabled>
                        <Wishlist />
                        <span className="tp-header-action-badge">0</span>
                      </button>
                    </div>
                    <div className="tp-header-action-item d-none d-sm-block" style={{ opacity: 0.5, cursor: 'not-allowed' }}>
                      <button className="tp-header-action-btn" disabled>
                        <CartTwo />
                        <span className="tp-header-action-badge">0</span>
                      </button>
                    </div>
                    <div className="tp-header-action-item d-lg-none">
                      <button onClick={() => setIsCanvasOpen(true)} type="button" className="tp-header-action-btn tp-offcanvas-open-btn">
                        <Menu />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* off canvas start */}
      <OffCanvas isOffCanvasOpen={isOffCanvasOpen} setIsCanvasOpen={setIsCanvasOpen} categoryType="beauty" />
      {/* off canvas end */}
    </>
  );
};

export default HeaderThree;