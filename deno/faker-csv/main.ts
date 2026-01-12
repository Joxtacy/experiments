import { stringify } from "jsr:@std/csv";
import { faker } from "https://esm.sh/@faker-js/faker@v9.0.3";

faker.seed(69420);

const contacts: { name: string; email: string; phone: string }[] = [];
for (let i = 0; i < 100_000; i++) {
	const firstName = faker.person.firstName();
	const lastName = faker.person.lastName();
	const name = faker.person.fullName({ firstName, lastName });
	const email = faker.internet.email({ firstName, lastName });
	const phone = faker.phone.number({ style: "international" });
	const obj = {
		firstName,
		lastName,
		name,
		email,
		phone,
	};
	contacts.push(obj);
}

const companies: { name: string; email: string; phone: string }[] = [];
for (let i = 0; i < 10_000; i++) {
	const name = faker.company.name();
	const email = faker.internet.email();
	const phone = faker.phone.number({ style: "international" });
	const domain = faker.internet.domainName();
	const obj = {
		name,
		email,
		phone,
		domain,
	};
	companies.push(obj);
}

const contacts_csv = stringify(contacts, {
	columns: ["firstName", "lastName", "name", "email", "phone"],
});
Deno.writeFileSync("contacts.csv", new TextEncoder().encode(contacts_csv));

const companies_csv = stringify(companies, {
	columns: ["name", "email", "phone", "domain"],
});
Deno.writeFileSync("companies.csv", new TextEncoder().encode(companies_csv));
