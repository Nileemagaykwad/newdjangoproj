"""
WSGI config for Edit_bhb project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/2.0/howto/deployment/wsgi/
"""
import os, sys
from django.core.wsgi import get_wsgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "Edit.settings")
sys.path.append('/opt/bitnami/apps/django/django_projects/edit-annotation/Edit/Edit')
os.environ.setdefault("PYTHON_EGG_CACHE", "/opt/bitnami/apps/django/django_projects/edit-annotation/Edit/Edit/egg_cache")

application = get_wsgi_application()
