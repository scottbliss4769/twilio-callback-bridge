from flask import Flask, request, Response
from twilio.twiml.voice_response import VoiceResponse, Dial
import os

app = Flask(__name__)

@app.route("/outbound-call", methods=["POST"])
def outbound_call():
    to_number = request.form.get("To")
    from_number = os.environ.get("TWILIO_CALLER_ID")

    if not to_number or not from_number:
        return "Missing parameters", 400

    response = VoiceResponse()
    dial = Dial(callerId=from_number)
    dial.number(to_number)
    response.append(dial)

    return Response(str(response), mimetype="text/xml")

@app.route("/")
def index():
    return "Twilio call bridge is up!"

if __name__ == "__main__":
    app.run()
