import os

# Definir carpetas a revisar
carpetas_a_revisar = ["test"]  # Cambia según tu estructura
carpeta_salida = "output"

# Crear carpeta de salida si no existe
os.makedirs(carpeta_salida, exist_ok=True)

# Archivo donde se fusionará todo
archivo_final = os.path.join(carpeta_salida, "merged.md")

with open(archivo_final, "w", encoding="utf-8") as salida:
    for carpeta in carpetas_a_revisar:
        if os.path.exists(carpeta):
            for archivo in sorted(os.listdir(carpeta)):
                if archivo.endswith(".md"):
                    ruta = os.path.join(carpeta, archivo)
                    with open(ruta, "r", encoding="utf-8") as f:
                        salida.write(f"# {archivo}\n\n")  # Encabezado con el nombre del archivo
                        salida.write(f.read() + "\n\n")

print(f"Archivos fusionados en {archivo_final}")
