import { Schema, model } from "mongoose";

const ModelIncrementSchema = new Schema({
  model: { type: String, required: true },
  field: { type: String, required: true },
  idx: { type: Number, default: 0 }
});

ModelIncrementSchema.statics.getNextId = async function (modelName, fieldName) {
  let incr = await this.findOne({ model: modelName, field: fieldName });
  if (!incr) {
    incr = await this.create({ model: modelName, field: fieldName });
  }
  incr.idx++;
  await incr.save();
  return incr.idx;
};

const ModelIncrement = model("ModelIncrement", ModelIncrementSchema, "modelincrement");

export default ModelIncrement;
