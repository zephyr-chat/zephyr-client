import os

SECRET_KEY = os.environ.get("ZEPHYR_FLASK_PROXY_KEY", "secret-key-123")

GRPC_SERVER_URL = os.environ.get("ZEPHYR_GRPC_SERVER_URL", "localhost:50051")
