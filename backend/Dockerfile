# Use an official Python image as the base image
FROM python:3.9-alpine

# Set the working directory
WORKDIR /backend

# Copy the requirements.txt file to the container
COPY backend/requirements.txt ./

# Install the dependencies for the Python application
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the code for the Python application
COPY backend/ .

# Set up a command to run the Gunicorn server
CMD ["gunicorn", "app:app", "-b", "0.0.0.0:5000"]