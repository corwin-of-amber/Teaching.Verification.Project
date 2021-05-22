from flask import Flask

app = Flask(__name__)

@app.route("/")
def hello_world():
    return '<script src="static/index.js"></script>'
