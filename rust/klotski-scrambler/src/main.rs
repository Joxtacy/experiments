use rand::seq::SliceRandom; // Import the SliceRandom trait to enable shuffling of slices.
use rand::thread_rng; // Import thread_rng for generating random numbers.

/// Checks if a given 15 puzzle is solvable.
///
/// A puzzle is solvable if the number of inversions plus the row number
/// of the blank space from the bottom is even.
fn is_solvable(puzzle: &[u8; 16]) -> bool {
    let mut inversions = 0;

    // Count the number of inversions in the puzzle.
    for i in 0..15 {
        for j in i + 1..16 {
            // An inversion is when a larger numbered tile precedes a smaller one.
            if puzzle[i] != 0 && puzzle[j] != 0 && puzzle[i] > puzzle[j] {
                inversions += 1;
            }
        }
    }

    // Determine the row of the blank tile (0) from the top.
    let blank_row = puzzle.iter().position(|&x| x == 0).unwrap() / 4;

    // Calculate the row of the blank tile from the bottom.
    let row_from_bottom = 3 - blank_row;

    // The puzzle is solvable if the sum of inversions and the blank row index is even.
    (inversions + row_from_bottom) % 2 == 0
}

/// Generates a solvable 15 puzzle by shuffling until a solvable configuration is found.
fn generate_solvable_puzzle() -> [u8; 16] {
    let mut puzzle = [0u8; 16];

    // Initialize the puzzle with numbers 1 through 15 and a blank space (0).
    (0..15).for_each(|i| {
        puzzle[i] = (i + 1) as u8;
    });
    puzzle[15] = 0; // The blank space.

    loop {
        // Shuffle the puzzle array randomly.
        puzzle.shuffle(&mut thread_rng());

        // Check if the shuffled puzzle is solvable.
        if is_solvable(&puzzle) {
            break;
        }
    }

    puzzle
}

/// Prints the 15 puzzle in a 4x4 grid format.
fn print_puzzle(puzzle: &[u8; 16]) {
    for (i, &tile) in puzzle.iter().enumerate() {
        // Print a space for the blank tile (0).
        if tile == 0 {
            print!("   ");
        } else {
            print!("{:>2} ", tile);
        }

        // Start a new line after every 4 tiles to form a 4x4 grid.
        if i % 4 == 3 {
            println!();
        }
    }
}

#[derive(Copy, Clone, Debug, PartialEq)]
enum Move {
    Up,
    Down,
    Left,
    Right,
}

/// Convert a sequence of moves to a string representation.
// fn moves_to_string(moves: &[Move]) -> String {
// let moves = moves
// .iter()
// .map(|m| match m {
// Move::Up => "U",
// Move::Down => "D",
// Move::Left => "L",
// Move::Right => "R",
// })
// .collect::<Vec<&str>>()
// .join("");
// moves
// }

/// Convert a sequence of moves to a compact string representation.
fn moves_to_string(moves: &[Move]) -> String {
    if moves.is_empty() {
        return String::new();
    }

    let mut result = String::new();
    let mut count = 1;

    for i in 1..moves.len() {
        if moves[i] == moves[i - 1] {
            count += 1;
        } else {
            result.push(moves[i - 1].get_char());
            if count > 1 {
                result.push_str(&count.to_string());
            }
            count = 1;
            result.push(' ');
        }
    }

    // Handle the last move
    if count > 1 {
        result.push_str(&count.to_string());
    }
    result.push(moves[moves.len() - 1].get_char());

    result
}

impl Move {
    /// Returns the opposite move, used to prevent move reversals.
    fn opposite(&self) -> Move {
        match self {
            Move::Up => Move::Down,
            Move::Down => Move::Up,
            Move::Left => Move::Right,
            Move::Right => Move::Left,
        }
    }

    /// Returns a single character representation of the move.
    fn get_char(&self) -> char {
        match self {
            Move::Up => 'U',
            Move::Down => 'D',
            Move::Left => 'L',
            Move::Right => 'R',
        }
    }
}

/// Apply a move to the puzzle and return the new blank position.
fn apply_move(puzzle: &mut [u8; 16], blank_pos: usize, mov: Move) -> usize {
    let new_blank_pos = match mov {
        Move::Down => blank_pos.wrapping_sub(4),
        Move::Up => blank_pos.wrapping_add(4),
        Move::Right => blank_pos.wrapping_sub(1),
        Move::Left => blank_pos.wrapping_add(1),
    };

    puzzle.swap(blank_pos, new_blank_pos);
    new_blank_pos
}

/// Generate a list of valid moves based on the current blank position,
/// excluding the move that would undo the last move.
fn valid_moves(blank_pos: usize, last_move: Option<Move>) -> Vec<Move> {
    let mut moves = Vec::new();

    if blank_pos >= 4 {
        moves.push(Move::Down);
    }
    if blank_pos <= 11 {
        moves.push(Move::Up);
    }
    if blank_pos % 4 != 0 {
        moves.push(Move::Right);
    }
    if blank_pos % 4 != 3 {
        moves.push(Move::Left);
    }

    // Exclude the move that would undo the last move.
    if let Some(last) = last_move {
        moves.retain(|&m| m != last.opposite());
    }

    moves
}

/// Scramble the puzzle by making a specified number of random moves from the solved state,
/// ensuring no move undoes the previous one.
fn scramble_puzzle(puzzle: &mut [u8; 16], num_moves: usize) -> Vec<Move> {
    let mut rng = thread_rng();
    let mut blank_pos = 15; // Blank tile starts at the bottom-right corner.
    let mut move_sequence = Vec::new();
    let mut last_move = None;

    for _ in 0..num_moves {
        let moves = valid_moves(blank_pos, last_move);
        let &selected_move = moves.choose(&mut rng).unwrap();
        blank_pos = apply_move(puzzle, blank_pos, selected_move);
        move_sequence.push(selected_move);
        last_move = Some(selected_move);
    }

    move_sequence
}

fn main() {
    // Generate a solvable 15 puzzle.

    // println!("Welcome to the 15-puzzle solver!");
    // let puzzle = generate_solvable_puzzle();

    // Display the scrambled 15 puzzle.
    // println!("Here is your scrambled 15-puzzle:");
    // print_puzzle(&puzzle);

    let mut puzzle = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0];
    let num_moves = 30; // Number of random moves to scramble the puzzle.

    // Scramble the puzzle and get the sequence of moves.
    let move_sequence = scramble_puzzle(&mut puzzle, num_moves);

    // Print the sequence of moves.
    println!("Moves taken to scramble the puzzle:");
    println!("{}", moves_to_string(&move_sequence));

    // Print the scrambled puzzle.
    println!("\nScrambled puzzle:");
    print_puzzle(&puzzle);
}
