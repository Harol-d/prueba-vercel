from flask import Flask
from flask_cors import CORS
from Routes import api

app = Flask(__name__)
CORS(app)
app.register_blueprint(api)

def main():
    app.run(host="0.0.0.0", port=4000)

if __name__ == "__main__":
    main()
