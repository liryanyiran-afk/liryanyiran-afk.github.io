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
      filename: '260214 MSTR.docx'
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
  const highlights = report.highlights.map((item) => `<li>${bilingual(item)}</li>`).join('');
  const sourceAction = report.source ? `
      <div class="report-file-actions">
        <a href="${escapeHtml(report.source.docx)}" download><span class="zh">原文文档</span><span class="en">Source DOCX</span></a>
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
      <ul class="report-highlights">${highlights}</ul>
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

function markdownToPrintHtml(markdown) {
  return markdown.split(/\n+/).map((line) => {
    const value = line.trim();
    if (!value) return '';
    if (value.startsWith('### ')) return `<h3>${escapeHtml(value.slice(4))}</h3>`;
    if (value.startsWith('## ')) return `<h2>${escapeHtml(value.slice(3))}</h2>`;
    if (value.startsWith('# ')) return `<h2>${escapeHtml(value.slice(2))}</h2>`;
    if (value.startsWith('- ')) return `<p class="print-bullet">${escapeHtml(value)}</p>`;
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

async function openReportPrintDialog(slug, button, mode = 'print') {
  const report = researchReports.find((item) => item.slug === slug);
  const printArea = document.getElementById('print-area');
  if (!report || !printArea) return;

  let fullText = reportToMarkdown(report);
  if (report.source?.markdown) {
    try {
      fullText = await fetchTextAsset(report.source.markdown);
    } catch (error) {
      fullText = reportToMarkdown(report);
    }
  }

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
    openReportPrintDialog(pdfButton.dataset.reportPdf, pdfButton, 'export');
    return;
  }

  const printButton = event.target.closest('[data-report-print]');
  if (printButton) {
    openReportPrintDialog(printButton.dataset.reportPrint, printButton, 'print');
  }
});

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
