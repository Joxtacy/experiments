package com.example.demo;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.servlet.ModelAndView;

import java.util.concurrent.atomic.AtomicInteger;

@Controller
public class HtmxController {

	AtomicInteger counter = new AtomicInteger(0);

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
		model.addAttribute("counter", counter.get());
		return new ModelAndView("counter");
	}

	@PostMapping("/counter/increment")
	public ModelAndView increment(Model model) {
		model.addAttribute("counter", counter.incrementAndGet());
		return new ModelAndView("count");
	}

	@PostMapping("/counter/decrement")
	public ModelAndView decrement(Model model) {
		model.addAttribute("counter", counter.decrementAndGet());
		return new ModelAndView("count");
	}

	@PostMapping("/counter/reset")
	public ModelAndView reset(Model model) {
		counter.set(0);
		model.addAttribute("counter", counter.get());
		return new ModelAndView("count");
	}
}
