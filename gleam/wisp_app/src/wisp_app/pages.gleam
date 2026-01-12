import wisp_app/models/item.{type Item}
import wisp_app/pages/home

pub fn home(items: List(Item)) {
  home.root(items)
}
