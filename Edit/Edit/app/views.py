"""
Definition of views.
"""

from django.shortcuts import render
from django.http import HttpRequest
from django.http import JsonResponse
from datetime import datetime
from rest_framework import status
import os
import pandas as pd
import json
from django.views.decorators.csrf import csrf_exempt
from app.utils import filter_table

from django.contrib.auth.decorators import login_required

@login_required
def home(request):
    """Renders the home page."""
    print ("caleed")
    assert isinstance(request, HttpRequest)
    return render(
        request,
        'app/index.html',
        {
            'title': 'Home Page',
            'year': datetime.now().year,
        }
    )


# save_session view
@csrf_exempt
def save_session(request):
    """Renders the home page."""
    assert isinstance(request, HttpRequest)
    session_arr = []
    # selected annotation columns
    annotation_session = request.POST.get('selected_annotation_columns', '')
    if annotation_session != '':
        session_arr = json.loads(annotation_session)
    # selected phenotype columns
    phenotype_session = request.POST.get('selected_phenotype_columns', '')
    if phenotype_session != '':
        session_arr = session_arr + json.loads(phenotype_session)  # added into session_arr

    request.session['selected_column_list'] = session_arr
    request.session.modified = True

    return JsonResponse({'success': json.dumps(session_arr)})  # list to json


# contact view
def contact(request):
    """Renders the contact page."""
    assert isinstance(request, HttpRequest)
    return render(
        request,
        'app/contact.html',
        {
            'title': 'Contact',
            'message': 'Your contact page.',
            'year': datetime.now().year,
        }
    )


# annotation view for csv read file
@csrf_exempt
def annotation(request):
    """Renders the annotation page."""
    column_list = []

    column_list = []
    if 'selected_column_list' in request.session:
        column_list = request.session['selected_column_list']

    return render(
        request,
        'app/annotation.html',
        {
            'title': 'Annotation',
            'message': 'Edit Annotation page.',
            'year': datetime.now().year,
            'column_list': json.dumps(column_list),
        }
    )


# view  for csv_read file
def csvread(request):
    gridresponse = {
        'total': 0,
        'records': []
    }

    column_list = []
    if 'selected_column_list' in request.session:
        column_list = request.session['selected_column_list']

    datastore = json.loads(filter_table(phenotypes=column_list))

    gridresponse = {
        'total': len(datastore),
        'records': datastore
    }
    return JsonResponse(gridresponse)


# view for v3_annotation
def v3_annotation_columns(request):
    data = dict()
    my_path = os.path.split(os.path.realpath(__file__))[0]
    file_path = os.path.join(my_path, "..", "files", "v3_annotation.json")

    with open(file_path) as data_file:
        data = json.load(data_file)

    tmp = []

    num = 0
    for item in data['records']:
        entry = {}
        entry = item
        entry['recid'] = num
        tmp.append(entry)
        num = num + 1

    gridresponse = {
        'total': data['total'],
        'records': tmp
    }

    return JsonResponse(gridresponse)


# view for v4_annotation
def v4_annotation_columns(request):
    data = dict()
    my_path = os.path.split(os.path.realpath(__file__))[0]
    file_path = os.path.join(my_path, "..", "files", "v4_annotation.json")

    with open(file_path) as data_file:
        data = json.load(data_file)

    tmp = []

    num = 0
    for item in data['records']:
        entry = {}
        entry = item
        entry['recid'] = num
        tmp.append(entry)
        num = num + 1

    gridresponse = {
        'total': data['total'],
        'records': tmp
    }

    return JsonResponse(gridresponse)


# view for phenotype(s)

def phenotype_columns(request):
    data = dict()
    my_path = os.path.split(os.path.realpath(__file__))[0]
    file_path = os.path.join(my_path, "..", "files", "phenotypes.json")

    with open(file_path) as data_file:
        data = json.load(data_file)

    tmp = []

    num = 0
    for item in data['records']:
        entry = {}
        entry = item
        entry['recid'] = num
        tmp.append(entry)
        num = num + 1

    render_data = {'total': data['total'], 'records': tmp}

    gridresponse = {
        'total': data['total'],
        'records': tmp
    }

    return JsonResponse(gridresponse)


# view for jsonread file
def jsonread(request, fname):
    data = dict()
    file_path = os.getcwd() + '/files/' + fname + '.json'

    with open(file_path) as data_file:
        data = json.load(data_file)

    tmp = []

    num = 0
    for item in data['records']:
        entry = {}
        entry = item
        entry['recid'] = num
        tmp.append(entry)
        num = num + 1

    render_data = {'total': data['total'], 'records': tmp}

    return JsonResponse(render_data)
