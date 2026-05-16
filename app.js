const body = document.body;
const languageButtons = Array.from(document.querySelectorAll('[data-lang]'));
const savedMode = localStorage.getItem('bitgates-language-mode');
const validModes = new Set(['bilingual', 'zh', 'en']);
const initialMode = validModes.has(savedMode) ? savedMode : 'bilingual';

function setMode(mode) {
  body.dataset.mode = mode;
  document.documentElement.lang = mode === 'en' ? 'en' : 'zh-Hans';
  localStorage.setItem('bitgates-language-mode', mode);
  languageButtons.forEach((button) => {
    const active = button.dataset.lang === mode;
    button.setAttribute('aria-pressed', String(active));
  });
}

languageButtons.forEach((button) => {
  button.addEventListener('click', () => setMode(button.dataset.lang));
});
setMode(initialMode);

const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    navMenu.classList.toggle('is-open', !expanded);
  });

  navMenu.addEventListener('click', (event) => {
    if (event.target.closest('a')) {
      navToggle.setAttribute('aria-expanded', 'false');
      navMenu.classList.remove('is-open');
    }
  });
}

const researchCategories = [
  { slug: 'traditional-assets', title: { zh: '传统资产', en: 'Traditional Assets' } },
  { slug: 'crypto-assets', title: { zh: '加密资产', en: 'Crypto Assets' } },
  { slug: 'compliance', title: { zh: '合规', en: 'Compliance' } }
];

const researchReports = [
  {
    slug: '260214-mstr',
    category: 'crypto-assets',
    lane: { zh: '加密资产', en: 'Crypto Assets' },
    status: { zh: '已发布', en: 'Published' },
    title: {
      zh: 'BTC跌至 8,000 美元也不爆仓？深度拆解 MSTR 的三重铁壁防御体系',
      en: 'BTC at $8,000 Without Liquidation? A Deep Dive into MSTR Defense'
    },
    date: { zh: '2026年2月14日', en: 'Feb 14, 2026' },
    dateIso: '2026-02-14',
    author: { zh: 'BitGates 加密资产行研小组', en: 'BitGates Crypto Assets Research Group' },
    summary: {
      zh: '本文围绕 MicroStrategy 的 DAT 模式、可转债结构、现金储备、优先股分红与 BTC 覆盖比率，拆解 MSTR 在极端熊市下的流动性防线与 8,000 美元生存阈值。',
      en: 'This report analyzes MicroStrategy as a digital asset treasury, covering convertible notes, cash reserves, preferred dividends, and BTC coverage ratio to evaluate MSTR liquidity resilience and its $8,000 survival threshold.'
    },
    tags: ['MSTR', 'Bitcoin', 'DAT', 'Convertible Notes', 'Liquidity'],
    highlights: [
      { zh: 'MSTR 债务以无担保高级可转债为主，不存在保证金贷款式强制平仓机制。', en: 'MSTR debt is primarily unsecured senior convertible notes, not margin loans with forced liquidation mechanics.' },
      { zh: '现金储备可覆盖未来两年主要刚性财务支出，并留有缓冲。', en: 'Current cash reserves can cover major fixed financial obligations for the next two years with remaining buffer.' },
      { zh: '8,000 美元 BTC 情景下，持仓价值与净债务基本接近，形成关键生存阈值。', en: 'At an $8,000 BTC scenario, BTC holdings remain close to net debt value, forming a key survival threshold.' }
    ],
    source: {
      docx: 'assets/reports/260214-mstr.docx',
      markdown: 'assets/reports/260214-mstr.md',
      filename: '260214 MSTR.docx',
      pdf: 'assets/reports/260214-mstr.pdf',
      pdfFilename: '260214 MSTR BitGates Research.pdf'
    }
  }
];

let activeReportFilter = 'all';

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
  }[char]));
}

function getReportUrl(slug) {
  const base = `${window.location.origin}${window.location.pathname}`;
  return `${base}#report-${slug}`;
}

function bilingual(pair, className = '') {
  const cls = className ? ` class="${className}"` : '';
  return `<span${cls}><span class="zh">${escapeHtml(pair.zh)}</span><span class="en">${escapeHtml(pair.en)}</span></span>`;
}

function sortedReports(filter = activeReportFilter) {
  return researchReports
    .filter((report) => filter === 'all' || report.category === filter)
    .sort((a, b) => new Date(b.dateIso) - new Date(a.dateIso));
}

function updateReportCounts() {
  const countTargets = Array.from(document.querySelectorAll('[data-report-count]'));
  countTargets.forEach((target) => {
    const filter = target.dataset.reportCount;
    target.textContent = String(sortedReports(filter).length);
  });
}

function updateFilterButtons(filter) {
  document.querySelectorAll('[data-report-filter]').forEach((button) => {
    const active = button.dataset.reportFilter === filter;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-selected', String(active));
  });
}

function renderReportCard(report, index) {
  const tags = report.tags.map((tag) => `<li>${escapeHtml(tag)}</li>`).join('');
  const highlights = report.highlights.map((item, itemIndex) => `
        <li>
          <span class="report-highlight-index">${String(itemIndex + 1).padStart(2, '0')}</span>
          <span class="report-highlight-text">${bilingual(item)}</span>
        </li>`).join('');
  const sourceLinks = [];
  if (report.source?.pdf) {
    sourceLinks.push(`<a href="${escapeHtml(report.source.pdf)}" download="${escapeHtml(report.source.pdfFilename || '')}"><span class="zh">正式 PDF</span><span class="en">Research PDF</span></a>`);
  }
  if (report.source?.docx) {
    sourceLinks.push(`<a href="${escapeHtml(report.source.docx)}" download="${escapeHtml(report.source.filename || '')}"><span class="zh">原文文档</span><span class="en">Source DOCX</span></a>`);
  }
  const sourceAction = sourceLinks.length ? `
      <div class="report-file-actions">
        ${sourceLinks.join('')}
      </div>` : '';

  return `
    <article class="report-card" id="report-${escapeHtml(report.slug)}">
      <div class="report-card-head">
        <span>${String(index + 1).padStart(2, '0')}</span>
        <strong>${bilingual(report.status)}</strong>
      </div>
      <p class="report-lane">${bilingual(report.lane)}</p>
      <h4>${bilingual(report.title)}</h4>
      <div class="report-byline">
        <span>${bilingual(report.date)}</span>
        <span>${bilingual(report.author)}</span>
      </div>
      <div class="report-summary bilingual-stack">
        <p class="zh">${escapeHtml(report.summary.zh)}</p>
        <p class="en">${escapeHtml(report.summary.en)}</p>
      </div>
      <div class="report-insight-block">
        <p class="report-insight-label"><span class="zh">关键判断</span><span class="en">Key findings</span></p>
        <ul class="report-highlights">${highlights}</ul>
      </div>
      <ul class="report-tags">${tags}</ul>
      ${sourceAction}
      <div class="report-card-actions">
        <button type="button" data-report-share="${escapeHtml(report.slug)}"><span class="zh">分享网址</span><span class="en">Share URL</span></button>
        <button type="button" data-report-pdf="${escapeHtml(report.slug)}"><span class="zh">导出 PDF</span><span class="en">Export PDF</span></button>
        <button type="button" data-report-print="${escapeHtml(report.slug)}"><span class="zh">打印 PDF</span><span class="en">Print PDF</span></button>
      </div>
    </article>`;
}

function renderResearchReports(filter = activeReportFilter) {
  const grid = document.getElementById('reports-grid');
  const empty = document.getElementById('reports-empty');
  const count = document.getElementById('reports-count');
  if (!grid) return;

  activeReportFilter = filter;
  const reports = sortedReports(filter);
  grid.innerHTML = reports.map(renderReportCard).join('');

  if (empty) empty.hidden = reports.length > 0;
  if (count) {
    count.innerHTML = `<span class="zh">${reports.length} 篇文章</span><span class="en">${reports.length} report${reports.length === 1 ? '' : 's'}</span>`;
  }
  updateReportCounts();
  updateFilterButtons(filter);
}

function currentLanguageText(zh, en) {
  return body.dataset.mode === 'en' ? en : zh;
}

function flashButton(button, zh, en) {
  if (!button) return;
  const original = button.innerHTML;
  button.textContent = currentLanguageText(zh, en);
  button.disabled = true;
  window.setTimeout(() => {
    button.innerHTML = original;
    button.disabled = false;
  }, 1400);
}

const qrDialog = document.getElementById('wechat-qr-dialog');
let lastQrTrigger = null;

function openWechatQr(trigger) {
  if (!qrDialog) return;
  lastQrTrigger = trigger || document.activeElement;
  qrDialog.hidden = false;
  body.classList.add('is-qr-open');
  window.setTimeout(() => {
    const closeButton = qrDialog.querySelector('.qr-close');
    if (closeButton) closeButton.focus();
  }, 0);
}

function closeWechatQr() {
  if (!qrDialog || qrDialog.hidden) return;
  qrDialog.hidden = true;
  body.classList.remove('is-qr-open');
  if (lastQrTrigger && typeof lastQrTrigger.focus === 'function') {
    lastQrTrigger.focus();
  }
}

async function shareReport(slug, button) {
  const report = researchReports.find((item) => item.slug === slug);
  if (!report) return;
  const url = getReportUrl(slug);
  const title = body.dataset.mode === 'en' ? report.title.en : report.title.zh;
  try {
    if (navigator.share) {
      await navigator.share({ title, url });
      flashButton(button, '已打开分享', 'Shared');
      return;
    }
    await navigator.clipboard.writeText(url);
    flashButton(button, '网址已复制', 'URL copied');
  } catch (error) {
    const textArea = document.createElement('textarea');
    textArea.value = url;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    textArea.remove();
    flashButton(button, '网址已复制', 'URL copied');
  }
}

async function fetchTextAsset(path) {
  const response = await fetch(path);
  if (!response.ok) throw new Error(`Unable to fetch ${path}`);
  return response.text();
}

function reportToMarkdown(report) {
  const highlightText = report.highlights.map((item) => `- ${item.zh} | ${item.en}`).join('\n');
  const tagText = report.tags.join(', ');
  return `# ${report.title.zh} | ${report.title.en}\n\n` +
    `Status: ${report.status.zh} | ${report.status.en}\n\n` +
    `Lane: ${report.lane.zh} | ${report.lane.en}\n\n` +
    `Date: ${report.date.zh} | ${report.date.en}\n\n` +
    `Author: ${report.author.zh} | ${report.author.en}\n\n` +
    `Share URL: ${getReportUrl(report.slug)}\n\n` +
    `## Summary\n\n${report.summary.zh}\n\n${report.summary.en}\n\n` +
    `## Highlights\n\n${highlightText}\n\n` +
    `## Tags\n\n${tagText}\n`;
}

async function getReportFullText(report) {
  let fullText = reportToMarkdown(report);
  if (report.source?.markdown) {
    try {
      fullText = await fetchTextAsset(report.source.markdown);
    } catch (error) {
      fullText = reportToMarkdown(report);
    }
  }
  return fullText;
}

function setReportActionBusy(button, zh, en) {
  if (!button) return () => {};
  const original = button.innerHTML;
  button.disabled = true;
  button.textContent = currentLanguageText(zh, en);
  return () => {
    button.innerHTML = original;
    button.disabled = false;
  };
}

function markdownToPrintHtml(markdown) {
  return markdown.split(/\n+/).map((line) => {
    const value = line.trim();
    if (!value) return '';
    if (value.startsWith('### ')) return `<h3>${escapeHtml(value.slice(4))}</h3>`;
    if (value.startsWith('## ')) return `<h2>${escapeHtml(value.slice(3))}</h2>`;
    if (value.startsWith('# ')) return `<h2>${escapeHtml(value.slice(2))}</h2>`;
    if (value.startsWith('- ')) return `<p class="print-bullet">${escapeHtml(value.slice(2))}</p>`;
    return `<p>${escapeHtml(value)}</p>`;
  }).join('');
}

function printContentForReport(report, fullText = '') {
  const highlights = report.highlights.map((item) => `<li>${escapeHtml(item.zh)} | ${escapeHtml(item.en)}</li>`).join('');
  const fullReport = fullText ? `<div class="print-full-report">${markdownToPrintHtml(fullText)}</div>` : '';
  return `
    <div class="print-document">
      <p class="print-kicker">HKU BitGates Society · 港大比特盖茨学会</p>
      <article class="print-report-card">
        <p class="print-meta">${escapeHtml(report.status.zh)} | ${escapeHtml(report.status.en)} · ${escapeHtml(report.lane.zh)} | ${escapeHtml(report.lane.en)}</p>
        <h1>${escapeHtml(report.title.zh)}<br><span>${escapeHtml(report.title.en)}</span></h1>
        <p class="print-byline">${escapeHtml(report.date.zh)} | ${escapeHtml(report.date.en)} · ${escapeHtml(report.author.zh)} | ${escapeHtml(report.author.en)}</p>
        <p>${escapeHtml(report.summary.zh)}</p>
        <p>${escapeHtml(report.summary.en)}</p>
        <ul>${highlights}</ul>
        ${fullReport}
        <p class="print-link">${escapeHtml(getReportUrl(report.slug))}</p>
      </article>
    </div>`;
}

function parseReportMarkdownBlocks(markdown) {
  const blocks = [];
  let paragraph = [];
  let skippedTitle = false;

  const flushParagraph = () => {
    if (!paragraph.length) return;
    const text = paragraph.join(' ').replace(/\s+/g, ' ').trim();
    if (text) blocks.push({ type: 'p', text });
    paragraph = [];
  };

  markdown.split(/\r?\n/).forEach((line) => {
    const value = line.trim();
    if (!value) {
      flushParagraph();
      return;
    }

    if (/^(发布日期|研究方向|来源)：/.test(value)) {
      flushParagraph();
      return;
    }

    const heading = value.match(/^(#{1,3})\s+(.+)$/);
    if (heading) {
      flushParagraph();
      const level = heading[1].length;
      const text = heading[2].trim();
      if (level === 1 && !skippedTitle) {
        skippedTitle = true;
        return;
      }
      blocks.push({ type: level === 2 ? 'h2' : 'h3', text });
      return;
    }

    if (/^[-*]\s+/.test(value)) {
      flushParagraph();
      blocks.push({ type: 'bullet', text: value.replace(/^[-*]\s+/, '') });
      return;
    }

    paragraph.push(value);
  });

  flushParagraph();
  return blocks;
}

const pdfTheme = {
  page: '#f3efe2',
  paper: '#faf7ee',
  paperDeep: '#ece6d6',
  ink: '#163a32',
  inkSoft: '#3c5148',
  muted: '#687268',
  green: '#153f35',
  greenDeep: '#0f302a',
  red: '#8f302c',
  brass: '#a2763b',
  line: '#d6ccba',
  mist: '#dfe8d7'
};

const pdfPage = {
  width: 1240,
  height: 1754,
  pointWidth: 595.28,
  pointHeight: 841.89,
  marginX: 110,
  marginTop: 142,
  marginBottom: 126
};

const pdfFont = '"Avenir Next", "Helvetica Neue", Arial, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif';
const pdfSerif = '"Songti SC", "STFangsong", Georgia, serif';

function setPdfFont(ctx, weight, size, family = pdfFont) {
  ctx.font = `${weight} ${size}px ${family}`;
}

function roundedRect(ctx, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + width - r, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + r);
  ctx.lineTo(x + width, y + height - r);
  ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  ctx.lineTo(x + r, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function drawPdfBackdrop(ctx, pageNumber, label = 'RESEARCH REPORT') {
  ctx.fillStyle = pdfTheme.page;
  ctx.fillRect(0, 0, pdfPage.width, pdfPage.height);

  ctx.strokeStyle = 'rgba(21, 63, 53, 0.055)';
  ctx.lineWidth = 1;
  for (let x = 68; x < pdfPage.width; x += 78) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, pdfPage.height);
    ctx.stroke();
  }
  for (let y = 76; y < pdfPage.height; y += 78) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(pdfPage.width, y);
    ctx.stroke();
  }

  const headerY = 56;
  setPdfFont(ctx, 760, 22);
  ctx.fillStyle = pdfTheme.green;
  ctx.fillText('HKU BitGates Society', pdfPage.marginX, headerY);
  setPdfFont(ctx, 650, 15);
  ctx.fillStyle = pdfTheme.red;
  ctx.letterSpacing = '2px';
  ctx.fillText('港大比特盖茨学会', pdfPage.marginX, headerY + 28);
  ctx.letterSpacing = '0px';

  setPdfFont(ctx, 720, 13);
  ctx.fillStyle = pdfTheme.muted;
  ctx.textAlign = 'right';
  ctx.fillText(label, pdfPage.width - pdfPage.marginX, headerY + 1);
  ctx.fillStyle = pdfTheme.brass;
  ctx.fillText(`PAGE ${String(pageNumber).padStart(2, '0')}`, pdfPage.width - pdfPage.marginX, headerY + 28);
  ctx.textAlign = 'left';

  ctx.strokeStyle = pdfTheme.line;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(pdfPage.marginX, 116);
  ctx.lineTo(pdfPage.width - pdfPage.marginX, 116);
  ctx.stroke();

  ctx.strokeStyle = 'rgba(143, 48, 44, 0.48)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(pdfPage.marginX, pdfPage.height - 76);
  ctx.lineTo(pdfPage.marginX + 160, pdfPage.height - 76);
  ctx.stroke();
  setPdfFont(ctx, 620, 13);
  ctx.fillStyle = pdfTheme.muted;
  ctx.fillText('bitgates.cn', pdfPage.marginX + 182, pdfPage.height - 70);
}

function tokenizeForPdf(text) {
  return String(text).match(/[\u3400-\u9fff\u3000-\u303f\uff00-\uffef]|[A-Za-z0-9$€£¥%.,:;!?()\[\]\/+'’#&=<>~]+|\s+|./g) || [];
}

function wrapPdfText(ctx, text, maxWidth) {
  const tokens = tokenizeForPdf(text);
  const lines = [];
  let line = '';

  const pushLine = () => {
    const clean = line.trim();
    if (clean) lines.push(clean);
    line = '';
  };

  tokens.forEach((token) => {
    if (/^\s+$/.test(token)) {
      if (line && !/\s$/.test(line)) line += ' ';
      return;
    }

    const candidate = line ? `${line}${token}` : token;
    if (ctx.measureText(candidate).width <= maxWidth) {
      line = candidate;
      return;
    }

    if (line) pushLine();

    if (ctx.measureText(token).width <= maxWidth) {
      line = token;
      return;
    }

    let part = '';
    Array.from(token).forEach((char) => {
      const test = part + char;
      if (ctx.measureText(test).width > maxWidth && part) {
        lines.push(part);
        part = char;
      } else {
        part = test;
      }
    });
    line = part;
  });

  pushLine();
  return lines;
}

function drawPdfWrappedText(ctx, text, x, y, maxWidth, lineHeight, options = {}) {
  setPdfFont(ctx, options.weight || 500, options.size || 24, options.family || pdfFont);
  ctx.fillStyle = options.color || pdfTheme.ink;
  const lines = wrapPdfText(ctx, text, maxWidth);
  const limit = options.maxLines ? lines.slice(0, options.maxLines) : lines;
  limit.forEach((line) => {
    ctx.fillText(line, x, y);
    y += lineHeight;
  });
  return y;
}

function drawPdfChip(ctx, text, x, y, fill, color) {
  setPdfFont(ctx, 760, 14);
  const width = ctx.measureText(text).width + 26;
  roundedRect(ctx, x, y, width, 34, 17);
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.fillStyle = color;
  ctx.fillText(text, x + 13, y + 22);
  return x + width + 10;
}

function createPdfCanvasPage(pageNumber, label) {
  const canvas = document.createElement('canvas');
  canvas.width = pdfPage.width;
  canvas.height = pdfPage.height;
  const ctx = canvas.getContext('2d');
  drawPdfBackdrop(ctx, pageNumber, label);
  return { canvas, ctx, y: pdfPage.marginTop };
}

function renderReportPdfCover(report) {
  const page = createPdfCanvasPage(1, 'RESEARCH DOSSIER');
  const { ctx } = page;
  const x = pdfPage.marginX;
  const width = pdfPage.width - pdfPage.marginX * 2;

  ctx.fillStyle = pdfTheme.greenDeep;
  roundedRect(ctx, x, 170, width, 1120, 34);
  ctx.fill();

  ctx.strokeStyle = 'rgba(250, 247, 238, 0.22)';
  ctx.lineWidth = 2;
  roundedRect(ctx, x + 26, 196, width - 52, 1068, 26);
  ctx.stroke();

  setPdfFont(ctx, 760, 15);
  ctx.fillStyle = '#dcc8a5';
  ctx.fillText('BITGATES RESEARCH ARCHIVE', x + 58, 258);

  setPdfFont(ctx, 840, 82);
  ctx.fillStyle = pdfTheme.paper;
  ctx.fillText('03', x + 58, 368);

  let chipX = x + 58;
  chipX = drawPdfChip(ctx, report.lane.en, chipX, 404, 'rgba(250, 247, 238, 0.12)', pdfTheme.paper);
  chipX = drawPdfChip(ctx, report.date.en, chipX, 404, 'rgba(143, 48, 44, 0.72)', pdfTheme.paper);
  drawPdfChip(ctx, 'PDF EXPORT', chipX, 404, 'rgba(162, 118, 59, 0.82)', pdfTheme.paper);

  let titleY = 548;
  titleY = drawPdfWrappedText(ctx, report.title.zh, x + 58, titleY, width - 116, 62, {
    weight: 820,
    size: 52,
    color: pdfTheme.paper
  });
  titleY += 20;
  drawPdfWrappedText(ctx, report.title.en, x + 60, titleY, width - 120, 40, {
    weight: 620,
    size: 29,
    color: '#d8dfd2'
  });

  const summaryY = 880;
  roundedRect(ctx, x + 58, summaryY, width - 116, 270, 24);
  ctx.fillStyle = 'rgba(250, 247, 238, 0.94)';
  ctx.fill();
  setPdfFont(ctx, 780, 15);
  ctx.fillStyle = pdfTheme.red;
  ctx.fillText('EXECUTIVE SUMMARY', x + 86, summaryY + 48);
  let y = summaryY + 88;
  y = drawPdfWrappedText(ctx, report.summary.zh, x + 86, y, width - 172, 32, {
    weight: 560,
    size: 23,
    color: pdfTheme.ink
  });
  drawPdfWrappedText(ctx, report.summary.en, x + 86, y + 12, width - 172, 28, {
    weight: 500,
    size: 18,
    color: pdfTheme.muted,
    maxLines: 3
  });

  const findingY = 1338;
  setPdfFont(ctx, 760, 15);
  ctx.fillStyle = pdfTheme.red;
  ctx.fillText('KEY FINDINGS', x, findingY);
  const cardGap = 18;
  const cardWidth = (width - cardGap * 2) / 3;
  report.highlights.slice(0, 3).forEach((item, index) => {
    const cardX = x + index * (cardWidth + cardGap);
    roundedRect(ctx, cardX, findingY + 34, cardWidth, 236, 22);
    ctx.fillStyle = pdfTheme.paper;
    ctx.fill();
    ctx.strokeStyle = pdfTheme.line;
    ctx.lineWidth = 1.5;
    ctx.stroke();
    setPdfFont(ctx, 820, 24);
    ctx.fillStyle = pdfTheme.brass;
    ctx.fillText(String(index + 1).padStart(2, '0'), cardX + 24, findingY + 82);
    drawPdfWrappedText(ctx, item.zh, cardX + 24, findingY + 124, cardWidth - 48, 26, {
      weight: 620,
      size: 19,
      color: pdfTheme.ink,
      maxLines: 4
    });
  });

  return page.canvas;
}

function renderReportPdfBody(report, blocks) {
  const pages = [];
  let pageNumber = 2;
  let page = createPdfCanvasPage(pageNumber, report.lane.en.toUpperCase());
  let { ctx } = page;
  let y = pdfPage.marginTop;
  const x = pdfPage.marginX;
  const width = pdfPage.width - pdfPage.marginX * 2;
  const bottom = pdfPage.height - pdfPage.marginBottom;

  const pushPage = () => {
    pages.push(page.canvas);
    pageNumber += 1;
    page = createPdfCanvasPage(pageNumber, report.lane.en.toUpperCase());
    ctx = page.ctx;
    y = pdfPage.marginTop;
  };

  const ensure = (height) => {
    if (y + height > bottom) pushPage();
  };

  blocks.forEach((block) => {
    if (block.type === 'h2') {
      setPdfFont(ctx, 820, 35);
      const lines = wrapPdfText(ctx, block.text, width);
      const height = lines.length * 43 + 38;
      ensure(height);
      y += 20;
      ctx.fillStyle = pdfTheme.red;
      ctx.beginPath();
      ctx.arc(x + 9, y - 12, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = pdfTheme.green;
      lines.forEach((line) => {
        ctx.fillText(line, x + 32, y);
        y += 43;
      });
      y += 18;
      return;
    }

    if (block.type === 'h3') {
      setPdfFont(ctx, 760, 25);
      const lines = wrapPdfText(ctx, block.text, width - 44);
      const height = lines.length * 32 + 30;
      ensure(height);
      roundedRect(ctx, x, y - 6, width, height - 6, 18);
      ctx.fillStyle = 'rgba(223, 232, 215, 0.64)';
      ctx.fill();
      ctx.fillStyle = pdfTheme.green;
      let lineY = y + 28;
      lines.forEach((line) => {
        ctx.fillText(line, x + 24, lineY);
        lineY += 32;
      });
      y += height + 8;
      return;
    }

    if (block.type === 'bullet') {
      setPdfFont(ctx, 520, 22);
      const lines = wrapPdfText(ctx, block.text, width - 54);
      lines.forEach((line, index) => {
        ensure(34);
        if (index === 0) {
          ctx.fillStyle = pdfTheme.brass;
          ctx.beginPath();
          ctx.arc(x + 10, y - 8, 5, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.fillStyle = pdfTheme.inkSoft;
        ctx.fillText(line, x + 34, y);
        y += 32;
      });
      y += 8;
      return;
    }

    setPdfFont(ctx, 500, 23);
    const lines = wrapPdfText(ctx, block.text, width);
    lines.forEach((line) => {
      ensure(34);
      ctx.fillStyle = pdfTheme.inkSoft;
      ctx.fillText(line, x, y);
      y += 34;
    });
    y += 18;
  });

  pages.push(page.canvas);
  return pages;
}

function base64ToBytes(value) {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function canvasToJpeg(canvas) {
  const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
  const [, base64] = dataUrl.split(',');
  return {
    width: canvas.width,
    height: canvas.height,
    bytes: base64ToBytes(base64)
  };
}

function encodePdfString(value) {
  return new TextEncoder().encode(value);
}

function buildPdfFromJpegs(images) {
  const parts = [];
  const offsets = [];
  let byteLength = 0;
  const append = (part) => {
    const value = typeof part === 'string' ? encodePdfString(part) : part;
    parts.push(value);
    byteLength += value.length;
  };
  const objectCount = 2 + images.length * 3;
  const addObject = (id, contentParts) => {
    offsets[id] = byteLength;
    append(`${id} 0 obj\n`);
    contentParts.forEach(append);
    append('\nendobj\n');
  };

  append('%PDF-1.4\n%\xE2\xE3\xCF\xD3\n');
  addObject(1, ['<< /Type /Catalog /Pages 2 0 R >>']);
  const pageIds = images.map((_, index) => 3 + index * 3);
  addObject(2, [`<< /Type /Pages /Count ${images.length} /Kids [${pageIds.map((id) => `${id} 0 R`).join(' ')}] >>`]);

  images.forEach((image, index) => {
    const pageId = 3 + index * 3;
    const imageId = pageId + 1;
    const contentId = pageId + 2;
    const imageName = `Im${index + 1}`;
    const drawCommand = `q\n${pdfPage.pointWidth} 0 0 ${pdfPage.pointHeight} 0 0 cm\n/${imageName} Do\nQ\n`;
    addObject(pageId, [`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pdfPage.pointWidth} ${pdfPage.pointHeight}] /Resources << /XObject << /${imageName} ${imageId} 0 R >> >> /Contents ${contentId} 0 R >>`]);
    addObject(imageId, [
      `<< /Type /XObject /Subtype /Image /Width ${image.width} /Height ${image.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${image.bytes.length} >>\nstream\n`,
      image.bytes,
      '\nendstream'
    ]);
    addObject(contentId, [`<< /Length ${drawCommand.length} >>\nstream\n${drawCommand}endstream`]);
  });

  const xrefOffset = byteLength;
  append(`xref\n0 ${objectCount + 1}\n`);
  append('0000000000 65535 f \n');
  for (let id = 1; id <= objectCount; id += 1) {
    append(`${String(offsets[id]).padStart(10, '0')} 00000 n \n`);
  }
  append(`trailer\n<< /Size ${objectCount + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`);
  return new Blob(parts, { type: 'application/pdf' });
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

async function downloadReportPdfAsset(report) {
  const response = await fetch(report.source.pdf, { cache: 'no-store' });
  if (!response.ok) {
    throw new Error(`Unable to fetch PDF asset: ${report.source.pdf}`);
  }
  const blob = await response.blob();
  downloadBlob(blob, report.source.pdfFilename || `${report.dateIso}-${report.slug}-bitgates-research.pdf`);
}

async function exportReportPdf(slug, button) {
  const report = researchReports.find((item) => item.slug === slug);
  if (!report) return;

  const restore = setReportActionBusy(button, report.source?.pdf ? '下载 PDF' : '生成 PDF', report.source?.pdf ? 'Downloading PDF' : 'Generating PDF');
  try {
    if (report.source?.pdf) {
      try {
        await downloadReportPdfAsset(report);
        restore();
        flashButton(button, 'PDF 已下载', 'PDF downloaded');
        return;
      } catch (assetError) {
        console.warn('Direct PDF download failed; falling back to generated PDF.', assetError);
      }
    }

    if (document.fonts?.ready) await document.fonts.ready;
    const fullText = await getReportFullText(report);
    const blocks = parseReportMarkdownBlocks(fullText);
    const canvases = [renderReportPdfCover(report), ...renderReportPdfBody(report, blocks)];
    const images = [];
    for (const canvas of canvases) images.push(await canvasToJpeg(canvas));
    const blob = buildPdfFromJpegs(images);
    downloadBlob(blob, `${report.dateIso}-${report.slug}-bitgates-research.pdf`);
    restore();
    flashButton(button, 'PDF 已下载', 'PDF downloaded');
  } catch (error) {
    console.error(error);
    restore();
    flashButton(button, 'PDF 生成失败', 'PDF failed');
  }
}

async function openReportPrintDialog(slug, button, mode = 'print') {
  const report = researchReports.find((item) => item.slug === slug);
  const printArea = document.getElementById('print-area');
  if (!report || !printArea) return;

  const restore = setReportActionBusy(button, '准备打印', 'Preparing print');
  const fullText = await getReportFullText(report);
  restore();
  printArea.innerHTML = printContentForReport(report, fullText);
  printArea.setAttribute('aria-hidden', 'false');
  body.classList.add('is-printing-report');

  if (mode === 'export') {
    flashButton(button, '请选择存为 PDF', 'Choose Save as PDF');
  }

  const cleanup = () => {
    body.classList.remove('is-printing-report');
    printArea.setAttribute('aria-hidden', 'true');
    window.removeEventListener('afterprint', cleanup);
  };
  window.addEventListener('afterprint', cleanup);
  window.setTimeout(() => window.print(), 120);
}


renderResearchReports('all');

if (window.location.hash.startsWith('#report-')) {
  window.setTimeout(() => {
    const slug = window.location.hash.replace('#report-', '');
    const report = researchReports.find((item) => item.slug === slug);
    if (report) {
      renderResearchReports('all');
      const target = document.querySelector(window.location.hash);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, 80);
}

document.addEventListener('click', (event) => {
  const qrOpen = event.target.closest('[data-qr-open]');
  if (qrOpen) {
    openWechatQr(qrOpen);
    return;
  }

  const qrClose = event.target.closest('[data-qr-close]');
  if (qrClose) {
    closeWechatQr();
    return;
  }

  const filterButton = event.target.closest('[data-report-filter]');
  if (filterButton) {
    renderResearchReports(filterButton.dataset.reportFilter);
    return;
  }

  const shareButton = event.target.closest('[data-report-share]');
  if (shareButton) {
    shareReport(shareButton.dataset.reportShare, shareButton);
    return;
  }

  const pdfButton = event.target.closest('[data-report-pdf]');
  if (pdfButton) {
    exportReportPdf(pdfButton.dataset.reportPdf, pdfButton);
    return;
  }

  const printButton = event.target.closest('[data-report-print]');
  if (printButton) {
    openReportPrintDialog(printButton.dataset.reportPrint, printButton, 'print');
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeWechatQr();
  }
});


function setupSmoothMemberDetails() {
  const detailItems = Array.from(document.querySelectorAll('.member-content details'));
  detailItems.forEach((details) => {
    const summary = details.querySelector('summary');
    const panel = summary ? summary.nextElementSibling : null;
    if (!summary || !panel || details.dataset.smoothDetails === 'true') return;

    details.dataset.smoothDetails = 'true';
    panel.classList.add('details-panel');

    summary.addEventListener('click', (event) => {
      event.preventDefault();
      const isOpen = details.hasAttribute('open');

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        details.toggleAttribute('open', !isOpen);
        return;
      }

      if (details.classList.contains('is-animating')) return;
      details.classList.add('is-animating');

      const cleanup = () => {
        panel.style.maxHeight = '';
        panel.style.opacity = '';
        panel.style.transform = '';
        panel.style.padding = '';
        details.classList.remove('is-animating');
      };

      if (isOpen) {
        panel.style.maxHeight = `${panel.scrollHeight}px`;
        panel.style.opacity = '1';
        panel.style.transform = 'translateY(0)';
        panel.style.padding = '14px 18px 20px';
        requestAnimationFrame(() => {
          panel.style.maxHeight = '0px';
          panel.style.opacity = '0';
          panel.style.transform = 'translateY(-8px)';
          panel.style.padding = '0 18px';
        });
        window.setTimeout(() => {
          details.removeAttribute('open');
          cleanup();
        }, 480);
        return;
      }

      details.setAttribute('open', '');
      panel.style.maxHeight = '0px';
      panel.style.opacity = '0';
      panel.style.transform = 'translateY(-8px)';
      panel.style.padding = '0 18px';
      requestAnimationFrame(() => {
        panel.style.maxHeight = `${panel.scrollHeight}px`;
        panel.style.opacity = '1';
        panel.style.transform = 'translateY(0)';
        panel.style.padding = '14px 18px 20px';
      });
      window.setTimeout(cleanup, 500);
    });
  });
}

setupSmoothMemberDetails();

const revealItems = Array.from(document.querySelectorAll('[data-reveal]'));
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' });

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}

const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();
