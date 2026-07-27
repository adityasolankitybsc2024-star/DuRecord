from django.db.models.signals import post_delete
from django.dispatch import receiver
from .models import Profile

@receiver(post_delete, sender=Profile)
def delete_user_image(sender, instance, **kwargs):
    if instance.ProfilePic:
        try:
            instance.ProfilePic.delete(save=False)
        except Exception as e:
            print("Error deleting image:", e)
