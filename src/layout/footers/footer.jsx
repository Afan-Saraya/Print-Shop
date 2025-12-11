import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
// internal
import logo from '@assets/img/logo/logo.png';
import pay from '@assets/img/footer/footer-pay.png';
import { Email, Location } from '@/svg';

const Footer = ({ style_2 = false, style_3 = false,primary_style=false }) => {
  return (
    <footer>
      <div className={`tp-footer-area ${primary_style?'tp-footer-style-2 tp-footer-style-primary tp-footer-style-6':''} ${style_2 ?'tp-footer-style-2':style_3 ? 'tp-footer-style-2 tp-footer-style-3': ''}`}
        data-bg-color={`${style_2 ? 'footer-bg-white' : 'footer-bg-grey'}`}>
        <div className="tp-footer-top pt-95 pb-40">
          <div className="container">
            <div className="row">
              <div className="col-xl-4 col-lg-3 col-md-4 col-sm-6">
                <div className="tp-footer-widget footer-col-1 mb-50">
                  <div className="tp-footer-widget-content">
                    <div className="tp-footer-logo">
                      <Link href="/">
                        <Image src={logo} alt="logo" />
                      </Link>
                    </div>
                    <p className="tp-footer-desc">Kreiramo personalizovane poklone sa printom na različitim materijalima. Tvoja kreativnost, naša kvaliteta.</p>
                    <div className="tp-footer-social">
                      <a href="#" target="_blank">
                        <i className="fa-brands fa-facebook"></i>
                      </a>
                      <a href="#" target="_blank">
                        <i className="fa-brands fa-twitter"></i>
                      </a>
                      <a href="#" target="_blank">
                        <i className="fa-brands fa-instagram"></i>
                      </a>
                      <a href="#" target="_blank">
                        <i className="fa-brands fa-linkedin"></i>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-2 col-lg-3 col-md-4 col-sm-6">
                <div className="tp-footer-widget footer-col-2 mb-50">
                  <h4 className="tp-footer-widget-title">Moj Račun</h4>
                  <div className="tp-footer-widget-content">
                    <ul>
                      <li><a href="#">Moj Profil</a></li>
                      <li><a href="#">Omiljeni</a></li>
                      <li><a href="#">Korpa</a></li>
                      <li><a href="#">Istorija Narudžbi</a></li>
                      <li><a href="#">Povraćaji</a></li>
                      <li><a href="/contact">Kontakt</a></li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-xl-3 col-lg-3 col-md-4 col-sm-6">
                <div className="tp-footer-widget footer-col-3 mb-50">
                  <h4 className="tp-footer-widget-title">Informacije</h4>
                  <div className="tp-footer-widget-content">
                    <ul>
                      <li><a href="#">O Nama</a></li>
                      <li><a href="#">Kako Radimo</a></li>
                      <li><a href="#">Politika Privatnosti</a></li>
                      <li><a href="#">Uslovi Korišćenja</a></li>
                      <li><a href="/coupon">Kuponi</a></li>
                      <li><a href="/contact">Kontakt</a></li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-xl-3 col-lg-3 col-md-4 col-sm-6">
                <div className="tp-footer-widget footer-col-4 mb-50">
                  <h4 className="tp-footer-widget-title">Kontaktiraj Nas</h4>
                  <div className="tp-footer-widget-content">
                    <div className="tp-footer-talk mb-20">
                      <span>Pitanja? Pozovi nas</span>
                      <h4><a href="tel:+38761234567">+387 61 234 567</a></h4>
                    </div>
                    <div className="tp-footer-contact">
                      <div className="tp-footer-contact-item d-flex align-items-start">
                        <div className="tp-footer-contact-icon">
                          <span>
                            <Email />
                          </span>
                        </div>
                        <div className="tp-footer-contact-content">
                          <p><a href="mailto:info@giftshop.ba">info@giftshop.ba</a></p>
                        </div>
                      </div>
                      <div className="tp-footer-contact-item d-flex align-items-start">
                        <div className="tp-footer-contact-icon">
                          <span>
                            <Location />
                          </span>
                        </div>
                        <div className="tp-footer-contact-content">
                          <p><a href="https://www.google.com/maps/place/Sarajevo,+Bosnia+and+Herzegovina/" target="_blank">Sarajevo <br /> Bosna i Hercegovina</a></p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="tp-footer-bottom">
          <div className="container">
            <div className="tp-footer-bottom-wrapper">
              <div className="row align-items-center">
                <div className="col-md-6">
                  <div className="tp-footer-copyright">
                    <p>© {new Date().getFullYear()} Sva Prava Zadržana | Gift Shop sa Personaliziranim Printom
                      <Link href="/">{" "}❤</Link>.
                    </p>
                  </div>
                </div>
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
