const mongose = require("mongoose");

const messageModel = mongose.Schema(
  {
    sender: {
      type: mongose.Schema.Types.ObjectId,
      ref: "user",
    },
    content: {
      type: String,
      trim: true,
    },
    chat: {
      type: mongose.Schema.Types.ObjectId,
      ref: "Chat",
    },
    readBy: [{ type: mongose.Schema.Types.ObjectId, ref: "user" }],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

const Message = mongose.model("Message", messageModel);
module.exports = Message;
