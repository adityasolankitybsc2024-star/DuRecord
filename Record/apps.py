from django.apps import AppConfig


class RecordConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'Record'

    def ready(self):
        import Record.signals
