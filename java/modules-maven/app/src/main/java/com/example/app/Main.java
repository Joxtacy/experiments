package com.example.app;

import com.example.util.GreeterService;

import java.util.ServiceLoader;

public class Main {
	public static void main(String[] args) {
		ServiceLoader<GreeterService> loader = ServiceLoader.load(GreeterService.class);
		GreeterService service = loader.findFirst().orElseThrow();
		service.greet("Modular Maven World");
	}
}
