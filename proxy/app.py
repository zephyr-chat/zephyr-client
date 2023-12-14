import json

from flask import Flask, request, jsonify
from flask_cors import CORS
from grpc import insecure_channel
from google.protobuf.json_format import MessageToJson

from config import *
import auth_pb2_grpc
import auth_pb2
import conversation_pb2_grpc as conv_pb2_grpc
import conversation_pb2 as conv_pb2
import event_pb2
import event_pb2_grpc

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

def get_conversation(request):
    headers = request.headers
    access_token = headers.get('Authorization', None)

    if not access_token:
        print(f"Access token not found")
        response = jsonify({'message':'No access token, unauthorized'})
        return response, 401
    
    try:
        stub = conv_pb2_grpc.ConversationServiceStub(channel)
        req = conv_pb2.Empty()
        metadata = [(b'authorization', access_token.encode())]
        reply: auth_pb2.AuthResponse = stub.GetConversations(req, metadata=metadata)
        return jsonify(json.loads(MessageToJson(reply))), 200 
    except Exception as e:
        print(f"Error occured while authentication {str(e)}")
        response = jsonify({'message':'Error while authenticating with server'})
        return response, 401

def create_conversation(request):
    response = jsonify({'message':'Not implemented'})
    return response, 401

@app.route('/conversation', methods=['GET', 'POST'])
def conversations():
    if request.method == 'GET':
        return get_conversation(request)
    elif request.method == 'POST':
        return create_conversation(request)

def get_events(request, conversation_id):
    headers = request.headers
    access_token = headers.get('Authorization', None)

    if not access_token:
        print(f"Access token not found")
        response = jsonify({'message':'No access token, unauthorized'})
        return response, 401
    
    if not conversation_id:
        print(f"Conversation ID not given")
        response = jsonify({'message':'Conversation ID not given'})
        return response, 401
    
    try:
        stub = event_pb2_grpc.EventServiceStub(channel)
        req = event_pb2.GetEventsRequest(conversation_id=int(conversation_id))
        metadata = [(b'authorization', access_token.encode())]
        reply: event_pb2.GetEventsReply = stub.GetEvents(req, metadata=metadata)
        print(reply)
        return jsonify(json.loads(MessageToJson(reply))), 200 
    except Exception as e:
        print(f"Error occured while authentication {str(e)}")
        response = jsonify({'message':'Error while authenticating with server'})
        return response, 401

def create_event(request, conversation_id):
    response = jsonify({'message':'Not implemented'})
    return response, 401

@app.route('/conversation/<conversation_id>/event', methods=['GET', 'POST'])
def events(conversation_id):
    if request.method == 'GET':
        return get_events(request, conversation_id)
    elif request.method == 'POST':
        return create_event(request, conversation_id)

if __name__ == '__main__':
    app.run(debug=True, port=5001)
