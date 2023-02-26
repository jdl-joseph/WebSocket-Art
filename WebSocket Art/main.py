from flask import Flask, render_template, url_for, redirect, request
from flask_socketio import SocketIO


app = Flask(__name__.split(".")[0])
socketio = SocketIO(app)
clients = []

@app.route("/")
def origin():
    return redirect(url_for("home"))

@app.route("/home")
def home():
    return render_template("home.html")

@app.route("/drawing_room")
def drawing_room():
    return render_template("drawing_room.html")

@socketio.on('new')
def on_new_client():
    sid = request.sid
    clients.append(sid)
    socketio.emit("accepted", sid, to=sid)

@socketio.on('draw')
def on_draw(data):
    id = data["ignore"]
    del data["ignore"]
    for c in clients:
        if c != id:
            socketio.emit("draw", data, to=c)

app.run(host="0.0.0.0", port=8080)