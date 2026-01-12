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
				{ duration: "1m", target: 100 },
				// maintain load
				{ duration: "5m", target: 100 },
				// ramp down to zero
				{ duration: "1m", target: 0 },
			],
		},
	},
};

export function handleSummary(data) {
	return {
		"request-cancel-error.html": htmlReport(data),
		stdout: textSummary(data, { indent: " ", enableColors: true }),
	};
}

export default function () {
	const url =
		"http://host.docker.internal:7083/flows/26b50374-7978-47b9-a817-6033e29bcb56/components/01af9258-740e-4fb4-a078-821f70af4e45";

	// send a get request and save response as a variable
	const res = http.get(url);

	// check that response is 200
	check(res, {
		"response code was 400": (res) => res.status == 400,
	});
	sleep(1);
}
