import requests
from bs4 import BeautifulSoup
import json

def crawl(url):
    r = requests.get(url, verify=False)

    soup = BeautifulSoup(r.content, "html.parser")

    div = soup.find("div", class_="ReviewsSection")
    if div is None:
        print(f"No div with class 'ReviewsSection' found on {url}")
        return []

    spans = div.find_all("span", class_="Formatted")
    footers = div.find_all("footer", class_="SocialFooter")

    reviews_and_likes = []
    for footer, span in zip(footers, spans):
        review = span.text
        like = footer.find("span", class_="Button__labelItem").text
        reviews_and_likes.append({"review": review, "likes": like})

    return reviews_and_likes

# Read the file
with open('part.jl', 'r') as f:
    data = [json.loads(line) for line in f]

# Open the output file
with open('reviews4.json', 'w') as f:
    # For each book in the file
    for book in data:
        url = book['url']
        reviews_and_likes = crawl(url)

        # Write the results to the file
        book_data = {"url": url, "reviews": reviews_and_likes}
        json.dump(book_data, f)
        f.write('\n')  # Write a newline character after each book

