"""Render original one-page PDFs for browsers without an embedded PDF viewer.
Run after build-documents.py with the Python environment containing PyMuPDF.
"""
from pathlib import Path
import json
import fitz

root = Path(__file__).resolve().parents[2] / 'frontend/public/apoio'
catalog = json.loads((root / 'catalogo-materiais.json').read_text())
for slug in catalog['pdf']:
    with fitz.open(root / f'{slug}.pdf') as document:
        if len(document) != 1:
            raise ValueError(f'{slug}: update the preview contract before adding pages')
        document[0].get_pixmap(matrix=fitz.Matrix(1.6, 1.6), alpha=False).save(root / f'{slug}-preview.png')
print(f"Rendered {len(catalog['pdf'])} document previews.")
