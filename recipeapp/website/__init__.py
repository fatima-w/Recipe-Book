import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from dotenv import load_dotenv



db = SQLAlchemy()
migrate = Migrate()
# load_dotenv('dev.env')
# gemini_api_key = os.getenv('GEMINI_API_KEY')
# print(f"GEMINI_API_KEY: {gemini_api_key}")

def create_app():
    app = Flask(__name__)
    
    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'fallback_secret_key')
    app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', r'sqlite:///C:\Development\hackathon\recipeapp\website\testdb2.db')

    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', 'jwt_fallback_secret_key')

    db.init_app(app)
    migrate.init_app(app, db)
    CORS(app)
    

    from .views import views
    from .auth import auth

    app.register_blueprint(views, url_prefix='/')
    app.register_blueprint(auth, url_prefix='/')
    JWTManager(app)

    from .models import User, Group, Data, Ingredient

    with app.app_context():
        db.create_all()

    return app