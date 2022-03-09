
const onErrorHandler = (reply, err) => reply
  .code(500)
  .header('Content-Type', 'application/json; charset=utf-8')
  .send(err);

module.exports = {
  onErrorHandler,
};
