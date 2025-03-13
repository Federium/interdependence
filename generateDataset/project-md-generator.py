import os
import pandas as pd

# 📂 Percorso del file CSV e della cartella di output
CSV_FILE = "projects.csv"
OUTPUT_DIR = "src/content/projects/"

# 📁 Crea la cartella di output se non esiste
os.makedirs(OUTPUT_DIR, exist_ok=True)

# 📖 Legge il CSV
df = pd.read_csv(CSV_FILE, sep=";", encoding="latin1")  # Oppure prova encoding="utf-8"

# 🔄 Converte ogni riga in un file .md
for _, row in df.iterrows():
    # Gestisce i NaN per 'global_id' e 'category_id' e li converte in interi
    project_id = int(row["global_id"]) if pd.notna(row["global_id"]) else 0  # Fallback a 0 se NaN
    category_id = int(row["category_id"]) if pd.notna(row["category_id"]) else 0  # Fallback a 0 se NaN
    filename = f"{OUTPUT_DIR}{project_id}.md"

    # 📄 Struttura del Markdown con frontmatter YAML
    # Gestione del campo 'team' come array
    team_list = row["team"].split(',') if pd.notna(row["team"]) else []
    team_array = ', '.join([f'"{member.strip()}"' for member in team_list])

    # Gestione del campo 'faculty' come array
    faculty_list = row["faculty"].split(',') if pd.notna(row["faculty"]) else []
    faculty_array = ', '.join([f'"{member.strip()}"' for member in faculty_list])

    # Contenuto del file Markdown
    content = f"""---
id: {project_id}
category_id: {category_id}
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
