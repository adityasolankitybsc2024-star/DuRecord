from django.shortcuts import render
from Record import models
from django.http import JsonResponse
from django.db import IntegrityError
from django.shortcuts import redirect
from django.urls import reverse

Inputs = [{"type":"Login", "inputs":[{"name":"Email", "type":"email", "alias":"email"}, {"name":"Password", "type":"password", "alias":"password"}]}, {"type":"Register", "inputs":[{"name":"Name", "type":"text", "alias":"name"}, {"name":"Email", "type":"email", "alias":"email"}, {"name":"Password", "type":"password", "alias":"password"}, {"name":"Profile Picture", "type":"file", "alias":"Profpic"}, {"name":"Institution", "type":"text", "alias":"institution"}, {"name":"Professor", "type":"text", "alias":"prof"}, {"name":"Topic", "type":"text", "alias":"topic"}]}]
# Create your views here.
def homepage(request):
    Inputs2 = [{"name":"Date", "type":"date", "alias":"date"}, {"name":"Work Done", "type":"textarea", "alias":"work"}, {"name":"In Time", "type":"time", "alias":"in"}, {"name":"Out time", "type":"time", "alias":"out"}]
    if "user_id" in request.session:
        try:
            User = models.User.objects.get(id = request.session["user_id"])
            Data = User.data.all().order_by("Date")
        except models.User.DoesNotExist:
            request.session.flush()
            User = None
            Data = None
    else:
        User = None
        Data = None

    return render(request, "homepage.html", {"Inputs":Inputs, "User":User, "I2":Inputs2, "Data":Data})

def Register(request):
    if request.method == "POST":
        name = request.POST.get("name")
        email = request.POST.get("email")
        password = request.POST.get("password")
        Profpic = request.FILES.get("Profpic")
        institution = request.POST.get("institution")
        prof = request.POST.get("prof")
        topic = request.POST.get("topic")

        try:
            User = models.User(name = name, email = email, Password = password, ProfilePic = Profpic, Institution = institution, Professor = prof, Topic = topic)
            User.save()
            return JsonResponse({"status":"success", "message":"User Registered Successfully"})
        except IntegrityError as e:
            return JsonResponse({"status":"failure", "message":"Entered email already exixts in the database"})
        
            
def Login(request):
    if request.method == "POST":
        email = request.POST.get("email")
        password = request.POST.get("password")

        try:
            User = models.User.objects.get(email = email)
            if User.Password == password:
                request.session["user_id"] = User.id
                return JsonResponse({"status":"success", "message":"Logged in Successfully!", "redirect":reverse("Homepage")})
            else:
                return JsonResponse({"status":"failure", "message":"Password is Incorrect"})
        
        except models.User.DoesNotExist:
            return JsonResponse({"status":"failure", "message":"This email is not registered in the database."})
            

def Profile(request):
    User = models.User.objects.get(id = request.session["user_id"])
    return render(request, "profile.html", {"User":User, "Inputs":Inputs})

def Logout(request):
    request.session.flush()
    return redirect("Homepage")

def AddData(request):
    if request.method == "POST":
        date = request.POST.get("date")
        work = request.POST.get("work")
        In = request.POST.get("in")
        Out = request.POST.get("out")

        try:
            Data = models.Data(user = models.User.objects.get(id = request.session["user_id"]), Date = date, WorkDone = work, InTime = In, OutTime = Out)
            Data.save()
            return JsonResponse({"status":"success", "message":"Data added successfully!", "redirect":reverse("Homepage")})
        except IntegrityError as e:
            return JsonResponse({"status":"failure", "message":str(e)})

def Datapane(request, id, Type):
    User = models.User.objects.get(id = request.session["user_id"])
    Data = User.data.get(id = id)
    Info = [{"name":"Date", "type":"date", "value":Data.Date.strftime("%Y-%m-%d"), "nn":"date"}, {"name":"In Time", "type":"time", "value":Data.InTime.strftime("%H:%M"), "nn":"intime"}, {"name":"Out Time", "type":"time", "value":Data.OutTime.strftime("%H:%M"), "nn":"outtime"}]
    if (Type == "edit") and (request.method == "POST"):
        try:
            Data.Date = request.POST.get("date")
            Data.InTime = request.POST.get("intime")
            Data.OutTime = request.POST.get("outtime")
            Data.WorkDone = request.POST.get("WD")

            Data.save()
            return JsonResponse({"status":"success", "message":"Data Changed Successfully", "redirect":reverse(Datapane, kwargs={"id":id, "Type":"view"})})
        except IntegrityError as e:
            return JsonResponse({"status":"failure", "message":str(e)})

    return render(request, "Data.html", {"User":User, "Hours":Data.hours_worked, "type":Type, "Info":Info, "Data":Data})