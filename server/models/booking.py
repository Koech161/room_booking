from utils import db
import datetime as dt

class Booking(db.Model):
    __tablename__ ='bookings'

    id = db.Column(db.Integer, primary_key=True)
    check_in = db.Column(db.DateTime, nullable=False, default= dt.datetime.utcnow)
    check_out = db.Column(db.DateTime, nullable=True)
    total_price = db.Column(db.Float, nullable=False)
    status = db.Column(db.Boolean, nullable=False)
    user_id = db.Column(db.Integer,db.ForeignKey('users.id'), nullable=False)
    room_id = db.Column(db.Integer, db.ForeignKey('rooms.id'), nullable=False)

    room = db.relationship('Room', back_populates='bookings')
    user = db.relationship('User', back_populates='bookings')
    payments = db.relationship('Payment', back_populates='booking', cascade='all, delete-orphan', lazy=True)

    


    def __repr__(self):
        return f"<Booking {self.check_in}, {self.check_out}, {self.total_price}, {self.status}>"