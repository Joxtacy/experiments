package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisPool;

@Service
public class JedisServiceImpl implements JedisService {

	private final JedisPool jedisPool;

	@Autowired
	public JedisServiceImpl(JedisPool jedisPool) {
		this.jedisPool = jedisPool;
	}

	@Override
	public String setValue(String key, String value) {
		try (Jedis jedis = jedisPool.getResource()) {
			jedis.set("key", "value");
			return jedis.set(key, value);
		}
	}

	@Override
	public String getValue(String key) {
		try (Jedis jedis = jedisPool.getResource()) {
			return jedis.get(key);
		}
	}
}
