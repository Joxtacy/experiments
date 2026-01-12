defmodule HelloWeb.HelloController do
  use HelloWeb, :controller

  # In controlelrs, you can execute plugs only for certain actions
  plug HelloWeb.Plugs.Locale, "en" when action in [:index]

  def index(conn, _params) do
    conn
    |> put_layout(html: :admin)
    |> render(:index)

    # render(conn, :index)
  end

  # def show(conn, %{"messenger" => messenger} = params) do # this will keep the whole map in the `params` variable
  def show(conn, %{"messenger" => msgr}) do
    conn
    |> assign(:messenger, msgr)
    |> assign(:receiver, "Dweezil")
    |> render(:show)

    #
    # same as
    #
    # render(conn, :show, messenger: msgr, receiver: "Dweezil")

    # conn
    # |> Plug.Conn.assign(:messenger, msgr)
    # |> render(:show)
    #
    # same as
    #
    # render(conn, :show, messenger: "derpy #{msgr}")

    # text(conn, "derpy #{msgr}")
    # json(conn, %{id: msgr})
    # html(conn, "<h1>derpy #{msgr}</h1>")
  end
end
