// server/models/Event.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // 我们先简化，不立即处理 participants 列表，
  // 而是默认发给全班。后续可以扩展这个字段。
}, {
  timestamps: true
});

module.exports = mongoose.model('Event', eventSchema);