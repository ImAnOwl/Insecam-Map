#!/usr/bin/env python
# -*- coding: utf-8 -*-
# This code is orginally from Jonas Leder. Only improved and changed by ImAnOwl/Oliver Czempas.
import requests
from tqdm import tqdm
import os, sys
import ftplib
import MySQLdb

#Variablen:
countries = ["DE", "US", "JP"]
api_key = 'INSERT_YOUR_API_CODE'

mysql_opts = { 
    'host': "MYSQL_IP", 
    'user': "MYSQL_USER", 
    'pass': "MYSQL_PW", 
    'db':   "MYSQL_PW" 
    } 
mysql = MySQLdb.connect(mysql_opts['host'], mysql_opts['user'], mysql_opts['pass'], mysql_opts['db'])
mysql.apilevel = "2.0" 
mysql.threadsafety = 2 
mysql.paramstyle = "format" 
cursor = mysql.cursor()
os.system("cls")
os.system("clear")

for x in countries:
  land = x
  
  url = []
  r = requests.get('http://www.insecam.org/en/bycountry/' + str(land) +'/?page=1', headers={'user-agent': 'mozilla'})
  seiten = r.text.split('pagenavigator("?page=", ')[1].split(",")[0]
  for i in tqdm(range(1, int(seiten) + 1)):
    r = requests.get('http://www.insecam.org/en/bycountry/' + str(land) +'/?page=' + str(i), headers={'user-agent': 'mozilla'})
    for x in range (0, r.text.count('/en/view/')):
      url.append(str(r.text.split('/en/view/')[x+1].split('/"')[0]))

  t = tqdm(range(0, len(url)))
  t.set_description(land)
  for i in t:
    r = requests.get('http://www.insecam.org/en/view/' + url[i], headers={'user-agent': 'mozilla'})
    lat = r.text.split("Latitude:")[1].split('">\n')[1].split("\n<")[0]
    lon = r.text.split("Longitude:")[1].split('">\n')[1].split("\n<")[0]
    city = r.text.split('City:')[1].split('View online network cameras in ')[1].split('"')[0]
    stream = r.text.split('<img id="image0" src="')[1].split('"')[0]
    cursor.execute("INSERT INTO `streams` (`id`, `city`, `country`, `source`, `lat`, `lon`) VALUES (NULL, '" + str(city) + "', '" + str(land) + "', '" + str(stream) + "', '" + str(lat) + "', '" + str(lon) + "');")
    mysql.commit()

print("Rendering completed.")
exit()
