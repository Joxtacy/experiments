package com.example.util;

public class DefaultGreeter implements GreeterService {
    @Override
    public String greet(String name) {
        return "Hello from DefaultGreeter, " + name + "!";
    }
}
