defmodule HelloWeb.HelloHTML do
  use HelloWeb, :html

  # def index(assigns) do
  #   ~H"""
  #   Hello!
  #   """
  # end

  embed_templates "hello_html/*"

  attr :mess, :string, default: nil

  def greet(assigns) do
    ~H"""
    <h2>Hello World, from <%= @mess %></h2>
    """
  end
end
