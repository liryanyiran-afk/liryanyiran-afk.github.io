from pathlib import Path
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    BaseDocTemplate, Frame, PageTemplate, Paragraph, Spacer, Table,
    TableStyle, PageBreak, KeepTogether, Image
)

ROOT = Path(__file__).resolve().parents[1]
OUTS = [
    ROOT / 'assets/reports/260214-mstr.pdf',
    ROOT / 'public/assets/reports/260214-mstr.pdf',
    ROOT / 'reports/260214-mstr.pdf',
]
FONT_PATH = Path('/System/Library/Fonts/Supplemental/Arial Unicode.ttf')
pdfmetrics.registerFont(TTFont('AU', str(FONT_PATH)))
pdfmetrics.registerFont(TTFont('AUBold', str(FONT_PATH)))

PAGE_W, PAGE_H = A4
MARGIN_X = 20 * mm
TOP = 22 * mm
BOTTOM = 18 * mm
CONTENT_W = PAGE_W - 2 * MARGIN_X

GREEN = colors.HexColor('#153f35')
GREEN_DARK = colors.HexColor('#0f302a')
INK = colors.HexColor('#1a302b')
INK_SOFT = colors.HexColor('#3e5149')
MUTED = colors.HexColor('#687268')
RED = colors.HexColor('#8f302c')
BRASS = colors.HexColor('#9a713a')
PAPER = colors.HexColor('#fbf8ee')
CANVAS = colors.HexColor('#f3efe2')
LINE = colors.HexColor('#d6ccba')
MIST = colors.HexColor('#e5eadb')
WHITE = colors.HexColor('#fffdf8')

styles = getSampleStyleSheet()
styles.add(ParagraphStyle(
    name='CNBody', fontName='AU', fontSize=9.6, leading=15.2, textColor=INK_SOFT,
    spaceAfter=7, wordWrap='CJK', alignment=TA_LEFT
))
styles.add(ParagraphStyle(
    name='Small', fontName='AU', fontSize=7.6, leading=10.5, textColor=MUTED,
    spaceAfter=4, wordWrap='CJK'
))
styles.add(ParagraphStyle(
    name='Tiny', fontName='AU', fontSize=6.8, leading=9.2, textColor=MUTED,
    wordWrap='CJK'
))
styles.add(ParagraphStyle(
    name='H1', fontName='AUBold', fontSize=24, leading=29, textColor=GREEN,
    spaceAfter=10, wordWrap='CJK'
))
styles.add(ParagraphStyle(
    name='H2', fontName='AUBold', fontSize=15.5, leading=20, textColor=GREEN,
    spaceBefore=12, spaceAfter=7, wordWrap='CJK'
))
styles.add(ParagraphStyle(
    name='H3', fontName='AUBold', fontSize=11.5, leading=15, textColor=RED,
    spaceBefore=7, spaceAfter=5, wordWrap='CJK'
))
styles.add(ParagraphStyle(
    name='Kicker', fontName='AUBold', fontSize=7.5, leading=9, textColor=RED,
    spaceAfter=8, alignment=TA_LEFT
))
styles.add(ParagraphStyle(
    name='Metric', fontName='AUBold', fontSize=15, leading=18, textColor=GREEN,
    alignment=TA_CENTER, wordWrap='CJK'
))
styles.add(ParagraphStyle(
    name='MetricLabel', fontName='AU', fontSize=7, leading=9, textColor=MUTED,
    alignment=TA_CENTER, wordWrap='CJK'
))
styles.add(ParagraphStyle(
    name='TableCell', fontName='AU', fontSize=7.1, leading=9.4, textColor=INK_SOFT,
    wordWrap='CJK'
))
styles.add(ParagraphStyle(
    name='TableHead', fontName='AUBold', fontSize=7.2, leading=9.4, textColor=WHITE,
    alignment=TA_CENTER, wordWrap='CJK'
))
styles.add(ParagraphStyle(
    name='TableNote', fontName='AU', fontSize=6.7, leading=8.8, textColor=MUTED,
    wordWrap='CJK'
))


def esc(text):
    return str(text).replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')


def P(text, style='CNBody'):
    return Paragraph(esc(text), styles[style])


def rich(text, style='CNBody'):
    return Paragraph(text, styles[style])


def on_page(canvas, doc):
    canvas.saveState()
    canvas.setTitle('BTC 跌至 8,000 美元也不爆仓？深度拆解 MSTR 的三重铁壁防御体系')
    canvas.setAuthor('HKU BitGates Society')
    canvas.setSubject('BitGates Research / Crypto Assets')
    canvas.setFillColor(CANVAS)
    canvas.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)
    # quiet grid
    canvas.setStrokeColor(colors.Color(0.08, 0.22, 0.19, alpha=0.055))
    canvas.setLineWidth(0.25)
    x = 12 * mm
    while x < PAGE_W:
        canvas.line(x, 0, x, PAGE_H)
        x += 18 * mm
    y = 12 * mm
    while y < PAGE_H:
        canvas.line(0, y, PAGE_W, y)
        y += 18 * mm
    # header
    canvas.setFillColor(GREEN)
    canvas.setFont('AUBold', 8.5)
    canvas.drawString(MARGIN_X, PAGE_H - 13 * mm, 'HKU BitGates Society · 港大比特盖茨学会')
    canvas.setFillColor(MUTED)
    canvas.setFont('AU', 7)
    canvas.drawRightString(PAGE_W - MARGIN_X, PAGE_H - 13 * mm, 'BitGates Research / Crypto Assets')
    canvas.setStrokeColor(LINE)
    canvas.setLineWidth(0.6)
    canvas.line(MARGIN_X, PAGE_H - 17 * mm, PAGE_W - MARGIN_X, PAGE_H - 17 * mm)
    # footer
    canvas.setStrokeColor(colors.Color(0.56, 0.19, 0.17, alpha=0.48))
    canvas.setLineWidth(1.0)
    canvas.line(MARGIN_X, 11 * mm, MARGIN_X + 28 * mm, 11 * mm)
    canvas.setFillColor(MUTED)
    canvas.setFont('AU', 7)
    canvas.drawString(MARGIN_X + 32 * mm, 9.8 * mm, 'bitgates.cn')
    canvas.drawRightString(PAGE_W - MARGIN_X, 9.8 * mm, f'Page {doc.page}')
    canvas.restoreState()


def make_doc(path):
    doc = BaseDocTemplate(
        str(path), pagesize=A4, leftMargin=MARGIN_X, rightMargin=MARGIN_X,
        topMargin=TOP, bottomMargin=BOTTOM
    )
    frame = Frame(MARGIN_X, BOTTOM + 5 * mm, CONTENT_W, PAGE_H - TOP - BOTTOM - 9 * mm, id='normal')
    doc.addPageTemplates([PageTemplate(id='main', frames=[frame], onPage=on_page)])
    return doc


def section(title, kicker=None):
    flow = []
    if kicker:
        flow.append(P(kicker, 'Kicker'))
    flow.append(P(title, 'H2'))
    return flow


def callout(title, body, accent=GREEN):
    data = [[rich(f'<font color="{RED.hexval()}">{esc(title)}</font>', 'H3')], [P(body, 'CNBody')]]
    t = Table(data, colWidths=[CONTENT_W], hAlign='LEFT')
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), WHITE),
        ('BOX', (0, 0), (-1, -1), 0.7, LINE),
        ('LEFTPADDING', (0, 0), (-1, -1), 10),
        ('RIGHTPADDING', (0, 0), (-1, -1), 10),
        ('TOPPADDING', (0, 0), (-1, -1), 7),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 7),
    ]))
    return KeepTogether([t, Spacer(1, 6)])


def bullets(items):
    rows = []
    for i, text in enumerate(items, 1):
        rows.append([P(f'{i:02d}', 'H3'), P(text, 'CNBody')])
    t = Table(rows, colWidths=[16 * mm, CONTENT_W - 16 * mm], hAlign='LEFT')
    t.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('LEFTPADDING', (0, 0), (-1, -1), 0),
        ('RIGHTPADDING', (0, 0), (-1, -1), 6),
        ('TOPPADDING', (0, 0), (-1, -1), 2),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
        ('LINEBELOW', (0, 0), (-1, -2), 0.35, LINE),
    ]))
    return t


def make_table(headers, rows, widths, note=None, compact=False, keep=True):
    style_cell = 'Tiny' if compact else 'TableCell'
    data = [[P(h, 'TableHead') for h in headers]]
    for row in rows:
        data.append([P(c, style_cell) for c in row])
    t = Table(data, colWidths=widths, repeatRows=1, hAlign='LEFT', splitByRow=1)
    commands = [
        ('BACKGROUND', (0, 0), (-1, 0), GREEN),
        ('TEXTCOLOR', (0, 0), (-1, 0), WHITE),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('GRID', (0, 0), (-1, -1), 0.35, LINE),
        ('LEFTPADDING', (0, 0), (-1, -1), 5),
        ('RIGHTPADDING', (0, 0), (-1, -1), 5),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
    ]
    for r in range(1, len(data)):
        if r % 2 == 0:
            commands.append(('BACKGROUND', (0, r), (-1, r), colors.HexColor('#f5f2e8')))
        else:
            commands.append(('BACKGROUND', (0, r), (-1, r), WHITE))
    t.setStyle(TableStyle(commands))
    flow = [t]
    if note:
        flow += [Spacer(1, 4), P(note, 'TableNote')]
    if keep:
        return [KeepTogether(flow)]
    return flow


def metric_strip(metrics):
    row = []
    for value, label in metrics:
        row.append([P(value, 'Metric'), P(label, 'MetricLabel')])
    cells = []
    for item in row:
        nested = Table([[item[0]], [item[1]]], colWidths=[CONTENT_W / len(metrics) - 4])
        nested.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), WHITE),
            ('BOX', (0, 0), (-1, -1), 0.5, LINE),
            ('TOPPADDING', (0, 0), (-1, -1), 7),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 7),
        ]))
        cells.append(nested)
    t = Table([cells], colWidths=[CONTENT_W / len(metrics)] * len(metrics))
    t.setStyle(TableStyle([('VALIGN', (0, 0), (-1, -1), 'TOP'), ('LEFTPADDING', (0, 0), (-1, -1), 2), ('RIGHTPADDING', (0, 0), (-1, -1), 2)]))
    return t


def cover_flow():
    logo = ROOT / 'public/assets/btg-logo-dark.png'
    flow = [Spacer(1, 12 * mm)]
    if logo.exists():
        flow.append(Image(str(logo), width=42 * mm, height=25 * mm))
        flow.append(Spacer(1, 12))
    flow += [
        P('BitGates Research / Crypto Assets', 'Kicker'),
        P('BTC 跌至 8,000 美元也不爆仓？', 'H1'),
        P('深度拆解 MSTR 的三重铁壁防御体系', 'H1'),
        P('A professional PDF edition rebuilt from the research draft with structured tables, liquidity math, and scenario analysis.', 'CNBody'),
        Spacer(1, 8),
        metric_strip([
            ('8,000', 'BTC stress price / 美元'),
            ('0.96x', 'coverage ratio / 覆盖比率'),
            ('22.5B', 'cash reserve / 美元'),
            ('17.26B', 'two-year rigid outflow / 美元'),
        ]),
        Spacer(1, 14),
        callout('Published edition note', '本 PDF 为网站导出的正式研报版式。原始 DOCX/Markdown 中被拆散的表格已重新结构化，所有关键数字以表格、公式和情景口径呈现，避免把制表残片直接交付给读者。'),
        Spacer(1, 8),
        P('发布日期：2026-02-14    来源：BitGates 加密资产行研小组    方向：Crypto Assets', 'Small'),
        P('免责声明：本文仅用于教育与研究交流，不构成投资建议或任何证券、数字资产买卖建议。', 'Small'),
    ]
    return flow


def build_story():
    story = cover_flow()
    story.append(PageBreak())

    story += section('一、执行摘要', 'EXECUTIVE SUMMARY')
    story.append(P('本文围绕 MicroStrategy（MSTR）的数字资产财库（DAT）模式，拆解其在极端熊市下的流动性防线。核心问题不是“BTC 下跌会不会触发保证金式强平”，而是 MSTR 能否在不主动出售 BTC 的前提下，用现金储备、低息可转债结构和资本市场融资能力穿越周期。'))
    story.append(bullets([
        'MSTR 的债务以无担保高级可转债为主，不是保证金贷款结构。BTC 价格下跌本身不会自动触发追加抵押或强制平仓。',
        '研究模型将 8,000 美元 BTC 价格视为关键生存阈值。在该情景下，717,131 枚 BTC 约合 57.4 亿美元，接近约 60 亿美元净债务，对应覆盖比率约 0.96 倍。',
        '现金端，研究稿采用 22.5 亿美元现金及等价物作为 USD Reserve 口径，未来两年刚性支出约 17.26 亿美元，对现金储备覆盖率约 76.7%。',
        '历史端，2022 年更严酷的熊市曾验证其资本运作韧性。MSTR 通过担保贷款、ATM 股权融资等工具延续 BTC 策略，没有因短期价格暴跌陷入偿付困境。'
    ]))

    story += section('二、DAT 与 mNAV：为什么 MSTR 不等同于 BTC ETF', 'FRAMEWORK')
    story.append(P('DAT（Digital Asset Treasury）是指将数字资产作为资产负债表核心资产的上市公司。相较 BTC 现货 ETF，DAT 公司具有更高波动性、更实时的价格发现机制和融资再购买资产的经营杠杆。'))
    story.append(P('牛市中，DAT 公司常围绕 mNAV（modified Net Asset Value）形成正向飞轮：市场给出 BTC 净值溢价，公司通过 ATM 股权发行或低息可转债融资，再增持 BTC，提高每股 BTC 敞口和叙事强度。熊市中，市场关注点转向现金储备、到期债务、利息与分红义务。'))
    story.append(callout('研究前提', '后文测算建立在一个关键假设上：MSTR 不主动出售其 BTC 持仓。若该前提变化，覆盖比率和流动性判断需要重新建模。'))

    story.append(PageBreak())
    story += section('三、可转债结构：低息、无抵押、无 margin call', 'CAPITAL STRUCTURE')
    story += make_table(
        ['发行日期', '金额', '利率', '到期 / 转换价', '状态及备注'],
        [
            ['2020年12月', '6.5亿美元', '0.75%', '2025-12-15 / 约397.99美元/股', '已赎回。2024年6月强制转换，节省约700万美元利息。'],
            ['2021年2月', '10.5亿美元', '0%', '2027-02-15 / 约1,432.46美元/股', '活跃。若熊市持续，持有人更可能要求还本而非转股。'],
            ['2021年6月', '5亿美元', '6.125%', '2028-06-15 / 不详', '已赎回。高级债券，非纯可转换债券。'],
            ['2024年3月（第一笔）', '8亿美元', '0.625%', '2030-03-15 / 约2,327美元/股', '活跃。低票息长期资金。'],
            ['2024年3月（第二笔）', '6亿美元', '0.875%', '2031-03-15 / 不详', '活跃。'],
            ['2024年6月', '8亿美元', '2.25%', '2032-06-15 / 不详', '活跃。'],
            ['2024年9月', '10亿美元', '0.625%', '2028-09-15 / 不详', '活跃。2028 年到期压力项之一。'],
            ['2024年11月', '30亿美元', '0%', '2029-12-01 / 约672美元/股', '活跃。2029-06-01 前在特定条件下可转换。'],
            ['2025年2月', '20亿美元', '0%', '2030-03-01 / 不详', '活跃。持有人可在 2028-03-01 要求回购。'],
        ],
        [23*mm, 22*mm, 15*mm, 39*mm, CONTENT_W - 99*mm],
        note='来源：原始研究稿整理自 SEC 文件口径。表格将 DOCX 转换后被拆开的字段重新合并，便于读者判断到期压力和利率结构。',
        compact=True
    )
    story.append(P('核心判断：这些可转债没有 margin call，同时缺乏 BTC 抵押物强制清算机制。到期时，公司需要处理还本付息或转股问题，但不会因 BTC 价格下跌自动触发保证金式强制卖币。'))

    story += section('四、固定义务与现金覆盖：两年压力测试', 'LIQUIDITY BRIDGE')
    story.append(P('根据研究稿口径，MSTR 年度固定财务义务约 8.88 亿美元。原始文本中“其他优先股分红 7.13 亿美元”实际应理解为优先股分红合计口径；否则会与总额产生重复计算。正式版 PDF 已将该口径修正为制表形式。'))
    story += make_table(
        ['项目', '金额（美元）', '说明'],
        [
            ['债务利息支出', '3,500万', '可转债票息整体较低，利息压力有限。'],
            ['STRF 系列优先股分红', '1.28亿', '固定分红义务之一。'],
            ['STRC 系列优先股分红', '3.80亿', '优先股分红中的最大单项。'],
            ['STRE 系列优先股分红', '9,200万', '固定分红义务之一。'],
            ['STRK 系列优先股分红', '1.12亿', '固定分红义务之一。'],
            ['优先股分红合计', '约7.13亿', '由各 STR 系列优先股分红构成，作为合计口径使用。'],
            ['非累积普通股分红', '1.40亿', '普通股侧现金流出假设。'],
            ['年度固定义务合计', '约8.88亿', '债务利息 + 优先股分红合计 + 普通股分红。'],
        ],
        [44*mm, 33*mm, CONTENT_W - 77*mm]
    )
    story.append(Spacer(1, 6))
    story += make_table(
        ['两年压力项目', '金额', '现金覆盖含义'],
        [
            ['未来两年刚性支出合计', '约17.26亿美元', '研究模型口径：8.88亿 + 1.25亿 + 7.13亿。'],
            ['当前现金及等价物', '约22.5亿美元', '2026-02-01 USD Reserve 口径。'],
            ['现金使用比例', '约76.7%', '22.5 亿美元储备足以覆盖刚性支出，并剩余约 5.24 亿美元缓冲。'],
        ],
        [44*mm, 32*mm, CONTENT_W - 76*mm]
    )

    story.append(PageBreak())
    story += section('五、软件业务与历史现金消耗', 'OPERATING CASH FLOW')
    story.append(P('软件业务收入提供了经营现金流基础，但其规模相对 BTC 持仓和资本结构并不构成主要安全垫。研究稿将其视为“稳定但不足以单独覆盖极端周期融资需求”的经营端底座。'))
    story += make_table(
        ['年份 / 期间', '总收入', '许可+订阅', '许可', '订阅', '支持服务', '其他服务'],
        [
            ['2021全年', '510.8M', '144.9M (+15% YoY)', '101.8M', '43.1M', '281.2M', '84.7M'],
            ['2022全年', '499.3M', '147.3M (+1.6% YoY)', '86.5M', '60.8M (+41%)', '266.5M', '85.5M'],
            ['2025 Q4', '123.0M', '未拆分', '未拆分', '未拆分', '未拆分', '未拆分'],
            ['2026 run-rate 假设', '约500M', '按季度约125M估算', '—', '—', '—', '—'],
        ],
        [24*mm, 21*mm, 34*mm, 20*mm, 25*mm, 24*mm, CONTENT_W - 148*mm],
        note='单位：百万美元。2025 Q4 与 2026 run-rate 为研究稿估算口径。',
        compact=True
    )

    story += make_table(
        ['时间点', '现金储备（百万美元）', '备注'],
        [
            ['2022 Q1', '94', '熊市初期，储备较高。'],
            ['2022 Q2', '66', 'BTC 价格持续下行。'],
            ['2022 Q3', '45', '低点区间，现金储备明显压缩。'],
            ['2022 Q4', '43.8–47', '年末现金：美国 14.8M + 非美国 29.0M。'],
            ['2023 Q1', '81', '熊市后期反弹。'],
            ['2023 Q2', '66–67', '储备维持低位但未失控。'],
        ],
        [34*mm, 40*mm, CONTENT_W - 74*mm]
    )

    story += section('六、2022 熊市压力对照', 'BEAR MARKET REFERENCE')
    story += make_table(
        ['年份', '总运营费用', '拆分', '研究含义'],
        [
            ['2022', '1,672M', '销售与市场 147M；研发 127M；一般行政 111M；数字资产减值 1,286M。', '剔除非现金减值后，经营与利息现金流出约 390M，远高于当时平均现金储备。'],
            ['2023', '501M', '销售与市场 150M；研发 121M；一般行政 115M；数字资产减值/收益净额 116M。', '运营支出回落，但上半年现金流出相对现金储备仍高。'],
        ],
        [22*mm, 26*mm, 68*mm, CONTENT_W - 116*mm]
    )
    story.append(P('融资工具箱方面，2022 年公司使用担保定期贷款、ATM 股权发行、股票期权行使与员工购股计划等渠道补充流动性。历史数据说明，其生存逻辑高度依赖资本市场再融资能力，但也验证了管理层在逆周期中的资本运作能力。'))

    story.append(PageBreak())
    story += section('七、8,000 美元 BTC 情景测算', 'SCENARIO ANALYSIS')
    story += make_table(
        ['变量', '数值', '计算说明'],
        [
            ['BTC 持仓数量', '717,131 枚', '研究稿口径。'],
            ['情景价格', '8,000 美元 / BTC', '极端下行情景。'],
            ['BTC 持仓市值', '约57.4亿美元', '717,131 × 8,000 = 5,737,048,000 美元。'],
            ['总债务', '约82.5亿美元', '研究稿债务口径。'],
            ['现金储备', '约22.5亿美元', 'USD Reserve 口径。'],
            ['净债务', '约60.0亿美元', '82.5 亿 - 22.5 亿。'],
            ['覆盖比率', '约0.96倍', 'BTC 持仓市值 / 净债务 = 57.4 / 60。'],
        ],
        [35*mm, 35*mm, CONTENT_W - 70*mm]
    )
    story.append(callout('阈值含义', '0.96 倍并不代表完全没有风险，而是说明在 8,000 美元极端情景下，BTC 核心资产价值与净债务规模已基本接近。只要 BTC 价格高于该阈值，MSTR 仍拥有继续融资和维持持仓策略的空间。'))

    story += section('八、结论与风险观察', 'CONCLUSION')
    story.append(P('MSTR 的财务韧性来自三层支撑：第一，ATM 带来的现金储备覆盖未来两年主要刚性支出；第二，可转债和其他资本工具提供了较低票息、较长期限的融资结构；第三，BTC 价格安全边际清晰，8,000 美元形成研究稿中的关键生存阈值。'))
    story.append(bullets([
        '风险一：若 BTC 跌破 8,000 美元并长时间停留，覆盖比率将显著恶化，市场对其再融资能力的信心可能快速收缩。',
        '风险二：若优先股分红、普通股分红或债务回购压力高于模型假设，现金缓冲会被压缩。',
        '风险三：若资本市场窗口关闭，MSTR 的历史融资工具箱未必能以同等成本复现。',
        '风险四：DAT 溢价本身具有周期性，mNAV 飞轮在熊市中可能反向运转，放大股价波动。'
    ]))
    story.append(P('最终判断：MSTR 不存在保证金贷款式“BTC 下跌即强平”的机械风险。真正需要关注的是现金消耗、到期债务、分红义务和再融资窗口之间的动态平衡。', 'H3'))
    story.append(Spacer(1, 8))
    story.append(P('© 2026 HKU BitGates Society. This research PDF is for education and discussion only.', 'Small'))
    return story


def main():
    primary = OUTS[0]
    primary.parent.mkdir(parents=True, exist_ok=True)
    doc = make_doc(primary)
    doc.build(build_story())
    data = primary.read_bytes()
    print(primary)

    for out in OUTS[1:]:
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_bytes(data)
        print(out)

if __name__ == '__main__':
    main()
