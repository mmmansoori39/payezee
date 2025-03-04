import Excel from "exceljs";
import path from "path";
import * as cashoutMasterService from "../services/cashoutMaster.service.js";
import * as depositMasterService from "../services/depositMaster.service.js";
import { HTTPCode } from "../utils/config/app.config.js";
import { userTypes } from "../utils/constants/constants.js";
import { commonResponse } from "../utils/helper/utility.helper.fn.js";
import { ErrorMessage, SuccessMessage } from "../utils/messages/messages.js";

const __dirname = path.dirname(new URL(import.meta.url).pathname);

const autoSizeColumn = (columns) => {
  try {
    columns.forEach(function (column) {
      let dataMax = 0;
      column.eachCell?.({ includeEmpty: true }, function (cell) {
        const columnLength = cell?.value?.length || 0;
        if (columnLength > dataMax) {
          dataMax = columnLength;
        }
      });
      column.width = dataMax < 10 ? 10 : dataMax;
    });
  } catch (error) {
    console.log("Error:autoSizeColumn:--------------\n", error);
  }
};

const generateExcelAndGetURL = async (data, transactionType, userType) => {
  if (data.length) {
    const workbook = new Excel.Workbook();
    const fileName = `kosmos-solution-report.xlsx`
    const worksheet = workbook.addWorksheet("Sheet 1");
    const exportPath = path.join(__dirname, "../public/", fileName);
    const url = `${process.env.SERVER_HOSTNAME}static/${fileName}`;
    const allColumns = [
      { header: "sr.no.", key: "sr.no." },
      { header: "transactionId", key: "transaction_id" },
      { header: "invoice_id", key: "invoice_id" },
      { header: "amount", key: "amount" },
      { header: "status", key: "status" },
      { header: "comment", key: "comment" },
      { header: "payer_name", key: "payer_name" },
      { header: "payer_email", key: "payer_email" },
      { header: "payer_phone", key: "payer_phone" },
      { header: "payer_city", key: "payer_city" },
      { header: "payer_state", key: "payer_state" },
      { header: "payer_street", key: "payer_street" },
      { header: "country", key: "country" },
      { header: "merchant_name", key: "merchant_name" },
      { header: "merchant_id", key: "merchant_id" },
      { header: "currency", key: "currency" },
      { header: "client_ip", key: "client_ip" },
      { header: "created_at", key: "created_at" }
    ];
    worksheet.columns = allColumns;
    data.forEach((item, index) => {
      const rowData = {
        "sr.no.": index + 1,
        transaction_id: item.transactionId,
        invoice_id: item.invoiceId,
        amount: item.amount,
        status: item.status,
        comment:item.comment || "",
        payer_name: `${item?.payer?.firstName || ""} ${item?.payer?.lastName || ""}`,
        payer_email: item?.payer?.email,
        payer_phone: item?.payer?.phone,
        payer_city: item?.payer?.address?.city,
        payer_state: item?.payer?.address?.state,
        payer_street: item?.payer?.address?.street,
        country: item.country,
        merchant_name: item?.merchant?.name,
        merchant_id: item?.merchant?._id,
        currency: item.currency,
        client_ip: item.clientIp,
        created_at: new Date(item?.createdAt)?.toUTCString(),
      };
      worksheet.addRow(rowData);
    });
    autoSizeColumn(worksheet.columns);
    await workbook.xlsx.writeFile(exportPath);
    return url;
  }
  return null;
};

export const getExcelFile = async (req, res) => {
  try {
    const queryParams = {};
    if (req.query.created_at_gte && req.query.created_at_lte) {
      queryParams.createdAt = {
        $gte: req.query.created_at_gte,
        $lte: req.query.created_at_lte
      };
    }
    if(req.query.merchant_id){
      queryParams.merchant = req.query.merchant_id;
    }
    if (req.user.type === userTypes.MERCHANT) {
      queryParams.merchant = req.user.merchantId;
    }
    let result = [];
    if (req.query.transaction_type === "cashout") {
      result = await cashoutMasterService.getAllCashouts(queryParams, { createdAt: 1 });
    }
    if (req.query.transaction_type === "deposit") {
      result = await depositMasterService.getAllPayments(queryParams, { createdAt: 1 });
    }
    console.log("req.user.type", req.user.type);
    const url = await generateExcelAndGetURL(result, req.query.transaction_type, req.user.type);
    if (!url) {
      return commonResponse(
        res,
        HTTPCode.NOT_FOUND,
        ErrorMessage.error,
        ErrorMessage.errorOnServer,
        null
      );
    } else {
      return commonResponse(
        res,
        HTTPCode.SUCCESSFUL,
        SuccessMessage.success,
        SuccessMessage.fetchSuccess,
        { url }
      );
    }
  } catch (error) {
    console.log(error);
    return commonResponse(
      res,
      HTTPCode.INTERNAL_SERVER,
      ErrorMessage.error,
      ErrorMessage.internalServerError,
      null
    );
  }
};
