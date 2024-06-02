from flask import Flask
from os import environ
from routes import *  
app = Flask(__name__)
app.config['SECRET_KEY'] = environ.get('SECRET_KEY')
@app.route('/')
def index():
    return "Welcome to the TrainTracker app!"
@app.route('/track', methods=['GET', 'POST'])
def track():
    return track_train()
if __name__ == '__main__':
    app.run(debug=True)