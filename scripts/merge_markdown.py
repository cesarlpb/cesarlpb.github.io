import os

# Carpeta principal que contiene los temas
carpeta_principal = "test"  # Cambia esto por la carpeta que contiene los temas
carpeta_salida = "output"
# ruta_plantilla = "ux_ui.template.html"  # Ruta de la plantilla HTML
ruta_plantilla = os.path.join(os.path.dirname(__file__), "ux_ui.template.html")

# Crear carpeta de salida si no existe
os.makedirs(carpeta_salida, exist_ok=True)

# Cargar la plantilla HTML
with open(ruta_plantilla, "r", encoding="utf-8") as plantilla_file:
    plantilla_html = plantilla_file.read()

# Recorrer cada subcarpeta dentro de la carpeta principal (cada una es un tema)
for tema in sorted(os.listdir(carpeta_principal)):
    ruta_tema = os.path.join(carpeta_principal, tema)

    # Verificar que sea un directorio
    if os.path.isdir(ruta_tema):
        markdown_completo = ""

        # Recorrer archivos .md dentro de la subcarpeta del tema
        for archivo in sorted(os.listdir(ruta_tema)):
            if archivo.endswith(".md"):
                ruta_md = os.path.join(ruta_tema, archivo)
                with open(ruta_md, "r", encoding="utf-8") as f:
                    markdown_completo += f"\n\n# {archivo}\n\n"  # Nombre del archivo como título
                    markdown_completo += f.read()

        # Reemplazar {{tema}} y {{markdown}} en la plantilla
        contenido_final = plantilla_html.replace("{{tema}}", tema).replace("{{markdown}}", markdown_completo)

        # Guardar el archivo HTML final en la carpeta de salida
        nombre_archivo_salida = f"{tema.replace(' ', '_')}.html"  # Evita espacios en el nombre del archivo
        ruta_salida = os.path.join(carpeta_salida, nombre_archivo_salida)

        with open(ruta_salida, "w", encoding="utf-8") as salida_file:
            salida_file.write(contenido_final)

        print(f"✅ Archivo generado: {ruta_salida}")
