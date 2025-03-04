import { Modal, ModalContent, ModalOverlay } from "@chakra-ui/react";
import { useRef } from "react";
import MerchantRegisterForm from "../MerchantRegisterForm";

const MerchantModal = ({ isOpen, onClose, data, onEditSubmit, isEdit = true }) => {
  const initialRef = useRef(null);
  const finalRef = useRef(null);
  return (
    <>
      <Modal
        initialFocusRef={initialRef}
        closeOnOverlayClick={false}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <MerchantRegisterForm
            isEdit={isEdit}
            onModalClose={onClose}
            onSubmit={onEditSubmit}
            values={isEdit ? data : {}}
          />
        </ModalContent>
      </Modal>
    </>
  );
};

export default MerchantModal;
