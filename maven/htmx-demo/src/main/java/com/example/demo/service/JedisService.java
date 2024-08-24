package com.example.demo.service;

public interface JedisService {
	public String setValue(String key, String value);

	public String getValue(String key);
}
