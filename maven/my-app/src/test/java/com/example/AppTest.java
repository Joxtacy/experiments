package com.example;

import org.junit.jupiter.api.*;

import static org.junit.jupiter.api.Assertions.assertEquals;

/**
 * Unit test for simple App.
 */
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class AppTest {

	App app;

	@BeforeAll
	void setup() {
		// This method is executed once before all tests
		System.out.println("Before all tests");
	}

	@BeforeEach
	void init() {
		// This method is executed before each test
		app = new App();
	}

	@Test
	@DisplayName("Testing the cube method")
	void testCube() {
		assertEquals(9, app.cube(3), "3 cubed should equal 9");
	}

	@AfterEach
	void tearDown() {
		// This method is executed after each test
		app = null;
	}

	@AfterAll
	void done() {
		// This method is executed once after all tests
		System.out.println("After all tests");
	}
}
