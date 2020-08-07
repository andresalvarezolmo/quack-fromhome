# importing the requests library 
import requests
import json
#api.openweathermap.org/data/2.5/weather?q={city name}&appid={your api key}
URL = "api.openweathermap.org/data/2.5/weather?q="
city = "London"
key = "439d4b804bc8187953eb36d2a8c26a02"
response = requests.get('https://samples.openweathermap.org/data/2.5/weather?q=London,uk&appid=439d4b804bc8187953eb36d2a8c26a02')
jsonResponse = response.json()
print(jsonResponse)
