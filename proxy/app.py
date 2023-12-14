from flask import Flask, request, jsonify
from flask_cors import CORS
from grpc import insecure_channel

from config import *
import auth_pb2_grpc
import auth_pb2


app = Flask(__name__)
CORS(app)

channel = insecure_channel(GRPC_SERVER_URL)

@app.route('/authenticate', methods=['POST'])
def authenticate():
    if request.method != 'POST':
        response = jsonify({'message':'Invalid request'})
        return response, 401
    
    body = request.get_json()
    username = body.get('username', None)
    password = body.get('password', None)

    if not username or not password:
        response = jsonify({'message':'Missing parameters'})
        return response, 401
    
    try:
        stub = auth_pb2_grpc.AuthServiceStub(channel)
        req = auth_pb2.AuthRequest(username=username, password=password)
        reply: auth_pb2.AuthResponse = stub.Authenticate(req)
        return jsonify({
            'access_token': reply.access_token
        }), 200
    except Exception as e:
        print(f"Error occured while authentication {str(e)}")
        response = jsonify({'message':'Error while authenticating with server'})
        return response, 401


if __name__ == '__main__':
    app.run(debug=True, port=5001)
