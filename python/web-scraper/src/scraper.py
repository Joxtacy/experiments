import requests
from bs4 import BeautifulSoup


def scrape_quotes():
    # Step 1: Send HTTP request
    url = "https://quotes.toscrape.com/"
    response = requests.get(url)

    # Step 2: Check if request was successful
    if response.status_code == 200:
        print("Successfully fetched the page!")
    else:
        print(f"Failed to fetch page. Status code: {response.status_code}")
        return

    # Step 3: Parse HTML content
    soup = BeautifulSoup(response.content, "html.parser")

    # Step 4: Find quote elements
    quotes = soup.find_all("div", class_="quote")

    # Step 5: Extract data from each quote
    for quote in quotes:
        text_elem = quote.find("span", class_="text")
        text = text_elem.get_text() if text_elem else ""
        author_elem = quote.find("small", class_="author")
        author = author_elem.get_text() if author_elem else ""
        tags = (
            [tag.get_text() for tag in quote.find_all("a", class_="tag")]
            if quote.find_all("a", class_="tag")
            else []
        )

        print(f"Quote: {text}")
        print(f"Author: {author}")
        print(f"Tags: {', '.join(tags)}")
        print("-" * 50)


if __name__ == "__main__":
    scrape_quotes()
