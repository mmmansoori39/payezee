import {
  Box,
  Button,
  Flex,
  Heading,
  Select,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr
} from "@chakra-ui/react";
import { memo, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Wrapper from "../../components/Wrapper";
import { setCityStatusData, setMerchants } from "../../redux/slices/CommonSlice";
import { getPaymentsByCityAndStatus } from "../../services/payments";
import { RangeDatepicker } from "chakra-dayzed-datepicker";
import { getAllMerchants } from "../../services/merchant";
import { depositStatus } from "../../utils/constants";
import { toInr } from "../../utils/common";

const initialDateRangeValue = [null, new Date()];
const ALL_MERCHANT = "all";

const DashboardPage = () => {
  const [selectedDates, setSelectedDates] = useState(initialDateRangeValue);
  const dispatch = useDispatch();
  const [merchantId, setMerchantId] = useState(ALL_MERCHANT);
  const { cityStatusData, merchants } = useSelector((state) => state.common);
  console.log({ cityStatusData });

  useEffect(() => {
    getAllMerchants().then((merchants) => {
      const merchantsArr = merchants.map((item) => ({ ...item, status: item.isActive ? "ACTIVE" : "INACTIVE" }));
      dispatch(setMerchants(merchantsArr));
    });
  }, [dispatch]);

  const onMerchantChange = (e) => {
    setMerchantId(e.currentTarget.value);
  };

  useEffect(() => {
    getPaymentsByCityAndStatus({ selectedDates, merchantId: merchantId === ALL_MERCHANT ? null : merchantId }).then(
      (res) => {
        dispatch(setCityStatusData(res || {}));
      }
    );
  }, [dispatch, merchantId, selectedDates]);

  const resetDateRange = () => {
    setSelectedDates(initialDateRangeValue);
    setMerchantId(ALL_MERCHANT);
  };

  const TableBox = memo(({ data }) => {
    const totals = useMemo(() => {
      if (data.length) {
        console.log({ data });
        return data.reduce((acc, cv) => {
          console.log({ acc });
          Object.values(depositStatus).forEach((item) => {
            if (acc[item]) {
              acc[item].totalAmount += cv.statuses?.[item]?.totalAmount || 0;
              acc[item].count += cv.statuses?.[item]?.count || 0;
            } else {
              acc[item] = {};
              acc[item].totalAmount = cv.statuses?.[item]?.totalAmount || 0;
              acc[item].count = cv.statuses?.[item]?.count || 0;
            }
          });
          return acc;
        }, {});
      }
      return [];
    }, [data]);
    console.log({ totals });
    return data?.length ? (
      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>City</Th>
              <Th isNumeric>Created</Th>
              <Th isNumeric>Pending</Th>
              <Th isNumeric>Completed</Th>
              <Th isNumeric>Rejected</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data.map((item) => {
              return (
                <Tr key={item.city}>
                  <Td>{item.city}</Td>
                  <Td isNumeric>
                    {toInr(item.statuses.created?.totalAmount || 0, 0)}{" "}
                    {item.statuses.created?.count ? `(${item.statuses.created?.count})` : ""}
                  </Td>
                  <Td isNumeric>
                    {toInr(item.statuses.pending?.totalAmount || 0, 0)}{" "}
                    {item.statuses.pending?.count ? `(${item.statuses.pending?.count})` : ""}
                  </Td>
                  <Td isNumeric>
                    {toInr(item.statuses.completed?.totalAmount || 0, 0)}{" "}
                    {item.statuses.completed?.count ? `(${item.statuses.completed?.count})` : ""}
                  </Td>
                  <Td isNumeric>
                    {toInr(item.statuses.rejected?.totalAmount || 0, 0)}{" "}
                    {item.statuses.rejected?.count ? `(${item.statuses.rejected?.count})` : ""}
                  </Td>
                </Tr>
              );
            })}
            <Tr>
              <Td textDecoration="underline">TOTAL</Td>
              <Td isNumeric>
                {toInr(totals?.created?.totalAmount || 0, 0)}{" "}
                {totals?.created?.count ? `(${totals?.created?.count})` : ""}
              </Td>
              <Td isNumeric>
                {toInr(totals?.pending?.totalAmount || 0, 0)}{" "}
                {totals?.pending?.count ? `(${totals?.pending?.count})` : ""}
              </Td>
              <Td isNumeric>
                {toInr(totals?.completed?.totalAmount || 0, 0)}{" "}
                {totals?.completed?.count ? `(${totals?.completed?.count})` : ""}
              </Td>
              <Td isNumeric>
                {toInr(totals?.rejected?.totalAmount || 0, 0)}{" "}
                {totals?.rejected?.count ? `(${totals?.rejected?.count})` : ""}
              </Td>
            </Tr>
          </Tbody>
        </Table>
      </TableContainer>
    ) : (
      <Text textAlign={"center"}>No records found!</Text>
    );
  });

  return (
    <Wrapper p={{ base: "3", md: "5" }}>
      <Box bg={"white"} p="4" borderRadius={"8"}>
        <Flex gap={8}>
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
          <Button mb="6" px={8} type="button" colorScheme="teal" onClick={resetDateRange}>
            Reset
          </Button>
        </Flex>
        {/* <Box borderWidth={"thin"} borderColor="GrayText" padding={"6"} borderRadius="lg" bg="white" width={"100%"}> */}
        <Heading mb="8" as="h1" size={"md"} textAlign="center">
          Deposits
        </Heading>
        <TableBox data={cityStatusData?.deposit || []} />
        <Heading mb="8" mt="8" as="h1" size={"md"} textAlign="center">
          Payouts
        </Heading>
        <TableBox data={cityStatusData?.cashout || []} />
      </Box>
      {/* </Box> */}
    </Wrapper>
  );
};

export default DashboardPage;
