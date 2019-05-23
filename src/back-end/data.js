const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//this will be our db's structure
const DataSchema = new Schema(
  {
    id: Number,
    message: String,
    code: String
  },
  { timestamps: true }
);

//export the new DataSchema
module.exports = mongoose.model("Data", DataSchema);
