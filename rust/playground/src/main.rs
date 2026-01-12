fn main() {
    let res = -11 % 2;
    println!("{}", res);

    let r; // r declared but not initialized
    let x = vec![69];
    hello(x);
    r = &x; // r borrows x
    println!("{:?}", r);
}

fn hello(a: Vec<i32>) {
    println!("{a:?}");
}
