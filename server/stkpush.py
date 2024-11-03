

from utils import db
import json
import requests
from flask import jsonify
from datetime import datetime
from app import request, Resource


class PaymentResource(Resource):
    def post(self):
        data = request.get_json()
        amount = data.get('amount')
        booking_id = data.get('booking_id')

        consumer_key = ''
        consumer_secret = ''
        shortcode = ''
        lipa_na_mpesa_online_url= 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest'

        response = requests.get('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', auth=(consumer_key, consumer_secret))
        access_token = response.json().get('access_token')

        headers = {'Authorization': f'Bearer {access_token}'}
        payload = {
            "BusinessShortCode": shortcode,
            "Password": f"{shortcode}",
            "Timestamp": datetime.now().strftime('%Y%m%d%H%M%S'),
            "TransactionType": "CustomerPayBillOnline",
            "Amount": amount,
            "PartyA": "0748512459",
            "PartyB": shortcode,
            "PhoneNumber": "0748512459",
            "CallbackURL":"",
            "AccountReference": f"Booking {booking_id}",
            "TransactionDesc": "Payment for booking"
        }

        # Make STK Push request
        response = requests.post(lipa_na_mpesa_online_url, json=payload, headers=headers)

        if response.status_code == 200:
            payment_data = response.json()

            payment = Payment(amount=amount, payement_method='M-pesa', status=True, booking_id=booking_id)
            db.session.add(payment)
            db.session.commit()
            return jsonify({'message': 'Payment initiated successfuly', "data": payment_data}),200
        else:
            return jsonify({'error': 'Payment initiatation failed', 'details': response.json()}),400

class CallbackResourece(Resource):
    def post(self):
        data = request.get_json()
        transaction_id = data.get('transactionId')
        status = data.get('status')

        payment = Payment.query.filter_by(transaction_id=transaction_id).first()

        if payment:
            payment.status = (status == 'SUCCESS')
            db.session.commit()
            return jsonify({'message': 'Payments status updated'}), 200
        return jsonify({'error': 'Payment record not found'}), 404
    