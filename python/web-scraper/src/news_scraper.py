import requests
from bs4 import BeautifulSoup
import csv
from datetime import datetime


class NewsScraper:
    def __init__(self):
        self.session = requests.Session()
        # Set headers to mimic a real browser
        self.session.headers.update(
            {
                "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"
            }
        )

    def scrape_hacker_news(self):
        """Scrape top stories from Hacker News"""
        url = "https://news.ycombinator.com/"

        try:
            response = self.session.get(url)
            response.raise_for_status()  # Raises exception for bad status codes

            soup = BeautifulSoup(response.content, "html.parser")
            stories = []

            # Find story elements
            story_links = soup.find_all("span", class_="titleline")
            scores = soup.find_all("span", class_="score")

            for i, story_link in enumerate(story_links[:10]):  # Top 10 stories
                title_element = story_link.find("a")
                if title_element:
                    title = title_element.text.strip()
                    link = title_element.get("href", "")

                    # Get score if available
                    score = scores[i].text if i < len(scores) else "No score"

                    stories.append(
                        {
                            "title": title,
                            "link": link,
                            "score": score,
                            "scraped_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                        }
                    )

            return stories

        except requests.RequestException as e:
            print(f"Error fetching data: {e}")
            return []

    def save_to_csv(self, stories, filename="news_stories.csv"):
        """Save stories to CSV file"""
        if not stories:
            print("No stories to save")
            return

        with open(filename, "w", newline="", encoding="utf-8") as file:
            writer = csv.DictWriter(
                file, fieldnames=["title", "link", "score", "scraped_at"]
            )
            writer.writeheader()
            writer.writerows(stories)

        print(f"Saved {len(stories)} stories to {filename}")

    def run(self):
        """Run the scraper"""
        print("Scraping Hacker News...")
        stories = self.scrape_hacker_news()

        if stories:
            # Print to console
            for story in stories:
                print(f"Title: {story['title']}")
                print(f"Score: {story['score']}")
                print(f"Link: {story['link']}")
                print("-" * 80)

            # Save to file
            self.save_to_csv(stories)
        else:
            print("No stories found")


if __name__ == "__main__":
    scraper = NewsScraper()
    scraper.run()
