import os
import json
from bs4 import BeautifulSoup as bs

dirname = os.path.dirname(__file__)
# table from: https://web.archive.org/web/20190810133837/https://realmpop.com/eu.html
REALMPOP = os.path.join(dirname, 'input/realmpop.txt')
# table from: https://worldofwarcraft.com/en-us/game/status/eu
REALMSTATUS = os.path.join(dirname, 'input/realmstatus.txt')
OUTPUT = os.path.join(dirname, 'output/connected_realms.json')


def parse():
    with open(REALMPOP, 'r', encoding='utf-8') as f:
        text = f.read().replace('&nbsp;', ' ')
    soup = bs(text, 'html.parser')
    table = soup.find('tbody')
    rows = [row for row in table.find_all('tr')]

    size_hash = {}
    for row in rows:
        columns = row.find_all('td')

        realm = {}
        realm['realms'] = [columns[0].find('a').text]
        realm['connected'] = True if columns[0].find('abbr') else False
        realm['rp'] = True if columns[1].text == 'RP' else False
        realm['region'] = columns[2].text
        realm['pop_size'] = int(columns[-1].text.replace(' ', ''))

        same_size_realm = size_hash.get(realm['pop_size'], None)
        if same_size_realm and realm['connected']:
            if (realm['rp'], realm['region']) == (same_size_realm['rp'], same_size_realm['region']):
                size_hash[realm['pop_size']]['realms'].append(
                    realm['realms'][0])
        else:
            size_hash[realm['pop_size']] = realm

    realms = []
    for size, group in size_hash.items():
        if len(group['realms']) > 1:
            selected_position = int(input(
                f'parent: {group["realms"]}, (type 1/2/3...):\n'))
            group['realm'] = group['realms'][selected_position-1]
        else:
            group['realm'] = group['realms'][0]
        realms.append(group)

    with open(OUTPUT, 'w', encoding='utf-8') as f:
        f.write(json.dumps(realms, indent=2))


def add_pop():
    with open(REALMSTATUS, 'r', encoding='utf-8') as f:
        text = f.read()
    soup = bs(text, 'html.parser')
    rows = [row for row in soup.find_all('div', {'class': 'Table-row'})]

    realm_pop_status = {}
    for row in rows:
        columns = row.find_all('div')
        realm_pop_status[columns[1].text] = columns[3].text

    with open(OUTPUT, 'r', encoding='utf-8') as f:
        parsed = json.loads(f.read())

    for realm in parsed:
        realm['pop'] = realm_pop_status[realm['realm']]

    with open(OUTPUT, 'w', encoding='utf-8') as f:
        f.write(json.dumps(parsed, indent=2))


if __name__ == '__main__':
    # parse()
    # add_pop()
