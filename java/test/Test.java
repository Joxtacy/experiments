String greeting = "Hello, World!";

String greeting() {
	return greeting;
}

void main() {
	System.out.println(greeting());
	Map<String, List<String>> headers = Optional.ofNullable(webhookDTO.getHeaders())
                .map(m -> m.entrySet().stream().collect(Collectors.toMap(Map.Entry::getKey, e -> List.of(e.getValue()))))
                .orElse(Collections.emptyMap());
}
