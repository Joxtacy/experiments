use escpos::errors::PrinterError;
use escpos::printer::Printer;
use escpos::printer_options::PrinterOptions;
use escpos::utils::*;
use escpos::{driver::*, errors::Result};

fn main() -> Result<()> {
    env_logger::init();

    // let driver = ConsoleDriver::open(true);
    let driver = UsbDriver::open(0x0483, 0x5743, None).unwrap();
    let mut printer_options = PrinterOptions::default();
    printer_options.characters_per_line(48);
    let mut printer = Printer::new(driver, Protocol::default(), Some(printer_options));
    printer.debug_mode(Some(DebugMode::Hex)).init()?;
    printer
        // check status
        .real_time_status(RealTimeStatusRequest::Printer)?
        .real_time_status(RealTimeStatusRequest::RollPaperSensor)?
        .send_status()?
        // text
        .smoothing(true)?
        .bold(true)?
        .underline(UnderlineMode::Single)?
        .writeln("Bold underline")?
        .justify(JustifyMode::CENTER)?
        .reverse(true)?
        .bold(false)?
        .writeln("Hello world - Reverse")?
        .feed()?
        .justify(JustifyMode::RIGHT)?
        .reverse(false)?
        .underline(UnderlineMode::None)?
        .size(2, 3)?
        .writeln("Hello world - Normal")?
        // QR code
        // bit image
        .bit_image_option(
            "./resources/images/rust-logo-small.png",
            BitImageOption::new(Some(128), None, BitImageSize::Normal)?,
        )?
        .feed()?
        .print()?;
    //.print_cut()?;

    printer.justify(JustifyMode::CENTER)?;
    print_ean13_code(&mut printer, "1234567890123".into())?;

    printer.justify(JustifyMode::LEFT)?;
    print_qr_code(&mut printer, "https://google.com".into())?;

    Ok(())
}

fn print_ean13_code(
    printer: &mut Printer<UsbDriver>,
    data: String,
) -> Result<&mut Printer<UsbDriver>> {
    printer
        .ean13_option(
            data.as_str(),
            BarcodeOption::new(
                BarcodeWidth::M,
                BarcodeHeight::S,
                BarcodeFont::A,
                BarcodePosition::Below,
            ),
        )?
        .print()?
        .feed()
}

fn print_qr_code(
    printer: &mut Printer<UsbDriver>,
    data: String,
) -> Result<&mut Printer<UsbDriver>> {
    // let driver = ConsoleDriver::open(true);
    printer
        .qrcode_option(
            data.as_str(),
            QRCodeOption::new(QRCodeModel::Model1, 6, QRCodeCorrectionLevel::M),
        )?
        .print()?
        .feed()
}
