from django.contrib import admin
from .models import UserAccount, CollectionItem, RecentActivity

# Register your models here.


admin.site.register(UserAccount)
admin.site.register(CollectionItem)
admin.site.register(RecentActivity)