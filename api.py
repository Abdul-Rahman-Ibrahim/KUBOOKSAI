from flask import Flask, jsonify, Response
import json
from collections import OrderedDict


app = Flask(__name__)

@app.route('/books', methods=['GET'])
def get_books():
    # Load your books data from 'books.json'
    with open('books.json', 'r') as f:
        books = json.load(f, object_pairs_hook=OrderedDict)
    # Return the data as JSON
    return Response(json.dumps(books, sort_keys=False), mimetype='application/json')

if __name__ == '__main__':
    app.run(debug=True)
