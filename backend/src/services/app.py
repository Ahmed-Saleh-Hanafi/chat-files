from core import get_settings

class AppServices:
    def __init__(self):
        pass
    
    def get_app_info(self):
        return {
            "app name": get_settings().APP_NAME,
            "app_version": get_settings().APP_VERSION
        }