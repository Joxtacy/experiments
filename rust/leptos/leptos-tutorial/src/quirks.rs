use leptos::prelude::*;

#[component]
pub fn SelectQuirks() -> impl IntoView {
    let (value, set_value) = signal(0i32);
    view! {
        <select
            on:change:target=move |ev| {
                set_value.set(ev.target().value().parse().unwrap());
            }
            prop:value=move || value.get().to_string()
        >
            <option value="0">"0"</option>
            <option value="1">"1"</option>
            <option value="2">"2"</option>
        </select>
        // a button that will cycle through the options
        <button on:click=move |_| {
            set_value
                .update(|n| {
                    if *n == 2 {
                        *n = 0;
                    } else {
                        *n += 1;
                    }
                })
        }>"Next Option"</button>
    }
}

#[component]
pub fn TextAreaQuirks() -> impl IntoView {
    let (some_value, set_some_value) = signal("Some value".to_string());
    view! {
        <textarea
            prop:value=move || some_value.get()
            on:input:target=move |ev| set_some_value(ev.target().value())
        >
            // plain-text initial value, does not change if the signal changes
            {some_value.get_untracked()}
        </textarea>
    }
}
