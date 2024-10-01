# https://docs.djangoproject.com/en/1.10/ref/settings/

import os
from datetime import timedelta
from decouple import config  # noqa
from dj_database_url import parse as db_url  # noqa


BASE_DIR = os.path.dirname(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
)


def base_dir_join(*args):
    return os.path.join(BASE_DIR, *args)


SITE_ID = 1

DEBUG = True

ADMINS = (("Admin", "lider.dev@gbringel.com"),)

AUTH_USER_MODEL = "users.User"

CORS_ALLOW_ALL_ORIGINS = True

PASSWORD_HASHERS = [
    "django.contrib.auth.hashers.BCryptPasswordHasher",
]

ALLOWED_HOSTS = ["*"]
CORS_ORIGIN_ALLOW_ALL = False
CORS_ORIGIN_WHITELIST = ("http://localhost:8000",)

DATABASES = {
    "default": config("DATABASE_URL", cast=db_url),
}

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "webpack_loader",
    "js_routes",
    "import_export",
    "rest_framework",
    "common",
    "users",
    "health_check",  # required
    "health_check.db",  # stock Django health checkers
    "health_check.cache",
    "health_check.storage",
    "health_check.contrib.migrations",
    "health_check.contrib.celery",  # requires celery
    "health_check.contrib.celery_ping",  # requires celery
    "health_check.contrib.psutil",  # disk and memory utilization; requires psutil
    "health_check.contrib.redis",  # requires Redis broker
    "rest_framework_simplejwt",
    "drf_spectacular",
    "django_filters",
    "corsheaders",
    "bcrypt",
    "simple_history",
]

MIDDLEWARE = [
    "debreach.middleware.RandomCommentMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    "simple_history.middleware.HistoryRequestMiddleware",
]

ROOT_URLCONF = "siscme.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [base_dir_join("templates")],
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
                "common.context_processors.sentry_dsn",
                "common.context_processors.commit_sha",
            ],
            "loaders": [
                (
                    "django.template.loaders.cached.Loader",
                    [
                        "django.template.loaders.filesystem.Loader",
                        "django.template.loaders.app_directories.Loader",
                    ],
                ),
            ],
        },
    },
]

WSGI_APPLICATION = "siscme.wsgi.application"

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]

REST_FRAMEWORK = {
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.PageNumberPagination",
    "PAGE_SIZE": 10,
    "MAX_PAGE_SIZE": 100,
    "DEFAULT_FILTER_BACKENDS": [
        "rest_framework.filters.SearchFilter",
        "django_filters.rest_framework.DjangoFilterBackend",
    ],
    "DEFAULT_SCHEMA_CLASS": "drf_spectacular.openapi.AutoSchema",
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework.authentication.SessionAuthentication",
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ],
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.IsAuthenticated",
    ],
    "EXCEPTION_HANDLER": "common.handlers.exception_handler",
}
# 'JWT_VERIFY_EXPIRATION': False,  # desabilita a verificação de expiração
SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=99999),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=1),
    "BLACKLIST_AFTER_ROTATION": False,
    "SIGNING_KEY": os.environ.get("SECRET_KEY_JWT", "INSECURE"),
    "AUTH_HEADER_TYPES": ("Bearer",),
}


SWAGGER_MODE = "default"  # "default","api_externa"


SPECTACULAR_SETTINGS = {
    "TITLE": "SISCME API",
    "DESCRIPTION": "Sistema de Gestão de Central de Material e Esterilização",
    "VERSION": "1.0.0",
    "SERVE_INCLUDE_SCHEMA": False,
    "COMPONENT_SPLIT_REQUEST": True,
    "PREPROCESSING_HOOKS": ["common.decorators.preprocessing_filter_spec"],
    # OTHER SETTINGS
}

LANGUAGE_CODE = "pt-br"

TIME_ZONE = "America/Manaus"

USE_I18N = True

USE_TZ = True

STATICFILES_DIRS = (
    base_dir_join("../frontend"),
)  # os.path.join(BASE_DIR, 'static'), )

# Webpack
WEBPACK_LOADER = {
    "DEFAULT": {
        "CACHE": False,  # on DEBUG should be False
        "STATS_FILE": base_dir_join("../webpack-stats.json"),
        "POLL_INTERVAL": 0.1,
        "IGNORE": [".+\.hot-update.js", ".+\.map"],
    }
}

# Celery
CELERY_ACCEPT_CONTENT = ["json"]
CELERY_TASK_SERIALIZER = "json"
CELERY_RESULT_SERIALIZER = "json"
CELERY_ACKS_LATE = True
CELERY_TIMEZONE = TIME_ZONE

# Sentry
SENTRY_DSN = config("SENTRY_DSN", default="")
COMMIT_SHA = config("HEROKU_SLUG_COMMIT", default="")

# Fix for Safari 12 compatibility issues, please check:
# https://github.com/vintasoftware/safari-samesite-cookie-issue
CSRF_COOKIE_SAMESITE = None
SESSION_COOKIE_SAMESITE = None

# Default primary key field type
# https://docs.djangoproject.com/en/3.2/ref/settings/#default-auto-field
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

HEALTH_CHECK = {
    "DISK_USAGE_MAX": 90,
    "MEMORY_MIN": 500,  # Min available MB
}

REDIS_URL = config("REDIS_URL", default="redis://localhost:6379/0")
