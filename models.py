from django.db import models
import os

class Train(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    route = models.CharField(max_length=255)
    schedule = models.TextField()

    def __str__(self):
        return self.name