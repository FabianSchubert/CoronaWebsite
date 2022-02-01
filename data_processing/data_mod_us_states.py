#! /usr/bin/env python3

import numpy as np
import pandas as pd

us_state_to_abbrev = {
    "Alabama": "AL",
    "Alaska": "AK",
    "Arizona": "AZ",
    "Arkansas": "AR",
    "California": "CA",
    "Colorado": "CO",
    "Connecticut": "CT",
    "Delaware": "DE",
    "Florida": "FL",
    "Georgia": "GA",
    "Hawaii": "HI",
    "Idaho": "ID",
    "Illinois": "IL",
    "Indiana": "IN",
    "Iowa": "IA",
    "Kansas": "KS",
    "Kentucky": "KY",
    "Louisiana": "LA",
    "Maine": "ME",
    "Maryland": "MD",
    "Massachusetts": "MA",
    "Michigan": "MI",
    "Minnesota": "MN",
    "Mississippi": "MS",
    "Missouri": "MO",
    "Montana": "MT",
    "Nebraska": "NE",
    "Nevada": "NV",
    "New Hampshire": "NH",
    "New Jersey": "NJ",
    "New Mexico": "NM",
    "New York": "NY",
    "North Carolina": "NC",
    "North Dakota": "ND",
    "Ohio": "OH",
    "Oklahoma": "OK",
    "Oregon": "OR",
    "Pennsylvania": "PA",
    "Rhode Island": "RI",
    "South Carolina": "SC",
    "South Dakota": "SD",
    "Tennessee": "TN",
    "Texas": "TX",
    "Utah": "UT",
    "Vermont": "VT",
    "Virginia": "VA",
    "Washington": "WA",
    "West Virginia": "WV",
    "Wisconsin": "WI",
    "Wyoming": "WY",
    "District of Columbia": "DC",
    "American Samoa": "AS",
    "Guam": "GU",
    "Northern Mariana Islands": "MP",
    "Puerto Rico": "PR",
    "United States Minor Outlying Islands": "UM",
    "Virgin Islands": "VI",
}

us_states_remove = ["Diamond Princess", "Grand Princess"]
abbr_us_states_remove = ['BP2', 'DD2', 'FM', 'IH2', 'LTC', 'MH', 'RP', 'US', 'VA2']

abbrev_to_us_state = {v: k for k, v in us_state_to_abbrev.items()}

dfus_cases = pd.read_csv("../dat/us_states_cases.csv")
dfus_deaths = pd.read_csv("../dat/us_states_deaths.csv")
dfus_vacc = pd.read_csv("../dat/us_states_vaccines.csv")

# aggregate over districts
dfus_cases = dfus_cases.groupby(["Province_State"]).agg('sum')
dfus_deaths = dfus_deaths.groupby(["Province_State"]).agg('sum')

population = dfus_deaths["Population"].tolist()

dfus_cases = dfus_cases[dfus_cases.columns[5:]]
dfus_deaths = dfus_deaths[dfus_deaths.columns[6:]]

dfus_cases = dfus_cases.transpose()
dfus_deaths = dfus_deaths.transpose()

dfus_cases["Date"] = pd.to_datetime(dfus_cases.index)
dfus_deaths["Date"] = pd.to_datetime(dfus_deaths.index)

dfus_cases.reset_index(drop=True,inplace=True)
dfus_deaths.reset_index(drop=True,inplace=True)

dfus_cases.columns.name = None
dfus_deaths.columns.name = None

dfus_vacc = dfus_vacc[["Date","Location","Series_Complete_Yes"]]
dfus_vacc["Date"] = pd.to_datetime(dfus_vacc["Date"])

dfus_vacc = dfus_vacc.pivot("Date","Location","Series_Complete_Yes")

dfus_vacc["Date"] = dfus_vacc.index
dfus_vacc.reset_index(drop=True,inplace=True)
dfus_vacc.columns.name = None


dfus_cases.fillna(0,inplace=True)
dfus_deaths.fillna(0,inplace=True)
dfus_vacc.fillna(0,inplace=True)

global_dates = pd.to_datetime(pd.read_csv("../dat/global_dates.csv",header=None).transpose()[0].tolist())


dfus_cases.drop(us_states_remove,axis=1,inplace=True)
dfus_deaths.drop(us_states_remove,axis=1,inplace=True)

dfus_vacc.drop(abbr_us_states_remove,axis=1,inplace=True)

dfus_vacc.rename(abbrev_to_us_state,axis=1,inplace=True)

cl = sorted(dfus_cases.columns[:-1])
cl.append(dfus_cases.columns[-1])
dfus_cases = dfus_cases.reindex(cl, axis=1)

cl = sorted(dfus_deaths.columns[:-1])
cl.append(dfus_deaths.columns[-1])
dfus_deaths = dfus_deaths.reindex(cl, axis=1)

cl = sorted(dfus_vacc.columns[:-1])
cl.append(dfus_vacc.columns[-1])
dfus_vacc = dfus_vacc.reindex(cl, axis=1)

states = dfus_vacc.columns[:-1]

dfus_cases.sort_index(inplace=True)
dfus_deaths.sort_index(inplace=True)
dfus_vacc.sort_index(inplace=True)

for state in states:

    dfproto = pd.DataFrame(columns = ['date', 'total_cases', 'total_deaths', 'people_fully_vaccinated'])
    dfproto["date"] = global_dates

    dfproto.sort_index(inplace=True)

    row_selector_cases = dfproto.date.isin(dfus_cases.Date)
    row_selector_deaths = dfproto.date.isin(dfus_deaths.Date)
    row_selector_vacc = dfproto.date.isin(dfus_vacc.Date)

    dfproto.total_cases = pd.to_numeric(dfproto.total_cases)
    dfproto.total_deaths = pd.to_numeric(dfproto.total_deaths)
    dfproto.people_fully_vaccinated = pd.to_numeric(dfproto.people_fully_vaccinated)

    dfproto.loc[row_selector_cases,"total_cases"] = dfus_cases[state].tolist()
    dfproto.loc[row_selector_deaths,"total_deaths"] = dfus_deaths[state].tolist()
    dfproto.loc[row_selector_vacc,"people_fully_vaccinated"] = dfus_vacc[state].tolist()

    dfproto.fillna(0,inplace=True);

    dfcountry = dfproto.drop("date",axis="columns")

    dfcountry.to_csv(f"../dat/country_data/{country}.csv",index=False)

    import pdb
    pdb.set_trace()
'''
nonsense_abbr = []

not_in_cases_abbr = []

for abbr in dfus_vacc.columns[:-1]:
    if not(abbr in abbrev_to_us_state):
        nonsense_abbr.append(abbr)
    elif not(abbrev_to_us_state[abbr] in dfus_cases.columns[:-1]):
        not_in_cases_abbr.append(abbr)

not_in_abbr_states = []
not_found_state = []

for state in dfus_cases.columns[:-1]:
    if not(state in us_state_to_abbrev):
        not_found_state.append(state)
    elif not(us_state_to_abbrev[state] in dfus_vacc.columns[:-1]):
        not_in_abbr_states.append(state)

'''

import pdb
pdb.set_trace()




