package com.example.demo.controller;

import java.util.concurrent.atomic.AtomicLong;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class EchoController {

    @GetMapping("/echo")
    public EchoResponse echo(@RequestParam(defaultValue = "Hello World!") String message) {
        return new EchoResponse(message);
    }

    @PostMapping("/echo")
    public EchoResponse echoPost(@RequestBody EchoRequest request) {
        return new EchoResponse(request.getMessage());
    }

    /**
     * Request body for echo endpoint.
     * Contains a single message field.
     */
    public static class EchoRequest {
        /**
         * The message to be echoed.
         */
        private String message;

        /**
         * Gets the message.
         * @return the message string
         */
        public String getMessage() {
            return message;
        }

        /**
         * Sets the message.
         * @param message the message string to set
         */
        public void setMessage(String message) {
            this.message = message;
        }
    }

    public static class EchoResponse {
        private String echo;
        private long timestamp;

        public EchoResponse(String message) {
            this.echo = message;
            this.timestamp = System.currentTimeMillis();
        }

        public String getEcho() {
            return echo;
        }

        public long getTimestamp() {
            return timestamp;
        }
    }

    private final AtomicLong counter = new AtomicLong(0);

    @GetMapping("/counter")
    public ResponseEntity<CounterResponse> getNextNumber() {
        long nextNumber = counter.incrementAndGet();

        // Example: fail after number 10
        if (nextNumber > 10) {
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                    .build(); // 429 Too Many Requests
        }

        return ResponseEntity.ok(new CounterResponse(nextNumber));
    }

    @PostMapping("/counter")
    public ResponseEntity<CounterResponse> getNextNumberPost() {
        long nextNumber = counter.incrementAndGet();
        return ResponseEntity.ok(new CounterResponse(nextNumber));
    }

    public static class CounterResponse {
        private long number;
        private long timestamp;

        public CounterResponse(long number) {
            this.number = number;
            this.timestamp = System.currentTimeMillis();
        }

        public long getNumber() {
            return number;
        }

        public long getTimestamp() {
            return timestamp;
        }
    }

    // Example of using @ResponseStatus annotation
    @GetMapping("/fail")
    @ResponseStatus(HttpStatus.NOT_IMPLEMENTED)
    public String alwaysFails() {
        return "This endpoint is not implemented yet";
    }
}
