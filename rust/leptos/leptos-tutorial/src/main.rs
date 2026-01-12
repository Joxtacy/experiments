use leptos::prelude::*;
mod buttons;
mod children;
mod control_flow;
mod inputs;
mod lists;
mod progress_bars;
mod quirks;

fn main() {
    console_error_panic_hook::set_once(); // https://book.leptos.dev/getting_started/leptos_dx.html#1-set-up-console_error_panic_hook
    leptos::mount::mount_to_body(App)
}

#[component]
fn App() -> impl IntoView {
    let (count, set_count) = signal(0);
    let double_count = move || count.get() * 2;

    view! {
        <button
            on:click=move |_| {
                *set_count.write() += 1;
            }
            class:red=move || count.get() % 2 == 1
            class=("button-20", move || count.get() % 2 == 1)
            class=(["button-20", "rounded"], move || count.get() % 2 == 1)
            style="position: absolute"
            style:left=move || format!("{}px", count.get() + 100)
            style:background-color=move || format!("rgb({}, {}, 100)", count.get(), 100)
            style:max-width="400px"
            style=("--columns", move || count.get().to_string())
        >
            "Click me: "
            {count}
        </button>
        <progress
            max="50"
            // signals are functions, so `value=count` and `value=move || count.get()`
            // are interchangeable.
            value=count
        />
        <progress max="50" value=double_count />
        <p>"Double Count: " {double_count}</p>
        <progress_bars::ProgressBar progress=count />
        <progress_bars::ProgressBar progress=Signal::derive(double_count) />

        <h1>"Iteration"</h1>
        <h2>"Static List"</h2>
        <p>"Use this pattern if the list itself is static."</p>
        <lists::StaticList length=5 />
        <h2>"Dynamic List"</h2>
        <p>"Use this pattern if the rows in your list will change."</p>
        <lists::DynamicList initial_length=5 />
        <inputs::ControlledInput />
        <inputs::ControlledInputBind />
        <inputs::UncontrolledInput />
        <inputs::NumericInput />
        <quirks::TextAreaQuirks />
        <quirks::SelectQuirks />
        <control_flow::ControlFlow />
        <buttons::Buttons />
        <children::TakesChildren render_prop=|| {
            view! { <p>"Hi, there!"</p> }
        }>
            // these get passed to `children`
            "Some text " <span>"A span"</span>
        </children::TakesChildren>
    }
}
