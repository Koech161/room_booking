from utils import db

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, nullable=False, unique=True)
    email = db.Column(db.String, nullable=False, unique=True)
    password = db.Column(db.String, nullable=False)
    role = db.Column(db.String, nullable=True, default='guest')
    confirmed = db.Column(db.Boolean, nullable=False, default=False) 


    bookings = db.relationship('Booking', back_populates='user', cascade='all, delete-orphan', lazy=True)
    def __repr__(self):
        return f'<User {self.username}, {self.email}, {self.role}>'
