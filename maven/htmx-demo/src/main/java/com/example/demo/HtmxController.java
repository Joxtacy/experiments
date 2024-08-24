package com.example.demo;

import com.example.demo.service.JedisService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.servlet.ModelAndView;

import java.util.concurrent.atomic.AtomicInteger;

@Controller
public class HtmxController {

	private final JedisService jedisService;

	private final AtomicInteger counter = new AtomicInteger(0);

	@Autowired
	public HtmxController(JedisService jedisService) {
		this.jedisService = jedisService;
	}

	@GetMapping("/")
	public ModelAndView index(Model model) {
		model.addAttribute("counter", counter.get());
		return new ModelAndView("index");
	}

	@GetMapping("/fragment")
	public ModelAndView fragment() {
		return new ModelAndView("fragment");
	}

	@GetMapping("/herp")
	public ModelAndView herp(Model model) {
		model.addAttribute("herp", "derp");
		return new ModelAndView("herp");
	}

	@GetMapping("/footer")
	public ModelAndView footer(Model model) {
		return new ModelAndView("index :: copy");
	}

	@GetMapping("/counter")
	public ModelAndView counter(Model model) {
		String c = jedisService.getValue("derpCounter");
		if (c.equals("nil")) {
			counter.set(0);
		} else {
			int cnt = Integer.parseInt(c);
			counter.set(cnt);
		}
		model.addAttribute("counter", counter.get());
		return new ModelAndView("counter");
	}

	@PostMapping("/counter/increment")
	public ModelAndView increment(Model model) {
		model.addAttribute("counter", counter.incrementAndGet());
		jedisService.setValue("derpCounter", String.valueOf(counter.get()));
		return new ModelAndView("count");
	}

	@PostMapping("/counter/decrement")
	public ModelAndView decrement(Model model) {
		model.addAttribute("counter", counter.decrementAndGet());
		jedisService.setValue("derpCounter", String.valueOf(counter.get()));
		return new ModelAndView("count");
	}

	@PostMapping("/counter/reset")
	public ModelAndView reset(Model model) {
		counter.set(0);
		jedisService.setValue("derpCounter", String.valueOf(0));
		model.addAttribute("counter", counter.get());
		return new ModelAndView("count");
	}
}
