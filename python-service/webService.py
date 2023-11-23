import datetime
from flask import Flask, request, jsonify
from flask_restful import Api, Resource
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from cryptography.fernet import Fernet
import pkg_resources
import jwt
import json

app = Flask(__name__)
bcrypt = Bcrypt(app)
api = Api(app)
CORS(app)
key = b'LL0DBCkmIfHfurrCpWP1-feJi0UD1DQoYrRRfTFjiX8='


def generateUserId(users):
    lastUser = len(users) - 1
    lastId = users[lastUser]['id']
    return lastId + 1


@app.route('/login', methods=['POST'])
def login():
    email = request.json.get('email')
    password = request.json.get('password')

    cipher_suite = Fernet(key)

    usersFile = pkg_resources.resource_filename("__main__", "encrypted_users.json")

    with open(usersFile, 'rb') as file:
        encrypted_data = file.read()

    decrypted_data = cipher_suite.decrypt(encrypted_data)
    users = json.loads(decrypted_data)['users']

    for user in users:
        if user['email'] == email and user['password'] == password:
            token = jwt.encode({
                'user_id': user['id'],
                'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
            }, key)  # deberia implementar esto luego app.config['SECRET_KEY']

            return jsonify({'token': token})

    return jsonify({'message': "Email or Password doesn't match", "success": False}), 401


@app.route('/createUser', methods=['POST'])
def createUser():
    try:

        cipher_suite = Fernet(key)

        usersFile = pkg_resources.resource_filename("__main__", "encrypted_users.json")

        with open(usersFile, 'rb') as file:
            encrypted_data = file.read()

        decrypted_data = cipher_suite.decrypt(encrypted_data)
        users = json.loads(decrypted_data)

        newUser = {
            "id": generateUserId(users['users']),
            "email": request.json.get('email'),
            "password": request.json.get('password')
        }

        users['users'].append(newUser)

        decrypted_data = json.dumps(users)

        encrypted_data = cipher_suite.encrypt(decrypted_data.encode())

        with open(usersFile, 'wb') as file:
            file.write(encrypted_data)

        return jsonify({'message': "User created successfully", "success": True}), 200

    except Exception as e:
        return jsonify({'message': "Error creating the new user", "success": False}), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)
