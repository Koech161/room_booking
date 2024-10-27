from flask import Flask, make_response, request
from flask_migrate import Migrate

from utils import db
from models.booking import Booking
from models.payment import Payment
from models.room import Room
from models.user import User
from flask_restful import Api, Resource
from schemas import PaymentSchema, UserSchema, BookingSchema, RoomSchema
import cloudinary
import cloudinary.uploader
from dotenv import load_dotenv
import os
import secrets
from flask_jwt_extended import JWTManager, create_access_token, jwt_required
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import timedelta
import logging
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')
app.json.compact=False



db.init_app(app)
migrate = Migrate(app,db)
api = Api(app)
load_dotenv()
jwt = JWTManager(app)

CLOUDINARY_CLOUD_NAME = os.getenv('CLOUDINARY_CLOUD_NAME')
CLOUDINARY_API_KEY = os.getenv('CLOUDINARY_API_KEY')
CLOUDINARY_API_SECRET = os.getenv('CLOUDINARY_API_SECRET')

cloudinary.config(
    cloud_name=CLOUDINARY_CLOUD_NAME,
    api_key=CLOUDINARY_API_KEY,
    api_secret=CLOUDINARY_API_SECRET,
    secure=True
)
print(app.config['JWT_SECRET_KEY'])

room_schema = RoomSchema()
user_schema = UserSchema()
payement_schema = PaymentSchema()
booking_schema = BookingSchema()
rooms_schema = RoomSchema(many=True)
users_schema = UserSchema(many=True)
payments_schema =PaymentSchema(many=True)
bookings_schema = BookingSchema(many=True)

class Register(Resource):
    def post(self):
        data = request.get_json()
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        role = data.get('role', 'guest')
        
        if not all([username, email, password]):
            return {'error': 'Username, email and password are required.'}, 404
        
        valid_roles = ['admin', 'guest', 'user']
        if role not in valid_roles:
            return {'error': f'Invalid role. Valid roles are: {", ".join(valid_roles)}.'}, 400
        
       
        hashed_password = generate_password_hash(password, method='pbkdf2:sha256')
        new_user = User(username=username, email=email, password=hashed_password, role=role)
        try:
            db.session.add(new_user)
            db.session.commit()
            return {'message': 'User registered successfully', 'user': new_user.username}
        except Exception as e:
            db.session.rollback()
            return {'error': str(e)}, 500

class Login(Resource):
    def post(self):
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        
        user = User.query.filter_by(email=email).first()
     
        if user and check_password_hash(user.password, password):
            access_token = create_access_token(identity=email, expires_delta=timedelta(days=1))
            return {'message': "Login successfully", "Token":access_token, }, 200
        return {'error': 'Invalid credentials'}, 401
class GetRooms(Resource):
    def get(self):
        rooms = Room.query.all()
        try:
            return rooms_schema.dump(rooms), 200
        except Exception as e:
            db.session.rollback()
            return {'error': str(e)},500
    
    def post(self):
        if 'file' not in request.files:
            return {'error': 'No file path'}, 400
        file = request.files['file']
        if file.filename == '':
            return {'error':'No selected file'}, 400
        data = request.form
        if not data:
            return {'Error': 'No input provided'}, 400
        room_no = data.get('room_no')
        room_type = data.get('room_type')
        capacity = data.get('capacity')
        status = data.get('status')
       
        if not all([room_no, room_type, capacity, status]):
            return {'error': 'All fields (room_no, room_type, capacity, status) are required'}, 400
        
        if isinstance(status, str):
            status = status.lower() == 'true'
                
        try:
            upload_result = cloudinary.uploader.upload(file, resource_type='image') 
            image_url = upload_result['secure_url']
            new_room = Room(room_no=room_no, room_type=room_type, capacity=capacity, status=status, image_url=image_url)
            db.session.add(new_room)
            db.session.commit()
            return {'message': 'Room added successfully', 'room': new_room.room_no},201
        except Exception as e:
            db.session.rollback()
            return {'error occured adding room': str(e)}, 500
        
class RoomByID(Resource):
    def get(self, id):
        room = Room.query.get_or_404(id)
        try:
            return room_schema.dump(room), 200
        except Exception as e:
            db.session.rollback()
            return {'error': str(e)}
    def patch(self, id):
        room = Room.query.get_or_404(id)

        data = request.get_json()
        if not data:
            return {'error': 'No input available'},404
        for attr, value in data.items():
            setattr(room, attr, value)
        try:
            db.session.commit()
            return {'message': 'Room Updated successfully'}, 200

        except Exception as e:  
            db.session.rollback()
            return {'error updateing room': str(e)},500

    def delete(self, id):
        room = Room.query.get_or_404(id)
        try:
            db.session.delete(room)
            db.session.commit()    
            return {'message': 'Room deleted successfully'},200
        except Exception as e:
            db.session.rollback()
            return {'error': str(e)},500


api.add_resource(GetRooms, '/rooms')
api.add_resource(RoomByID, '/rooms/<int:id>')
api.add_resource(Login, '/login')
api.add_resource(Register, '/register')


if __name__ == '__main__':
    app.run(port=5555, debug=True)