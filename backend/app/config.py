import os

from dotenv import load_dotenv


load_dotenv()


APP_NAME = os.getenv(
    "APP_NAME",
    "AI Interview Agent"
)

DEBUG = os.getenv(
    "DEBUG",
    "False"
)