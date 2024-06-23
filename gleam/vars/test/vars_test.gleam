import gleeunit
import gleeunit/should
import vars/internal

pub fn main() {
  gleeunit.main()
}

pub fn format_pairs_test() {
  internal.format_pair("foo", "bar")
  |> should.equal("foo=bar")
}

// gleeunit test functions end in `_test`
pub fn hello_world_test() {
  1
  |> should.equal(1)
}
