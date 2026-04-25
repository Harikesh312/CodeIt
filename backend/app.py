from flask import Flask
from flask_cors import CORS
from flask_socketio import SocketIO
from auth import auth_bp
from models import init_db
from sockets.socket_handler import register_socket_events
from routes.code import code_bp

app = Flask(__name__)
app.config["SECRET_KEY"] = "secret"

CORS(app)

# ✅ FIRST create socketio
socketio = SocketIO(app, cors_allowed_origins="*")

# ✅ THEN register socket events
register_socket_events(socketio)

# Init DB
init_db()

# Register routes
app.register_blueprint(auth_bp, url_prefix="/auth")
app.register_blueprint(code_bp, url_prefix="/code")

@app.route("/")
def home():
    return "Backend running!"

if __name__ == "__main__":
    socketio.run(app, debug=True)