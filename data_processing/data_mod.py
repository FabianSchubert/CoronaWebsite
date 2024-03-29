#! /usr/bin/env python3

import numpy as np
import pandas as pd
import os

def data_mod(datafold="../dat"):

    eu27 = [
    "Austria",
    "Belgium",
    "Bulgaria",
    "Croatia",
    "Cyprus",
    "Czechia",
    "Denmark",
    "Estonia",
    "Finland",
    "France",
    "Germany",
    "Greece",
    "Hungary",
    "Ireland",
    "Italy",
    "Latvia",
    "Lithuania",
    "Luxembourg",
    "Malta",
    "Netherlands",
    "Poland",
    "Portugal",
    "Romania",
    "Slovakia",
    "Slovenia",
    "Spain",
    "Sweden"
    ]

    eu19 = [
    "Belgium",
    "Germany",
    "Estonia",
    "Finland",
    "France",
    "Greece",
    "Ireland",
    "Italy",
    "Latvia",
    "Lithuania",
    "Luxembourg",
    "Malta",
    "Netherlands",
    "Austria",
    "Portugal",
    "Slovakia",
    "Slovenia",
    "Spain",
    "Cyprus"
    ]


    ignore_list = ["Europe","European Union",
                    "High income","International",
                    "Lower middle income","Low income",
                    "Upper middle income"]

    dfraw = pd.read_csv(os.path.join(datafold,"owid.csv"))

    countries = dfraw["location"].unique().tolist()

    for ign in ignore_list:
        countries.remove(ign)

    with open(os.path.join(datafold,"countries.csv"),"w") as f:
        for d in countries:
            f.write(f'{d},')

    first_date = dfraw["date"].min()
    last_date = dfraw["date"].max()

    global_dates = pd.date_range(first_date,last_date)

    global_dates_str = global_dates.strftime("%Y-%m-%d").tolist()

    with open(os.path.join(datafold,"global_dates.csv"),"w") as f:
        for d in global_dates_str[:-1]:
            f.write(f'{d},')
        f.write(global_dates_str[-1])

    dfred = pd.concat([dfraw["location"],dfraw["date"],
        dfraw["total_cases"],dfraw["total_deaths"],
        dfraw["people_fully_vaccinated"]],axis=1)

    datay = dfred.columns[2:].tolist()

    population = []

    dfeu27 = pd.DataFrame(0, index=np.arange(len(global_dates)), columns=["total_cases","total_deaths","people_fully_vaccinated"])

    dfeu19 = pd.DataFrame(0, index=np.arange(len(global_dates)), columns=["total_cases","total_deaths","people_fully_vaccinated"])

    popeu27 = 0
    popeu19 = 0

    for country in countries:
        
        dfinst = dfred.loc[dfred["location"]==country]

        population.append(dfraw.loc[dfraw["location"]==country]["population"].unique()[0])

        dfproto = pd.DataFrame(columns=dfinst.columns[1:])

        dfproto["date"] = global_dates

        dfproto.total_cases = pd.to_numeric(dfproto.total_cases)
        dfproto.total_deaths = pd.to_numeric(dfproto.total_deaths)
        dfproto.people_fully_vaccinated = pd.to_numeric(dfproto.people_fully_vaccinated)

        row_selector = dfproto.date.isin(dfinst.date)

        dfproto.loc[row_selector,"total_cases"] = dfinst["total_cases"].tolist()
        dfproto.loc[row_selector,"total_deaths"] = dfinst["total_deaths"].tolist()
        dfproto.loc[row_selector,"people_fully_vaccinated"] = dfinst["people_fully_vaccinated"].tolist()

        #linear interpolation
        dfproto.loc[:,datay] = dfproto[datay].interpolate()

        dfcountry = dfproto.fillna(0)

        dfcountry = dfcountry.drop("date",axis="columns")

        dfcountry.to_csv(os.path.join(datafold,f"country_data/{country}.csv"),index=False)

        if country in eu27:
            dfeu27 = dfcountry.add(dfeu27)
            popeu27 += population[-1]
        if country in eu19:
            dfeu19 = dfcountry.add(dfeu19)
            popeu19 += population[-1]


    with open(os.path.join(datafold,"population.csv"),"w") as f:
        for d in population:
            f.write(f'{d},')


    ################## US States #############################


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
        "Palau": "PW"
    }

    us_states_remove = ["Diamond Princess", "Grand Princess"]
    abbr_us_states_remove = ['BP2', 'DD2', 'FM', 'IH2', 'LTC', 'MH', 'RP', 'US', 'VA2','PW']

    abbrev_to_us_state = {v: k for k, v in us_state_to_abbrev.items()}

    dfus_cases = pd.read_csv(os.path.join(datafold,"us_states_cases.csv"))
    dfus_deaths = pd.read_csv(os.path.join(datafold,"us_states_deaths.csv"))
    dfus_vacc = pd.read_csv(os.path.join(datafold,"us_states_vaccines.csv"))

    # aggregate over districts
    dfus_cases = dfus_cases.groupby(["Province_State"]).agg('sum')
    dfus_deaths = dfus_deaths.groupby(["Province_State"]).agg('sum')

    dfus_cases.drop(us_states_remove,axis=0,inplace=True)
    dfus_deaths.drop(us_states_remove,axis=0,inplace=True)

    dfus_vacc = dfus_vacc[~dfus_vacc.Location.isin(abbr_us_states_remove)]

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

    global_dates = pd.to_datetime(pd.read_csv(os.path.join(datafold,"global_dates.csv"),header=None).transpose()[0].tolist())

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

        dfstate = dfproto.drop("date",axis="columns")

        dfstate.to_csv(os.path.join(datafold,f"country_data/{state} (US State).csv"),index=False)

    with open(os.path.join(datafold,"countries.csv"),"a") as f:
        for d in states:
            f.write(f'{d} (US State),')

    with open(os.path.join(datafold,"population.csv"),"a") as f:
        for d in population:
            f.write(f'{d},')

    ##################### save eu data #######################

    with open(os.path.join(datafold,"countries.csv"),"a") as f:
        f.write('EU 27,')
        f.write('EU 19')

    with open(os.path.join(datafold,"population.csv"),"a") as f:
        f.write(f'{popeu27},')
        f.write(f'{popeu19}')

    dfeu27.to_csv(os.path.join(datafold,"country_data/EU 27.csv"),index=False)

    dfeu19.to_csv(os.path.join(datafold,"country_data/EU 19.csv"),index=False)


if __name__ == "__main__":
    data_mod()