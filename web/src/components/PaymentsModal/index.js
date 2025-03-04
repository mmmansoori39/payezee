import {
  Box,
  Button,
  Flex,
  FormLabel,
  List,
  ListItem,
  Modal,
  ModalContent,
  ModalOverlay,
  Select,
  Spinner,
  Text,
  Textarea,
  Tooltip
} from "@chakra-ui/react";
import dayjs from "dayjs";
import { useRef, useState } from "react";
import { FiCopy } from "react-icons/fi";
import { copyToClipboard } from "../../utils/common";
import { depositStatus, rejectionReasons } from "../../utils/constants";
import { AiOutlineDelete } from "react-icons/ai";

const CopyButton = ({ text }) => {
  return (
    <Button
      ml="1"
      h="8"
      fontSize={"sm"}
      onClick={() => {
        copyToClipboard(text);
      }}>
      <FiCopy aria-label="copy" />
    </Button>
  );
};

const PaymentsModal = ({
  data,
  isOpen,
  onClose,
  transactionType,
  onStatusChanged,
  loading,
  isReadonly,
  onSaveComment,
  onDeleteComment
}) => {
  const initialRef = useRef(null);
  const finalRef = useRef(null);

  const [comment, setComment] = useState("");
  const [customComment, setCustomComment] = useState("");

  const onCommentInputChange = (e) => {
    setComment(e.currentTarget.value);
  };

  const onCustomCommentInputChange = (e) => {
    setCustomComment(e.currentTarget.value);
  };

  const onCommentSave = () => {
    onSaveComment(customComment || comment, () => {
      setComment("");
      setCustomComment("");
    });
  };

  const status = data?.status;
  const color =
    status === depositStatus.PENDING
      ? "#D69E2E"
      : status === depositStatus.REJECTED
      ? "#E53E3E"
      : status === depositStatus.COMPLETED
      ? "#38A169"
      : "blue.500";

  return (
    <Modal
      initialFocusRef={initialRef}
      closeOnOverlayClick={true}
      finalFocusRef={finalRef}
      isOpen={isOpen}
      onClose={onClose}>
      <ModalOverlay />
      <ModalContent w="600px" maxWidth={"800px"}>
        <Box p={"8"}>
          <List spacing={2}>
            <ListItem borderBottom={"1px solid gray"} h={"8"}>
              <Text as={"span"} fontWeight={"bold"}>
                STATUS:
              </Text>{" "}
              <Text as={"span"} bg={color} color="white" p="1" fontWeight="bold" borderRadius="md">
                {String(status).toUpperCase()}
              </Text>{" "}
            </ListItem>
            {isReadonly && data?.comment && (
              <ListItem borderBottom={"1px solid gray"} pb="2">
                <Text as={"span"} fontWeight={"bold"}>
                  Comment:
                </Text>
                {data?.comment}
              </ListItem>
            )}{" "}
            <ListItem borderBottom={"1px solid gray"} h={"10"}>
              <Flex justifyContent={"space-between"} alignItems="center">
                <Text as={"span"} fontWeight={"bold"}>
                  Transaction Id:
                </Text>{" "}
                {data?.transactionId}
                <CopyButton text={data?.transactionId} />
              </Flex>
            </ListItem>{" "}
            <ListItem borderBottom={"1px solid gray"} h={"10"}>
              <Flex justifyContent={"space-between"} alignItems="center">
                <Text as={"span"} fontWeight={"bold"}>
                  Invoice Id (From Merchant):
                </Text>{" "}
                {data?.invoiceId}
                <CopyButton text={data?.invoiceId} />
              </Flex>
            </ListItem>{" "}
            <ListItem borderBottom={"1px solid gray"} h={"8"}>
              <Text as={"span"} fontWeight={"bold"}>
                Customer Name:
              </Text>{" "}
              {data?.payer?.firstName} {data?.payer?.lastName}
            </ListItem>{" "}
            <ListItem borderBottom={"1px solid gray"} h={"8"}>
              <Text as={"span"} fontWeight={"bold"}>
                Email:
              </Text>{" "}
              {data?.payer?.email}
            </ListItem>{" "}
            <ListItem borderBottom={"1px solid gray"} h="max-content">
              <Text as={"span"} fontWeight={"bold"}>
                Amount:
              </Text>{" "}
              {data?.amount} {data?.currency}
            </ListItem>{" "}
            <Box borderBottom={"1px solid gray"}>
              <Text as={"span"} fontWeight={"bold"}>
                Amount In Words:
              </Text>{" "}
              {data?.amountInText}
            </Box>{" "}
            <ListItem borderBottom={"1px solid gray"} h={"8"}>
              <Text as={"span"} fontWeight={"bold"}>
                User Id (From Merchant):
              </Text>{" "}
              {data?.payer.userId}
            </ListItem>{" "}
            <ListItem borderBottom={"1px solid gray"} h={"8"}>
              <Text as={"span"} fontWeight={"bold"}>
                Phone:
              </Text>{" "}
              {data?.payer.phone}
            </ListItem>{" "}
            <ListItem borderBottom={"1px solid gray"} h={"8"}>
              <Text as={"span"} fontWeight={"bold"}>
                Merchant Name:
              </Text>{" "}
              {data?.merchant?.name}{" "}
              {data?.merchant?.contactPersonName ? ` - ${data?.merchant?.contactPersonName}` : ""}
            </ListItem>{" "}
            <ListItem>
              <Text as={"span"} fontWeight={"bold"}>
                Address:
              </Text>
              <ListItem ml="4">
                <Text as={"span"} fontWeight={"bold"}>
                  Street:
                </Text>{" "}
                {data?.payer?.address?.street}
              </ListItem>{" "}
              <ListItem ml="4">
                <Text as={"span"} fontWeight={"bold"}>
                  City:
                </Text>{" "}
                {data?.payer?.address?.city}
              </ListItem>{" "}
              <ListItem ml="4">
                <Text as={"span"} fontWeight={"bold"}>
                  State:
                </Text>{" "}
                {data?.payer?.address?.state}
              </ListItem>{" "}
              <ListItem ml="4">
                <Text as={"span"} fontWeight={"bold"}>
                  Zip Code:
                </Text>{" "}
                {data?.payer?.address?.zipCode}
              </ListItem>{" "}
              <ListItem pl="4" borderBottom={"1px solid gray"} h={"8"}>
                <Text as={"span"} fontWeight={"bold"}>
                  Country Code:
                </Text>{" "}
                {data?.country}
              </ListItem>
            </ListItem>
            <ListItem borderBottom={"1px solid gray"} h={"8"}>
              <Text as={"span"} fontWeight={"bold"}>
                Created At:
              </Text>{" "}
              {dayjs(data?.createdAt).format("ddd, MMMM D, YYYY - hh:mm A")}
            </ListItem>
            {!!data?.comments?.length && (
              <ListItem>
                <Text as={"span"} fontWeight={"bold"}>
                  Comments:
                </Text>

                {data?.comments.map((item, index) => {
                  return (
                    <Flex
                      borderBottom={index !== data?.comments.length - 1 ? "1px" : "0"}
                      borderColor="gray.300"
                      p="1"
                      alignItems="center"
                      gap="20px"
                      justifyContent="space-between"
                      key={item._id}>
                      <Text maxW={"60%"}>{item.text}</Text>
                      <Flex justifyContent="center" alignItems="center" gap="10px">
                        <Flex flexDirection="column" mr="2">
                          <Text fontSize="xs">{dayjs(item?.createdAt).format("D MMM YY - hh:mm A")}</Text>
                          <Text fontSize="xs" textOverflow="ellipsis" w="10%" whiteSpace="nowrap">
                            {item.author.name}
                          </Text>
                        </Flex>
                        {!isReadonly && (
                          <Tooltip label="Are you sure? delete this comment">
                            <Button onClick={onDeleteComment(item.id)} variant="ghost" size="sm" w="max">
                              <AiOutlineDelete />
                            </Button>
                          </Tooltip>
                        )}
                      </Flex>
                    </Flex>
                  );
                })}
              </ListItem>
            )}
          </List>
          {!isReadonly && (
            <Box mt="4">
              {!loading && (
                <>
                  <FormLabel>Add Comment:</FormLabel>
                  <Select mb="6" onChange={onCommentInputChange} value={comment}>
                    <option value={""}>Select a comment</option>
                    {rejectionReasons?.length &&
                      rejectionReasons.map((item) => {
                        return (
                          <option key={item} value={item}>
                            {item}
                          </option>
                        );
                      })}
                  </Select>
                  {comment === "Other" && (
                    <Textarea
                      placeholder="add comments"
                      rows={5}
                      value={customComment}
                      onChange={onCustomCommentInputChange}
                    />
                  )}
                  {(!!comment || (!!comment && !!customComment)) && (
                    <Button mt="4" onClick={onCommentSave} colorScheme={"blue"} disabled={true}>
                      Save Comment
                    </Button>
                  )}
                  <Flex mt="4" justifyContent="space-between">
                    {data?.status !== depositStatus.PENDING && (
                      <Button onClick={onStatusChanged(depositStatus.PENDING, comment)} colorScheme={"yellow"}>
                        Dispatched
                      </Button>
                    )}
                    {data?.status !== depositStatus.COMPLETED && (
                      <Button
                        onClick={onStatusChanged(depositStatus.COMPLETED, comment)}
                        colorScheme={"green"}
                        disabled={true}>
                        {transactionType === "deposit" ? "Collected" : "Paidout"}
                      </Button>
                    )}
                    {data?.status !== depositStatus.REJECTED && (
                      <Button
                        onClick={onStatusChanged(depositStatus.REJECTED, comment)}
                        colorScheme={"red"}
                        disabled={true}>
                        {transactionType === "deposit" ? "Unable to Collect" : "Unable to Payout"}
                      </Button>
                    )}
                  </Flex>
                </>
              )}
              {loading && <Spinner />}
            </Box>
          )}
        </Box>
      </ModalContent>
    </Modal>
  );
};

export default PaymentsModal;
