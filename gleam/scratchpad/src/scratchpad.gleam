import gleam/io
import gleam/set

pub fn main() {
  io.println("Hello from scratchpad!")

  let eighty_eight = set.from_list([88])
  io.debug(eighty_eight)
  let eighty_eight = set.insert(eighty_eight, 89)
  io.debug(eighty_eight)
  let eighty_eight = set.delete(eighty_eight, 88)
  io.debug(eighty_eight)
  let eighty_eight = set.delete(eighty_eight, 89)
  io.debug(eighty_eight)
}
