{:ok, connection} = AMQP.Connection.open
{:ok, channel} = connection
      |> AMQP.Channel.open()
channel |> AMQP.Queue.declare("task_queue_durable", durable: true)

message = case System.argv do
  [] -> "Hello World!"
  words -> Enum.join(words, " ")
end

channel |> AMQP.Basic.publish("", "task_queue_durable", message, persistent: true)
IO.puts " [x] Send '#{message}'"
connection |> AMQP.Connection.close()
