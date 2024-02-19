const mongoose = require('mongoose');
const { Schema } = mongoose;

const configSchema = new Schema(
  {
    active: Boolean,
    attributes: { type: Schema.Types.Mixed },
    config: { type: Schema.Types.Mixed },
  },
  {
    collection: 'configs',
    toObject: {
      transform(doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
    toJSON: {
      transform(doc) {
        return doc.toObject();
      },
    },
  }
);

const Config = mongoose.model('config', configSchema);

module.exports = Config;
