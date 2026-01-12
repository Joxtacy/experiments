#![allow(dead_code)]

fn main() {}

fn count_bits(n: i64) -> u32 {
    n.count_ones()
}

fn solution(s: &str) -> Vec<String> {
    s.chars()
        .collect::<Vec<_>>()
        .chunks(2)
        .map(|c| {
            if c.len() == 1 {
                format!("{}{}", c[0], "_")
            } else {
                format!("{}{}", c[0], c[1])
            }
        })
        .collect()
}

fn likes(names: &[&str]) -> String {
    match names.len() {
        0 => String::from("no one likes this"),
        1 => format!("{} likes this", names[0]),
        2 => format!("{} and {} like this", names[0], names[1]),
        3 => format!("{}, {} and {} like this", names[0], names[1], names[2]),
        4.. => format!(
            "{}, {} and {} others like this",
            names[0],
            names[1],
            names.len() - 2
        ),
    }
}

fn digital_root(n: i64) -> i64 {
    if n < 10 {
        n
    } else {
        digital_root(n / 10 + n % 10)
    }
}

fn digital_root_alt(n: i64) -> i64 {
    (n - 1) % 9 + 1
}

#[cfg(test)]
mod tests_bit_counting {
    use super::*;

    #[test]
    fn returns_expected() {
        assert_eq!(count_bits(0), 0);
        assert_eq!(count_bits(4), 1);
        assert_eq!(count_bits(7), 3);
        assert_eq!(count_bits(9), 2);
        assert_eq!(count_bits(10), 2);
        assert_eq!(count_bits(26), 3);
        assert_eq!(count_bits(77231418), 14);
        assert_eq!(count_bits(12525589), 11);
        assert_eq!(count_bits(3811), 8);
        assert_eq!(count_bits(392902058), 17);
        assert_eq!(count_bits(1044), 3);
        assert_eq!(count_bits(10030245), 10);
        assert_eq!(count_bits(183337941), 16);
        assert_eq!(count_bits(20478766), 14);
        assert_eq!(count_bits(103021), 9);
        assert_eq!(count_bits(287), 6);
        assert_eq!(count_bits(115370965), 15);
        assert_eq!(count_bits(31), 5);
        assert_eq!(count_bits(417862), 7);
        assert_eq!(count_bits(626031), 12);
        assert_eq!(count_bits(89), 4);
        assert_eq!(count_bits(674259), 10);
    }
}

#[cfg(test)]
mod tests_split_strings {
    use super::*;

    #[test]
    fn basic() {
        assert_eq!(solution("abcdef"), ["ab", "cd", "ef"]);
        assert_eq!(solution("abcdefg"), ["ab", "cd", "ef", "g_"]);
        assert_eq!(solution(""), [] as [&str; 0]);
    }
}

#[cfg(test)]
mod tests_who_likes_it {
    use super::*;

    #[test]
    fn fixed_tests() {
        assert_eq!(likes(&[]), "no one likes this");
        assert_eq!(likes(&["Peter"]), "Peter likes this");
        assert_eq!(likes(&["Jacob", "Alex"]), "Jacob and Alex like this");
        assert_eq!(
            likes(&["Max", "John", "Mark"]),
            "Max, John and Mark like this"
        );
        assert_eq!(
            likes(&["Alex", "Jacob", "Mark", "Max"]),
            "Alex, Jacob and 2 others like this"
        );
        assert_eq!(
            likes(&["a", "b", "c", "d", "e"]),
            "a, b and 3 others like this"
        );
    }
}

#[cfg(test)]
mod tests_digital_root {
    use super::*;

    #[test]
    fn returns_expected() {
        assert_eq!(digital_root(0), 0);
        assert_eq!(digital_root(16), 7);
        assert_eq!(digital_root(942), 6);
        assert_eq!(digital_root(132189), 6);
        assert_eq!(digital_root(493193), 2);
    }

    #[test]
    fn returns_expected_alt() {
        assert_eq!(digital_root_alt(0), 0);
        assert_eq!(digital_root_alt(16), 7);
        assert_eq!(digital_root_alt(942), 6);
        assert_eq!(digital_root_alt(132189), 6);
        assert_eq!(digital_root_alt(493193), 2);
    }
}
