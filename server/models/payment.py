from utils import db
import datetime as dt

class Payment(db.Model):
    __tablename__ = 'payments'

    id = db.Column(db.Integer, primary_key=True)
    amount = db.Column(db.Float, nullable=False)
    payment_date = db.Column(db.DateTime, nullable=False, default=dt.datetime.utcnow)
    payment_method = db.Column(db.String, nullable=False)
    status = db.Column(db.Boolean, nullable=False)
    booking_id = db.Column(db.Integer, db.ForeignKey('bookings.id'), nullable=False)

    booking = db.relationship('Booking', back_populates='payments')

    def __repr__(self):
        return f"<Payments {self.amount}, {self.payment_date}, {self.payment_method},{self.status}, {self.booking_id}>"