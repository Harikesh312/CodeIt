from flask_socketio import join_room, emit

def register_socket_events(socketio):

    @socketio.on("connect")
    def connect():
        print("User connected")

    @socketio.on("join_room")
    def handle_join(data):
        room = data["room"]
        join_room(room)
        print(f"User joined room {room}")

        emit("user_joined", {"msg": "A user joined"}, room=room)
    
    @socketio.on("code_change")
    def code_change(data):
        emit(
            "code_update",
            data["code"],
            room=data["room"],
            include_self=False
    )

    @socketio.on("send_message")
    def handle_message(data):
        emit("receive_message", data, room=data["room"])

    @socketio.on("code_output")
    def handle_output(data):
        emit("receive_output", data["output"], room=data["room"])

    @socketio.on("start_call")
    def start_call(data):
        emit("start_call", {}, room=data["room"], include_self=False)