use leptos::prelude::*;

#[component]
pub fn ProgressBar(
    #[prop(default = 100)] max: u16,
    #[prop(into)] progress: Signal<i32>,
) -> impl IntoView {
    view! {
        <progress max=max value=progress />
        <br />
    }
}
