use escpos_rs::{
    command::{Command, Font},
    Instruction, Justification, PrintData, Printer, PrinterProfile,
};

fn main() {
    // We create a usb contest for the printer
    let printer_profile = PrinterProfile::usb_builder(0x0483, 0x5743)
        .with_font_width(Font::FontA, 48)
        .with_font_width(Font::FontB, 60) // FontB-E are the same
        .with_font_width(Font::FontC, 60)
        .with_font_width(Font::FontD, 60)
        .with_font_width(Font::FontE, 60)
        .build();
    // We pass it to the printer
    let printer = match Printer::new(printer_profile) {
        Ok(maybe_printer) => match maybe_printer {
            Some(printer) => printer,
            None => panic!("No printer was found :("),
        },
        Err(e) => panic!("Error: {}", e),
    };

    // We print simple text
    match printer.println("Hello, world! This is a very long sentence that will hopefully break the line. And if it doesn't then I am probably printing out in thin air. Which would be pretty cool to be fair.") {
        Ok(_) => (),
        Err(e) => println!("Error: {}", e),
    }

    // We create a simple instruction with a single substitution
    let instruction = Instruction::text(
        "Hello, %name%!",
        Font::FontA,
        Justification::Center,
        // Words that will be replaced in this specific instruction
        Some(vec!["%name%".into()].into_iter().collect()),
    );
    // We create custom information for the instruction
    let print_data_1 = PrintData::builder().replacement("%name%", "Jesper").build();
    // And a second set...
    let print_data_2 = PrintData::builder().replacement("%name%", "Jacob").build();

    printer
        .instruction(&Instruction::command(Command::Underline1Dot), None)
        .unwrap();
    // We send the instruction to the printer, along with the custom data
    // for this particular print
    match printer.instruction(&instruction, Some(&print_data_1)) {
        Ok(_) => (), // "Hello, Jesper!" should've been printed.
        Err(e) => println!("Error: {}", e),
    }
    printer
        .instruction(&Instruction::command(Command::Underline2Dot), None)
        .unwrap();
    printer
        .instruction(&Instruction::command(Command::BoldOn), None)
        .unwrap();
    // Now we print the second data
    match printer.instruction(&instruction, Some(&print_data_2)) {
        Ok(_) => (), // "Hello, Jacob!" should've been printed.
        Err(e) => println!("Error: {}", e),
    }
    printer
        .instruction(&Instruction::command(Command::BoldOff), None)
        .unwrap();
    printer
        .instruction(&Instruction::command(Command::UnderlineOff), None)
        .unwrap();

    let qr_instruction = Instruction::dynamic_qr_code("My QR");
    let print_data_3 = PrintData::builder()
        .add_qr_code("My QR", "https://youtu.be/dQw4w9WgXcQ")
        .build();

    // We print a QR code
    match printer.instruction(&qr_instruction, Some(&print_data_3)) {
        Ok(_) => (), // a QR code should've been printed
        Err(e) => println!("Error: {}", e),
    }

    // We cut the paper
    match printer.instruction(&Instruction::Cut, None) {
        Ok(_) => (), // cut
        Err(e) => println!("Error: {}", e),
    }
}
