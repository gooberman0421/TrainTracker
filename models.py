from django.core.cache import cache  # Django's caching framework
import requests  # Assuming you're using requests to make API calls
from django.db import models
import logging  # For logging errors

# Setup basic logging
logger = logging.getLogger(__name__)

class Train(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    route = models.CharField(max_length=255)
    schedule = models.TextField()  # This might be fetched from an external API

    def __str__(self):
        return self.name

def fetch_train_schedules(train_ids):
    """
    Fetch train schedules for a batch of train IDs to reduce API calls.
    train_ids: List of train IDs
    """
    schedules = []
    api_endpoint = "https://api.trains.com/v1/schedules"
    try:
        response = requests.post(api_endpoint, json={"train_ids": train_ids})
        if response.status_code == 200:
            schedules = response.json()
        else:
            logger.error(f'Failed to fetch schedules with status code {response.status_code}')
    except requests.RequestException as e:
        logger.error(f'Error fetching schedules from API: {e}')
    except Exception as e:
        logger.error(f'Unexpected error during fetch_train_schedules: {e}')
    return schedules

def get_or_set_train_schedule(train_id):
    """
    Get the train schedule from cache if available; otherwise, fetch from API, then cache it.
    train_id: ID of the train
    """
    cache_key = f"train_schedule_{train_id}"
    try:
        schedule = cache.get(cache_key)
        if not schedule:
            # Assuming a function exists to fetch schedule for a single train ID
            schedule = fetch_train_schedules([train_id])  # Assuming you adjust fetch_train_schedules to handle single/multiple IDs
            if schedule:
                # Assume schedule[0] since fetching just one; adjust based on your API's response structure
                schedule = schedule[0] if schedule else {}
                # Cache the schedule for 2 hours (7200 seconds)
                cache.set(cache_key, schedule, timeout=7200)
            else:
                logger.error(f'No schedule found for train_id: {train_id}')
    except Exception as e:
        logger.error(f'Error in get_or_set_train_schedule: {e}')
        schedule = {}
    return schedule