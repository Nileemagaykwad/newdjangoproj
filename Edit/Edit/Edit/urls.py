"""
Definition of urls for Edit_bhb.
"""

from datetime import datetime
from django.conf.urls import url
# import django.contrib.auth.views

import app.forms
import app.views
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import views as auth_views

# Uncomment the next lines to enable the admin:
# from django.conf.urls import include
from django.contrib import admin

# admin.autodiscover()

urlpatterns = [
    # Examples:

    url(r'^home$', app.views.home, name='home'),
    url(r'^save_session$', app.views.save_session, name='save_session'),
    url(r'^contact$', app.views.contact, name='contact'),
    url(r'^annotation$', csrf_exempt(app.views.annotation), name='annotation_index'),
    url(r'^csvread/', app.views.csvread, name='annotation_csvread'),
    url(r'^jsonread/(?P<fname>\w+)/$', app.views.jsonread, name='annotation_filters'),
    url(r'^v3_annotation_columns$', app.views.v3_annotation_columns, name='v3_annotation'),
    url(r'^v4_annotation_columns$', app.views.v4_annotation_columns, name='v4_annotation'),
    url(r'^phenotype$', app.views.phenotype_columns, name='phenotype'),#phenotype
    url(r'^admin/', admin.site.urls),
    # url(r'^$',
    #     django.contrib.auth.views.login,
    #     {
    #         'template_name': 'app/login.html',
    #         'authentication_form': app.forms.BootstrapAuthenticationForm,
    #         'extra_context':
    #             {
    #                 'title': 'Log in',
    #                 'year': datetime.now().year,
    #             }
    #     },
    #     name='login'),

    url(r'^$', auth_views.login, {'template_name': 'app/login.html'}, name='login'),

    # url(r'^logout$',
    #     django.contrib.auth.views.logout,
    #     {
    #         'next_page': '/',
    #     },
    #     name='logout'),

]
