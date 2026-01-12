// Import necessary modules
import { check } from 'k6';
import http from 'k6/http';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.1/index.js";

export const options = {
  // define thresholds
  thresholds: {
    http_req_failed: ['rate<0.01'], // http errors should be less than 1%
    http_req_duration: ['p(99)<1000'], // 99% of requests should be below 1s
  },
  // define scenarios
  scenarios: {
    // arbitrary name of scenario
    average_load: {
      executor: 'ramping-vus',
      stages: [
        // ramp up to average load of 20 virtual users
        { duration: '10s', target: 20 },
        // maintain load
        { duration: '10s', target: 20 },
        // ramp down to zero
        { duration: '10s', target: 0 },
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

export default function() {
  // define URL and request body
  const number = encodeURIComponent("+46120772029");
  const unknownNumber = encodeURIComponent("i does not exist");

  const url = `http://appmixer1-dev.service.telavox.se:2200/flows/dc6d823d-447f-4a15-b80d-b75716f52842/components/3b5f9b73-8ab6-4f0a-b044-ee920e0841b2?number=${unknownNumber}`;

  // send a post request and save response as a variable
  const res = http.get(url);

  // check that response is 200
  check(res, {
    'response code was 200': (res) => res.status == 200,
  });
}
