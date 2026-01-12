use indicatif::{ParallelProgressIterator, ProgressIterator};
use rayon::prelude::*;

fn main() {
    let res = (0..100_000_000)
        //.into_par_iter()
        .into_iter()
        .progress()
        .map(|i| i * 1)
        .collect::<Vec<_>>();
    println!("{}", res.len());
}
