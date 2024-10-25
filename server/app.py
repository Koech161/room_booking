from flask import Flask, make_response, request
from flask_migrate import Migrate

from utils import db
from models.booking import Booking
from models.payment import Payment
from models.room import Room
from models.user import User
from flask_restful import Api, Resource
from schemas import PaymentSchema, UserSchema, BookingSchema, RoomSchema

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.json.compact=False

db.init_app(app)
migrate = Migrate(app,db)
api = Api(app)

room_schema = RoomSchema()
user_schema = UserSchema()
payement_schema = PaymentSchema()
booking_schema = BookingSchema()
rooms_schema = RoomSchema(many=True)
users_schema = UserSchema(many=True)
payments_schema =PaymentSchema(many=True)
bookings_schema = BookingSchema(many=True)

class GetRooms(Resource):
    def get(self):
        rooms = Room.query.all()
        try:
            return make_response(rooms_schema.dump(rooms)), 200
        except Exception as e:
            db.session.rollback()
            return {'error': str(e)},500
    
    def post(self):
        data = request.get_json()
        if not data:
            return {'Error': 'No input provided'}, 400
        room_no = data.get('room_no')
        room_type = data.get('room_type')
        capacity = data.get('capacity')
        status = data.get('status')
        
        if isinstance(status, str):
            status = status.lower() == 'true'

        new_room = Room(room_no=room_no, room_type=room_type, capacity=capacity, status=status)
        try:
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
            return make_response(room_schema.dump(room)), 200
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

if __name__ == '__main__':
    app.run(port=5555, debug=True)