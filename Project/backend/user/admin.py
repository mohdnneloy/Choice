from django.contrib import admin

# the module name is app_name.models
from user.models import *


# Register your models to admin site, then you can add, edit, delete and search your models in Django admin site.
admin.site.register(Arizona_Voter)
admin.site.register(California_Voter)
admin.site.register(Voter)
admin.site.register(PartyAmbassador)
admin.site.register(Admin)
