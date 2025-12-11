import React from "react";
import { ToastContainer } from "react-toastify";
// internal
import BackToTopCom from "@/components/common/back-to-top";

const Wrapper = ({ children }) => {
  return (
    <div id="wrapper">
      {children}
      <BackToTopCom />
      <ToastContainer />
    </div>
  );
};

export default Wrapper;
