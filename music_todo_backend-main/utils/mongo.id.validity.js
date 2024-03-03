import { mongoose } from "mongoose";

export const checkMongoIdValidity = (id) => {
  const isValid = mongoose.Types.ObjectId.isValid(id);

  return isValid;
};
