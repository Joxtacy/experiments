use ratatui::{
    layout::{Alignment, Constraint, Direction, Layout},
    style::Style,
    widgets::{Block, Borders, Paragraph},
    Frame,
};
use tui_tree_widget::{Tree, TreeItem, TreeState};

use crate::app::App;

/// Renders the user interface widgets.
pub fn render(app: &mut App, frame: &mut Frame) {
    let chunks = Layout::default()
        .direction(Direction::Horizontal)
        .constraints([Constraint::Percentage(50), Constraint::Min(50)])
        .split(frame.size());

    let left_block = Block::default()
        .borders(Borders::ALL)
        .style(Style::default());
    let left_title = Paragraph::new("Left block").block(left_block);

    //let right_block = Block::default()
    //.borders(Borders::ALL)
    //.style(Style::default());
    //let right_title = Paragraph::new("Right block").block(right_block);

    let right_chunks = Layout::default()
        .direction(Direction::Vertical)
        .constraints([Constraint::Percentage(50), Constraint::Percentage(50)])
        .split(chunks[1]);

    let rb_block = Block::default()
        .borders(Borders::ALL)
        .title("hi")
        .title_alignment(Alignment::Center)
        .style(Style::default());
    let rb_title = Paragraph::new(format!("Counter: {}", app.counter))
        .alignment(Alignment::Center)
        .block(rb_block);

    let mut state = TreeState::default();

    let item = TreeItem::new_leaf("l", "leaf");
    let item2 = TreeItem::new_leaf("q", "reaf");
    let a = TreeItem::new_leaf("a", "a leaf");
    let b = TreeItem::new("r", "Root", vec![a, item2]).unwrap();
    let items = vec![item, b];
    //state.open(vec!["r"]);
    //state.toggle_selected();

    let tree_widget = Tree::new(&items)
        .expect("all item identifiers are unique")
        .block(Block::bordered().title("Tree Widget"));

    frame.render_stateful_widget(tree_widget, right_chunks[0], &mut state);

    frame.render_widget(left_title, chunks[0]);
    //frame.render_widget(right_title, right_chunks[0]);
    frame.render_widget(rb_title, right_chunks[1]);

    // This is where you add new widgets.
    // See the following resources:
    // - https://docs.rs/ratatui/latest/ratatui/widgets/index.html
    // - https://github.com/ratatui-org/ratatui/tree/master/examples
    //frame.render_widget(
    //Paragraph::new(format!(
    //"This is a tui template.\n\
    //Press `Esc`, `Ctrl-C` or `q` to stop running.\n\
    //Press left and right to increment and decrement the counter respectively.\n\
    //Counter: {}",
    //app.counter
    //))
    //.block(
    //Block::bordered()
    //.title("Template")
    //.title_alignment(Alignment::Center)
    //.border_type(BorderType::Rounded),
    //)
    //.style(Style::default().fg(Color::Cyan).bg(Color::Black))
    //.centered(),
    //frame.size(),
    //)
}
