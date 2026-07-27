from django.db import models
from django.utils import timezone
from datetime import datetime
from cloudinary_storage.storage import MediaCloudinaryStorage
from django.contrib.auth.models import User

# Create your models here.
def current_time():
    return timezone.now().time()

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    ProfilePic = models.ImageField(storage=MediaCloudinaryStorage(), upload_to="images/")
    Institution = models.CharField(max_length=200)
    Professor = models.CharField(max_length=100)
    Topic = models.CharField(max_length=200, null=True, blank=True)

    def Total_Hours(self):
        total = 0
        for obj in self.user.data.all():
            total += obj.hours_worked()
        
        return total

    def __str__(self):
        return self.user.username

class Data(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="data")
    Date = models.DateField(default=timezone.now)
    WorkDone = models.TextField(null=True, blank=True)
    InTime = models.TimeField(default=current_time)
    OutTime = models.TimeField(default=current_time)

    def hours_worked(self):
        if self.InTime and self.OutTime:
            ITD = datetime.combine(self.Date, self.InTime)
            OTD = datetime.combine(self.Date, self.OutTime)
            hours = OTD - ITD
            return round(hours.total_seconds() / 3600, 2)
        else:
            return 0

    def __str__(self):
        return f"{self.user.username} :- [{self.Date}] [{self.hours_worked()} hrs]"