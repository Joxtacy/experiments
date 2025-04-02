import app/models/item.{type Item, Completed, Uncompleted}
import gleam/list
import lustre/attribute
import lustre/element.{type Element}
import lustre/element/html
import lustre/element/svg

pub fn root(items: List(Item)) -> Element(t) {
  html.div([attribute.class("app")], [
    html.h1([attribute.class("app-title")], [html.text("Todo App")]),
    todos(items),
  ])
}

fn todos(items: List(Item)) -> Element(t) {
  html.div([attribute.class("todos")], [
    todos_input(),
    html.div([attribute.class("todos__inner")], [
      html.div(
        [attribute.class("todos__list")],
        items
          |> list.map(item),
      ),
      todos_empty(),
    ]),
  ])
}

fn todos_input() -> Element(t) {
  html.form(
    [
      attribute.class("add-todo-input"),
      attribute.method("POST"),
      attribute.action("/items/create"),
    ],
    [
      html.input([
        attribute.name("todo_title"),
        attribute.class("add-todo-input__input"),
        attribute.placeholder("What needs to be done?"),
        attribute.autofocus(True),
      ]),
    ],
  )
}

fn item(item: Item) -> Element(t) {
  let completed_class: String = {
    case item.status {
      Completed -> "todo--completed"
      Uncompleted -> ""
    }
  }

  html.div([attribute.class("todo " <> completed_class)], [
    html.div([attribute.class("todo__inner")], [
      html.form(
        [
          attribute.method("POST"),
          attribute.action("/items/" <> item.id <> "/completion?_method=PATCH"),
        ],
        [html.button([attribute.class("todo__button")], [svg_icon_checked()])],
      ),
      html.span([attribute.class("todo__title")], [html.text(item.title)]),
    ]),
    html.form(
      [
        attribute.method("POST"),
        attribute.action("/items/" <> item.id <> "?_method=DELETE"),
      ],
      [html.button([attribute.class("todo__delete")], [svg_icon_delete()])],
    ),
  ])
}

fn todos_empty() -> Element(t) {
  html.div([attribute.class("todos__empty")], [])
}

fn svg_icon_delete() -> Element(t) {
  html.svg(
    [
      attribute.class("todo__delete-icon"),
      attribute.attribute("viewBox", "0 0 24 24"),
    ],
    [
      svg.path([
        attribute.attribute("fill", "currentColor"),
        attribute.attribute(
          "d",
          "M9,3V4H4V6H5V19A2,2 0 0,0 7,21H17A2,2 0 0,0 19,19V6H20V4H15V3H9M9,8H11V17H9V8M13,8H15V17H13V8Z",
        ),
      ]),
    ],
  )
}

fn svg_icon_checked() -> Element(t) {
  html.svg(
    [
      attribute.class("todo__checked-icon"),
      attribute.attribute("viewBox", "0 0 24 24"),
    ],
    [
      svg.path([
        attribute.attribute("fill", "currentColor"),
        attribute.attribute(
          "d",
          "M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z",
        ),
      ]),
    ],
  )
}
