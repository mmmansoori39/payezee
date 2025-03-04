import { Box, Button, Flex, Select, Text, useDisclosure } from "@chakra-ui/react";
import { RangeDatepicker } from "chakra-dayzed-datepicker";
import dayjs from "dayjs";
import { cloneDeep } from "lodash";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import CustomTable from "../../components/CustomTable";
import NotFound from "../../components/NotFound";
import PaymentsModal from "../../components/PaymentsModal";
import { setCashouts, setDeposits, setLoading, setMerchants } from "../../redux/slices/CommonSlice";
import { getAllMerchants } from "../../services/merchant";
import { deleteCommentCashout, deleteCommentDeposit, getAllCashouts, getAllDeposits, updateCashoutStatus, updateDepositStatus } from "../../services/payments";
import { depositStatus } from "../../utils/constants";
import ConfirmStatusUpdateModal from "../../components/ConfirmStatusUpdateModal";

const initialDateRangeValue = [null, new Date()];
const ALL_MERCHANT = "all";

const PaymentsPage = ({ transactionType = "deposit" }) => {
  const [selectedDates, setSelectedDates] = useState(initialDateRangeValue);
  const dispatch = useDispatch();
  const { deposits, loading, cashouts, merchants } = useSelector((state) => state.common);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [updateDetails, setUpdateDetails] = useState({});
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [merchantId, setMerchantId] = useState(ALL_MERCHANT);
  
  const {
    isOpen: isConfirmStatusChangeOpen,
    onOpen: onConfirmStatusChangeOpen,
    onClose: onConfirmStatusChangeClose
  } = useDisclosure();

  const onSaveComment = (comment, cb) => {
    if (transactionType === "deposit") {
      setUpdating(true);
      updateDepositStatus(selectedPayment.id, undefined, comment).then((res) => {
        setUpdating(false);
        if (res?.status === 200) {
          setSelectedPayment(res.data.responseData);
          updateStore(setDeposits, res.data.responseData);
          toast.success("Comment Added!");
          cb && cb()
        } else {
          toast.error("Comment add failed");
        }
      });
    }
    if (transactionType === "cashout") {
      setUpdating(true);
      // eslint-disable-next-line no-debugger
      debugger;
      updateCashoutStatus(selectedPayment.id, undefined, comment).then((res) => {
        setUpdating(false);
        if (res.status === 200) {
          toast.success("Comment Added!");
          updateStore(setCashouts, res.data.responseData);
          setSelectedPayment(res.data.responseData);
          cb && cb()
        } else {
          toast.error("Comment add failed");
        }
      });
    }
  }


  useEffect(() => {
    getAllMerchants().then((merchants) => {
      const merchantsArr = merchants.map((item) => ({ ...item, status: item.isActive ? "ACTIVE" : "INACTIVE" }));
      dispatch(setMerchants(merchantsArr));
    });
  }, [dispatch]);

  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (selectedDates.length === 2) {
      if (transactionType === "deposit") {
        dispatch(setLoading(true));
        getAllDeposits({ selectedDates, merchantId: merchantId === ALL_MERCHANT ? null : merchantId }).then(
          (payments) => {
            dispatch(setDeposits(payments));
            dispatch(setLoading(false));
          }
        );
      }
      if (transactionType === "cashout") {
        dispatch(setLoading(true));
        getAllCashouts({ selectedDates, merchantId: merchantId === ALL_MERCHANT ? null : merchantId }).then(
          (payments) => {
            dispatch(setCashouts(payments));
            dispatch(setLoading(false));
          }
        );
      }
    }
  }, [dispatch, transactionType, selectedDates, merchantId]);

  const onMerchantChange = (e) => {
    setMerchantId(e.currentTarget.value);
  };

  const editPayment = useCallback(
    (payment) => () => {
      setSelectedPayment(payment);
      onOpen();
    },
    [onOpen]
  );

  const resetDateRange = () => {
    setSelectedDates(initialDateRangeValue);
    setMerchantId(ALL_MERCHANT)
  };

  const columns = useMemo(
    () => [
      {
        Header: "Sr. No.",
        accessor: "sequence"
      },
      {
        Header: "Created on",
        accessor: "createdAt",
        Cell: ({ row }) => {
          const { createdAt } = row.original;

          return (
            <div style={{ textAlign: "end" }}>
              {dayjs(createdAt).format("hh:mm A")}
              <br />
              {dayjs(createdAt).format("D MMMM  YYYY")}
            </div>
          );
        }
      },
      {
        Header: "Invoice ID",
        accessor: "invoiceId"
      },
      {
        Header: "Merchant Name",
        accessor: "merchant.name"
      },
      {
        Header: "Name",
        accessor: "payer.firstName",
        Cell: ({ row }) => {
          const { payer } = row.original;
          return `${payer.firstName} ${payer.lastName}`;
        }
      },
      {
        Header: "Amount",
        accessor: "amount",
        Cell: ({ row }) => {
          const { currency, amount } = row.original;
          return `${currency} ${amount}`;
        }
      },
      {
        Header: "Address",
        accessor: "payer.address.city",
        Cell: ({ row }) => {
          const { payer } = row.original;
          return (
            <Text maxWidth={"200px"} w="max-content">
              {`${payer?.address?.street}, ${payer?.address?.city}, \n ${payer?.address?.zipCode}, ${payer?.address?.state}`}
            </Text>
          );
        }
      },

      {
        Header: "STATUS",
        accessor: "status",
        Cell: ({ row }) => {
          const status = row.original.status;
          const color =
            status === depositStatus.PENDING
              ? "#D69E2E"
              : status === depositStatus.REJECTED
              ? "#E53E3E"
              : status === depositStatus.COMPLETED
              ? "#38A169"
              : "blue.500";
          return (
            <Text as={"span"} bg={color} color="white" p="1" borderRadius="md">
              {String(status).toUpperCase()}
            </Text>
          );
        }
      },
      {
        Header: "",
        accessor: "id",
        Cell: ({ cell }) => {
          return (
            <Button onClick={editPayment(cell.row.original)} variant="link">
              View
            </Button>
          );
        }
      }
    ],
    [editPayment]
  );

  const updateStore = (setter, selectedPayment) => {
    const clonedPayments = cloneDeep(payments);
    const index = clonedPayments.findIndex((item) => item.id === selectedPayment.id);
    clonedPayments[index] = { ...selectedPayment };
    dispatch(setter(clonedPayments));
  };

  const onStatusChanged = (status, comment) => () => {
    setUpdateDetails({ status, comment });
    onConfirmStatusChangeOpen();
  };

  const onDeleteComment = (commentId) => () => {
    if (transactionType === "deposit") {
      deleteCommentDeposit(selectedPayment.id, commentId).then((res) => {
        setUpdating(false);
        if (res?.status === 200) {
          setSelectedPayment(res.data.responseData);
          updateStore(setDeposits, res.data.responseData);
          toast.success("Comment Deleted");
        } else {
          toast.error("Comment delete failed");
        }
      });
    }
    if (transactionType === "cashout") {
      deleteCommentCashout(selectedPayment.id, commentId).then((res) => {
        setUpdating(false);
        if (res.status === 200) {
          toast.success("Comment Deleted");
          updateStore(setCashouts, res.data.responseData);
          setSelectedPayment(res.data.responseData);
        } else {
          toast.error("Comment delete failed");
        }
      });
    }
  };

  const onUpdateConfirmation = () => {
    const { status } = updateDetails;
    onConfirmStatusChangeClose()
    if (transactionType === "deposit") {
      setUpdating(true);
      updateDepositStatus(selectedPayment.id, status).then((res) => {
        setUpdating(false);
        if (res?.status === 200) {
          setSelectedPayment(res.data.responseData);
          updateStore(setDeposits, res.data.responseData);
          toast.success("Payment status updated!");
        } else {
          toast.error("Update status failed");
        }
      });
    }
    if (transactionType === "cashout") {
      setUpdating(true);
      updateCashoutStatus(selectedPayment.id, status).then((res) => {
        setUpdating(false);
        if (res.status === 200) {
          toast.success("Payment status updated!");
          updateStore(setCashouts, res.data.responseData);
          setSelectedPayment(res.data.responseData);
        } else {
          toast.error("Update status failed");
        }
      });
    }
  }

  const payments = useMemo(
    () => (transactionType === "deposit" ? deposits : cashouts),
    [cashouts, deposits, transactionType]
  );

  const totalAmount = useMemo(() => {
    let totalAmount = 0;
    payments.forEach((item) => {
      if (item.status === depositStatus.COMPLETED) {
        totalAmount += item.amount;
      }
    });
    return totalAmount;
  }, [payments]);

  return (
    <Box p={{ base: "4", md: "6" }}>
      {/* <Box w="max-content" mb={"4"}>
        <Flex w="max-content" alignItems={"center"}>
        <Box w="max-content">Select Date Range</Box>
        </Flex>
      </Box> */}
      <Flex alignItems="center" w="100%" justifyContent={"flex-start"} mb={"4"}>
        <Select w="max-content" mr="4" onChange={onMerchantChange} value={merchantId}>
          <option value={ALL_MERCHANT}>all merchants</option>
          {merchants?.length &&
            merchants.map((item) => {
              return (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              );
            })}
        </Select>
        <Box>
          <RangeDatepicker
            propsConfigs={{
              dayOfMonthBtnProps: {
                defaultBtnProps: {
                  _hover: {
                    background: "teal",
                    color: "white"
                  }
                },
                selectedBtnProps: { background: "teal", color: "white" },
                isInRangeBtnProps: { background: "teal", color: "white" },
                todayBtnProps: { colorScheme: "teal" }
              },
              popoverCompProps: {
                popoverContentProps: { colorScheme: "teal" },
                popoverBodyProps: { colorScheme: "teal" }
              },
              dateNavBtnProps: { colorScheme: "teal" }
            }}
            maxDate={new Date()}
            selectedDates={selectedDates}
            onDateChange={setSelectedDates}
          />
        </Box>

        <Button ml="3" type="button" colorScheme="teal" onClick={resetDateRange}>
          Reset
        </Button>
        <Text ml="8">
          <Text as="span" fontWeight={"semibold"}>
            {transactionType === "deposit" ? "Collected" : "Paid out"} Amount:{" "}
          </Text>
          <Text as="span" w="100%" fontSize="xl">
            {Number(totalAmount).toLocaleString("en-IN", {
              maximumFractionDigits: 2,
              style: "currency",
              currency: "INR"
            })}
          </Text>
        </Text>
      </Flex>
      {!!payments.length && (
        <Box borderWidth={"thin"} borderColor="GrayText" padding={"4"} borderRadius="lg" bg="white" width={"100%"}>
          <CustomTable columns={columns} data={payments} />
        </Box>
      )}
      {!payments.length && !loading && (
        <NotFound
          title={"No Record Found"}
          description={"The records you're looking for does not seem to exist"}
          ctaTitle={"Go to Home"}
          ctaPath="/"
        />
      )}
      {selectedPayment && isOpen && (
        <PaymentsModal
          onStatusChanged={onStatusChanged}
          isOpen={isOpen}
          onClose={onClose}
          data={selectedPayment}
          transactionType={transactionType}
          loading={updating}
          onSaveComment={onSaveComment}
          onDeleteComment={onDeleteComment}
        />
      )}
      <ConfirmStatusUpdateModal
        updateDetails={updateDetails}
        onConfirm={onUpdateConfirmation}
        isOpen={isConfirmStatusChangeOpen}
        onClose={onConfirmStatusChangeClose}
      />
    </Box>
  );
};

export default PaymentsPage;
