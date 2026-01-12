import dot_env
import dot_env/env
import gleam/dynamic/decode
import gleam/erlang/process
import gleam/option
import mist
import sqlight
import wisp
import wisp/wisp_mist
import wisp_app/models/item
import wisp_app/router
import wisp_app/web

pub fn main() {
  wisp.configure_logger()

  dot_env.new()
  |> dot_env.set_path(".env")
  |> dot_env.set_debug(False)
  |> dot_env.load

  let assert Ok(secret_base_key) = env.get_string("SECRET_BASE_KEY")

  use conn <- sqlight.with_connection(":memory:")
  let todo_decoder = {
    use id <- decode.field(0, decode.string)
    use title <- decode.field(1, decode.string)
    use completed <- decode.field(2, sqlight.decode_bool())

    //decode.success(#(id, title, completed))
    decode.success(item.create_item(option.Some(id), title, completed))
  }

  let sql =
    "
		create table todos (id text, title text, completed int);
		
		insert into todos (id, title, completed) values
		('1', 'first todo', 0),
		('2', 'second todo', 0),
		('3', 'third todo', 1);
		"
  let assert Ok(Nil) = sqlight.exec(sql, conn)

  let sql =
    "
		select id, title, completed from todos
		where id < ?
		"

  let i = item.create_item(option.Some("1"), "first todo", False)
  let j = item.create_item(option.Some("2"), "second todo", False)
  // let assert Ok([#("1", "first todo", False), #("2", "second todo", False)]) =
  let assert Ok([i, j]) =
    sqlight.query(
      sql,
      on: conn,
      with: [sqlight.int(3)],
      expecting: todo_decoder,
    )

  let ctx =
    web.Context(static_directory: static_directory(), items: [], db: conn)

  let handler = router.handle_request(_, ctx)

  let assert Ok(_) =
    wisp_mist.handler(handler, secret_base_key)
    |> mist.new
    |> mist.port(8000)
    |> mist.start_http

  process.sleep_forever()
}

fn static_directory() -> String {
  let assert Ok(priv_directory) = wisp.priv_directory("wisp_app")
  priv_directory <> "/static"
}
