from celery.schedules import crontab


CELERYBEAT_SCHEDULE = {
    # Internal tasks
    "clearsessions": {
        "schedule": crontab(hour=3, minute=0),
        "task": "users.tasks.clearsessions",
    },
    "monitorar solicitacao": {
        "task": "common.tasks.monitorar_status_tabela",
        "schedule": 30,
    },
}
