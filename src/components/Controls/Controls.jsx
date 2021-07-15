import React from "react";

import "./Controls.css";

const Controls = ({ ...props }) => {
  return (
    <div class="broadcast_button_block" {...props}>
      <div class="broadcast_button_top_bolt"></div>
      <p class="broadcast_button_text">ТНГ</p>
      <div class="broadcast_button"></div>
      <div class="broadcast_button_bottom_bolt"></div>
    </div>
  );
};

export default Controls;
