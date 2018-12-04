const amqp = require('amqplib/callback_api');
const uuidv4 = require('uuid/v4');

//const open = require('amqplib').connect('amqp://localhost');

const grandParentAuthentication = (resolve, root, args, context, info) => {
  const { token, answers } = args;
  let result;
  let sendPackage = JSON.stringify({
    token: token,
    answers: answers
  });

  return new Promise(promiseResolve => {
    amqp.connect(
      'amqp://localhost',
      function(err, conn) {
        conn.createChannel(function(err, ch) {
          ch.assertQueue('', { exclusive: true }, function(err, q) {
            var corr = uuidv4();
            ch.consume(
              q.queue,
              async function(msg) {
                if (msg.properties.correlationId == corr) {
                  const response = JSON.parse(msg.content);
                  context.rabbitResponse = response;
                  result = await resolve(root, args, context, info);
                  promiseResolve(result);
                }
              },
              { noAck: true }
            );
            ch.sendToQueue('rpc_queue', Buffer.from(sendPackage, 'utf8'), {
              correlationId: corr,
              replyTo: q.queue
            });
          });
        });
      }
    );
  });
};

module.exports = {
  grandParentAuthentication
};
