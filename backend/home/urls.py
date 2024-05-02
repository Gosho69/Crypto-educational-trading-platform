from django.urls import path, include
from . import views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import CustomTokenObtainPairView, DashboardMyProfileView, CreateUserView, DashboardAllCryptoView, DashboardBuyCrypto, DashboardMyCryptoView, DashboardSellCrypto

urlpatterns = [
    path('sign_up/',CreateUserView.as_view(), name='register'),
    path('login/', CustomTokenObtainPairView.as_view(), name='get_token'),
    path('token/refresh/', TokenRefreshView.as_view(), name='refresh_token'),
    path('auth/', include("rest_framework.urls")),
    path('dashboard/my_profile/', DashboardMyProfileView.as_view(), name='my_profile'),
    path('dashboard/all_crypto/', DashboardAllCryptoView.as_view(), name='all_crypto'),
    path('dashboard/all_crypto/<str:cryptoname>/', DashboardBuyCrypto.as_view(), name="buy_crypto"),
    path('dashboard/mycrypto/', DashboardMyCryptoView.as_view(), name='my_crypto'),
    path('dashboard/mycrypto/<str:cryptoname>/', DashboardSellCrypto.as_view(), name='sell_crypto'),
]