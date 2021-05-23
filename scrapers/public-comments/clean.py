import pandas as pd

IN_PATH = 'scrapers/public-comments/04-29-21-public-comments-by-bill.csv'
OUT_PATH = 'scrapers/public-comments/public-comments.json'

raw = pd.read_csv(IN_PATH)


def split_bill_id(t): return t[:2] + ' ' + t[2:]


raw['bill'] = raw['bill'].apply(split_bill_id)

raw.to_json(OUT_PATH, orient='records')
print(f'Written public comment counts for {len(raw)} bills to {OUT_PATH}')
