defmodule HelloWeb.PageController do
  use HelloWeb, :controller

  def home(conn, _params) do
    # The home page is often custom made,
    # so skip the default app layout.

    # send_resp(conn, 201, "")
    # conn
    # |> put_resp_content_type("text/plain")
    # # |> put_status(:created)
    # |> send_resp(201, "")

    # render(conn, :home, layout: false)
    # conn
    # |> put_status(:accepted)
    # |> render(:home, layout: false)

    # redirect(conn, to: ~p"/redirect_test")
    # If you want to redirect to page outside of the app
    # redirect(conn, external: "https://elixir-lang.org")

    conn
    |> clear_flash()
    |> put_flash(:error, "Let's pretend we have an error.")
    |> redirect(to: ~p"/redirect_test")
  end

  def redirect_test(conn, _params) do
    render(conn, :home, layout: false)
  end
end
