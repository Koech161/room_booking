from flask import Flask, make_response, request
from flask_migrate import Migrate
from flask_cors import CORS
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
from flask_admin import Admin
from flask_admin.contrib.sqla import ModelView

from flask_mail import Mail, Message # pip install Flask-mail
from itsdangerous import URLSafeTimedSerializer

load_dotenv()
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', secrets.token_hex(16))
app.json.compact=False

# send email before registering
app.config['MAIL_SERVER'] = 'smtp.gmail.com' 
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] =os.getenv('MAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')
app.config['MAIL_DEFAULT_SENDER'] = os.getenv('MAIL_DEFAULT_SENDER')
app.config['MAIL_DEBUG'] = True



CLOUDINARY_CLOUD_NAME = os.getenv('CLOUDINARY_CLOUD_NAME')
CLOUDINARY_API_KEY = os.getenv('CLOUDINARY_API_KEY')
CLOUDINARY_API_SECRET = os.getenv('CLOUDINARY_API_SECRET')

cloudinary.config(
    cloud_name=CLOUDINARY_CLOUD_NAME,
    api_key=CLOUDINARY_API_KEY,
    api_secret=CLOUDINARY_API_SECRET,
    secure=True
)

db.init_app(app)
migrate = Migrate(app,db)
api = Api(app)
CORS(app)
jwt = JWTManager(app)

mail = Mail(app)
s  = URLSafeTimedSerializer(app.config['SECRET_KEY'])

room_schema = RoomSchema()
user_schema = UserSchema()
payement_schema = PaymentSchema()
booking_schema = BookingSchema()
rooms_schema = RoomSchema(many=True)
users_schema = UserSchema(many=True)
payments_schema =PaymentSchema(many=True)
bookings_schema = BookingSchema(many=True)

admin = Admin(app, name='Room Admin', template_mode='bootstrap3')
class RoomAdmin(ModelView):
    # Include a custom form if needed, or just rely on default
    column_list = ('room_no', 'room_type', 'capacity', 'status', 'image_url')
    form_columns = ('room_no', 'room_type', 'capacity', 'status', 'image_url')  
admin.add_view(ModelView(User, db.session))
admin.add_view(RoomAdmin(Room, db.session))

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
            user_data = user_schema.dump(new_user)
            token = s.dump(email, salt='email-confirm')
            comfirm_url = f"http://localhost:5555/confirm/{token}"
            msg =Message("Confirm Your Email", recipients=[email])
            msg.body = f"Please click the link to confirm your email: {comfirm_url}"
            try:
                mail.send(msg)
                print('Email send successfully')
            except Exception as e:
                print(f"Failed to send email: {str(e)}")    
            return {'message': 'User registered successfully', 'user': user_data},201
        except Exception as e:
            db.session.rollback()
            return {'error': str(e)}, 500
class ConfirmEmail(Resource):
    def get(self, token):
        try:
            email = s.loads(token, salt='email-confirm', max_age=1800)
            user = User.query.filter_by(email=email).first()
            if user and not user.confirmed:
                user.confirmed =True
                db.session.commit()   
                return {'message': 'Email confirmed successfully! You can now log in.'}, 200
            return {'error': 'User not found or already registered'}, 404
        except Exception as e:
            return {'errror': str(e)}, 400
            

class Login(Resource):
    def post(self):
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        
        user = User.query.filter_by(email=email).first()
        if user:
            if not user.confirmed:
                return {'error': 'Email not confirmed. please check your email for the confirmation link'}, 403
     
        if check_password_hash(user.password, password):
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
api.add_resource(ConfirmEmail, '/confirm/<token>')



if __name__ == '__main__':
    app.run(port=5555, debug=True)