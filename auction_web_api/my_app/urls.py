from django.urls import re_path
from my_app import views 
 
urlpatterns = [ 
    re_path(r'^api/player$', views.player_collection),
    re_path(r'^api/player/(?P<id>[0-9]+)$', views.player),
    re_path(r'^api/team/process$', views.team_process),
]