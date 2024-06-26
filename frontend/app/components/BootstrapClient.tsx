"use client";

import { use, useEffect } from "react";

const BootstrapClient = () => {
  useEffect(() => {
    require("bootstrap/dist/js/bootstrap.bundle.min.js");

    return () => {};
  }, []);

  return <div></div>;
};

export default BootstrapClient;
