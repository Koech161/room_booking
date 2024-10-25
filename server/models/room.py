from utils import db

class Room(db.Model):
    __tablename__ = 'rooms'

    id = db.Column(db.Integer, primary_key=True)
    room_no = db.Column(db.String,nullable=False, unique=True)
    room_type = db.Column(db.String, nullable=False)
    capacity = db.Column(db.Integer, nullable=False)
    status = db.Column(db.Boolean, nullable=False)

    bookings = db.relationship('Booking', back_populates='room', cascade='all, delete-orphan', lazy=True)

    def __repr__(self):
        return f"<Room {self.room_no}, {self.room_type}, {self.capacity} ,{self.status}>"