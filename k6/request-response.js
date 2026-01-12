// Import necessary modules
import { check, sleep } from "k6";
import http from "k6/http";
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.1/index.js";

export const options = {
	// define thresholds
	thresholds: {
		http_req_failed: ["rate<0.01"], // http errors should be less than 1%
		http_req_duration: ["p(99)<1000"], // 99% of requests should be below 1s
	},
	// define scenarios
	scenarios: {
		// arbitrary name of scenario
		average_load: {
			gracefulStop: "60s",
			executor: "ramping-vus",
			stages: [
				// ramp up to average load of x virtual users
				{ duration: "1m", target: 500 },
				// maintain load
				{ duration: "5m", target: 500 },
				// ramp down to zero
				{ duration: "1m", target: 0 },
			],
		},
	},
	summaryTrendStats: ["avg", "min", "med", "max", "p(90)", "p(95)", "p(99)", "count"],
};

export function handleSummary(data) {
	return {
		"request-response.html": htmlReport(data),
		stdout: textSummary(data, { indent: " ", enableColors: true }),
	};
}

export default function () {
	const url =
		"http://host.docker.internal:7083/flows/67a579ec-5e91-49d0-899b-a6a41911928f/components/44a6a172-70bf-4273-bb89-a6b1749338df";

	// send a get request and save response as a variable
	const res = http.get(url);

	// check that response is 200
	check(res, {
		"response code was 200": (res) => res.status == 200,
	});
	sleep(1);
}
