import { Box, Button, Flex, useDisclosure } from "@chakra-ui/react";
import cloneDeep from "lodash/cloneDeep";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import CustomTable from "../../components/CustomTable";
import MerchantModal from "../../components/MerchantModal";
import { setMerchants } from "../../redux/slices/CommonSlice";
import { getAllMerchants, registerMerchant, updateMerchant } from "../../services/merchant";

const MerchantList = () => {
  const dispatch = useDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { merchants } = useSelector((state) => state.common);
  const [selectedMerchantData, setSelectedMerchantData] = useState(null);
  const [isEdit, setIsEdit] = useState(false);

  const onModalClose = () => {
    onClose();
    setSelectedMerchantData(null);
  };

  const onAddCTAClicked = () => {
    setIsEdit(false);
    onOpen();
  };

  useEffect(() => {
    getAllMerchants().then((merchants) => {
      const merchantsArr = merchants.map((item) => ({ ...item, status: item.isActive ? "ACTIVE" : "INACTIVE" }));
      dispatch(setMerchants(merchantsArr));
    });
  }, [dispatch]);

  const editMerchant = useCallback(
    (merchantData) => () => {
      setIsEdit(true);
      setSelectedMerchantData(merchantData);
      onOpen();
    },
    [onOpen]
  );

  const onSubmitEdit = async (values) => {
    const updatedBody = {};
    Object.keys(selectedMerchantData).forEach((key) => {
      if (selectedMerchantData[key] !== values[key]) {
        updatedBody[key] = values[key];
      }
    });
    const res = await updateMerchant(selectedMerchantData.id, updatedBody);
    if (res.status === 200) {
      const clonedMerchants = cloneDeep(merchants);
      const index = clonedMerchants.findIndex((item) => item.id === selectedMerchantData.id);
      clonedMerchants[index] = values;
      clonedMerchants[index].status = values.isActive ? "ACTIVE" : "INACTIVE";
      dispatch(setMerchants(clonedMerchants));
      toast.success("Merchant Info Updated Successfully");
    } else {
      toast.error("Something Went Wrong!");
    }
  };

  const onSubmit = async (values) => {
    const res = await registerMerchant(values);
    if (res.status === 200) {
      toast.success("Merchant Added Successfully");
      getAllMerchants().then((merchants) => {
        const index = merchants.findIndex((item) => item.id === res.data.responseData.id);
        const merchantsArr = merchants.map((item) => ({ ...item, status: item.isActive ? "ACTIVE" : "INACTIVE" }));
        setSelectedMerchantData(merchantsArr[index]);
        setIsEdit(true);
        dispatch(setMerchants(merchantsArr));
      });
    } else {
      toast.error("Something Went Wrong!");
    }
  };

  const columns = useMemo(
    () => [
      {
        Header: "Name",
        accessor: "name"
      },
      {
        Header: "Representative",
        accessor: "contactPersonName"
      },
      {
        Header: "Email",
        accessor: "contactEmail"
      },
      {
        Header: "MOBILE",
        accessor: "contactMobileNumber"
      },
      {
        Header: "STATUS",
        accessor: "status"
      },
      {
        Header: "",
        accessor: "id",
        Cell: ({ cell }) => {
          return (
            <Button onClick={editMerchant(cell.row.original)} variant="link">
              View
            </Button>
          );
        }
      }
    ],
    [editMerchant]
  );

  return (
    <Box p={{ base: "4", md: "6" }}>
      <Box>
        <Flex justifyContent={"flex-end"} mb="4" onClick={onOpen}>
          <Button onClick={onAddCTAClicked} type="button">
            Add Merchant
          </Button>
        </Flex>
        <Box borderWidth={"thin"} borderColor="GrayText" padding={"4"} borderRadius="lg" bg="white" width={"100%"}>
          <CustomTable columns={columns} data={merchants} />
        </Box>
      </Box>
      <MerchantModal
        isEdit={isEdit}
        {...{ isOpen, onOpen, onClose: onModalClose }}
        data={selectedMerchantData}
        onEditSubmit={!isEdit ? onSubmit : onSubmitEdit}
      />
    </Box>
  );
};

export default MerchantList;
