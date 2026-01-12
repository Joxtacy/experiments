use askama::Template;

#[derive(Template)]
#[template(path = "hello.html")]
struct HelloTemplate<'a> {
    name: &'a str,
}

#[derive(Template)]
#[template(path = "base.html")]
struct BaseTemplate<'a> {
    title: &'a str,
}

#[derive(Template)]
#[template(path = "child.html")]
struct ChildTemplate;

#[derive(Template)]
#[template(path = "for.html")]
struct ForTemplate {
    users: Vec<String>,
}

fn main() {
    let hello = HelloTemplate { name: "wurl" };
    println!("HELLO:\n{}", hello.render().unwrap());

    let base = BaseTemplate { title: "herpderp" };
    println!("BASE:\n{}", base.render().unwrap());

    let child = ChildTemplate;
    println!("CHILD:\n{}", child.render().unwrap());

    let users = vec!["herp".to_string(), "derp".to_string()];
    let for_template = ForTemplate { users };
    println!("FOR:\n{}", for_template.render().unwrap());
}
