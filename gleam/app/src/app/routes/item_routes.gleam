import app/models/item.{type Item}
import app/web.{type Context, Context}
import gleam/dynamic/decode
import gleam/io
import gleam/json
import gleam/list
import gleam/option
import gleam/result
import gleam/string
import wisp.{type Request, type Response}

type ItemsJson {
  ItemsJson(id: String, title: String, status: Bool)
}

pub fn items_middleware(
  req: Request,
  ctx: Context,
  handle_request: fn(Context) -> Response,
) {
  let parsed_items = {
    case wisp.get_cookie(req, "items", wisp.PlainText) {
      Ok(json_string) -> {
        let decoder = {
          use id <- decode.field("id", decode.string)
          use title <- decode.field("title", decode.string)
          use status <- decode.field("completed", decode.bool)
          decode.success(ItemsJson(id:, title:, status:))
        }

        let result = json.parse(json_string, decode.list(decoder))
        case result {
          Ok(items) -> items
          Error(_) -> []
        }
      }
      Error(_) -> []
    }
  }
  let items = create_items_from_json(parsed_items)

  let ctx = Context(..ctx, items: items)

  handle_request(ctx)
}

fn create_items_from_json(items: List(ItemsJson)) -> List(Item) {
  items
  |> list.map(fn(item) {
    let ItemsJson(id, title, status) = item
    item.create_item(option.Some(id), title, status)
  })
}

pub fn post_create_item(req: Request, ctx: Context) -> Response {
  use form <- wisp.require_form(req)

  let current_items = ctx.items
  io.debug(current_items)

  let result = {
    use item_title <- result.try(list.key_find(form.values, "todo_title"))
    let new_item = item.create_item(option.None, item_title, False)

    io.debug(new_item)
    list.append(current_items, [new_item])
    |> todos_to_json
    |> Ok
  }

  case result {
    Ok(todos) -> {
      wisp.redirect("/")
      |> wisp.set_cookie(req, "items", todos, wisp.PlainText, 60 * 60 * 24)
    }
    Error(_) -> wisp.bad_request()
  }
}

pub fn delete_item(req: Request, ctx: Context, item_id: String) -> Response {
  let current_items = ctx.items

  let json_items = {
    list.filter(current_items, fn(item) { item.id != item_id })
    |> todos_to_json
  }

  wisp.redirect("/")
  |> wisp.set_cookie(req, "items", json_items, wisp.PlainText, 60 * 60 * 24)
}

pub fn patch_toggle_todo(
  req: Request,
  ctx: Context,
  item_id: String,
) -> Response {
  let current_items = ctx.items

  let result = {
    use _ <- result.try(
      list.find(current_items, fn(item) { item.id == item_id }),
    )

    list.map(current_items, fn(item) {
      case item.id == item_id {
        True -> item.toggle_todo(item)
        False -> item
      }
    })
    |> todos_to_json
    |> Ok
  }

  case result {
    Ok(json_items) ->
      wisp.redirect("/")
      |> wisp.set_cookie(req, "items", json_items, wisp.PlainText, 60 * 60 * 24)
    Error(_) -> wisp.bad_request()
  }
}

fn todos_to_json(items: List(Item)) -> String {
  "["
  <> items
  |> list.map(items_to_json)
  |> string.join(",")
  <> "]"
}

fn items_to_json(item: Item) -> String {
  json.object([
    #("id", json.string(item.id)),
    #("title", json.string(item.title)),
    #("completed", json.bool(item.item_status_to_bool(item.status))),
  ])
  |> json.to_string
}
