from flask import Flask, request, jsonify
from flask_migrate import Migrate
from flask_cors import CORS
from utils import db
from models.booking import Booking
from models.room import Room
from models.user import User
from models.payment import Payment
from flask_restful import Api, Resource
from schemas import PaymentSchema, UserSchema, BookingSchema, RoomSchema
import cloudinary
import cloudinary.uploader
from dotenv import load_dotenv
import os
import secrets
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import timedelta
from flask_admin import Admin
from flask_admin.contrib.sqla import ModelView
from datetime import datetime
from itsdangerous import URLSafeTimedSerializer
import json
import requests
import base64
from requests.auth import HTTPBasicAuth

load_dotenv()
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', secrets.token_hex(16))
app.json.compact=False


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
    column_list = ('room_no', 'room_type', 'capacity', 'status', 'image_url','price_per_hour')
    form_columns = ('room_no', 'room_type', 'capacity', 'status', 'image_url', 'price_per_hour')  
admin.add_view(ModelView(User, db.session))
admin.add_view(ModelView(Booking,db.session))
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
        
        existing_user = User.query.filter((User.username == username) | (User.email == email)).first()
        if existing_user:
            return {'error': 'Username or email already exists.'}, 409 
        hashed_password = generate_password_hash(password, method='pbkdf2:sha256')
        new_user = User(username=username, email=email, password=hashed_password, role=role)
        try:
            db.session.add(new_user)
            db.session.commit()
            user_data = user_schema.dump(new_user)
            token = s.dumps(email, salt='email-confirm')
            confirm_url = f"http://localhost:5555/confirm/{token}"
              
            return {'message': 'User registered successfully', 'confirmation_link': confirm_url, 'user_data': user_data},201
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
class UserByID(Resource):
    def get(self,id):
        user = User.query.get_or_404(id)
        return user_schema.dump(user),200    
            

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
            access_token = create_access_token(identity=user.id, expires_delta=timedelta(days=1))
            return {'message': "Login successfully", "token":access_token,'userId':user.id }, 200
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
        price_per_hour= data.get('price_per_hour')
        
       
        if not all([room_no, room_type, capacity, status, price_per_hour]):
            return {'error': 'All fields (room_no, room_type, capacity, status, price_per_hour) are required'}, 400
        
        if isinstance(status, str):
            status = status.lower() == 'true'
                
        try:
            upload_result = cloudinary.uploader.upload(file, resource_type='image') 
            image_url = upload_result['secure_url']
            new_room = Room(room_no=room_no, room_type=room_type, capacity=capacity, status=status, image_url=image_url,price_per_hour=price_per_hour)
            db.session.add(new_room)
            db.session.commit()
            return {'message': 'Room added successfully', 'room': new_room.room_no},201
        except Exception as e:
            db.session.rollback()
            return {'error occured adding room': str(e)}, 500
        
class RoomByID(Resource):
    @jwt_required()
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
        
class BookRoom(Resource):
    # @jwt_required()
    def post(self):
        data = request.get_json()     
        user_id = data.get('user_id')
        room_id = data.get('room_id')
        check_in = data.get('check_in')
        check_out = data.get('check_out')
        print('Userid:', user_id)
       
        check_in_dt = datetime.strptime(check_in,'%Y-%m-%dT%H:%M:%S.%fZ')
        check_out_dt = datetime.strptime(check_out, '%Y-%m-%dT%H:%M:%S.%fZ')

        room = Room.query.get_or_404(room_id)
        hours = (check_out_dt - check_in_dt).total_seconds() / 3600
        total_price = hours * room.price_per_hour

        if not is_room_available(room_id, check_in_dt, check_out_dt):
            return {'error': 'Room already booked for the selected time'}, 409
        new_booking = Booking(user_id=user_id, room_id=room.id, check_in=check_in_dt, check_out=check_out_dt, total_price=total_price, status=True)
        try:
            db.session.add(new_booking)
            db.session.commit()
            return {'Mesaage': 'Room successfully booked', 'booked:id': new_booking.id, 'total_price': total_price}, 201
        except ValueError:
            return {'error': 'Invalid date format. Please use YYYY-MM-DDTHH:MM:SS.'}, 400
        except Exception as e:
            db.session.rollback()
            return {'error': str(e)}, 500
        
    @jwt_required()
    def get(self):
        user_id = get_jwt_identity()
        bookings = Booking.query.filter_by(user_id=user_id).all()
        if bookings is None:
            return {'error': 'Booking not found for this user'}, 404 
        # bookings_data = [booking_schema.dump(booking) for booking in bookings]
        return bookings_schema.dump(bookings), 200    
        
def is_room_available(room_id, check_in, check_out):
    bookings  =Booking.query.filter(
        Booking.room_id == room_id,
        (Booking.check_in < check_out) & (Booking.check_out > check_in)
    ).all()
    return len(bookings) == 0

class CancelBooking(Resource):
    def delete(self,id):
        booking = Booking.query.get_or_404(id)
        user_id = get_jwt_identity()
        if booking.user_id != user_id:
            return {'error': 'You do not have permision to cancel booking'},403
        try:
            db.session.delete(booking)
            db.session.commit()
            return {'message': 'Booking canceled successfully'},200
        except Exception as e:
            db.session.rollback()
            return {'error': str(e)}, 500
       
       
       
        # Mpesa Integrations 

class PaymentResource(Resource):
    def post(self):
        data = request.get_json()
        amount = data.get('amount')
        booking_id = data.get('booking_id')

        consumer_key = os.getenv('CONSUMER_KEYS')
        consumer_secret = os.getenv('CONSUMER_SECRET')
        passkey= os.getenv('PASSKEY')
        shortcode = '174379'
        lipa_na_mpesa_online_url= 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest'
        callback_url = os.getenv('CALLBACK_URL')
        timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
        print("Callback URL:", callback_url)

        response = requests.get('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', auth=HTTPBasicAuth(consumer_key, consumer_secret))
        if response.status_code != 200:
            return jsonify({'error': 'Failed to obtain access token', 'details': response.json()}), 400

        access_token = response.json().get('access_token')
        password_string = f"{shortcode}{passkey}{timestamp}"
        password = base64.b64encode(password_string.encode()).decode()
        headers = {
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {access_token}'}
        print('acesstoken:', access_token)
        payload = {
            "BusinessShortCode": shortcode,
            "Password": password,
            "Timestamp": timestamp,
            "TransactionType": "CustomerPayBillOnline",
            "Amount": amount,
            "PartyA": "254748512459",
            "PartyB": shortcode,
            "PhoneNumber": "254748512459",
            "CallbackURL":callback_url,
            "AccountReference": f"Booking {booking_id}",
            "TransactionDesc": "Payment for booking"
        }

        # Make STK Push request
        response = requests.post(lipa_na_mpesa_online_url, json=payload, headers=headers)

        if response.status_code == 200:
            payment_data = response.json()

            payment = Payment(amount=amount, payement_method='M-pesa',payment_date=timestamp, status=True, booking_id=booking_id, transaction_id=payment_data.get('transactionId'))
            db.session.add(payment)
            db.session.commit()
            return jsonify({'message': 'Payment initiated successfuly', "data": payment_data})
        else:
            return jsonify({'error': 'Payment initiatation failed', 'details': response.json()})

class CallbackResource(Resource):
    def post(self):
        data = request.get_json()
        if not data or 'transactionId' not in data or 'status' not in data:
            return jsonify({'error': 'Invalid callback data'})
        transaction_id = data.get('transactionId')
        status = data.get('status')
       

        payment = Payment.query.filter_by(transaction_id=transaction_id).first()

        if payment:
            payment.status = (status == 'SUCCESS')
            db.session.commit()
            return jsonify({'message': 'Payments status updated'})
        return jsonify({'error': 'Payment record not found'})       
        
    
         
               


api.add_resource(GetRooms, '/rooms')
api.add_resource(RoomByID, '/rooms/<int:id>')
api.add_resource(Login, '/login')
api.add_resource(Register, '/register')
api.add_resource(ConfirmEmail, '/confirm/<token>')
api.add_resource(BookRoom, '/bookings')
api.add_resource(CancelBooking, '/bookings/<int:id>')
api.add_resource(UserByID, '/users/<int:id>')
api.add_resource(PaymentResource, '/pay')
api.add_resource(CallbackResource, '/callback')



if __name__ == '__main__':
    app.run(port=5555, debug=True)