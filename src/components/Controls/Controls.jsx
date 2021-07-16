import React from "react";

import "./Controls.css";

const Controls = ({ ...props }) => {
  return (
    <div className="broadcast_button_block" {...props}>
      <div className="broadcast_button_top_bolt"></div>
      <p className="broadcast_button_text">ТНГ</p>
      <div className="broadcast_button"></div>
      <div className="broadcast_button_bottom_bolt"></div>
    </div>
  );
};

export default Controls;
