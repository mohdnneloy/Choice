Requirements for working on this Project

# INSTALL Python 3.10.0 on your system.
   - Got to Customized Installation
   - Select all the options in the first window, Click Next
   - Select all except the last two options in the second window, Click Next
   - Complete Installation

// Django Commands ==============================

# Making new Django Project
    - django-admin startproject <projectname>

# Make a new app
    - python manage.py startapp <appname>

# Make Migrations ("Make sure you are on the right directory where the manage.py file is available")
    - python manage.py makemigrations 
    - python manage.py migrate 

# Run Server ("Make sure you are on the right directory where the manage.py file is available")
    - python manage.py runserver

# Make new admin superuser
    - python manage.py createsuperuser

# Creating Requirement.txt file (Use anyone as per your requirement)
    - pip freeze > requirements.txt
    - pip3 freeze > requirements.txt

# Installing Requirement.txt into your venv
    - Activate your venv
    - Go to the directory where you have the "requirement.txt" file
    - pip install -r requirements.txt


// Django Based Dependencies =========================

# Install Django
    - pip install django

# Install Django Rest Framework
    - pip install djangorestframework

# Install Django Cors Header for React Connectivity
    - pip install django-cors-headers
    - If the above command does not work use this - "python -m pip install django-cors-headers"

# Install MySQlClient for Django
    - pip install mysqlclient
    - If the above command does not work use this - "pip install --only-binary :all: mysqlclient"

# Install Djoser with JWT Authentication module
    - pip install -U djoser
    - pip install -U djangorestframework_simplejwt
    - Documentation at -> https://djoser.readthedocs.io/en/latest/getting_started.html

# Install Image uploader for sql
    - pip install Pillow

# Install Face Recognition for Windows
    - Install Anaconda (Make Sure the ADD path option is ticked)
    - pip install cmake
    - pip install dlib
    - pip install face_recognition

# Install Imageb64 to Image
    - pip install drf-extra-fields

# Install Simple Crypt to Encrypt Pivate Key
    - pip install cryptocode

# Install Open CV
    - pip install opencv-python

# Install Deep Face
    - pip install deepface

# Install aiohttp
    - pip install aiohttp


// Django Error Solutions =========================

# Error Solution to "PermissionError: [WinError 5] Access is denied"
    - pip install pydirectory

# Fix For Long Paths
    - Go to Admin PowerSell
    - And Run this command -> New-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\FileSystem" ` -Name "LongPathsEnabled" -Value 1 -PropertyType DWORD -Force
    - https://learn.microsoft.com/en-us/windows/win32/fileio/maximum-file-path-limitation?tabs=powershell#enable-long-paths-in-windows-10-version-1607-and-later



//  React Basics =================================

# Create React App (Only if the project is not created, Here it is already created)
    - npx create-react-app my-app - // Incase of my-app is frontend

# Go inside to your react app directory, here "frontend" and install node modules
    - npm install

# Run React Server
    - npm start


//  React Based Dependencies =================================

# React Router DOM
    - npm install react-router-dom

# Bable Parser
    - npm install --save-dev @babel/parser

# Install Axios for API
    - npm install react-axios

# Install Bootstrap
    - npm install react-bootstrap bootstrap
    - npm install bootstrap@5.2.1

# Install Material UI
    - npm install @mui/material @emotion/react @emotion/styled
    - npm install @mui/icons-material

# Install React Webcam
    - npm install react-webcam

# Install Ant icons
    - npm i @ant-design/icons

# Install AntD
    - npm i antd

# Install Moment for Date formatting
    - npm install moment

# Install Recharts for react charts
    - npm install recharts
    - npm i d3-scale-chromatic

// Virtual Environment Commands ======================

# Creating a Virtual environment "For Linux"
    - pip install virtualenv
    - virtualenv <nameofyourchoice>
    - activate virtual environment -> backenv\Scripts\activate
    - deactivate virtual environment -> backenv\Scripts\deactivate
    - Install node -> pip install nodeenv

# Python Virtual Environment
    - py -m venv <project-name>
    - activate virtual environment -> backenv\Scripts\activate
    - deactivate virtual environment -> backenv\Scripts\deactivate
    - Install all packages using requirements.txt file on another virtual environment -> pip install -r requirements.txt
    - Install node -> pip install nodeenv


// Hardware Drivers

# SecuGen Hamster Plus Driver (For Windows)
	- https://secugen.com/drivers/
	- https://www.dropbox.com/transfer/AAAAALEmiddQ3e9cIdvNsScYBYDhH_akw96TwEKZGDM3fZ07ssnjG0M
	- Test fingerprint scanner: https://www.dropbox.com/transfer/AAAAAPZ1meLZMwZqpLSSg-VbMtiuN0ZivTxsMtTjDRFveRkEaHOY69s