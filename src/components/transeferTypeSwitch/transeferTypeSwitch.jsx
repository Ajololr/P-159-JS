import * as React from "react";
import { TransferType, TransferTypeContext } from "../../App";

import transferTypeSwitchImage from "./transfer-type-switch.png";

import "./transferTypeSwitch.css";

export const TranseferTypeSwitch = () => {
  const { transferType, setTransferType } =
    React.useContext(TransferTypeContext);

  const clickHandler = () => {
    let newValue;

    switch (transferType) {
      case TransferType.tlg:
        newValue = TransferType.tlf;
        break;

      case TransferType.tlf:
        newValue = TransferType.tlfPh;
        break;

      case TransferType.tlfPh:
        newValue = TransferType.du;
        break;

      case TransferType.du:
        newValue = TransferType.tlg;
        break;

      default:
        newValue = TransferType.tlg;
        break;
    }

    setTransferType(newValue);
  };

  let rotation;

  switch (transferType) {
    case TransferType.tlg:
      rotation = "-10deg";
      break;

    case TransferType.tlf:
      rotation = "20deg";
      break;

    case TransferType.tlfPh:
      rotation = "50deg";
      break;

    case TransferType.du:
      rotation = "80deg";
      break;

    default:
      rotation = "-10deg";
      break;
  }

  return (
    <img
      alt=""
      className="transfer-type-switch"
      src={transferTypeSwitchImage}
      onClick={clickHandler}
      style={{ transform: `rotate(${rotation}` }}
    />
  );
};
