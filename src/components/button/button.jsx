import * as React from "react";

import "./button.css";

export const Button = ({ ...props }) => {
  return <div className="button" {...props}></div>;
};
