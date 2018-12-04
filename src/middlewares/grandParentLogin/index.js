const amqp = require('amqplib/callback_api');
const uuidv4 = require('uuid/v4');

const grandParentAuthentication = (resolve, root, args, context, info) => {
  const { token, answers } = args;
  let sendPackage = JSON.stringify({
    token: token,
    answers: answers
  });
  amqp.connect(
    'amqp://localhost',
    function(err, conn) {
      conn.createChannel(function(err, ch) {
        ch.assertQueue('', { exclusive: true }, function(err, q) {
          var corr = uuidv4();
          console.log(' [x] Requesting reply', sendPackage);
          ch.consume(
            q.queue,
            function(msg) {
              if (msg.properties.correlationId == corr) {
                // setTimeout(function() {
                //   conn.close();
                //   process.exit(0);
                // }, 500);
                const response = JSON.parse(msg.content);
                console.log(response);
                context.rabbitResponse = response;
                return resolve(root, args, context, info);
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
};

module.exports = {
  grandParentAuthentication
};
