import gleeunit
import gleeunit/should
import vars/internal

pub fn main() {
  gleeunit.main()
}

// gleeunit test functions end in `_test`
pub fn format_pair_test() {
  internal.format_pair("hello", "world")
  |> should.equal("hello=world")
}
