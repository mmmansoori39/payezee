import { Box, Button, Flex, Text, Tooltip, useDisclosure } from "@chakra-ui/react";
import { RangeDatepicker } from "chakra-dayzed-datepicker";
import dayjs from "dayjs";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CustomTable from "../../components/CustomTable";
import NotFound from "../../components/NotFound";
import PaymentsModal from "../../components/PaymentsModal";
import { setCashouts, setDeposits, setLoading } from "../../redux/slices/CommonSlice";
import { getAllCashouts, getAllDeposits, getReportDownloadURL } from "../../services/payments";
import { depositStatus, userTypes } from "../../utils/constants";
import { Select } from "@chakra-ui/react";
import { downloadFile } from "../../utils/common";
import { FiDownload } from "react-icons/fi";

const initialDateRangeValue = [null, new Date()];

const PaymentsPage = () => {
  const [transactionType, setTransactionType] = useState("deposit");
  const [selectedDates, setSelectedDates] = useState(initialDateRangeValue);
  const dispatch = useDispatch();
  const { deposits, loading, cashouts, user } = useSelector((state) => state.common);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const reportDownload = () => {
    getReportDownloadURL({ selectedDates, transactionType }).then((res) => {
      if (res?.url) {
        downloadFile(res.url);
      }
    });
  };

  useEffect(() => {
    if (selectedDates.length === 2) {
      if (transactionType === "deposit") {
        dispatch(setLoading(true));
        getAllDeposits({ selectedDates }).then((payments) => {
          dispatch(setDeposits(payments));
          dispatch(setLoading(false));
        });
      }
      if (transactionType === "cashout") {
        dispatch(setLoading(true));
        getAllCashouts({ selectedDates }).then((payments) => {
          dispatch(setCashouts(payments));
          dispatch(setLoading(false));
        });
      }
    }
  }, [dispatch, transactionType, selectedDates]);

  const editPayment = useCallback(
    (payment) => () => {
      setSelectedPayment(payment);
      onOpen();
    },
    [onOpen]
  );

  const onTransactionTypeChange = (e) => {
    setTransactionType(e.currentTarget.value);
  };

  const resetDateRange = () => {
    setSelectedDates(initialDateRangeValue);
  };

  const columns = useMemo(
    () => [
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

  const payments = transactionType === "deposit" ? deposits : cashouts;

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

        <Select ml="3" w={"max-content"} onChange={onTransactionTypeChange} value={transactionType}>
          <option value="deposit" defaultChecked>
            Deposit
          </option>
          <option value="cashout">Cashout</option>
        </Select>

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
        <Tooltip label="Download Report">
          <Box onClick={reportDownload} borderRadius={4} shadow={"md"} p="2" bg={"white"} cursor={"pointer"} ml="4">
            <FiDownload height={24} width={24} />
          </Box>
        </Tooltip>
      </Flex>
      {!!payments.length && (
        <Box borderWidth={"thin"} borderColor="GrayText" padding={"4"} borderRadius="lg" bg="white" width={"100%"}>
          <CustomTable columns={columns} data={payments} />
        </Box>
      )}
      {!payments.length && !loading && (
        <NotFound
          showCTA={user.type === userTypes.ADMIN}
          title={"No Record Found"}
          description={"The records you're looking for does not seem to exist"}
          ctaTitle={"Go to Home"}
          ctaPath="/"
        />
      )}
      <PaymentsModal
        isOpen={isOpen}
        onClose={onClose}
        data={selectedPayment}
        isReadonly={true}
        transactionType={transactionType}
      />
    </Box>
  );
};

export default PaymentsPage;
