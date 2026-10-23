#!/usr/bin/env python3
"""Build the full SPEE upgrade backlog as a branded, editable ITIS DOCX."""

from __future__ import annotations

import re
import zipfile
from io import BytesIO
from pathlib import Path

from docx import Document
from docx.enum.section import WD_SECTION
from docx.enum.table import WD_CELL_VERTICAL_ALIGNMENT
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Inches, Pt, RGBColor


ROOT = Path(__file__).resolve().parent
SOURCE_MD = ROOT / "backlog_desenvolvimento_upgrade_spee.md"
BRAND_REFERENCE = ROOT / "Backlog_Completo_Upgrade_SPEE_ITIS.docx"
OUTPUT_DOCX = ROOT / "Backlog_Completo_Desenvolvimento_Upgrade_SPEE_ITIS_v1.6.docx"

GREEN = "006B12"
GREEN_DARK = "00520D"
GREEN_LIGHT = "EAF3EB"
GREEN_PALE = "F4F8F4"
GOLD = "BE8200"
TEXT = "333333"
MUTED = "6A6A6A"
WHITE = "FFFFFF"
RULE = "9DC4A2"
CODE_BG = "F0F3F0"

PAGE_WIDTH_TWIPS = 12240
MARGIN_TWIPS = 1368  # 0.95 in
USABLE_WIDTH_TWIPS = PAGE_WIDTH_TWIPS - (2 * MARGIN_TWIPS)


def set_run_font(run, name="Arial", size=None, color=TEXT, bold=None, italic=None):
    run.font.name = name
    rpr = run._element.get_or_add_rPr()
    rfonts = rpr.rFonts
    if rfonts is None:
        rfonts = OxmlElement("w:rFonts")
        rpr.insert(0, rfonts)
    for key in ("ascii", "hAnsi", "eastAsia", "cs"):
        rfonts.set(qn(f"w:{key}"), name)
    if size is not None:
        run.font.size = Pt(size)
    if color:
        run.font.color.rgb = RGBColor.from_string(color)
    if bold is not None:
        run.bold = bold
    if italic is not None:
        run.italic = italic


def set_cell_shading(cell, fill):
    tc_pr = cell._tc.get_or_add_tcPr()
    shd = tc_pr.find(qn("w:shd"))
    if shd is None:
        shd = OxmlElement("w:shd")
        tc_pr.append(shd)
    shd.set(qn("w:fill"), fill)


def set_cell_margins(cell, top=90, start=100, bottom=90, end=100):
    tc_pr = cell._tc.get_or_add_tcPr()
    tc_mar = tc_pr.first_child_found_in("w:tcMar")
    if tc_mar is None:
        tc_mar = OxmlElement("w:tcMar")
        tc_pr.append(tc_mar)
    for tag, value in (("top", top), ("start", start), ("bottom", bottom), ("end", end)):
        node = tc_mar.find(qn(f"w:{tag}"))
        if node is None:
            node = OxmlElement(f"w:{tag}")
            tc_mar.append(node)
        node.set(qn("w:w"), str(value))
        node.set(qn("w:type"), "dxa")


def set_table_borders(table, color=RULE, size=4):
    tbl_pr = table._tbl.tblPr
    borders = tbl_pr.find(qn("w:tblBorders"))
    if borders is None:
        borders = OxmlElement("w:tblBorders")
        tbl_pr.append(borders)
    for edge in ("top", "left", "bottom", "right", "insideH", "insideV"):
        tag = borders.find(qn(f"w:{edge}"))
        if tag is None:
            tag = OxmlElement(f"w:{edge}")
            borders.append(tag)
        tag.set(qn("w:val"), "single")
        tag.set(qn("w:sz"), str(size))
        tag.set(qn("w:space"), "0")
        tag.set(qn("w:color"), color)


def set_table_geometry(table, widths_twips):
    table.autofit = False
    tbl_pr = table._tbl.tblPr
    tbl_w = tbl_pr.find(qn("w:tblW"))
    if tbl_w is None:
        tbl_w = OxmlElement("w:tblW")
        tbl_pr.append(tbl_w)
    tbl_w.set(qn("w:w"), str(sum(widths_twips)))
    tbl_w.set(qn("w:type"), "dxa")

    tbl_ind = tbl_pr.find(qn("w:tblInd"))
    if tbl_ind is None:
        tbl_ind = OxmlElement("w:tblInd")
        tbl_pr.append(tbl_ind)
    tbl_ind.set(qn("w:w"), "0")
    tbl_ind.set(qn("w:type"), "dxa")

    grid = table._tbl.tblGrid
    for child in list(grid):
        grid.remove(child)
    for width in widths_twips:
        grid_col = OxmlElement("w:gridCol")
        grid_col.set(qn("w:w"), str(width))
        grid.append(grid_col)

    for row in table.rows:
        for idx, cell in enumerate(row.cells):
            tc_pr = cell._tc.get_or_add_tcPr()
            tc_w = tc_pr.find(qn("w:tcW"))
            if tc_w is None:
                tc_w = OxmlElement("w:tcW")
                tc_pr.append(tc_w)
            tc_w.set(qn("w:w"), str(widths_twips[idx]))
            tc_w.set(qn("w:type"), "dxa")
            cell.width = Inches(widths_twips[idx] / 1440)


def mark_repeat_header(row):
    tr_pr = row._tr.get_or_add_trPr()
    tbl_header = tr_pr.find(qn("w:tblHeader"))
    if tbl_header is None:
        tbl_header = OxmlElement("w:tblHeader")
        tr_pr.append(tbl_header)
    tbl_header.set(qn("w:val"), "true")


def set_no_split(row):
    tr_pr = row._tr.get_or_add_trPr()
    cant_split = tr_pr.find(qn("w:cantSplit"))
    if cant_split is None:
        cant_split = OxmlElement("w:cantSplit")
        tr_pr.append(cant_split)


def add_paragraph_border(paragraph, side="bottom", color=RULE, size=6, space=3):
    p_pr = paragraph._p.get_or_add_pPr()
    p_bdr = p_pr.find(qn("w:pBdr"))
    if p_bdr is None:
        p_bdr = OxmlElement("w:pBdr")
        p_pr.append(p_bdr)
    border = OxmlElement(f"w:{side}")
    border.set(qn("w:val"), "single")
    border.set(qn("w:sz"), str(size))
    border.set(qn("w:space"), str(space))
    border.set(qn("w:color"), color)
    p_bdr.append(border)


def shade_paragraph(paragraph, fill):
    p_pr = paragraph._p.get_or_add_pPr()
    shd = p_pr.find(qn("w:shd"))
    if shd is None:
        shd = OxmlElement("w:shd")
        p_pr.append(shd)
    shd.set(qn("w:fill"), fill)


def set_alt_text(inline_shape, title, description):
    doc_pr = inline_shape._inline.docPr
    doc_pr.set("title", title)
    doc_pr.set("descr", description)


def add_field(paragraph, instruction, fallback="1"):
    run = paragraph.add_run()
    begin = OxmlElement("w:fldChar")
    begin.set(qn("w:fldCharType"), "begin")
    instr = OxmlElement("w:instrText")
    instr.set(qn("xml:space"), "preserve")
    instr.text = instruction
    separate = OxmlElement("w:fldChar")
    separate.set(qn("w:fldCharType"), "separate")
    text = OxmlElement("w:t")
    text.text = fallback
    end = OxmlElement("w:fldChar")
    end.set(qn("w:fldCharType"), "end")
    run._r.extend([begin, instr, separate, text, end])
    set_run_font(run, size=8, color=MUTED)


def add_inline_md(paragraph, text, *, default_size=None, default_color=TEXT, default_bold=False):
    """Add a small, safe subset of Markdown inline formatting."""
    token_re = re.compile(r"(`[^`]+`|\*\*[^*]+\*\*|(?<!\*)\*[^*]+\*(?!\*))")
    pos = 0
    for match in token_re.finditer(text):
        if match.start() > pos:
            run = paragraph.add_run(text[pos:match.start()])
            set_run_font(run, size=default_size, color=default_color, bold=default_bold)
        token = match.group(0)
        if token.startswith("`"):
            run = paragraph.add_run(token[1:-1])
            set_run_font(run, name="Consolas", size=(default_size or 10) - 0.5, color="444444")
            shd = OxmlElement("w:shd")
            shd.set(qn("w:fill"), "ECEFEC")
            run._element.get_or_add_rPr().append(shd)
        elif token.startswith("**"):
            run = paragraph.add_run(token[2:-2])
            set_run_font(run, size=default_size, color=default_color, bold=True)
        else:
            run = paragraph.add_run(token[1:-1])
            set_run_font(run, size=default_size, color=default_color, bold=default_bold, italic=True)
        pos = match.end()
    if pos < len(text):
        run = paragraph.add_run(text[pos:])
        set_run_font(run, size=default_size, color=default_color, bold=default_bold)


def plain_md(text):
    return re.sub(r"\*\*|\*|`", "", text).strip()


def configure_styles(doc):
    styles = doc.styles
    normal = styles["Normal"]
    normal.font.name = "Arial"
    normal.font.size = Pt(10.2)
    normal.font.color.rgb = RGBColor.from_string(TEXT)
    normal._element.rPr.rFonts.set(qn("w:ascii"), "Arial")
    normal._element.rPr.rFonts.set(qn("w:hAnsi"), "Arial")
    normal.paragraph_format.space_after = Pt(4)
    normal.paragraph_format.line_spacing = 1.08
    normal.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.LEFT
    normal.paragraph_format.widow_control = True

    specs = {
        "Title": (29, GREEN_DARK, 22, 8),
        "Subtitle": (13.5, TEXT, 0, 18),
        "Heading 1": (18, GREEN, 14, 8),
        "Heading 2": (14.2, GREEN, 11, 5),
        "Heading 3": (12.3, GREEN, 8, 4),
        "Heading 4": (11.2, GREEN_DARK, 7, 3),
    }
    for name, (size, color, before, after) in specs.items():
        style = styles[name]
        style.font.name = "Arial"
        style.font.size = Pt(size)
        style.font.bold = True
        style.font.italic = False
        style.font.color.rgb = RGBColor.from_string(color)
        style._element.rPr.rFonts.set(qn("w:ascii"), "Arial")
        style._element.rPr.rFonts.set(qn("w:hAnsi"), "Arial")
        style.paragraph_format.space_before = Pt(before)
        style.paragraph_format.space_after = Pt(after)
        style.paragraph_format.line_spacing = 1.0
        style.paragraph_format.keep_with_next = True
        style.paragraph_format.keep_together = True
        style.paragraph_format.widow_control = True

    styles["Heading 1"].paragraph_format.page_break_before = False
    styles["Heading 3"].paragraph_format.space_before = Pt(7)
    styles["Heading 3"].paragraph_format.space_after = Pt(3)

    # Remove the decorative blue rule inherited from Word's built-in Title style.
    title_ppr = styles["Title"]._element.get_or_add_pPr()
    title_border = title_ppr.find(qn("w:pBdr"))
    if title_border is not None:
        title_ppr.remove(title_border)

    for name in ("List Bullet", "List Number"):
        style = styles[name]
        style.font.name = "Arial"
        style.font.size = Pt(10)
        style.font.color.rgb = RGBColor.from_string(TEXT)
        style._element.rPr.rFonts.set(qn("w:ascii"), "Arial")
        style._element.rPr.rFonts.set(qn("w:hAnsi"), "Arial")
        style.paragraph_format.left_indent = Inches(0.28)
        style.paragraph_format.first_line_indent = Inches(-0.18)
        style.paragraph_format.space_after = Pt(1.3)
        style.paragraph_format.line_spacing = 1.04
        style.paragraph_format.widow_control = True

    if "ITIS Code" not in [s.name for s in styles]:
        styles.add_style("ITIS Code", 1)
    code = styles["ITIS Code"]
    code.font.name = "Consolas"
    code.font.size = Pt(8.2)
    code.font.color.rgb = RGBColor.from_string("3E463E")
    code._element.rPr.rFonts.set(qn("w:ascii"), "Consolas")
    code._element.rPr.rFonts.set(qn("w:hAnsi"), "Consolas")
    code.paragraph_format.left_indent = Inches(0.16)
    code.paragraph_format.right_indent = Inches(0.10)
    code.paragraph_format.space_after = Pt(0)
    code.paragraph_format.line_spacing = 1.0
    code.paragraph_format.keep_together = True


def add_numbering_definition(doc, fmt, text, left=430, hanging=260):
    numbering = doc.part.numbering_part.element
    abstract_ids = [int(el.get(qn("w:abstractNumId"))) for el in numbering.findall(qn("w:abstractNum"))]
    num_ids = [int(el.get(qn("w:numId"))) for el in numbering.findall(qn("w:num"))]
    abstract_id = (max(abstract_ids) + 1) if abstract_ids else 1
    num_id = (max(num_ids) + 1) if num_ids else 1

    abstract = OxmlElement("w:abstractNum")
    abstract.set(qn("w:abstractNumId"), str(abstract_id))
    multi = OxmlElement("w:multiLevelType")
    multi.set(qn("w:val"), "singleLevel")
    abstract.append(multi)
    lvl = OxmlElement("w:lvl")
    lvl.set(qn("w:ilvl"), "0")
    start = OxmlElement("w:start")
    start.set(qn("w:val"), "1")
    lvl.append(start)
    num_fmt = OxmlElement("w:numFmt")
    num_fmt.set(qn("w:val"), fmt)
    lvl.append(num_fmt)
    lvl_text = OxmlElement("w:lvlText")
    lvl_text.set(qn("w:val"), text)
    lvl.append(lvl_text)
    suff = OxmlElement("w:suff")
    suff.set(qn("w:val"), "space")
    lvl.append(suff)
    p_pr = OxmlElement("w:pPr")
    tabs = OxmlElement("w:tabs")
    tab = OxmlElement("w:tab")
    tab.set(qn("w:val"), "num")
    tab.set(qn("w:pos"), str(left))
    tabs.append(tab)
    p_pr.append(tabs)
    ind = OxmlElement("w:ind")
    ind.set(qn("w:left"), str(left))
    ind.set(qn("w:hanging"), str(hanging))
    p_pr.append(ind)
    lvl.append(p_pr)
    r_pr = OxmlElement("w:rPr")
    color = OxmlElement("w:color")
    color.set(qn("w:val"), GREEN)
    r_pr.append(color)
    bold = OxmlElement("w:b")
    r_pr.append(bold)
    lvl.append(r_pr)
    abstract.append(lvl)
    numbering.append(abstract)

    num = OxmlElement("w:num")
    num.set(qn("w:numId"), str(num_id))
    abstract_ref = OxmlElement("w:abstractNumId")
    abstract_ref.set(qn("w:val"), str(abstract_id))
    num.append(abstract_ref)
    numbering.append(num)
    return abstract_id, num_id


def new_num_instance(doc, abstract_id):
    numbering = doc.part.numbering_part.element
    num_ids = [int(el.get(qn("w:numId"))) for el in numbering.findall(qn("w:num"))]
    num_id = (max(num_ids) + 1) if num_ids else 1
    num = OxmlElement("w:num")
    num.set(qn("w:numId"), str(num_id))
    abstract_ref = OxmlElement("w:abstractNumId")
    abstract_ref.set(qn("w:val"), str(abstract_id))
    num.append(abstract_ref)
    lvl_override = OxmlElement("w:lvlOverride")
    lvl_override.set(qn("w:ilvl"), "0")
    start_override = OxmlElement("w:startOverride")
    start_override.set(qn("w:val"), "1")
    lvl_override.append(start_override)
    num.append(lvl_override)
    numbering.append(num)
    return num_id


def apply_num(paragraph, num_id):
    p_pr = paragraph._p.get_or_add_pPr()
    num_pr = p_pr.find(qn("w:numPr"))
    if num_pr is None:
        num_pr = OxmlElement("w:numPr")
        p_pr.append(num_pr)
    ilvl = OxmlElement("w:ilvl")
    ilvl.set(qn("w:val"), "0")
    num = OxmlElement("w:numId")
    num.set(qn("w:val"), str(num_id))
    num_pr.extend([ilvl, num])


def logo_bytes():
    with zipfile.ZipFile(BRAND_REFERENCE) as zf:
        return zf.read("word/media/image1.png")


def style_logo(shape, title="Logótipo ITIS"):
    set_alt_text(shape, title, "Logótipo do Instituto de Tecnologias, Inovação e Serviços")


def set_header_footer(doc, logo):
    section = doc.sections[0]
    section.different_first_page_header_footer = True
    doc.settings.odd_and_even_pages_header_footer = True

    first_header = section.first_page_header
    first_header.is_linked_to_previous = False
    first_header.paragraphs[0].text = ""

    odd = section.header
    odd.is_linked_to_previous = False
    p = odd.paragraphs[0]
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_after = Pt(0)
    shape = p.add_run().add_picture(BytesIO(logo), width=Inches(1.75))
    style_logo(shape)

    even = section.even_page_header
    even.is_linked_to_previous = False
    p1 = even.paragraphs[0]
    p1.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p1.paragraph_format.space_after = Pt(0)
    r = p1.add_run("ITIS – Instituto de Tecnologias, Inovação e Serviços")
    set_run_font(r, name="Georgia", size=9.4, color=GREEN, bold=True)
    p2 = even.add_paragraph()
    p2.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p2.paragraph_format.space_before = Pt(0)
    p2.paragraph_format.space_after = Pt(2)
    r = p2.add_run("INOVAÇÃO COMO EXIGÊNCIA CONTÍNUA")
    set_run_font(r, name="Georgia", size=8.2, color=GOLD, bold=True)
    add_paragraph_border(p2, "bottom", color=RULE, size=4, space=2)

    for footer in (section.footer, section.even_page_footer, section.first_page_footer):
        footer.is_linked_to_previous = False
        p = footer.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.LEFT
        p.paragraph_format.space_after = Pt(0)
        r = p.add_run("Emitido por: ")
        set_run_font(r, size=8.2, color=TEXT, bold=True)
        r = p.add_run("ITIS – Instituto de Tecnologias, Inovação e Serviços / 2026")
        set_run_font(r, size=8.2, color=TEXT)

        p = footer.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.LEFT
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(0)
        for label, value, suffix in (
            ("NUIT: ", "400319227", " | "),
            ("Email: ", "info@itis.ac.mz", " | "),
            ("Web: ", "www.itis.ac.mz", ""),
        ):
            r = p.add_run(label)
            set_run_font(r, size=8.2, color=TEXT, bold=True)
            r = p.add_run(value + suffix)
            set_run_font(r, size=8.2, color=TEXT)

        p = footer.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(0)
        r = p.add_run("Página ")
        set_run_font(r, size=7.8, color=MUTED)
        add_field(p, "PAGE", "1")
        r = p.add_run(" de ")
        set_run_font(r, size=7.8, color=MUTED)
        add_field(p, "NUMPAGES", "1")


def add_cover(doc, metadata, quote, logo):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_after = Pt(2)
    shape = p.add_run().add_picture(BytesIO(logo), width=Inches(2.15))
    style_logo(shape)

    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_after = Pt(1)
    r = p.add_run("ITIS – Instituto de Tecnologias, Inovação e Serviços")
    set_run_font(r, name="Georgia", size=11.3, color=GREEN, bold=True)

    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_after = Pt(30)
    r = p.add_run("INOVAÇÃO COMO EXIGÊNCIA CONTÍNUA")
    set_run_font(r, name="Georgia", size=9.5, color=GOLD, bold=True)

    p = doc.add_paragraph(style="Title")
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_before = Pt(0)
    p.paragraph_format.space_after = Pt(10)
    p.add_run("Backlog completo de desenvolvimento\ndo upgrade do SPEE")

    p = doc.add_paragraph(style="Subtitle")
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.add_run("Prioridades, funcionalidades, estimativas e âmbito do MVP de 40 dias")

    table = doc.add_table(rows=0, cols=2)
    labels = (("Versão", metadata["Versão"]), ("Data", metadata["Data"]),
              ("Estado", metadata["Estado"]), ("Âmbito", metadata["Âmbito"]))
    for idx, (label, value) in enumerate(labels):
        cells = table.add_row().cells
        for cell in cells:
            set_cell_margins(cell, 70, 95, 70, 95)
            if idx % 2 == 0:
                set_cell_shading(cell, GREEN_LIGHT)
        p1 = cells[0].paragraphs[0]
        p1.paragraph_format.space_after = Pt(0)
        r = p1.add_run(label)
        set_run_font(r, size=9.5, color=GREEN, bold=True)
        p2 = cells[1].paragraphs[0]
        p2.paragraph_format.space_after = Pt(0)
        add_inline_md(p2, value, default_size=9.3)
    set_table_geometry(table, [int(USABLE_WIDTH_TWIPS * 0.28), int(USABLE_WIDTH_TWIPS * 0.72)])
    set_table_borders(table, color="C9DDCB", size=3)

    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(3)

    metric = doc.add_table(rows=2, cols=3)
    values = (("9 440 h", "Backlog funcional"), ("10 856 h", "Esforço técnico total"), ("40 dias", "Primeira iteração MVP"))
    for col, (value, label) in enumerate(values):
        top = metric.cell(0, col)
        bottom = metric.cell(1, col)
        set_cell_shading(top, GREEN)
        set_cell_shading(bottom, GREEN_LIGHT)
        for c in (top, bottom):
            set_cell_margins(c, 80, 80, 80, 80)
            c.vertical_alignment = WD_CELL_VERTICAL_ALIGNMENT.CENTER
        p = top.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p.paragraph_format.space_after = Pt(0)
        r = p.add_run(value)
        set_run_font(r, name="Georgia", size=14, color=WHITE, bold=True)
        p = bottom.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p.paragraph_format.space_after = Pt(0)
        r = p.add_run(label)
        set_run_font(r, size=8.6, color=TEXT, bold=True)
    set_table_geometry(metric, [USABLE_WIDTH_TWIPS // 3] * 3)
    set_table_borders(metric, color=GREEN, size=4)

    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(8)
    p.paragraph_format.space_after = Pt(6)
    p.paragraph_format.left_indent = Inches(0.08)
    p.paragraph_format.right_indent = Inches(0.08)
    shade_paragraph(p, "FBF3DF")
    add_paragraph_border(p, "left", color=GOLD, size=16, space=5)
    add_inline_md(p, quote, default_size=8.7, default_color=TEXT)

    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_before = Pt(2)
    r = p.add_run("Documento de trabalho • versão editável")
    set_run_font(r, size=8.5, color=MUTED)


def choose_widths(headers):
    n = len(headers)
    lowered = [plain_md(h).lower() for h in headers]
    if n == 2:
        first = 0.26 if any(k in lowered[0] for k in ("id", "item", "âmbito")) else 0.34
        fractions = [first, 1 - first]
    elif n == 3:
        if "horas" in lowered[2]:
            fractions = [0.18, 0.62, 0.20]
        elif lowered[0] in ("id", "item", "prioridade", "período"):
            fractions = [0.18, 0.30, 0.52]
        else:
            fractions = [0.22, 0.33, 0.45]
    elif n == 4:
        if "horas" in lowered[2]:
            fractions = [0.16, 0.48, 0.16, 0.20]
        else:
            fractions = [0.16, 0.14, 0.34, 0.36]
    else:
        fractions = [1 / n] * n
    widths = [int(USABLE_WIDTH_TWIPS * f) for f in fractions]
    widths[-1] += USABLE_WIDTH_TWIPS - sum(widths)
    return widths


def add_markdown_table(doc, rows):
    headers, data_rows = rows[0], rows[2:]
    n = len(headers)
    table = doc.add_table(rows=1, cols=n)
    table.style = "Table Grid"
    for idx, text in enumerate(headers):
        cell = table.cell(0, idx)
        set_cell_shading(cell, GREEN)
        set_cell_margins(cell)
        cell.vertical_alignment = WD_CELL_VERTICAL_ALIGNMENT.CENTER
        p = cell.paragraphs[0]
        p.paragraph_format.space_after = Pt(0)
        add_inline_md(p, text, default_size=8.7, default_color=WHITE, default_bold=True)
    mark_repeat_header(table.rows[0])
    set_no_split(table.rows[0])

    for row_idx, row in enumerate(data_rows, start=1):
        table_row = table.add_row()
        set_no_split(table_row)
        cells = table_row.cells
        for col, text in enumerate(row):
            cell = cells[col]
            set_cell_margins(cell)
            cell.vertical_alignment = WD_CELL_VERTICAL_ALIGNMENT.TOP
            if row_idx % 2 == 0:
                set_cell_shading(cell, GREEN_PALE)
            p = cell.paragraphs[0]
            p.paragraph_format.space_after = Pt(0)
            p.paragraph_format.line_spacing = 1.0
            p.paragraph_format.keep_together = False
            add_inline_md(p, text, default_size=(8.3 if n >= 4 else 8.6))

    set_table_geometry(table, choose_widths(headers))
    set_table_borders(table)
    after = doc.add_paragraph()
    after.paragraph_format.space_after = Pt(2)
    after.paragraph_format.space_before = Pt(0)
    return table


def add_code_block(doc, language, lines):
    label = doc.add_paragraph()
    label.paragraph_format.left_indent = Inches(0.16)
    label.paragraph_format.space_before = Pt(3)
    label.paragraph_format.space_after = Pt(1)
    if len(lines) <= 18:
        label.paragraph_format.keep_with_next = True
    shade_paragraph(label, CODE_BG)
    r = label.add_run((language or "texto").upper())
    set_run_font(r, size=7.2, color=GREEN, bold=True)
    for idx, line in enumerate(lines):
        p = doc.add_paragraph(style="ITIS Code")
        shade_paragraph(p, CODE_BG)
        add_paragraph_border(p, "left", color=GREEN, size=12, space=4)
        if len(lines) <= 18 and idx < len(lines) - 1:
            p.paragraph_format.keep_with_next = True
        r = p.add_run(line if line else " ")
        set_run_font(r, name="Consolas", size=8.2, color="3E463E")
    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(1)


def parse_table_row(line):
    return [cell.strip() for cell in line.strip().strip("|").split("|")]


def is_table_separator(cells):
    return all(re.fullmatch(r":?-{3,}:?", c.replace(" ", "")) for c in cells)


def add_body_from_markdown(doc, lines, bullet_num_id, number_abstract_id):
    i = 0
    paragraph_buffer = []
    current_number_id = None
    last_heading = None

    def flush_paragraph():
        nonlocal paragraph_buffer
        if not paragraph_buffer:
            return
        text = " ".join(part.strip() for part in paragraph_buffer).strip()
        paragraph_buffer = []
        if not text:
            return
        p = doc.add_paragraph()
        if text.endswith(":") and len(plain_md(text)) < 110:
            p.paragraph_format.keep_with_next = True
        add_inline_md(p, text)

    while i < len(lines):
        raw = lines[i].rstrip()
        stripped = raw.strip()

        if not stripped:
            flush_paragraph()
            current_number_id = None
            i += 1
            continue

        heading = re.match(r"^(#{2,4})\s+(.+)$", stripped)
        if heading:
            flush_paragraph()
            level = len(heading.group(1)) - 1
            text = plain_md(heading.group(2))
            if text == last_heading:
                i += 1
                continue
            p = doc.add_paragraph(style=f"Heading {level}")
            p.add_run(text)
            if level == 3:
                add_paragraph_border(p, "bottom", color=RULE, size=3, space=2)
            last_heading = text
            current_number_id = None
            i += 1
            continue

        if stripped.startswith("```"):
            flush_paragraph()
            language = stripped[3:].strip()
            code_lines = []
            i += 1
            while i < len(lines) and not lines[i].strip().startswith("```"):
                code_lines.append(lines[i].rstrip("\n"))
                i += 1
            i += 1
            add_code_block(doc, language, code_lines)
            current_number_id = None
            continue

        if stripped.startswith("|") and i + 1 < len(lines) and lines[i + 1].strip().startswith("|"):
            first = parse_table_row(stripped)
            second = parse_table_row(lines[i + 1].strip())
            if len(first) == len(second) and is_table_separator(second):
                flush_paragraph()
                rows = [first, second]
                i += 2
                while i < len(lines) and lines[i].strip().startswith("|"):
                    row = parse_table_row(lines[i].strip())
                    if len(row) < len(first):
                        row.extend([""] * (len(first) - len(row)))
                    rows.append(row[:len(first)])
                    i += 1
                add_markdown_table(doc, rows)
                current_number_id = None
                continue

        if stripped.startswith(">"):
            flush_paragraph()
            quote_parts = []
            while i < len(lines) and lines[i].strip().startswith(">"):
                quote_parts.append(lines[i].strip()[1:].strip())
                i += 1
            p = doc.add_paragraph()
            p.paragraph_format.left_indent = Inches(0.13)
            p.paragraph_format.right_indent = Inches(0.08)
            p.paragraph_format.space_before = Pt(5)
            p.paragraph_format.space_after = Pt(7)
            shade_paragraph(p, "FBF3DF")
            add_paragraph_border(p, "left", color=GOLD, size=14, space=5)
            add_inline_md(p, " ".join(quote_parts), default_size=9.4)
            current_number_id = None
            continue

        bullet = re.match(r"^[-*]\s+(.+)$", stripped)
        if bullet:
            flush_paragraph()
            p = doc.add_paragraph(style="List Bullet")
            apply_num(p, bullet_num_id)
            add_inline_md(p, bullet.group(1), default_size=10)
            current_number_id = None
            i += 1
            continue

        numbered = re.match(r"^\d+\.\s+(.+)$", stripped)
        if numbered:
            flush_paragraph()
            if current_number_id is None:
                current_number_id = new_num_instance(doc, number_abstract_id)
            p = doc.add_paragraph(style="List Number")
            apply_num(p, current_number_id)
            add_inline_md(p, numbered.group(1), default_size=10)
            i += 1
            continue

        if stripped == "---":
            flush_paragraph()
            current_number_id = None
            i += 1
            continue

        paragraph_buffer.append(stripped)
        i += 1

    flush_paragraph()


def extract_front_matter(lines):
    metadata = {}
    for line in lines[:12]:
        m = re.match(r"\*\*(Versão|Data|Estado|Âmbito):\*\*\s*(.+?)(?:\s{2,})?$", line.strip())
        if m:
            metadata[m.group(1)] = plain_md(m.group(2))
    quote_lines = []
    for line in lines[:20]:
        if line.strip().startswith(">"):
            quote_lines.append(line.strip()[1:].strip())
    quote = " ".join(quote_lines)
    body_start = 0
    for idx, line in enumerate(lines):
        if line.strip() == "---":
            body_start = idx + 1
            break
    return metadata, quote, lines[body_start:]


def build():
    lines = SOURCE_MD.read_text(encoding="utf-8").splitlines()
    metadata, quote, body_lines = extract_front_matter(lines)
    required = {"Versão", "Data", "Estado", "Âmbito"}
    missing = required - metadata.keys()
    if missing:
        raise RuntimeError(f"Metadados em falta: {sorted(missing)}")

    doc = Document()
    section = doc.sections[0]
    section.page_width = Inches(8.5)
    section.page_height = Inches(11)
    section.left_margin = Inches(0.95)
    section.right_margin = Inches(0.95)
    section.top_margin = Inches(0.96)
    section.bottom_margin = Inches(1.28)
    section.header_distance = Inches(0.16)
    section.footer_distance = Inches(0.20)
    section.start_type = WD_SECTION.NEW_PAGE

    configure_styles(doc)
    logo = logo_bytes()
    set_header_footer(doc, logo)
    bullet_abstract_id, bullet_num_id = add_numbering_definition(doc, "bullet", "•")
    number_abstract_id, _ = add_numbering_definition(doc, "decimal", "%1.")

    props = doc.core_properties
    props.title = "Backlog completo de desenvolvimento do upgrade do SPEE"
    props.subject = "Prioridades, funcionalidades, estimativas e MVP de 40 dias"
    props.author = "ITIS – Instituto de Tecnologias, Inovação e Serviços"
    props.keywords = "SPEE, backlog, SPEE Studio, INSS, Empreendedorismo, Mission Control, MVP"
    props.comments = "Documento de trabalho editável gerado a partir do backlog Markdown consolidado."

    add_cover(doc, metadata, quote, logo)
    doc.add_page_break()
    add_body_from_markdown(doc, body_lines, bullet_num_id, number_abstract_id)

    settings = doc.settings._element
    update = settings.find(qn("w:updateFields"))
    if update is None:
        update = OxmlElement("w:updateFields")
        settings.append(update)
    update.set(qn("w:val"), "true")

    doc.save(OUTPUT_DOCX)
    print(OUTPUT_DOCX)


if __name__ == "__main__":
    build()
