{:ok, connection} = AMQP.Connection.open
{:ok, channel} = connection
      |> AMQP.Channel.open()
channel |> AMQP.Queue.declare("hello")
channel |> AMQP.Basic.publish("", "hello", "Hello World!")
IO.puts " [x] Sent 'Hello World!'"
connection |> AMQP.Connection.close()
