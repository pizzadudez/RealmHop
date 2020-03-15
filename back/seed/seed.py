import os
import json
import sqlite3

dirname = os.path.dirname(__file__)
REALMS = os.path.join(dirname, 'output/merged_realms.json')
HOP_DB = os.path.join(dirname, 'input/char_db.db')
DB = os.path.join(dirname, '..', 'db.sqlite3')


def seed_realms():
    conn = sqlite3.connect(DB)
    c = conn.cursor()
    with open(REALMS, 'r', encoding='utf-8') as f:
        realms = json.loads(f.read())

    for realm in realms:
        data = (
            realm['realm'],
            ', '.join(realm['realms']) if len(realm['realms']) else None,
            realm['region'],
            realm['pop'],
            realm['rp']
        )
        c.execute("""INSERT OR IGNORE INTO realms (
            name, merged_realms, region, population, roleplay)
            VALUES (?, ?, ?, ?, ?)""", data)

    conn.commit()
    conn.close()


def seed_shards():
    conn = sqlite3.connect(HOP_DB)
    c = conn.cursor()
    c.execute('SELECT realm FROM char_db WHERE role="hopper" AND account=10')
    realms = [x[0] for x in c.fetchall()]
    conn.close()

    conn = sqlite3.connect(DB)
    c = conn.cursor()
    c.execute('INSERT OR IGNORE INTO zones (name) VALUES (?)', ('nazjatar', ))

    c.execute('UPDATE shards SET inactive=1')
    for realm in realms:
        c.execute("""UPDATE shards SET inactive=0 WHERE
            zone_id = (SELECT id FROM zones WHERE name=?)
            AND realm_id = (SELECT id FROM realms WHERE name=?)""",
                  ('nazjatar', realm))
        c.execute("""INSERT OR IGNORE INTO shards (zone_id, realm_id)
            SELECT z.id, r.id FROM
            (SELECT id FROM zones WHERE name=?) as z CROSS JOIN
            (SELECT id FROM realms WHERE name=?) as r""", ('nazjatar', realm))

    conn.commit()
    conn.close()


if __name__ == '__main__':
    # seed_realms()
    seed_shards()
