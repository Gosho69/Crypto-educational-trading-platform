import uuid
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.models import BaseUserManager


class MyUser(AbstractBaseUser, PermissionsMixin):
    username = models.CharField(_("username"), max_length=100, unique=True, default=uuid.uuid1)
    email = models.EmailField(_("email address"), unique=True)
    password = models.CharField(_("password"), max_length=128)
    credits = models.IntegerField(_("credits"), default=10000)
    created_at = models.DateTimeField(_("created at"), default=timezone.now)


    USERNAME_FIELD = "username"
    REQUIRED_FIELDS = []

    objects = BaseUserManager() 

    def __str__(self):
        return self.username

class Crypto(models.Model):
    name = models.CharField(_("name"), max_length=100)
    amount = models.FloatField(_("amount"))
    user = models.ForeignKey(MyUser, on_delete=models.CASCADE, related_name="cryptos")

    def __str__(self):
        return self.name