# --- GENERA SLUG --- #

import re
import unicodedata

def generate_slug(title: str) -> str:
    title = str(title)

    # Normalizza i caratteri speciali (es. rimuove accenti)
    title = unicodedata.normalize('NFKD', title).encode('ascii', 'ignore').decode('utf-8')
    
    # Sostituisce caratteri non alfanumerici con uno spazio
    title = re.sub(r'[^\w\s-]', '', title)
    
    # Sostituisce spazi e underscore con un trattino
    title = re.sub(r'[\s_]+', '-', title)
    
    # Converte tutto in minuscolo e rimuove eventuali trattini iniziali/finali
    return title.lower().strip('-')


# --- CREA CARTELLA PROGETTI --- #

import os
import pandas as pd


# 📂 Percorso del file CSV e della cartella di output
CSV_FILE = "projects.csv"
OUTPUT_DIR = "src/content/"

# 📁 Crea la cartella di output se non esiste
os.makedirs(OUTPUT_DIR, exist_ok=True)

# 📖 Legge il CSV
df = pd.read_csv(CSV_FILE, sep=";", encoding="latin1")  # Oppure prova encoding="utf-8"

# 🔄 Converte ogni riga in un file .md
for _, row in df.iterrows():
    # Gestisce i NaN per 'global_id' e 'category_id' e li converte in interi
    project_id = int(row["id"]) if pd.notna(row["id"]) else 0  # Fallback a 0 se NaN
   # category_id = int(row["category_id"]) if pd.notna(row["category_id"]) else 0  # Fallback a 0 se NaN
    folder_dir = f"{OUTPUT_DIR}/{row["category"]}/FDV_{row["category"]}_{project_id}/"
    os.makedirs(folder_dir, exist_ok=True)
    os.makedirs(f"{folder_dir}/img/", exist_ok=True) # crea directory immagini

    filename = f"{folder_dir}/FDV_{row["category"]}_{project_id}.md"

    # 📄 Struttura del Markdown con frontmatter YAML
    # Gestione del campo 'team' come array
    team_list = row["team"].split(',') if pd.notna(row["team"]) else []
    team_array = ', '.join([f'"{member.strip()}"' for member in team_list])

    # Gestione del campo 'faculty' come array
    faculty_list = row["faculty"].split(',') if pd.notna(row["faculty"]) else []
    faculty_array = ', '.join([f'"{member.strip()}"' for member in faculty_list])

    # Contenuto del file Markdown
    content = f"""---
category: {row["category"]}
id: {project_id}
slug: {generate_slug(row["title"])}
title: "{row["title"]}"
subtitle: "{row["subtitle"]}"
project_website: "{row["project_website"]}"
degree: "{row["degree"]}"
course: "{row["course"]}"
ay: "{row["ay"]}"
team: [{team_array}]
faculty: [{faculty_array}]
university: "{row["university"]}"
department: "{row["department"]}"
city: "{row["city"]}"
state: "{row["state"]}"
school_website: "{row["school_website"]}"
school_instagram: "{row["school_instagram"]}"
---

{row["description"]}
"""
    # ✍️ Scrive il file
    with open(filename, "w", encoding="utf-8") as f:
        f.write(content)

print(f"✅ Conversione completata! {len(df)} file creati in {OUTPUT_DIR}")
