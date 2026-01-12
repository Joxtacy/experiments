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
			executor: "ramping-vus",
			stages: [
				// ramp up to average load of 20 virtual users
				{ duration: "30s", target: 100 },
				// maintain load
				{ duration: "60s", target: 100 },
				// ramp down to zero
				{ duration: "10s", target: 0 },
			],
		},
	},
};

export function handleSummary(data) {
	return {
		"summary.html": htmlReport(data),
		stdout: textSummary(data, { indent: " ", enableColors: true }),
	};
}

export default function () {
	// define URL and request body
	const number = encodeURIComponent("+13099934711");
	const unknownNumber = encodeURIComponent("i does not exist");

	const url =
		`http://host.docker.internal:2200/flows/74e72010-233f-4650-8746-7a53375405f6/components/c9ae51f3-89d0-4402-82d6-aa0bbc6b99cb?number=${number}`;

	// send a post request and save response as a variable
	const res = http.get(url);

	// check that response is 200
	check(res, {
		"response code was 200": (res) => res.status == 200,
	});
	sleep(1);
}
