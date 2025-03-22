import os

# Specifica il percorso della cartella principale in cui si trovano le cartelle dei progetti
base_path = "/Users/filippo/Documents/GitHub/interdependence/src/projects"
output_folder = "/Users/filippo/Documents/GitHub/interdependence/src/images_metadata"

# Funzione per ottenere tutte le immagini in una cartella
def get_images(project_path, category_folder):
    img_folder = os.path.join(project_path, 'img')
    images = []
    if os.path.exists(img_folder):
        for img_file in os.listdir(img_folder):
            # Verifica che sia una immagine (puoi aggiungere più estensioni se necessario)
            if img_file.endswith(('.png', '.jpg', '.jpeg', '.webp')):
                # Correzione del percorso relativo dell'immagine
                img_path = os.path.join('../','projects', category_folder, os.path.basename(project_path), 'img', img_file)  # Path corretto
                images.append(img_path)
    return images

# Crea la cartella di output se non esiste
os.makedirs(output_folder, exist_ok=True)

# Itera attraverso tutte le categorie
for category_folder in os.listdir(base_path):
    category_path = os.path.join(base_path, category_folder)

    if os.path.isdir(category_path):  # Verifica che sia una cartella
        print(f"Processando la categoria: {category_folder}")

        # Itera attraverso i progetti all'interno di ogni categoria
        for project_folder in os.listdir(category_path):
            project_path = os.path.join(category_path, project_folder)

            if os.path.isdir(project_path):  # Verifica che sia una cartella di progetto
                # Verifica che il nome della cartella del progetto abbia il formato corretto
                parts = project_folder.split('_')
                if len(parts) == 3:
                    category_id = parts[1]  # Il secondo elemento è la categoria
                    project_id = parts[2]    # Il terzo elemento è l'ID del progetto
                else:
                    print(f"Nome cartella non valido: {project_folder}")
                    continue  # Passa alla cartella successiva se il formato non è corretto

                # Ottieni le immagini dalla cartella img
                images = get_images(project_path, category_folder)

                # Procedi solo se ci sono immagini
                if images:
                    # Genera il percorso per il file .md del progetto
                    md_file_path = os.path.join(output_folder, f"FDV_{category_id}_{project_id}_img.md")

                    # Crea il contenuto per il file .md
                    md_content = f"""---
category: "{category_id}"
id: {project_id}
images:
  - {"\n  - ".join(images)}
---
"""
                    # Scrivi il contenuto nel file .md
                    with open(md_file_path, "w") as md_file:
                        md_file.write(md_content)
                        print(f"Creato il file {md_file_path} con {len(images)} immagini.")
