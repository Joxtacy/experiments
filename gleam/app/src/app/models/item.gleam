import gleam/option.{type Option}
import wisp

pub type ItemStatus {
  Completed
  Uncompleted
}

pub type Item {
  Item(id: String, title: String, status: ItemStatus)
}

pub fn create_item(id: Option(String), title: String, completed: Bool) -> Item {
  let id = option.unwrap(id, wisp.random_string(64))

  case completed {
    True -> Item(id, title, status: Completed)
    False -> Item(id, title, status: Uncompleted)
  }
}

pub fn toggle_todo(item: Item) -> Item {
  case item.status {
    Completed -> Item(..item, status: Uncompleted)
    Uncompleted -> Item(..item, status: Completed)
  }
}

pub fn item_status_to_bool(status: ItemStatus) -> Bool {
  case status {
    Completed -> True
    Uncompleted -> False
  }
}
