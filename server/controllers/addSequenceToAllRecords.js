import CashoutMaster from "../models/cashoutMaster.model.js";
import DepositMaster from "../models/depositMaster.model.js";
import ModelIncrement from "./sequenceIncrement.model.js";

export const fetchAllAndUpdate = async () => {
  let items = await DepositMaster.find();
  for (const item of items) {
    const sequence = await ModelIncrement.getNextId("DepositMaster", "sequence");
    item.sequence = sequence;
    console.log({ sequence });
    await DepositMaster.updateOne({ _id: item._id }, { sequence });
  }

  items = await CashoutMaster.find();
  for (const item of items) { 
    const sequence = await ModelIncrement.getNextId("CashoutMaster", "sequence");
    item.sequence = sequence;
    console.log({ sequence });
    await CashoutMaster.updateOne({ _id: item._id }, { sequence });
  }
};
