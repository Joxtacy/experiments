public class HelloWorld {
	public static void main(String[] args) {
		System.out.println("Hello, World!");
		String s = "world";
		System.out.println(STR."Hi, \{s}");
		try {
			System.out.println("Hi");
			return;
		} catch (Exception e) {
			System.out.println("catch");
		} finally {
			System.out.println("Bye");
		}
	}
}
