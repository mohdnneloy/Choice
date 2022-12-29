# Cluster endpoints
from django.urls import path
from . import views

urlpatterns = [

    # ========== User APIs ================

    # APIs for Voter Panel
    path('addvoter', views.addVoter),
    path('loginvoter', views.loginVoter),
    path('profilevoter', views.profileVoter),
    path('pollsvoter', views.pollsVoter),
    path('castvote', views.castVote),
    path('campaignsvoter', views.VoterCampaign),

    # APIs for Admin Panel
    path('addadmin', views.addAdmin),
    path('loginadmin', views.loginAdmin),
    path('profileadmin', views.profileAdmin),
    path('createpoll', views.createPoll),
    path('pollsadmin', views.pollsAdmin),
    path('pollpublish', views.pollPublish),

    # APIs for Party Ambassador
    path('addpartyambassador', views.addPartyAmbassador),
    path('loginpartyambassador', views.loginPartyAmbassador),
    path('profilepartyambassador', views.profilePartyAmbassador),
    path('createcampaign', views.createCampaign),
    path('campaignspa', views.PACampaign),


]