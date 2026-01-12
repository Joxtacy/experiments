defmodule Receive do
  def wait_for_messages(channel) do
    receive do
      {:basic_deliver, payload, meta} -> 
        IO.puts " [x] Received #{payload}"
        payload
        |> to_charlist
        |> Enum.count(fn x -> x == ?. end)
        |> Kernel.*(1000)
        |> :timer.sleep
        IO.puts" [x] Done"
        AMQP.Basic.ack(channel, meta.delivery_tag)

        wait_for_messages(channel)
    end
  end
end

{:ok, connection} = AMQP.Connection.open
{:ok, channel} = connection
      |> AMQP.Channel.open
{:ok, _} = AMQP.Queue.declare(channel, "task_queue_durable", durable: true)

AMQP.Basic.consume(channel,
  "task_queue_durable",
  nil, # consumer process, defaults to self()
  no_ack: false)
IO.puts " [*] Waiting for messages. To exit press CTRL+C, CTRL+C"

Receive.wait_for_messages(channel)
