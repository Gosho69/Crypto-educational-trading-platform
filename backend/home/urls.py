from django.urls import path, include
from . import views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import CustomTokenObtainPairView

urlpatterns = [
    path('register/',views.CreateUserView.as_view(), name='register'),
    path('token/', CustomTokenObtainPairView.as_view(), name='get_token'),
    path('token/refresh/', TokenRefreshView.as_view(), name='refresh_token'),
    path('auth/', include("rest_framework.urls"))
]