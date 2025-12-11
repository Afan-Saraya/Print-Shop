import React,{useState} from "react";
import Image from "next/image";
import Link from "next/link";
import { mobile_menu } from "@/data/menu-data";
// internal
import insta_1 from '@assets/img/instagram/4/instagram-1.jpg';
import insta_3 from '@assets/img/instagram/4/instagram-3.jpg';
import insta_4 from '@assets/img/instagram/4/instagram-4.jpg';
import insta_6 from '@assets/img/instagram/4/instagram-6.jpg';

// instagram data 
const instagram_data = [
  { id: 1, link: '#', img: insta_1 },
  { id: 2, link: '#', img: insta_3 },
  { id: 3, link: '#', img: insta_4 },
  { id: 4, link: '#', img: insta_6 },
]
const MobileMenus = () => {
  const [isActiveMenu,setIsActiveMenu] = useState("")

  // handleOpenSubMenu
  const handleOpenSubMenu = (title) => {
    if(title === isActiveMenu){
      setIsActiveMenu("")
    }
    else {
      setIsActiveMenu(title)
    }
  }
  return (
    <>
      <nav className="tp-main-menu-content">
        <ul>
          {mobile_menu.map((menu, i) => (
            <li key={i}>
              <Link href={menu.link}>{menu.title}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
};

export default MobileMenus;
