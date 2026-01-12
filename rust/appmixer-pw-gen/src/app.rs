use std::error;

use redis::{Client, Commands, Connection, RedisResult};

/// Application result type.
pub type AppResult<T> = std::result::Result<T, Box<dyn error::Error>>;

/// Application.
#[derive(Debug)]
pub struct App<'a> {
    /// Is the application running?
    pub running: bool,
    /// counter
    pub counter: u8,
    /// redis connection
    pub client: Option<&'a Client>,
}

impl<'a> Default for App<'a> {
    fn default() -> Self {
        Self {
            running: true,
            counter: 0,
            client: None,
        }
    }
}

impl<'a> App<'a> {
    /// Constructs a new instance of [`App`].
    pub fn new() -> Self {
        Self::default()
    }

    /// .
    ///
    /// # Panics
    ///
    /// Panics if .
    pub fn init(&mut self, client: &'a Client) {
        self.client = Some(client);

        let mut con = self.client.unwrap().get_connection().unwrap();
        let res: RedisResult<u8> = con.get("ratatuiCounter");
        if res.is_err() {
            let _: () = con.set("ratatuiCounter", self.counter).unwrap();
        } else {
            let count = res.unwrap();
            self.counter = count;
        }
    }

    /// Handles the tick event of the terminal.
    pub fn tick(&self) {}

    /// Set running to false to quit the application.
    pub fn quit(&mut self) {
        self.running = false;
    }

    pub fn increment_counter(&mut self) {
        if let Some(res) = self.counter.checked_add(1) {
            self.counter = res;
            let mut con = self.client.unwrap().get_connection().unwrap();
            let _: () = con.set("ratatuiCounter", res).unwrap();
        }
    }

    pub fn decrement_counter(&mut self) {
        if let Some(res) = self.counter.checked_sub(1) {
            self.counter = res;
            let mut con = self.client.unwrap().get_connection().unwrap();
            let _: () = con.set("ratatuiCounter", res).unwrap();
        }
    }
}
