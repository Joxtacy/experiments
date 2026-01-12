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
			gracefulRampDown: "70s",
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
		"request-no-response.html": htmlReport(data),
		stdout: textSummary(data, { indent: " ", enableColors: true }),
	};
}

export default function () {
	const url =
		"http://host.docker.internal:7083/flows/4f88b525-3677-496c-92a0-1098b2466b56/components/5cc22059-1eeb-4d26-98d1-dda041581bd0";

	// send a get request and save response as a variable
	const res = http.get(url);

	// check that response is 200
	check(res, {
		"response code was 200": (res) => res.status == 200,
	});
	sleep(1);
}
