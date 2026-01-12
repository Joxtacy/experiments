import sqlight
import wisp_app/models/item.{type Item}
import wisp_app/web.{type Context}

pub fn read_todo(ctx: Context, id: String) -> Item {
  let sql =
    "
		select id, title, completed from todos
		where id = ?
		"

  let item = sqlight.query(sql, on: ctx.db, with: [sqlight.string(id)])
  todo
}
