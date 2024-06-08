from django.core.cache import cache  # Django's caching framework
import requests  # Assuming you're using requests to make API calls
from django.db import models

class Train(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    route = models.CharField(max_length=255)
    schedule = models.TextField()  # This might be fetched from an external API

    def __str__(self):
        return self.name

# Pseudocode function for fetching train schedules in batches
def fetch_train_schedules(train_ids):
    """
    Fetch train schedules for a batch of train IDs to reduce API calls.
    train_ids: List of train IDs
    """
    schedules = []
    # Assuming the API has a bulk fetch endpoint
    api_endpoint = "https://api.trains.com/v1/schedules"
    response = requests.post(api_endpoint, json={"train_ids": train_ids})
    if response.status_code == 200:
        schedules = response.json()
    
    return schedules

# Pseudocode function for caching schedule information
def get_or_set_train_schedule(train_id):
    """
    Get the train schedule from cache if available; otherwise, fetch from API, then cache it.
    train_id: ID of the train
    """
    cache_key = f"train_schedule_{train_id}"
    schedule = cache.get(cache_key)
    if not schedule:
        # Assuming a function exists to fetch schedule for a single train ID
        schedule = fetch_train_schedule(train_id)  # This needs to be implemented
        # Cache the schedule for 2 hours (7200 seconds)
        cache.set(cache_key, schedule, timeout=7200)
    
    return schedule