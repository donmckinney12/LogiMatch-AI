from flask import Flask
from flask_sqlalchemy import SQLAlchemy
import os

app = Flask(__name__)
db_path = os.path.abspath(os.path.join(os.getcwd(), 'test.db'))
app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{db_path}'
db = SQLAlchemy(app)

@app.route('/')
def hello():
    return "Hello"

if __name__ == '__main__':
    print("Starting test app...")
    app.run(port=5001)
