web: gunicorn siscme.wsgi --chdir backend --limit-request-line 8188 --log-file -
worker: REMAP_SIGTERM=SIGQUIT celery --workdir backend --app=siscme worker --loglevel=info
beat: REMAP_SIGTERM=SIGQUIT celery --workdir backend --app=siscme beat -S redbeat.RedBeatScheduler --loglevel=info
