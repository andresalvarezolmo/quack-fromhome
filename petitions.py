# importing libraries
import requests
import json
import numpy as np
import matplotlib.pyplot as plt
import tkinter
import sys

#requests

r_c = requests.get('https://api.covid19api.com/countries')
countries = r_c.json()

#Country finder

root = tkinter.Tk()

def get_me():
    country = tkinter.simpledialog.askstring('input string', 'Please input country: ')

    for i in range(0,len(countries)-1):
        if countries[i]['Country'] == country or countries[i]['Slug'] == country.lower():
            country_link = 'https://api.covid19api.com/country/{}?from=2020-03-01T00:00:00Z&to=2020-08-07T00:00:00Z'.format(countries[i]['Slug'])
            country1 = countries[i]['Country']
            break
    else:
        print("Country doesn't exist")

    #Getting the information into a usable format

    r2 = requests.get(country_link)
    historical_data = r2.json()

    hist_data_vals = []
    for i in historical_data:
        h = list(i.values())
        hist_data_vals.append(h)

    hist_data_vals_int = []
    for i in range(0,len(hist_data_vals)-1):
        hi = int(hist_data_vals[i][10])
        hist_data_vals_int.append(hi)

    hdv_array = np.array(hist_data_vals_int)

    T = np.linspace(0,len(hist_data_vals), len(hist_data_vals)-1) #Time

    #The plot

    fig = plt.figure()
    ax = fig.add_subplot(1, 1, 1)
    ax.set_facecolor('dimgrey')
    fig.set_facecolor('dimgrey')
    ax.spines['bottom'].set_color('white')
    ax.spines['top'].set_color('white')
    ax.spines['left'].set_color('white')
    ax.spines['right'].set_color('white')
    ax.tick_params(axis='x', colors='white')
    ax.tick_params(axis='y', colors='white')
    for label in ax.get_xticklabels():
        label.set_fontproperties('Corbel')

    for label in ax.get_yticklabels():
        label.set_fontproperties('Corbel')
    fig.patch.set_facecolor('dimgray')
    plt.plot(T,hdv_array[:], color = 'lightcyan', linewidth = 3)
    plt.title('Active cases in {}'.format(country1), color = 'white', fontname = 'Corbel Bold', fontsize=20,)
    plt.xlabel('time (in days)', color = 'white', fontname = 'Corbel Bold')
    plt.ylabel('active cases', color = 'white', fontname = 'Corbel Bold')

    plt.show()

button = tkinter.Button(root, text = 'Please input country', command = get_me)
button.pack()

root.geometry('300x300')

root.mainloop()

