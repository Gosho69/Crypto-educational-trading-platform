from django.shortcuts import render
from django.views import View
from rest_framework import generics
from .models import MyUser, Crypto
from .serializer import UserSerializer, CryptoSerializer
from rest_framework.permissions import AllowAny, AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializer import CustomTokenObtainPairSerializer
from django.http import JsonResponse
from rest_framework.authtoken.models import Token
from rest_framework.views import APIView
from .functions.getcrypto import get_crypto_info, get_crypto_price
from .functions.getjsonresponse import getJsonResponseFuncName
import json
from django.core.exceptions import ValidationError
from django.db import IntegrityError

cryptonames = ['bitcoin', 'ethereum', 'litecoin', 'eos', 'cardano', 'stellar', 'iota', 'tron', 'neo', 'solana']

class CreateUserView(generics.CreateAPIView):
    queryset = MyUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
    
class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class DashboardMyProfileView(APIView):
    permission_classes = [AllowAny]
    def get(self, request, *args, **kwargs):    
        user = request.user
        return JsonResponse({
            'username': user.username,
            'email': user.email,
            'credits': user.credits
        })

class DashboardAllCryptoView(APIView):
    permission_classes = [AllowAny]
    def get(self, request, *args, **kwargs):
        all_data = {}
        for name in cryptonames:
            try:
                json_data = getJsonResponseFuncName(get_crypto_info, name)
                all_data[name] = json_data['data']
            except:
                return JsonResponse({"error": f"Invalid crypto name: {name}"}, status=400)   
        formatted_data = {key: value for key, value in all_data.items()}
        return JsonResponse({"data": formatted_data}, status=200)
    
class DashboardBuyCrypto(APIView):
    permission_classes = [AllowAny]
    serializer_class = CryptoSerializer
    def post(self, request, *args, **kwargs):
        user = request.user
        user_id = user.id
        cryptoname = kwargs.get('cryptoname', '').lower()
        crypto_data = Crypto.objects.filter(user_id=user_id, name=cryptoname).values_list()
        for el in list(crypto_data):
            crypto_id = int(el[0])
            amount_db = el[2]
        data = getJsonResponseFuncName(get_crypto_price, cryptoname)
        price = round(float(data['price']), 2)
        amount = request.data['amount']
        user_credits = user.credits
        total_price = float(price) * float(amount)
        if crypto_data:
            if user_credits >= total_price:
                amount = float(amount) + float(amount_db)
                user.credits = user_credits - total_price
                user.save()
                Crypto.objects.filter(id=crypto_id).update(amount=amount)
                return JsonResponse({"message": f"Bought {cryptoname} successfully"}, status=200)
            else:
                return JsonResponse({"error": "Not enough credits"}, status=400)
        else:
            if user_credits >= total_price:
                Crypto.objects.create(name=cryptoname, amount=amount, user_id=user_id)
                user.credits = user.credits - total_price
                user.save()
                return JsonResponse({"message": f"Bought {cryptoname} successfully"}, status=200)
            else:
                return JsonResponse({"error": "Not enough credits"}, status=400)

class DashboardMyCryptoView(APIView):
    permission_classes = [AllowAny]
    serializer_class = CryptoSerializer, UserSerializer
    def get(self, request, *args, **kwargs):
        user = request.user
        user_id = user.id
        all_data = {}
        crypto_datas = Crypto.objects.filter(user_id=user_id).values_list('name', 'amount')
        try:
            all_data.update(crypto_datas)
            return JsonResponse({"cryptos": all_data}, status=200)
        except:
            return JsonResponse({"message":"You don't have any crypto yet"}, status=200)

class DashboardSellCrypto(APIView):
    permission_classes = [AllowAny]
    serializer_class = CryptoSerializer, UserSerializer
    def post(self, request, *args, **kwargs):
        user = request.user
        user_id = user.id
        cryptoname = kwargs.get('cryptoname').lower()
        crypto_data = Crypto.objects.filter(name=cryptoname).values_list()
        for el in list(crypto_data):
            crypto_id = int(el[0])
            amount_db = el[2]
        price = getJsonResponseFuncName(get_crypto_price, cryptoname)
        price = round(float(price['price']), 2)
        amount_buy = request.data['amount']
        user_credits = user.credits
        try:
            if float(amount_db) >= float(amount_buy):
                if amount_buy == amount_db:
                    Crypto.objects.filter(id=crypto_id).delete()
                    return JsonResponse({"message": f"Sold {amount_buy} {cryptoname} successfully"}, status=200)
                if amount_buy == 0:
                    return JsonResponse({"error": "You can't sell 0 crypto"}, status=400)
                amount = float(amount_db) - float(amount_buy)
                Crypto.objects.filter(id=crypto_id).update(amount=abs(amount))
                user_credits = user_credits + abs(float(amount_buy)) * price
                user.credits = user_credits
                user.save()
                return JsonResponse({"message": f"Sold {amount_buy} {cryptoname} successfully"}, status=200)
            else:
                return JsonResponse({"error": "You dont have that much crypto"}, status=400)
        except:
            return JsonResponse({"error": "Error"}, status=400)