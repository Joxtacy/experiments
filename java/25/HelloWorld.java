// import java.time.LocalDate;

String greeting() {
	return "Hello World!";
}

void main() {
	var authors = List.of("James", "Bill", "Guy", "Alex", "Dan", "Gavin");
	for (var name : authors) {
		IO.println(name + ": " + name.length());
	}

	IO.println("hello".substring(0, "hello".length() - 1));

	var string1 = "herp";
	var string2 = string1;
	string2 = string2.substring(0, string2.length() - 1);
	IO.println(string1);
	IO.println(string2);

	var now = new Date();
	// var now2 = LocalDate().now();
	IO.println(now);
	// IO.println(now2);

	IO.println("""
				Hello world :)
				I'm a multiline string ":D"
			""");
}
