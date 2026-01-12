use std::path::PathBuf;

use rusqlite::{Connection, Result};

// User's data directory (cross-platform)
fn get_db_path() -> PathBuf {
    let mut path = dirs::data_dir().unwrap_or_else(|| PathBuf::from("."));
    path.push("my_app");
    std::fs::create_dir_all(&path).unwrap();
    path.push("database.db");
    path
}

#[derive(Debug)]
struct Person {
    id: i32,
    name: String,
    email: String,
}

fn main() -> Result<()> {
    // Create/open database
    let db_path = get_db_path();
    let conn = Connection::open(&db_path)?;

    // Create table
    conn.execute(
        "CREATE TABLE IF NOT EXISTS person (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT NOT NULL
        )",
        [],
    )?;

    // Insert data
    conn.execute(
        "INSERT INTO person (name, email) VALUES (?1, ?2)",
        ["John Doe", "john@example.com"],
    )?;

    // Query data
    let mut stmt = conn.prepare("SELECT id, name, email FROM person")?;
    let person_iter = stmt.query_map([], |row| {
        Ok(Person {
            id: row.get(0)?,
            name: row.get(1)?,
            email: row.get(2)?,
        })
    })?;

    for person in person_iter {
        println!("{:?}", person?);
    }

    Ok(())
}
