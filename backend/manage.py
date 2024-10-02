#!/usr/bin/env python

import os
import sys

from django.conf import settings
from django.core.management import execute_from_command_line

from decouple import config


if __name__ == "__main__":
    settings_module = config("DJANGO_SETTINGS_MODULE", default=None)

    if sys.argv[1] == "test":
        if settings_module:
            print(
                "Ignoring config('DJANGO_SETTINGS_MODULE') because it's test. "
                "Using 'siscme.settings.test'"
            )
        os.environ.setdefault("DJANGO_SETTINGS_MODULE", "siscme.settings.test")
    else:
        if settings_module is None:
            print(
                "Error: no DJANGO_SETTINGS_MODULE found."
                "Will NOT start devserver. "
                "Remember to create .env file at project root. "
                "Check README for more info."
            )
            sys.exit(1)
        os.environ.setdefault("DJANGO_SETTINGS_MODULE", settings_module)

    if settings.DEBUG:
        if os.environ.get("RUN_MAIN") or os.environ.get("WERKZEUG_RUN_MAIN"):
            try:
                import debugpy

                debugpy.listen(("localhost", 5678))
                print("Waiting for debugger attach")
                import time

                time.sleep(1)
                # debugpy.wait_for_client()
            except ImportError:
                pass

    execute_from_command_line(sys.argv)
