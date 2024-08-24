package com.example.demo.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import redis.clients.jedis.JedisPool;
import redis.clients.jedis.JedisPoolConfig;

import java.time.Duration;

@Configuration
public class JedisConfig {

	@Bean
	public JedisPool jedisPool() {
		JedisPoolConfig config = new JedisPoolConfig();
		config.setMaxTotal(128);
		config.setMaxIdle(128);
		config.setMinIdle(16);
		config.setTestOnBorrow(true);
		config.setTestOnReturn(true);
		config.setTestWhileIdle(true);
		config.setMinEvictableIdleDuration(Duration.ofSeconds(60));
		config.setTimeBetweenEvictionRuns(Duration.ofSeconds(30));
		config.setNumTestsPerEvictionRun(-1);
		return new JedisPool(config, "localhost", 6379);
	}
}
