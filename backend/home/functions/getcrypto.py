import requests
from django.http import JsonResponse
import json

def get_crypto_info(cryptoname):
    name = cryptoname.lower()
    try:
        response = requests.get(f"https://api.coincap.io/v2/assets/{name}")
        data = {}
        data["name"] = response.json()['data']['name']
        data["price"] = response.json()['data']['priceUsd']
        data["change"] = response.json()['data']['changePercent24Hr']
        data["symbol"] = response.json()['data']['symbol']
        return JsonResponse({"data": data}, status=200)
    except:
        return JsonResponse({"error": "Invalid crypto name"}, status=400)

def get_crypto_price(cryptoname):
    name = cryptoname.lower()
    try:
        raw_data = get_crypto_info(name)
        raw_data_list = list(raw_data)
        json_string = raw_data_list[0].decode('utf-8')
        json_data = json.loads(json_string)
        price = json_data['data']['price']
        return JsonResponse({"price" : price}, status=200)
    except:
        return JsonResponse({"error": "Invalid crypto name"}, status=400)
