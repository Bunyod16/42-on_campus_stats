# from application import app
# import os

# if __name__ == "__main__":
#     app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))

from application import create_app
import os

app = create_app()  # Create an app using the factory function

if __name__ == "__main__":
    # Extract the port number from the environment variable PORT
    # or default to 5000 if it's not set.
    port = int(os.environ.get("PORT", 5000))
    # Run the app with host set to 0.0.0.0 to make the server
    # externally visible (if it's running on a VPS or Heroku, for example).
    app.run(host="0.0.0.0", port=port)
