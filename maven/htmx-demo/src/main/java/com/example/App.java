package com.example;

import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisPool;

/**
 * Hello world!
 */
public class App {
	public static void main(String[] args) {
		System.out.println("Hello World!");
		JedisPool pool = new JedisPool("localhost", 6379);

		try (Jedis jedis = pool.getResource()) {
			jedis.set("clientName", "Jedis");
			String clientName = jedis.get("clientName");
			System.out.println(STR."clientName: \{clientName}");
		} finally {
			pool.close();
		}
	}
}
