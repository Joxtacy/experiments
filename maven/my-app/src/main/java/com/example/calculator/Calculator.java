package com.example.calculator;

public class Calculator {
	int add(int a, int b) {
		return a + b;
	}

	int subtract(int a, int b) {
		return a - b;
	}

	int multiply(int a, int b) {
		return a * b;
	}

	int divide(int a, int b) throws ArithmeticException {
		if (b == 0) throw new ArithmeticException("Divide by zero");
		return a / b;
	}
}
