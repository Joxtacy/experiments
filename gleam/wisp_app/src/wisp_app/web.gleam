import gleam/bool
import gleam/string_tree
import sqlight
import wisp
import wisp_app/models/item.{type Item}

pub type Context {
  Context(static_directory: String, items: List(Item), db: sqlight.Connection)
}

pub fn middleware(
  req: wisp.Request,
  ctx: Context,
  handle_request: fn(wisp.Request) -> wisp.Response,
) -> wisp.Response {
  let req = wisp.method_override(req)

  use <- wisp.serve_static(req, under: "/static", from: ctx.static_directory)
  use <- wisp.log_request(req)
  use <- wisp.rescue_crashes
  use req <- wisp.handle_head(req)

  use <- default_responses

  handle_request(req)
  // This below is the equivalent of all of the `use <-` above
  // wisp.serve_static(
  // req,
  // under: "/static",
  // from: ctx.static_directory,
  // next: fn() {
  // wisp.log_request(req, fn() {
  // wisp.rescue_crashes(fn() {
  // wisp.handle_head(req, fn(req) {
  // default_responses(fn() { handle_request(req) })
  // })
  // })
  // })
  // },
  // )
}

pub fn default_responses(handle_request: fn() -> wisp.Response) -> wisp.Response {
  let response = handle_request()

  use <- bool.guard(when: response.body != wisp.Empty, return: response)

  case response.status {
    404 | 405 ->
      "<h1>Not found</h1>"
      |> string_tree.from_string
      |> wisp.html_body(response, _)

    400 | 422 ->
      "<h1>Bad request</h1>"
      |> string_tree.from_string
      |> wisp.html_body(response, _)

    413 ->
      "<h1>Request entity too large</h1>"
      |> string_tree.from_string
      |> wisp.html_body(response, _)

    500 ->
      "<h1>Internal server error</h1>"
      |> string_tree.from_string
      |> wisp.html_body(response, _)

    _ -> response
  }
}
