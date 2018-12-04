var amqp = require('amqplib/callback_api');
const uuidv4 = require('uuid/v4');

amqp.connect(
  'amqp://localhost',
  function(err, conn) {
    conn.createChannel(function(err, ch) {
      ch.assertQueue('', { exclusive: true }, function(err, q) {
        var corr = uuidv4();
        let text = 'Luke is a';

        console.log(' [x] Requesting reply', text);

        ch.consume(
          q.queue,
          function(msg) {
            if (msg.properties.correlationId == corr) {
              console.log(' [.] Got %s', msg.content.toString());
              setTimeout(function() {
                conn.close();
                process.exit(0);
              }, 500);
            }
          },
          { noAck: true }
        );

        ch.sendToQueue('rpc_queue', new Buffer(text.toString()), {
          correlationId: corr,
          replyTo: q.queue
        });
      });
    });
  }
);
