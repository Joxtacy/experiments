use leptos::prelude::*;

/// Displays a `render_prop` and some children within markup.
#[component]
pub fn TakesChildren<F, IV>(
    /// Takes a function (type F) that returns anything that can be
    /// converted into a View (type IV)
    render_prop: F,
    /// `children` can take one of several different types, each of which
    /// is a function that returns some view type
    children: Children,
) -> impl IntoView
where
    F: Fn() -> IV,
    IV: IntoView,
{
    view! {
        <h1>
            <code>"<TakesChildren/>"</code>
        </h1>
        <h2>"Render Prop"</h2>
        {render_prop()}
        <h2>"Children"</h2>
        {children()}
    }
}
