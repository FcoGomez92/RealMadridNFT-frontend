import ReactDOM from "react-dom";
import close from "./close.png";

const ModalComponent = ({ children, onClose }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close-modal" onClick={onClose}>
          <img src={close} width="30px" alt="" />
        </span>
        {children}
      </div>
    </div>
  );
};

const ModalPortal = ({ children, onClose }) => {
  return ReactDOM.createPortal(
    <ModalComponent onClose={onClose}>{children}</ModalComponent>,
    document.getElementById("modal-root")
  );
};

export default ModalPortal;
