
from flask import Flask
from models.database import engine, Base


app = Flask(__name__)

Base.metadata.create_all(bind=engine)
print("All tables created successfully")

@app.route("/")
def home():
    return "Local Event Tracker API Running"

if __name__ == "__main__":
    app.run(debug=True)
