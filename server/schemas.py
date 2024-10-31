from marshmallow import fields, Schema

class UserSchema(Schema):

    id = fields.Int(dump_only=True)
    username=fields.Str(required=True)
    email= fields.Str(required=True)
    password = fields.Str(load_only=True)
    role= fields.Str(dump_only=True)

class RoomSchema(Schema):
    id = fields.Int(dump_only=True) 
    room_no = fields.Str(required=True)
    room_type = fields.Str(required=True)
    capacity = fields.Int(required=True)
    status = fields.Bool(required=True)
    image_url = fields.Str(required=True)
    price_per_hour = fields.Float(required=True)

class BookingSchema(Schema):
    id = fields.Int(dump_only=True)
    check_in= fields.Date(required=True)
    check_out= fields.Date(required=True)
    total_price = fields.Float(required=True)
    status = fields.Bool(required=True)
    user_id = fields.Int(dump_only=True)
    room_id = fields.Int(dump_only=True)

class PaymentSchema(Schema):
    id = fields.Int(dump_only=True)
    amount = fields.Float(required=True)
    payment_date = fields.Date(required=True)
    payment_method = fields.Str(required=True)
    status = fields.Bool(required=True)



