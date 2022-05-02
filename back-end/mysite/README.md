# Fresgo Back-end setup guide
The process for setting up the back-end locally is much simpler than the front-end process, though keep in mind, you must update the api_networking.js file in the mobile app to reflect the IP address which this solution runs on.

# Windows
Install `virtualenv` using `pip install virtualenv`
Create your virtual environment using: `python -m virtualenv .venv` or `virtualenv --python C:\Path\To\Python\python.exe .venv`

Enter the virtual environment using: `.venv/Scripts/activate`
- Install all dependencies using: `pip install -r requirements.txt`
- Install any other libraries you need inside the virtual environment using `pip install`
- Update requirements list using `pip3 freeze > requirements.txt`

You can then simply run the manage.py file using Django in order to run the server.

Once you are done developing, you can exit the environment using: `deactivate` 