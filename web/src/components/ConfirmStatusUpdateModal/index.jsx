import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button
} from "@chakra-ui/react";
import { useRef } from "react";

function ConfirmStatusUpdateModal({ isOpen, onClose, onConfirm, updateDetails }) {
  const cancelRef = useRef();

  return (
    <>
      <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Update Transaction Status
            </AlertDialogHeader>

            <AlertDialogBody>
              <p>Are you sure? </p>
              <p>You want to change the status to {String(updateDetails.status).toUpperCase()}</p>
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button variant={"outline"} ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="teal" onClick={onConfirm} ml={3}>
                Update
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}

export default ConfirmStatusUpdateModal;
