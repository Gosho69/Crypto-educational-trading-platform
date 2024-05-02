from rest_framework import serializers
from .models import MyUser, Crypto
from django.contrib.auth.hashers import make_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class UserSerializer(serializers.ModelSerializer):
    username = serializers.CharField(
        required=True, 
        help_text="Requierd username, max length 100 characters"
    )
    password = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password', 'placeholder': 'Password'}
    )
    class Meta:
        model = MyUser
        fields = ['id', 'username','email', 'password']
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data.get('password'))
        user = MyUser.objects.create(**validated_data)
        return user 
    
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        return data
    
class CryptoSerializer(serializers.ModelSerializer):
    amount = serializers.FloatField(
        required=True,
        help_text="Amount of crypto to buy"
    )
    class Meta:
        model = Crypto
        fields = ['name', 'amount', 'user_id']
        extra_kwargs = {"user_id": {"read_only": True}}
