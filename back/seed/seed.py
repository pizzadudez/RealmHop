import os
import json
import sqlite3

dirname = os.path.dirname(__file__)
REALMS = os.path.join(dirname, 'output/merged_realms.json')
# HOP_DB = os.path.join(dirname, 'input/char_db.db')
HOP_DB = r'D:\_Repos\_wow\char_db\dependencies\char_db.db'
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


def shards_from_char_db():
    """Translate char_db hoppers into shards (realm + zone combo)"""

    conn = sqlite3.connect(HOP_DB)
    c = conn.cursor()
    c.execute('SELECT DISTINCT type FROM char_db WHERE account=10 AND role="hopper"')
    zones = [x[0] for x in c.fetchall()]
    c.execute('SELECT realm, type FROM char_db WHERE account=10 AND role="hopper"')
    shards = [{'realm': x[0], 'zone': x[1]} for x in c.fetchall()]
    conn.close()

    conn = sqlite3.connect(DB)
    c = conn.cursor()
    # Add zones
    for zone in zones:
        c.execute('INSERT OR IGNORE INTO zones (name) VALUES (?)', (zone, ))

    c.execute('UPDATE shards SET inactive=1')
    for shard in shards:
        c.execute("""UPDATE shards SET inactive=0 WHERE
            realm_id = (SELECT id FROM realms WHERE name=?)
            AND zone_id = (SELECT id FROM zones WHERE name=?)""",
                  (shard['realm'], shard['zone']))
        c.execute("""INSERT OR IGNORE INTO shards (realm_id, zone_id)
            SELECT r.id, z.id  FROM
            (SELECT id FROM realms WHERE name=?) as r CROSS JOIN
            (SELECT id FROM zones WHERE name=?) as z""", (shard['realm'], shard['zone']))

    conn.commit()
    conn.close()


if __name__ == '__main__':
    # seed_realms()
    shards_from_char_db()
