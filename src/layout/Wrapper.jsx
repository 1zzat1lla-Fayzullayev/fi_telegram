import React from "react";

function Wrapper({ children }) {
  return <div className="max-w-[1280px] mx-auto p-[10px] my-[30px]">{children}</div>;
}

export default Wrapper;
