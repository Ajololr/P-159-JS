import React, { useContext } from "react";

import { ModalSettingsContext } from "../../App";

import "./Modal.css";

function Modal() {
  const {
    modalSettings: { actions = [], isVisible = false, title = "" },
  } = useContext(ModalSettingsContext);

  return (
    <div
      className={`modal-wrapper ${isVisible ? "modal-wrapper_visible" : ""}`}
    >
      <div className="modal-window">
        <h2 className="modal-header">{title}</h2>
        {actions.map((action) => (
          <button
            key={action.title}
            onClick={action.onClick}
            className="modal-option"
          >
            {action.title}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Modal;
