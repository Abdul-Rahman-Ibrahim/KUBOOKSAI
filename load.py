import json

class PrepareBooks:
    def __init__(self):
        self.books = {}
        self.reviews = {}

    def loadBooks(self, filepath):

        with open(filepath, 'r') as file:
            data = [json.loads(line) for line in file]
            for book in data:
                url = book["url"]

                tmp_books = {}

                tmp_books["title"] = book.get("titleComplete", "")
                tmp_books["author"] = book.get("author", "")
                tmp_books["isbn"] = book.get("isbn13", "") or book.get("isbn", "")
                tmp_books["summary"] = book.get("description", "")
                tmp_books["ratingsCount"] = book.get("ratingsCount", 0)
                tmp_books["reviewsCount"] = book.get("reviewsCount", 0)
                tmp_books["avgRating"] = book.get("avgRating", 0)
                tmp_books["numPages"] = book.get("numPages", 0)
                tmp_books["language"] = book.get("language", "")
                tmp_books["publishDate"] = book.get("publishDate", "")
                tmp_books["genres"] = book.get("genres", [])
                tmp_books["characters"] = book.get("characters", [])
                tmp_books["places"] = book.get("places", [])
                tmp_books["imageUrl"] = book.get("imageUrl", "")
                

                self.books[url] = tmp_books
    
    def writeJson(self):
        books_list = []
        for i, (url, book) in enumerate(self.books.items(), start=1):
            books_list.append({
                "id": i,
                "title": book["title"],
                "url": url,
                "imageUrl": book["imageUrl"], 
                "summary": book["summary"],
                "numPages": book["numPages"],
                "ratingsCount": book["ratingsCount"],
                "avgRating": book["avgRating"],
                "reviewsCount": book["reviewsCount"],
                "genres": book["genres"],
                "author": book["author"],
                "publishDate": book["publishDate"]
            })

        with open('books.json', 'w') as file:
            json.dump(books_list, file, indent=4)


    def loadReviews(self, filepath):

        with open(filepath, 'r') as file:
            data = [json.loads(line) for line in file]
        return data
            

    def getDescription(self):
        data = []
        for url in self.books:
            summary = self.books[url]["summary"]
            title = self.books[url]["title"]
            author = self.books[url]["author"]
            stringAuthor = ', '.join(author)

            genres = self.books[url]["genres"]
            stringGenres = ', '.join(genres)

            characters = self.books[url]["characters"]
            stringCharacters = ', '.join(characters)

            places = self.books[url]["places"]
            stringPlaces = ', '.join(places)

            description = f"{title} by {stringAuthor}. Places are {stringPlaces}. \
            The characters are {stringCharacters}. The genres are {stringGenres}. \
            Summary: {summary}"

            data.append(description)
            
        return data

    def get_book_info(self, url):

        return self.books[url]
                

