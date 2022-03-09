module.exports = function (mongoose, connection) {
  const modelName = 'Config';
  const schema = mongoose.Schema(
    {
      active: Boolean,
      attributes: { type: mongoose.Schema.Types.Mixed },
      config: { type: mongoose.Schema.Types.Mixed },
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
    },
  );

  schema.index({ 'active': 1, 'attributes.$**': 'text' });
  schema.set('toObject', {
    virtuals: true,
    versionKey: false,
    transform(doc, ret) {
      delete ret._id;
    },
  });
  const model = connection.model(modelName, schema);
  return {
    modelName,
    model,
  };
};
