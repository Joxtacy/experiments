//import necessary modules
import http from 'k6/http';
import { group, sleep } from 'k6';

//set baseURL
const baseUrl = 'https://test.k6.io';

export default function() {
  // visit some endpoints in one group
  group('Contacts flow', function() {
    http.get(`${baseUrl}/contacts.php`);
    sleep(1);
    // return to the home page
    http.get(`${baseUrl}/`);
    sleep(1);
  });

  // Coinflip players in another group
  group('Coinflip game', function() {
    http.get(`${baseUrl}/flip_coin.php?bet=heads`);
    sleep(1);
    http.get(`${baseUrl}/flip_coin.php?bet=tails`);
    sleep(1);
  });
}
