from django.urls import path, include
from Record import views 

urlpatterns = [
    path('', views.homepage, name="Homepage"),
    path('register/', views.Register, name="Register"),
    path('login/', views.Login, name="Login"),
    path('profile/', views.Profile, name="Profile"),
    path('logout/', views.Logout, name="Logout"),
    path('addData/', views.AddData, name="AddData"),
    path('datapane/<int:id>/<str:Type>', views.Datapane, name="Datapane")
]