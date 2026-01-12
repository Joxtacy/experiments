use leptos::{ev::SubmitEvent, html, prelude::*};

#[component]
pub fn ControlledInput() -> impl IntoView {
    let (name, set_name) = signal("Controlled".to_string());

    view! {
        <input
            type="text"
            // adding :target gives us typed access to the element
            // that is the target of the event that fires
            on:input:target=move |ev| {
                set_name.set(ev.target().value());
            }

            // the `prop:` syntax lets you update a DOM property,
            // rather than an attribute.
            prop:value=name
        />
        <p>"Name is: " {name}</p>
    }
}

#[component]
pub fn ControlledInputBind() -> impl IntoView {
    let (name, set_name) = signal("Controlled Bind".to_string());
    // let name = RwSignal::new("Controlled Bind".to_string());
    let email = RwSignal::new("".to_string());
    let spam_me = RwSignal::new(true);

    view! {
        <input type="text" bind:value=(name, set_name) />
        <input type="email" bind:value=email />
        <label>
            "Please send me lots of spam email." <input type="checkbox" bind:checked=spam_me />
        </label>
        <p>"Name is: " {name}</p>
        <p>"Email is: " {email}</p>
        <Show when=move || spam_me.get()>
            <p>"You’ll receive cool bonus content!"</p>
        </Show>
    }
}

#[component]
pub fn UncontrolledInput() -> impl IntoView {
    let (name, set_name) = signal("Uncontrolled".to_string());

    let input_element: NodeRef<html::Input> = NodeRef::new();

    let on_submit = move |ev: SubmitEvent| {
        // stop the page from reloading!
        ev.prevent_default();

        // here, we'll extract the value from the input
        let value = input_element
            .get()
            // event handlers can only fire after the view
            // is mounted to the DOM, so the `NodeRef` will be `Some`
            .expect("<input> should be mounted")
            // `leptos::HtmlElement<html::Input>` implements `Deref`
            // to a `web_sys::HtmlInputElement`.
            // this means we can call`HtmlInputElement::value()`
            // to get the current value of the input
            .value();
        set_name.set(value);
    };

    view! {
        // on_submit defined below
        <form on:submit=on_submit>
            <input type="text" value=name node_ref=input_element />
            <input type="submit" value="Submit" />
        </form>
        <p>"Name is: " {name}</p>
    }
}

#[component]
pub fn NumericInput() -> impl IntoView {
    let (value, set_value) = signal(Ok(0));

    view! {
        <h1>"Error Handling"</h1>
        <label>
            "Type a number (or something that's not a number!)"
            <input // type="number"
            on:input:target=move |ev| { set_value.set(ev.target().value().parse::<i32>()) } />
            // If an `Err(_) had been rendered inside the <ErrorBoundary/>,
            // the fallback will be displayed. Otherwise, the children of the
            // <ErrorBoundary/> will be displayed.
            // the fallback receives a signal containing current errors
            <ErrorBoundary fallback=|errors| {
                view! {
                    <div class="error">
                        <p>"Not a number! Errors: "</p>
                        // we can render a list of errors
                        // as strings, if we'd like
                        <ul>
                            {move || {
                                errors
                                    .get()
                                    .into_iter()
                                    .map(|(_, e)| view! { <li>{e.to_string()}</li> })
                                    .collect::<Vec<_>>()
                            }}
                        </ul>
                    </div>
                }
            }>
                <p>
                    // because `value` is `Result<i32, _>`,
                    "You entered " // it will render the `i32` if it is `Ok`,
                    // and render nothing and trigger the error boundary
                    // if it is `Err`. It's a signal, so this will dynamically
                    // update when `value` changes
                    <strong>{value}</strong>
                </p>
            </ErrorBoundary>
        </label>
    }
}
