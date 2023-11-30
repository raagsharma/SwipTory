const { Types } = require("mongoose");

const toObjectId = (id) => new Types.ObjectId(id);

module.exports = {
  toObjectId,
};
