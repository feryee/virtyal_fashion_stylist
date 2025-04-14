#open terminal in project directory

# Create a virtual environment (Python 3.3+)
python -m venv venv

# Activate the virtual environment
# On Windows:
venv\Scripts\activate


# On macOS/Linux:
source venv/bin/activate

#install requirements.txt
pip install -r requirements.txt



#makemigrations
python manage.py makemigrations 
python manage.py migrate

#run server
python manage.py runserver


#create superuser
python manage.py createsuperuser