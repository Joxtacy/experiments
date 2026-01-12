defmodule Math do
  def sum(a, b) do
    a + b
  end

  def zero?(0), do: true

  def zero?(x) when is_integer(x) do
    false
  end

  # A function head declaring defaults
  def sum_list(a, b \\ 0)

  def sum_list([head | tail], accumulator) do
    sum_list(tail, head + accumulator)
  end

  def sum_list([], accumulator) do
    accumulator
  end

  def double_each([head | tail]) do
    [head * 2 | double_each(tail)]
  end

  def double_each([]) do
    []
  end
end

IO.puts(Math.sum(1, 2))
IO.puts(Math.zero?(0))
IO.puts(Math.zero?(1))
# IO.puts(Math.zero?("zero"))    #=> ** (FunctionClauseError)
# IO.puts(Math.zero?([1, 2, 3])) #=> ** (FunctionClauseError)
# IO.puts(Math.zero?(0.0))       #=> ** (FunctionClauseError)

IO.puts(Math.sum_list([1, 2, 3, 4], 5))
IO.puts(Math.sum_list([1, 2, 3, 4]))
IO.puts(Enum.reduce([1, 2, 3, 4], 0, fn x, acc -> x + acc end))

IO.inspect(Math.double_each([1, 2, 3, 4]))
IO.inspect([1, 2, 3, 4] |> Math.double_each())
IO.inspect(Enum.map([1, 2, 3, 4], fn x -> x * 2 end))
