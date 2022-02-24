#! /usr/bin/env python3

import data_mod
import get_data

from datetime import date
import os
import shutil

dir_path = os.path.dirname(os.path.abspath(__file__))
dir_dat = os.path.join(dir_path, '../dat/')

print("downloading data...")
get_data.get_data(dir_dat)
print("done")

print("processing data...")
data_mod.data_mod(dir_dat)
print("done")
#### backup

today = str(date.today())


backup_fold = os.path.join(dir_dat,f'backup/{today}')

if not(os.path.isdir(backup_fold)):
    print("copying backup files...")
    os.mkdir(backup_fold)
    shutil.copytree(os.path.join(dir_dat,'country_data'), os.path.join(backup_fold,"country_data"))
    shutil.copy(os.path.join(dir_dat,'population.csv'), os.path.join(backup_fold,'population.csv'))
    shutil.copy(os.path.join(dir_dat,'countries.csv'), os.path.join(backup_fold,'countries.csv'))
    shutil.copy(os.path.join(dir_dat,'global_dates.csv'), os.path.join(backup_fold,'global_dates.csv'))
    print("done")

