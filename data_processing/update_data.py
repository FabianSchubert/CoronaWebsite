#! /usr/bin/env python3

import data_mod
import get_data

from datetime import date
import os
import shutil

print("downloading data...")
get_data.get_data()
print("done")

print("processing data...")
data_mod.data_mod()
print("done")
#### backup

today = str(date.today())

backup_fold = f'../dat/backup/{today}'

if not(os.path.isdir(backup_fold)):
    print("copying backup files...")
    os.mkdir(backup_fold)
    shutil.copytree('../dat/country_data', backup_fold+"/country_data")
    shutil.copy('../dat/population.csv', backup_fold+"/population.csv")
    shutil.copy('../dat/countries.csv', backup_fold+"/countries.csv")
    shutil.copy('../dat/global_dates.csv', backup_fold+"/global_dates.csv")
print("done")

