import subprocess
import json
from flask import Flask

app = Flask(__name__)

@app.route("/")
def index():
    return open('index.html').read()

@app.route("/benchmarks")
def list_benchmarks():
    return json.dumps(['list your', 'benchmakrs', 'here'])

@app.route("/verify")
def verify():
    p = subprocess.run("ls", stdout=subprocess.PIPE)
    return p.stdout