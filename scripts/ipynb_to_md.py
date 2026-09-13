#!/usr/bin/env python3
"""
Convierte un archivo .ipynb a .md para compartir contexto con una IA.

Uso:
    python scripts/ipynb_to_md.py notebook.ipynb
    python scripts/ipynb_to_md.py notebook.ipynb -o salida.md
    python scripts/ipynb_to_md.py notebook.ipynb --no-outputs
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Any


def _normalize_source(source: Any) -> str:
    if isinstance(source, list):
        return "".join(source)
    if isinstance(source, str):
        return source
    return ""


def _clean_trailing_newlines(text: str) -> str:
    return text.rstrip("\n")


def _extract_text_output(output: dict[str, Any]) -> str:
    output_type = output.get("output_type")

    if output_type == "stream":
        return _normalize_source(output.get("text", ""))

    if output_type in {"execute_result", "display_data"}:
        data = output.get("data", {})
        if "text/plain" in data:
            return _normalize_source(data["text/plain"])

    if output_type == "error":
        traceback = output.get("traceback", [])
        if traceback:
            return "\n".join(traceback)
        ename = output.get("ename", "Error")
        evalue = output.get("evalue", "")
        return f"{ename}: {evalue}".strip()

    return ""


def notebook_to_markdown(nb_data: dict[str, Any], include_outputs: bool = True) -> str:
    cells = nb_data.get("cells", [])
    parts: list[str] = []

    for idx, cell in enumerate(cells, start=1):
        cell_type = cell.get("cell_type", "")
        source = _clean_trailing_newlines(_normalize_source(cell.get("source", "")))

        if cell_type == "markdown":
            if source:
                parts.append(source)
            else:
                parts.append(f"<!-- celda markdown vacia {idx} -->")
            continue

        if cell_type == "code":
            parts.append("```python")
            parts.append(source if source else "# celda de codigo vacia")
            parts.append("```")

            if include_outputs:
                outputs = cell.get("outputs", [])
                output_chunks = [
                    _clean_trailing_newlines(_extract_text_output(output))
                    for output in outputs
                ]
                output_chunks = [chunk for chunk in output_chunks if chunk]

                if output_chunks:
                    parts.append("")
                    parts.append("```text")
                    parts.append("\n\n".join(output_chunks))
                    parts.append("```")
            continue

        # Para tipos de celda menos comunes (raw, etc.)
        if source:
            parts.append(source)
        else:
            parts.append(f"<!-- celda {cell_type or 'desconocida'} vacia {idx} -->")

    return "\n\n".join(parts).strip() + "\n"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Convierte un notebook (.ipynb) a Markdown (.md)."
    )
    parser.add_argument("input", type=Path, help="Ruta al archivo .ipynb")
    parser.add_argument(
        "-o",
        "--output",
        type=Path,
        help="Ruta de salida .md (por defecto: mismo nombre que input)",
    )
    parser.add_argument(
        "--no-outputs",
        action="store_true",
        help="No incluir outputs de celdas de codigo",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    input_path: Path = args.input

    if not input_path.exists():
        raise FileNotFoundError(f"No existe el archivo: {input_path}")

    if input_path.suffix.lower() != ".ipynb":
        raise ValueError("El archivo de entrada debe tener extension .ipynb")

    output_path: Path = args.output or input_path.with_suffix(".md")
    output_path.parent.mkdir(parents=True, exist_ok=True)

    with input_path.open("r", encoding="utf-8") as f:
        nb_data = json.load(f)

    markdown = notebook_to_markdown(nb_data, include_outputs=not args.no_outputs)

    with output_path.open("w", encoding="utf-8") as f:
        f.write(markdown)

    print(f"Markdown generado: {output_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
