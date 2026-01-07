from flask import Flask


from routes.event import event_bp

app = Flask(__name__)

app.register_blueprint(event_bp, url_prefix="/api")
app.register_blueprint(booking_bp, url_prefix="/api")
app.register_blueprint(payment_bp, url_prefix="/api")
app.register_blueprint(review_bp, url_prefix="/api")
app.register_blueprint(user_bp, url_prefix="/api")

@app.route('/')
def home():
    return "Welcome to event organization app!!"

if __name__ == '__main__':
    app.run(debug=True) 