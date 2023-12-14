import json
from concurrent import futures

from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
from flask_socketio import SocketIO, disconnect
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
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
app.config['SECRET_KEY'] = SECRET_KEY
socketio = SocketIO(app, cors_allowed_origins="*")

channel = insecure_channel(GRPC_SERVER_URL)

websocket_connections = {}

@cross_origin
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
        print(f"Error occured while getting conversations {str(e)}")
        response = jsonify({'message':'Error while getting conversations'})
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
        return jsonify(json.loads(MessageToJson(reply))), 200 
    except Exception as e:
        print(f"Error occured while getting events {str(e)}")
        response = jsonify({'message':'Error while getting events'})
        return response, 401

def create_event(request, conversation_id):
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
    
    body = request.get_json()
    content = body.get('content', None)
    if not content:
        response = jsonify({'message':'No content'})
        return response, 400
    
    try:
        stub = event_pb2_grpc.EventServiceStub(channel)
        req = event_pb2.CreateEventRequest(conversation_id=int(conversation_id), content=content, type=event_pb2.ContentType.MESSAGE, previous_event_id=-1)
        metadata = [(b'authorization', access_token.encode())]
        reply: event_pb2.Event = stub.CreateEvent(req, metadata=metadata)
        return jsonify(json.loads(MessageToJson(reply))), 200 
    except Exception as e:
        print(f"Error occured while creating event {str(e)}")
        response = jsonify({'message':'Error while creating event'})
        return response, 401

@app.route('/conversation/<conversation_id>/event', methods=['GET', 'POST'])
def events(conversation_id):
    if request.method == 'GET':
        return get_events(request, conversation_id)
    elif request.method == 'POST':
        return create_event(request, conversation_id)
    
@socketio.on('connect')
def handle_connect():
    print('New websocket session started')
    
    sid = request.sid
    headers = request.headers
    access_token = headers.get('Authorization', None)

    if not access_token:
        print(f"Access token not found in socket connection")
        disconnect()
    
    def grpc_streaming_call():
        stub = event_pb2_grpc.EventServiceStub(channel)
        metadata = [(b'authorization', access_token.encode())]
        for response in stub.StreamEvents(event_pb2.EmptyRequest(), metadata=metadata):
            socketio.emit('message', MessageToJson(response), room=sid)

    websocket_connections[sid] = futures.ThreadPoolExecutor().submit(grpc_streaming_call)

@socketio.on('disconnect')
def handle_disconnect():
    print('Websocket disconnected')
    sid = request.sid
    if sid in websocket_connections:
        grpc_thread = websocket_connections.pop(sid)
        grpc_thread.cancel()

@app.route('/register', methods=['POST'])
def register_user():
    try:
        body = request.get_json()
        username = body.get('username', None)
        password = body.get('password', None)
        display_name = body.get('display_name', None)

        stub = auth_pb2_grpc.AuthServiceStub(channel)

        req = auth_pb2.RegisterUserRequest(
            username=username,
            password=password,
            display_name=display_name
        )

        reply: auth_pb2.UserResponse = stub.RegisterUser(req)

        return jsonify(json.loads(MessageToJson(reply))), 200 
    except Exception as e:
        print(f"Error occured while creating user {str(e)}")
        response = jsonify({'message':'Error while creating user'})
        return response, 500

if __name__ == '__main__':
    socketio.run(app, port=5001)
