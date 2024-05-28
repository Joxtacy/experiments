package com.example.calculator;

import org.junit.jupiter.api.*;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class CalculatorTest {

	Calculator calculator;

	@BeforeAll
	void setup() {
		// This method is executed once before all tests
		System.out.println("Before all tests");
	}

	@BeforeEach
	void init() {
		// This method is executed before each test
		calculator = new Calculator();
	}

	@Test
	@DisplayName("Testing addition method")
	void testAddition() {
		assertEquals(2, calculator.add(1, 1), "1 + 1 should equal 2");
	}

	@Test
	void testSubtraction() {
		assertEquals(0, calculator.subtract(1, 1), "1 - 1 should equal 0");
	}

	@Test
	void testMultiplication() {
		assertEquals(4, calculator.multiply(2, 2), "2 * 2 should equal 4");
	}

	@Test
	void testDivisionThrow() {
		assertThrows(ArithmeticException.class, () -> calculator.divide(1, 0), "Division by zero should throw an exception");
	}

	@Test
	void testDivisionNotThrow() {
		assertEquals(2, calculator.divide(8, 4), "Should not throw an exception");
	}

	@AfterEach
	void tearDown() {
		// This method is executed after each test
		calculator = null;
	}

	@AfterAll
	void done() {
		// This method is executed once after all tests
		System.out.println("After all tests");
	}
}
