#! /usr/bin/env python3

import requests
import os

def get_data(datafold="../dat"):

    url_owid = "https://covid.ourworldindata.org/data/owid-covid-data.csv"
    url_cdc_vacc_us = "https://data.cdc.gov/api/views/unsk-b7fc/rows.csv?accessType=DOWNLOAD"
    url_johns_hopkins_us_cases = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_US.csv"
    url_johns_hopkins_us_deaths = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_US.csv"

    urls = [url_owid,url_cdc_vacc_us,url_johns_hopkins_us_cases,url_johns_hopkins_us_deaths]

    files = ["owid","us_states_vaccines","us_states_cases","us_states_deaths"]

    for k, url in enumerate(urls):
        try:
            r = requests.get(url)
            with open(os.path.join(datafold,f'{files[k]}.csv'),"wb") as f:
                f.write(r.content)
        except requests.exceptions.RequestException as e:
            raise SystemExit(e)

if __name__ == "__main__":
    get_data()



