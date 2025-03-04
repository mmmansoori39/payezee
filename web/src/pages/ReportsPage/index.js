import { Box, Button, FormLabel, Select, Text } from "@chakra-ui/react";
import { RangeDatepicker } from "chakra-dayzed-datepicker";
import { useEffect, useState } from "react";
import { FiDownload } from "react-icons/fi";
import { getReportDownloadURL } from "../../services/payments";
import { downloadFile } from "../../utils/common";
import { getAllMerchants } from "../../services/merchant";
import { setMerchants } from "../../redux/slices/CommonSlice";
import { useDispatch, useSelector } from "react-redux";

const initialDateRangeValue = [null, new Date()];
const ALL_MERCHANT = "all";

const ReportsPage = () => {
  const dispatch = useDispatch();
  const [selectedDates, setSelectedDates] = useState(initialDateRangeValue);
  const [transactionType, setTransactionType] = useState("deposit");
  const { merchants } = useSelector((state) => state.common);
  const [merchantId, setMerchantId] = useState(ALL_MERCHANT);

  useEffect(() => {
    getAllMerchants().then((merchants) => {
      const merchantsArr = merchants.map((item) => ({ ...item, status: item.isActive ? "ACTIVE" : "INACTIVE" }));
      dispatch(setMerchants(merchantsArr));
    });
  }, [dispatch]);

  const reportDownload = () => {
    getReportDownloadURL({
      selectedDates,
      transactionType,
      merchantId: merchantId === ALL_MERCHANT ? null : merchantId
    }).then((res) => {
      if (res?.url) {
        downloadFile(res.url);
      }
    });
  };

  const resetDateRange = () => {
    setSelectedDates(initialDateRangeValue);
    setTransactionType("deposit");
    setMerchantId(ALL_MERCHANT);
  };

  const onTransactionTypeChange = (e) => {
    setTransactionType(e.currentTarget.value);
  };
  const onMerchantChange = (e) => {
    setMerchantId(e.currentTarget.value);
  };

  return (
    <Box pb="10">
      <Box bg="white" maxW={600} p="6" borderRadius="xl" margin={"auto"} mt="10">
        <Text as={"h1"} mb="4" fontSize={"lg"} fontWeight={"semibold"}>
          Download Report
        </Text>
        <Box mb="6">
          <FormLabel>Select Date Range</FormLabel>
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
        <FormLabel>Select Transaction Type</FormLabel>
        <Select mb="6" onChange={onTransactionTypeChange} value={transactionType}>
          <option value="deposit" defaultChecked>
            Deposit
          </option>
          <option value="cashout">Cashout</option>
        </Select>{" "}
        <FormLabel>Select Merchant</FormLabel>
        <Select mb="6" onChange={onMerchantChange} value={merchantId}>
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
        <Button mb="6" type="button" colorScheme="teal" onClick={resetDateRange}>
          Reset
        </Button>
        <Button mb="6" onClick={reportDownload} borderRadius={4} shadow={"md"} cursor={"pointer"} ml="4">
          <FiDownload height={24} width={24} /> Download
        </Button>
      </Box>
    </Box>
  );
};

export default ReportsPage;
