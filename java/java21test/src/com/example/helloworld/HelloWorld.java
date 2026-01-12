package com.example.helloworld;

import com.sun.net.httpserver.SimpleFileServer;

import java.net.InetSocketAddress;
import java.nio.file.Path;
import java.text.NumberFormat;
import java.util.*;
import java.util.concurrent.*;
import java.util.function.BiConsumer;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.Gatherers;
import java.util.stream.Stream;

import static java.lang.StringTemplate.STR;

public class HelloWorld {
	// Java 21 (Preview)
	final ScopedValue<String> USER = ScopedValue.newInstance();

	// Java 22 `static` not necessary
	public void main(String[] args) {
		/* Java 9 (September 2017) */

		// Module System (Project Jigsaw):
		// I do not understand this one
		/*
		 * module com.example.module {
		 * requires java.base;
		 * exports com.example.package;
		 * }
		 */

		// Collection Factory Methods
		// Easier way to create collections.
		List<String> list = List.of("a", "b", "c");
		Set<String> set = Set.of("a", "b", "c");
		Map<String, String> map = Map.of("key1", "value1", "key2", "value2");

		// Private Methods in Interfaces
		new MyInterfaceImpl().defaultMethod();

		/* Java 10 (March 2018) */

		// Local-Variable Type Inference
		// use `var` to let compiler infer the type of local variables
		var inferredList = new ArrayList<String>();
		inferredList.add("String one");
		inferredList.add("String two");
		var inferredStream = inferredList.stream();
		inferredStream.forEach(System.out::println);

		// Unmodifiable Collections
		// Improvements to the unmodifiable collections
		var copyOfList = List.copyOf(inferredList);
		// copyOfList.add("lksdf"); // cannot modify this list
		copyOfList.forEach(System.out::println);

		/* Java 11 (September 2018) */

		// New String methods
		// Methods like lines(), strip(), repeat(int), etc.
		String multiline = "Hello\nWorld";
		multiline.lines().forEach(System.out::println);

		String str = "  hello  ";
		System.out.println(str.strip());

		String repeated = "Java".repeat(3);
		System.out.println(repeated);

		// Local-Variable Syntax for Lambda Parameters
		// Allows the use of `var` in lambda expressions.
		// Seems like `var` isn't even needed though... 🤔
		Map<String, Integer> map1 = new HashMap<>();
		map1.put("key1", 1);
		map1.put("key2", 2);
		map1.forEach((k, v) -> System.out.println(k + ": " + v));
		derp((var a, var b) -> System.out.println(STR."\{a}:\{b}"));

		// HTTP Client API
		// Standardized HTTP Client for HTTP/2 and WebSocket
		/*
		 * try (HttpClient client = HttpClient.newHttpClient()) {
		 * HttpRequest request = HttpRequest.newBuilder()
		 * .uri(URI.create("https://example.com"))
		 * .build();
		 * HttpResponse<String> response = client.send(request,
		 * HttpResponse.BodyHandlers.ofString());
		 * // System.out.println(response.body());
		 * } catch (Exception e) {
		 * // noop
		 * }
		 */

		/* Java 12 (March 2019) */

		// Switch Expressions (Preview)
		int num = 2;
		String result = switch (num) {
			case 1 -> "one";
			case 2 -> "two";
			default -> "many";
		};
		System.out.println(STR."Switch result: \{result}");

		// Compact Number Formatting
		// Format numbers in a human-readable way
		NumberFormat compactNumberFormat = NumberFormat.getCompactNumberInstance();
		System.out.println(compactNumberFormat.format(1_000)); // "1K"
		System.out.println(compactNumberFormat.format(1_230_280)); // "1M"
		NumberFormat japaneseNumberFormat = NumberFormat.getCompactNumberInstance(Locale.JAPANESE,
				NumberFormat.Style.SHORT);
		System.out.println(japaneseNumberFormat.format(1_234_567)); // 123万

		/* Java 13 (September 2019) */

		// Text Blocks (Preview)
		String textBlock = """
				This is a text block.
				It can span multiple lines.
				""";
		System.out.println(textBlock);

		/* Java 14 (March 2020) */

		// Switch Expression (Standard)
		int day = 2;
		String dayName = switch (day) {
			case 1 -> "Monday";
			case 2 -> "Tuesday";
			default -> "Unknown";
		};

		// Records (Preview)
		// Simplified data carrier classes
		Point p = new Point(1, 2);
		System.out.println(p.x() + ", " + p.y());

		/* Java 15 (September 2020) */

		// Text Blocks (Standard)
		String html = """
				<html>
				    <body>
				        <p>Hello, World</p>
				    </body>
				</html>
				""";

		// Pattern Matching for instanceof (Preview)
		Object obj = "Henlo";
		if (obj instanceof String s) {
			System.out.println(s.toUpperCase());
		}

		/* Java 16 (March 2021) */

		// Records (Standard)
		User u = new User("Jeppe", 35);

		// Pattern Matching for `instanceof` (Standard)
		Object o = "A string";
		if (o instanceof String s) {
			System.out.println(s.toLowerCase());
		}

		/* Java 17 (September 2021) LTS */

		// Sealed Classes
		// Restricts which classes can extend or implement them
		// See below

		/* Java 18 (March 2022) */

		// Simple Web Server
		// Provides a simple, minimal web server for prototyping
		/*
		 * var server = SimpleFileServer.createFileServer(
		 * new InetSocketAddress(8000), Path.of("/var/www"),
		 * SimpleFileServer.OutputLevel.VERBOSE);
		 * server.start();
		 */

		// UTF-8 by Default
		// Default character set is not UTF-8

		/* Java 19 (September 2022) */

		// Virtual Threads (Preview)
		// Introduces lightweight, user-mode threads.
		try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
			executor.submit(() -> System.out.println("Hello from virtual thread"));
		} finally {
			System.out.println("Thread dead");
		}

		// Structured Concurrency (Preview)
		// Simplifies multithreading with structured concurrency
		Callable<String> task1 = () -> "Hello from Callable";
		Callable<Integer> task2 = () -> 1 + 1;
		Function<Integer, Callable<Integer>> function = (i) -> () -> (1 + i);
		try (var scope = new StructuredTaskScope.ShutdownOnFailure()) {
			StructuredTaskScope.Subtask<String> subtask1 = scope.fork(task1);
			StructuredTaskScope.Subtask<Integer> subtask2 = scope.fork(task2);
			StructuredTaskScope.Subtask<Integer> subtask3 = scope.fork(function.apply(68));
			scope.join().throwIfFailed();
			System.out.println("Result 1: " + subtask1.get());
			System.out.println("Result 2: " + subtask2.get());
			System.out.println("Result 3: " + subtask3.get());
		} catch (InterruptedException | ExecutionException _) {
			// noop
		}

		/* Java 20 (March 2023) */

		// Pattern Matching for switch (Preview)
		// Enhances `switch` with pattern matching
		var formatIntSwitch = formatterPatternSwitch(69);
		System.out.println(formatIntSwitch);
		var formatDoubleSwitch = formatterPatternSwitch(69.69);
		System.out.println(formatDoubleSwitch);

		/* Java 21 (September) LTS */

		// String Templates (Preview)
		// Simplifies embedding expressions inside strings
		String name = "Wurl";
		String template = STR."Hello, \{name.toUpperCase()}!"; // preview
				System.out.println(template);

		// Sequenced Collections
		// Introduces new collection interfaces
		SequencedCollection<Integer> numbers = new ArrayList<>();
		numbers.addFirst(0);
		numbers.addLast(4);
		numbers.forEach(System.out::println);

		// Scoped Values (Preview)
		var executor = Executors.newVirtualThreadPerTaskExecutor();
		ScopedValue.where(USER, "Alice").run(() -> {
			executor.submit(() -> {
				System.out.println("Task 1 user: " + USER.get());
			});
			executor.submit(() -> {
				System.out.println("Task 2 user: " + USER.get());
			});
		});
		executor.shutdown();

		/* Java 22 (March 2024) */

		// Unnamed Variables & Patterns
		// Lets you declare a variable as `_` if you're not using it, like in a for
		// loop, lambda expression, or a try-catch.
		var s = "sixty nine";
		try {
			int i = Integer.parseInt(s);
		} catch (NumberFormatException _) {
			System.out.println("Invalid Number: " + s);
		}

		// String Templates (Second Preview)
		String a = "MIRP";
		String t = STR."Merp, \{a.toLowerCase()}!"; // preview
				System.out.println(t);

		// Statements Before super(...) or this(...) (Preview)
		BeforeSuper bs = new BeforeSuper("Hello before super");

		// Stream Gatherers (Preview)
		var l = Stream.iterate(0, i -> i + 1)
				.gather(Gatherers.windowFixed(3))
				.limit(2)
				.collect(Collectors.toList());
		System.out.println(l);
	}

	// Java 9
	// Private Methods in Interfaces
	public interface MyInterface {
		default void defaultMethod() {
			privateMethod();
		}

		private void privateMethod() {
			System.out.println("Private method in interface");
		}
	}

	public class MyInterfaceImpl implements MyInterface {
	}

	// Java 14 (Preview), Java 15 (Second Preview), Java 16 (Standard)
	public record Point(int x, int y) {
	}

	public record User(String name, int age) {
	}

	void derp(BiConsumer<String, Integer> biConsumer) {
		biConsumer.accept("hi", 69);
	}

	// Java 17 (September 2021) LTS
	public abstract sealed class Shape permits Circle, Rectangle {
	}

	public final class Circle extends Shape {
	}

	public final class Rectangle extends Shape {
	}
	// public final class Triangle extends Shape {} // Triangle is not allowed

	// Java 20 (March 2023)
	String formatterPatternSwitch(Object o) {
		return switch (o) {
			case Integer i -> String.format("int %d", i);
			case Long l -> String.format("long %d", l);
			case Double d -> String.format("double %f", d);
			case String s -> String.format("String %s", s);
			default -> o.toString();
		};
	}

	// Java 22 (Preview)
	public class Before {
		String a;

		Before(String a) {
			this.a = a;
			System.out.println("Before: " + a);
		}
	}

	public class BeforeSuper extends Before {
		public BeforeSuper(String a) {
			System.out.println("BeforeSuper: " + a);
			if (a.equals("ded"))
				throw new IllegalArgumentException("Can't have a name like that");
			super(a);
		}
	}

}
