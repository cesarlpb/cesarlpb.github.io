import os
import locale
from datetime import datetime

locale.setlocale(locale.LC_TIME, "es_ES.UTF-8")  # Cambiar a español
mes_y_año = datetime.now().strftime("%b %Y")     # Ejemplo: "Feb 2025"

# Constantes
NUMERACION_INICIAL = 0 # podría empezar en 0 -> portada
DIGITOS_PAGINA     = 3 # formato "001", "002", etc.

# Carpeta principal que contiene los temas
carpeta_principal = "test"  # Cambia esto por la carpeta que contiene los temas
carpeta_salida = "output"
# ruta_plantilla = "ux_ui.template.html"  # Ruta de la plantilla HTML
ruta_plantilla = os.path.join(os.path.dirname(__file__), "ux_ui.template.html")

# Crear carpeta de salida si no existe
os.makedirs(carpeta_salida, exist_ok=True)

def formatear_numero_pagina(num_pagina):
    return str(num_pagina).zfill(DIGITOS_PAGINA)

# Cargar la plantilla HTML
with open(ruta_plantilla, "r", encoding="utf-8") as plantilla_file:
    plantilla_html = plantilla_file.read()

numero_pagina = NUMERACION_INICIAL
div_slide_header = """
<div id="{{id_slide}}" class="page-header">{{contenido_header}}</div>
"""
div_slide_footer = """
<div class="page-footer">{{archivo}} {{numero_pagina}}</div>
"""

# Recorrer cada subcarpeta dentro de la carpeta principal (cada una es un tema)
for tema in sorted(os.listdir(carpeta_principal)):
    ruta_tema = os.path.join(carpeta_principal, tema)

    # Verificar que sea un directorio
    if os.path.isdir(ruta_tema):
        markdown_completo = ""

        # Recorrer archivos .md dentro de la subcarpeta del tema
        for archivo in sorted(os.listdir(ruta_tema)):
            numero_pagina += 1
            str_numero_pagina = formatear_numero_pagina(numero_pagina)
            if archivo.endswith(".md"):
                ruta_md = os.path.join(ruta_tema, archivo)
                with open(ruta_md, "r", encoding="utf-8") as f:
                    markdown_completo += div_slide_header
                    markdown_completo += f"\n\n## {archivo.replace(".md", "")}\n\n"  # Nombre del archivo como título
                    markdown_completo += f.read()
                    markdown_completo += f"\n{div_slide_footer}\n"
                    # separador de slides:
                    markdown_completo += f"\n---\n"
                    # replace de header y footer:
                    markdown_completo = markdown_completo.replace("{{id_slide}}", f"slide-{str_numero_pagina}")
                    markdown_completo = markdown_completo.replace("{{contenido_header}}", f"")
                    markdown_completo = markdown_completo.replace("{{archivo}}", archivo.replace(".md", ""))
                    markdown_completo = markdown_completo.replace("{{numero_pagina}}", str_numero_pagina)

        # Reemplazar {{tema}} y {{markdown}} en la plantilla
        contenido_final = plantilla_html.replace("{{tema}}", tema.upper()).replace("{{markdown}}", markdown_completo)
        # Reemplazar fecha y año una vez en archivo en campo {{fecha_actualizado}}:
        contenido_final = contenido_final.replace("{{fecha_actualizado}}", mes_y_año.capitalize())
        
        # Guardar el archivo HTML final en la carpeta de salida
        nombre_archivo_salida = f"{tema.replace(' ', '_')}.html"  # Evita espacios en el nombre del archivo
        ruta_salida = os.path.join(carpeta_salida, nombre_archivo_salida)

        with open(ruta_salida, "w", encoding="utf-8") as salida_file:
            salida_file.write(contenido_final)

        print(f"✅ Archivo generado: {ruta_salida}")
