import requests
from bs4 import BeautifulSoup
import re
import pandas as pd
import codecs
import json
import base64
from PIL import Image
from io import BytesIO

NAME_CLEANING = {
    # 2019 legislature w/ late-term replacements
    'Kim Abbott': 'Kim Abbott',
    'Fred Anderson': 'Fred Anderson',
    'Duane Ankney': 'Duane Ankney',
    'JACOB BACHMEIER': 'Jacob Bachmeier',
    'JADE BAHR': 'Jade Bahr',
    'NANCY BALLANCE': 'Nancy Ballance',
    'DICK BARRETT': 'Dick Barrett',
    'Dan Bartel': 'Dan Bartel',
    'Becky Beard': 'Becky Beard',
    'David Bedey': 'David Bedey',
    'Bryce Bennett': 'Bryce Bennett',
    'Seth Berglee': 'Seth Berglee',
    'BARBARA BESSETTE': 'Barbara Bessette',
    'Laurie Bishop': 'Laurie Bishop',
    'Mark Blasdel': 'Mark Blasdel',
    'Kenneth Bogner': 'Kenneth Bogner',
    'Cydnie ': 'Carlie Boland',
    'Larry Brewster': 'Larry Brewster',
    'ZACH BROWN': 'Zach Brown',
    'DEE BROWN': 'Dee Brown',
    'Bob Brown': 'Bob Brown',
    'TOM BURNETT': 'Tom Burnett',
    'Ed Buttrey': 'Ed Buttrey',
    'Mary Caferro': 'Mary Caferro',
    'Jill Cohenour': 'Jill Cohenour',
    'Mike Cuffe': 'Mike Cuffe',
    'Willis Curdy': 'Willis Curdy',
    'Geraldine Custer': 'Geraldine Custer',
    'GREG DEVRIES': 'Greg DeVries',
    'ALAN DOANE': 'Alan Doane',
    'Julie Dooling': 'Julie Dooling',
    'KIMBERLY DUDIK': 'Kim Dudik',
    'DAVID DUNN': 'David Dunn',
    'Mary Ann Dunwell': 'Mary Ann Dunwell',
    'Neil Duram': 'Neil Duram',
    'Janet Ellis': 'Janet Ellis',
    'Jason Ellsworth': 'Jason Ellsworth',
    'John Esp': 'John Esp',
    'Robert Farris': 'Robert Farris-Olsen',
    'Dave Fern': 'Dave Fern',
    'JENNIFER FIELDER': 'Jennifer Fielder',
    'Ross Fitzgerald': 'Ross Fitzgerald',
    'Steve Fitzpatrick': 'Steve Fitzpatrick',
    'Frank Fleming': 'Frank Fleming',
    'Pat Flowers': 'Pat Flowers',
    'John Fuller': 'John Fuller',
    'Moffie Funk': 'Moffie Funk',
    'Wylie Galt': 'Wylie Galt',
    'RODNEY GARCIA': 'Rodney Garcia',
    'Frank Garner': 'Frank Garner',
    'Terry Gauthier': 'Terry Gauthier',
    'Bruce ': 'Bruce Gillespie',
    'Carl Glimm': 'Carl Glimm',
    'Sharon Greef': 'Sharon Greef',
    'Jen Gross': 'Jen Gross',
    'BRUCE GRUBBS': 'Bruce Grubbs',
    'Steve Gunderson': 'Steve Gunderson',
    'Jim Hamilton': 'Jim Hamilton',
    'BRADLEY MAXON HAMLETT': 'Bradley Hamlett',
    'Derek Harvey': 'Derek Harvey',
    'Denise Hayman': 'Denise Hayman',
    'Greg Hertz': 'Greg Hertz',
    'Steve Hinebauch': 'Steve Hinebauch',
    'Kenneth Holmlund': 'Kenneth Holmlund',
    'Mike Hopkins': 'Mike Hopkins',
    'Brian Hoven': 'Brian Hoven',
    'David Howard': 'David Howard',
    'Tom Jacobson': 'Tom Jacobson',
    'Llew Jones': 'Llew Jones',
    'Jessica Karjala': 'Jessica Karjala',
    'Doug Kary': 'Doug Kary',
    'Josh Kassmier': 'Josh Kassmier',
    'Jim Keane': 'Jim Keane',
    'Bob Keenan': 'Bob Keenan',
    'Kathy Kelker': 'Kathy Kelker',
    'Connie Keogh': 'Connie Keogh',
    'Emma Kerr': 'Emma Kerr-Carpenter',
    'Casey Knudsen': 'Casey Knudsen',
    'Rhonda Knudsen': 'Rhonda Knudsen',
    'JOEL KRAUTTER': 'Joel Krautter',
    'JASMINE KROTKOV': 'Jasmine Krotkov',
    'Mike Lang': 'Mike Lang',
    'Dennis Lenz': 'Dennis Lenz',
    'Denley Loge': 'Denley Loge',
    'Ryan Lynch': 'Ryan Lynch',
    'MARGARET ': 'Margie MacDonald',
    'SUE MALEK': 'Sue Malek',
    'FORREST MANDEVILLE': 'Forrest Mandeville',
    'Theresa Manzella': 'Theresa Manzella',
    'Marilyn Marler': 'Marilyn Marler',
    'Edie McClafferty': 'Edie McClafferty',
    'NATE MCCONNELL': 'Nate McConnell',
    'Wendy McKamey': 'Wendy McKamey',
    'Mary McNally': 'Mary McNally',
    'Bill Mercer': 'Bill Mercer',
    'Terry Moore': 'Terry Moore',
    'FREDERICK ': 'Eric Moore',
    'Shane Morigeau': 'Shane Morigeau',
    'DALE MORTENSEN': 'Dale Mortensen',
    'Mark Noland': 'Mark Noland',
    'Andrea Olsen': 'Andrea Olsen',
    'ALBERT OLSZEWSKI': 'Albert Olszewski',
    'Ryan Osmundson': 'Ryan Osmundson',
    'RAE PEPPERS': 'Rae Peppers',
    'ZAC PERRY': 'Zac Perry',
    'MIKE PHILLIPS': 'Mike Phillips',
    'GORDON PIERSON': 'Gordon Pierson',
    'JP Pomnichowski': 'JP Pomnichowski',
    'Christopher Pope': 'Chris Pope',
    'DEBO POWERS': 'Debo Powers',
    'Joe Read': 'Joe Read',
    'ALAN REDFIELD': 'Alan Redfield',
    'Matt Regier': 'Matt Regier',
    'Keith Regier': 'Keith Regier',
    'Vince Ricci': 'Vince Ricci',
    'TOM RICHMOND': 'Tom Richmond',
    'Tyson Running Wolf': 'Tyson Running Wolf',
    'MARILYN RYAN': 'Marilyn Ryan',
    'Walt Sales': 'Walt Sales',
    'SCOTT SALES': 'Scott Sales',
    'Dan Salomon': 'Dan Salomon',
    'Diane Sands': 'Diane Sands',
    'CASEY SCHREINER': 'Casey Schreiner',
    'JON SESSO': 'Jon Sesso',
    'RAY SHAW': 'Ray Shaw',
    'Lola Sheldon': 'Lola Sheldon-Galloway',
    'Derek Skees': 'Derek Skees',
    'Jason Small': 'Jason Small',
    'Frank Smith': 'Frank Smith',
    'Cary Smith': 'Cary Smith',
    'BRIDGET SMITH': 'Bridget Smith',
    'Sharon Stewart Peregoy': 'Sharon Stewart Peregoy',
    'Katie Sullivan': 'Katie Sullivan',
    'Mark Sweeney': 'Mark Sweeney',
    'Russ Tempel': 'Russ Tempel',
    'FRED THOMAS': 'Fred Thomas',
    'Brad Tschida': 'Brad Tschida',
    'Barry Usher': 'Barry Usher',
    'Gordon Vance': 'Gordon Vance',
    'Sue Vinton': 'Sue Vinton',
    'GENE VUCKOVICH': 'Gene Vuckovich',
    'Marvin Weatherwax': 'Marvin Weatherwax',
    'ROGER WEBB': 'Roger Webb',
    'PEGGY WEBB': 'Peggy Webb',
    'Susan Webber': 'Susan Webber',
    'Jeff Welborn': 'Jeff Welborn',
    'Tom Welch': 'Tom Welch',
    'KERRY WHITE': 'Kerry White',
    'Jonathan Windy Boy': 'Jonathan Windy Boy',
    'TOM WINTER': 'Tom Winter',
    'TOM WOODS': 'Tom Woods',
    'DANIEL ZOLNIKOV': 'Daniel Zolnikov',
    'Katie Zolnikov': 'Katie Zolnikov',
    'Fiona Nave': 'Fiona Nave',
    
    # New for 20201 legislature
    'Marta Bertoglio': 'Marta Bertoglio',
    'Michele Binkley': 'Michele Binkley',
    'Ellie Boldman': 'Ellie Boldman',
    'Alice Buckley': 'Alice Buckley',
    'Jennifer Carlson': 'Jennifer Carlson',
    'Paul Fielder': 'Paul Fielder',
    'Mike Fox': 'Mike Fox',
    'Tom France': 'Tom France',
    'Gregory Frazer': 'Gregory Frazer',
    'Chris Friedel': 'Chris Friedel',
    'Steven Galloway': 'Steven Galloway',
    'Jane Gillette': 'Jane Gillette',
    'Steve Gist': 'Steve Gist',
    'Donavon Hawk': 'Donavon Hawk',
    'Ed Hill': 'Ed Hill',
    'Jedediah Hinkle': 'Jedediah Hinkle',
    'Caleb Hinkle': 'Caleb Hinkle',
    'Scot Kerns': 'Scot Kerns',
    'Kelly Kortum': 'Kelly Kortum',
    'Brandon Ler': 'Brandon Ler',
    'Marty Malone': 'Marty Malone',
    'Ron Marshall': 'Ron Marshall',
    'Tom McGillvray': 'Tom McGillvray',
    'Braxton Mitchell': 'Braxton Mitchell',
    'Brad Molnar': 'Brad Molnar',
    'Fiona  Nave': 'Fiona  Nave',
    'Sara Novak': 'Sara Novak',
    'Shannon O': "Shannon O'Brien",
    'Jimmy Patelis':  'Jimmy Patelis',
    'Bob Phalen':  'Bob Phalen',
    'Brian Putnam': 'Brian Putnam',
    'Amy Regier': 'Amy Regier',
    "Linda Reksten":  "Linda Reksten",
    "Jerry Schillinger": "Jerry Schillinger",
    "Kerri Seekins": "Kerri Seekins-Crowe",
    "Ed Stafman": "Ed Stafman",
    "Mallerie Stromswold": "Mallerie Stromswold",
    "Danny Tenenbaum":  "Danny Tenenbaum",
    "Mark Thane":  "Mark Thane",
    "Jeremy Trebas": "Jeremy Trebas",
    "Kenneth Walsh": 'Kenneth Walsh',
    'Rynalea Whiteman Pena': 'Rynalea Whiteman Pena',
}

def get_name(page):
    title = page.find('h3').text
    name = re.search(r'(?<=(Sen|Rep)\. )(\w| )+', title).group(0)
    name = name.replace('  ',' ')
#     if name not in NAME_CLEANING.keys():
#         print(f'No Match: "{name}"')
#         return name
    cleaned = NAME_CLEANING[name]
    return cleaned

def get_district(page):
    title = page.find('h3').text
    district = re.search(r'(SD|HD)\w+', title).group(0)
    district = district.replace('SD','SD ').replace('HD','HD ')
    return district

def get_address(page):
    address = page.find(string="Address").parent.text
    address = re.sub(r'\n\s+',' ', address)
    address = re.sub(r'\s+',' ', address)
    address = address.replace('Address ','')
    return address.strip(' ')

def get_city(page):
    address = page.find(string="Address").parent.text
    city = re.search(r'(?<=\n)(\w| )+(?=, MT)', address).group(0)
    return city.strip().title()

def get_sessions_served(page):
    table = page.find('strong', string='Legislative Service').parent.findNext('p')
    try:
        house_text = re.search('(?<=House:)\s+(.|\n)+?(?=<br/>|</p>)', str(table)).group(0)
    except AttributeError:
        house_text = ''
    house_session_links = BeautifulSoup(house_text, 'html.parser')

    try:
        senate_text = re.search('(?<=Senate:)\s+(.|\n)+?(?=<br/>|</p>)', str(table)).group(0)
    except AttributeError:
        senate_text = ''
    senate_session_links = BeautifulSoup(senate_text, 'html.parser')

    sessions = []
    for link in house_session_links.find_all(True):
        sessions.append({
            'year': link.text ,
            'url': f'https://leg.mt.gov/{link["href"]}',
            'chamber': 'house',
        })
    for link in senate_session_links.find_all(True):
        sessions.append({
            'year': link.text ,
            'url': f'https://leg.mt.gov/{link["href"]}',
            'chamber': 'senate',
        })
    return sessions

def get_committees(page_soup):
    assignment_table = page_soup.find(id='committeeAssignmentTable').find('tbody')
    rows = assignment_table.find_all('tr')
    
    committees = []
    for row in rows:
        cols = row.find_all('td')
        committee = re.search(r'\((S|H|J)\).+', cols[0].text).group(0).replace('(S)','Senate').replace('(H)', 'House').replace('(J)', 'Joint')
        role = re.search(r'(Member|Chair|Vice Chair|Majority Vice Chair|Minority Vice Chair|NULL)', cols[1].text).group(0).replace('NULL','Member')
        committees.append({
            'committee': committee,
            'role': role,
        })
    return committees

def download_portrait(page, path):
    portrait = page.find('img')
    src = portrait['src'].split(',')[1]
    im = Image.open(BytesIO(base64.b64decode(src)))
    im.save(path, 'PNG')
    print('--Image written to', path)
    
    
def get_roster(file):
    # Fetch list of names
    # HTML downloaded from https://leg.mt.gov/legislator-information/

    roster_html = codecs.open(file,'r').read()
    roster_soup = BeautifulSoup(roster_html, 'html.parser')
    rows = list(roster_soup.find('table', id='reports-table').find_all('tr'))
    headers = rows[0]
    rows = rows[1:]
    roster = []
    for row in rows:
        url = row.find('td', {"class":'nameCell'}).find('a')['href']
        name_text = row.find('td', {"class":'nameCell'}).text.strip().replace('\n                       ','').split(' \n                    \n')
        if len(name_text) > 1: note = name_text[1]
        else: note = ''
        #     email_url = row.find('td', {"class":'emailCell'}).find('a')['href']

        roster.append({
            'name': name_text[0],
            'party': row.find('td', {"class":'partyCell'}).text.strip().replace('\n                       ',''),
            'district': row.find('td', {"class":'seatCell'}).text.strip().replace('\n                    ',' '),
    #         'email': email_url,
            'phone': row.find('td', {"class":'phoneCell'}).text.strip().replace('\n                    ',', '),
            'url': f'https://leg.mt.gov/{url}',
            'note': note,
        })
    return roster
    

def get_lawmaker(lawmaker, fetch_portraits=True):
    print('Fetching', lawmaker['name'], lawmaker['url'])
    session = requests.Session()
    r = session.get(lawmaker['url'])
    page = BeautifulSoup(r.text, 'html.parser')
    
    name = get_name(page)
    key = name.replace(' ','-')
    image_path = f'images/{key}-{year}.png'
    
    download_portrait(page, image_path) # Slow
    
    results = {
        'name': name,
        'district': get_district(page),
        'party': lawmaker['party'],
        'address': get_address(page),
        'city': get_city(page),
        'sessions': get_sessions_served(page),
        'committees_19': get_committees(page),
        'note': lawmaker['note'],
        'image_path': image_path,
        'source': lawmaker['url'],
    }
    return results


def main():
    roster = get_roster('raw/web-roster-2021.html')
    year = '2021'
    details = []
    for lawmaker in roster:
        # Temporary fix — skip Kathy Whitman w/ broken page
        if lawmaker['url'] != 'https://leg.mt.gov//legislator-information/roster/individual/6929':
            results = get_lawmaker(lawmaker)
            details.append(results)

    with open('process/lawmakers.json', 'w') as f:
        stringed = json.dumps(details, indent=4)
        f.write(stringed)
        print('File written')
        
main()