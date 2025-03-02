use leptos::*;

fn main() {
    console_error_panic_hook::set_once();
    mount_to_body(|| view! { <App /> })
}

#[component]
fn App() -> impl IntoView {
    let (count, set_count) = create_signal(0);
    let double_count = move || count() * 2;
    view! {
        <button
            on:click=move |_| {
                set_count.update(|n| *n += 1);
            }
            // the class: syntax reactively updates a single class
            // here, we'll set the `red` class when `count` is odd
            class:red=move || count() % 2 == 1
            class=("button-20", move || count() % 2 == 1)
            // set the `style` attribute
            style="position: absolute"
            // and toggle individual CSS properties with `style:`
            style:left=move || format!("{}px", count() * 2 + 100)
            style:background-color=move || format!("rgb({}, {}, 100)", count(), 100)
            style:max-width="400px"
            style:top="100px"
            // Set a CSS variable for stylesheet use
            style=("--columns", count)
        >
            "Click me: "
            {count}
        </button>
        <progress
            max="50"
            // signals are functions, so `value=count` and `value=move || count.get()`
            // are interchangeable.
            value=double_count
        />
        <ProgressBar progress=count />
        <ProgressBar progress=Signal::derive(double_count) />
    }
}

/// Shows progress toward a goal
#[component]
fn ProgressBar(
    /// The maximum value of the progress bar
    #[prop(default = 100)]
    max: u16,
    /// How much progress should be displayed
    #[prop(into)]
    progress: Signal<i32>,
) -> impl IntoView {
    view! {
        <progress
            max=max
            // signals are functions, so `value=count` and `value=move || count.get()`
            // are interchangeable.
            value=progress
        />
    }
}
