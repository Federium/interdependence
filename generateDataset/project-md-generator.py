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
OUTPUT_DIR = "/Users/filippo/Documents/GitHub/interdependence/src/projects"
# OUTPUT_DIR = "src/projects"

# 📁 Crea la cartella di output se non esiste
os.makedirs(OUTPUT_DIR, exist_ok=True)

# 📖 Legge il CSV
df = pd.read_csv(CSV_FILE, delimiter=";", encoding="utf-8", quoting=0, on_bad_lines="skip",escapechar='\\')

# 🔄 Converte ogni riga in un file .md
for _, row in df.iterrows():
    # Gestisce i NaN per 'id' e 'category_id' e li converte in interi
    project_id = int(row["id"]) if pd.notna(row["id"]) else 0  # Fallback a 0 se NaN
    title = row["title"] if pd.notna(row["title"]) else "Untitled"  # Fallback a "Untitled" se NaN
    subtitle = row["subtitle"] if pd.notna(row["subtitle"]) else ""  # Fallback a stringa vuota se NaN
    project_website = row["project_website"] if pd.notna(row["project_website"]) else ""  # Fallback a stringa vuota se NaN
    degree = row["degree"] if pd.notna(row["degree"]) else ""  # Fallback a stringa vuota se NaN
    course = row["course"] if pd.notna(row["course"]) else ""  # Fallback a stringa vuota se NaN
    ay = row["ay"] if pd.notna(row["ay"]) else ""  # Fallback a stringa vuota se NaN
    school = row["school"] if pd.notna(row["school"]) else ""  # Fallback a stringa vuota se NaN
    school_website = row["school_website"] if pd.notna(row["school_website"]) else ""  # Fallback a stringa vuota se NaN
    hasVideo = row["hasVideo"] if pd.notna(row["hasVideo"]) else "false"  # Fallback a "false" se NaN
    videoLink = row["video_link"] if pd.notna(row["video_link"]) else ""  # Fallback a stringa vuota se NaN
    description = row["description"] if pd.notna(row["description"]) else ""  # Fallback a stringa vuota se NaN

    # Gestione del campo 'team' come array
    team_list = row["team"].split(',') if pd.notna(row["team"]) else []
    team_array = ', '.join([f'"{member.strip()}"' for member in team_list])

    # Gestione del campo 'faculty' come array
    faculty_list = row["faculty"].split(',') if pd.notna(row["faculty"]) else []
    faculty_array = ', '.join([f'"{member.strip()}"' for member in faculty_list])

    # Crea la cartella per il progetto
    folder_dir = f"{OUTPUT_DIR}/{row['category']}/FDV_{row['category']}_{project_id}/"
    os.makedirs(folder_dir, exist_ok=True)
    os.makedirs(f"{folder_dir}/img/", exist_ok=True)  # crea directory immagini

    # Crea il nome del file
    filename = f"{folder_dir}/FDV_{row['category']}_{project_id}.md"

    # 📄 Struttura del Markdown con frontmatter YAML
    content = f"""---
category: {row['category']}
id: {project_id}
slug: {generate_slug(title)}
title: "{title}"
subtitle: "{subtitle}"
project_website: "{project_website}"
degree: "{degree}"
course: "{course}"
ay: "{ay}"
team: [{team_array}]
faculty: [{faculty_array}]
school: "{school}"
school_website: "{school_website}"
hasVideo: "{hasVideo}"
videoLink: "{videoLink}"
---

{description}
"""

    # ✍️ Scrive il file
    with open(filename, "w", encoding="utf-8") as f:
        f.write(content)

print(f"✅ Conversione completata! {len(df)} file creati in {OUTPUT_DIR}")
