from flask import Flask, request, jsonify
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

trains = [
    {"id": 1, "name": "Train A", "route": "Route 1"},
    {"id": 2, "name": "Train B", "route": "Route 2"}
]

@app.route('/trains', methods=['GET'])
def get_trains():
    return jsonify(trains)

@app.route('/trains', methods=['POST'])
def add_train():
    train_data = request.json
    trains.append(train_data)
    return jsonify({"message": "Train added successfully!"}), 201

@app.route('/trains/<int:train_id>', methods=['GET'])
def get_train(train_id):
    train = next((train for train in trains if train['id'] == train_id), None)
    if train:
        return jsonify(train)
    else:
        return jsonify({"message": "Train not found"}), 404

if __name__ == '__main__':
    app.run(debug=True, port=os.getenv('PORT', 5000))