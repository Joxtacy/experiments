use std::{cmp::Ordering, io, process::exit};

use rand::Rng;

fn main() -> io::Result<()> {
    print!("\x1B[2J\x1B[1;1H");
    println!("ROBOT MISSILE");
    println!();
    println!("TYPE THE CORRECT CODE");
    println!("LETTER (A-Z) TO");
    println!("DEFUSE THE MISSILE.");
    println!("YOU HAVE 4 CHANCES");
    println!();

    let c = (rand::thread_rng().gen_range(65..=90) as u8 as char).to_string();

    for g in 0..4 {
        let mut input = String::new();
        io::stdin().read_line(&mut input)?;
        let input = input.trim().to_uppercase();

        match input.cmp(&c) {
            Ordering::Equal => {
                println!("TICK...FZZZZ...CLICK...");
                print!("YOU DID IT");
                if g == 3 {
                    println!(" (JUST)");
                } else {
                    println!();
                }
                exit(0)
            }
            Ordering::Less => {
                print!("LATER");
            }
            Ordering::Greater => {
                print!("EARLIER");
            }
        }
        println!(" THAN {}", input);
    }

    println!();
    println!("BOOOOOOOOMMM...");
    println!("YOU BLEW IT.");
    println!("THE CORRECT CODE WAS {}", c);
    Ok(())
}
