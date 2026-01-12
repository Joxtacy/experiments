use leptos::{ev::MouseEvent, prelude::*};

#[component]
pub fn Buttons() -> impl IntoView {
    let (toggled_a, set_toggled_a) = signal(false);
    let (toggled_b, set_toggled_b) = signal(false);
    let (toggled_c, set_toggled_c) = signal(false);
    let (toggled_d, set_toggled_d) = signal(false);

    // share `set_toggled` with all children of this component
    provide_context(set_toggled_d);

    view! {
        <div>
            <p>"Toggled? " {toggled_a}</p>
            <ButtonA setter=set_toggled_a />
        </div>
        <div>
            <p>"Toggled? " {toggled_b}</p>
            <ButtonB on_click=move |_| set_toggled_b.update(|value| *value = !*value) />
        </div>
        <div>
            <p>"Toggled? " {toggled_c}</p>
            // note the on:click instead of on_click
            // this is the same syntax as an HTML element event listener
            <ButtonC on:click=move |_| set_toggled_c.update(|value| *value = !*value) />
        </div>
        <div>
            <p>"Toggled? " {toggled_d}</p>
            <Layout />
        </div>
    }
}

#[component]
fn ButtonA(setter: WriteSignal<bool>) -> impl IntoView {
    view! { <button on:click=move |_| setter.update(|value| *value = !*value)>"Toggle A"</button> }
}

#[component]
fn ButtonB(on_click: impl FnMut(MouseEvent) + 'static) -> impl IntoView {
    view! { <button on:click=on_click>"Toggle B"</button> }
}

#[component]
fn ButtonC() -> impl IntoView {
    view! { <button>"Toggle C"</button> }
}

#[component]
fn Layout() -> impl IntoView {
    view! {
        <header>
            <h1>"My Page"</h1>
        </header>
        <main>
            <Content />
        </main>
    }
}

#[component]
fn Content() -> impl IntoView {
    view! {
        <div class="content">
            <ButtonD />
        </div>
    }
}
#[component]
fn ButtonD() -> impl IntoView {
    // use_context searches up the context tree, hoping to
    // find a `WriteSignal<bool>`
    // in this case, I .expect() because I know I provided it
    let setter = use_context::<WriteSignal<bool>>().expect("to have found the setter provided");

    view! { <button on:click=move |_| setter.update(|value| *value = !*value)>"Toggle D"</button> }
}
