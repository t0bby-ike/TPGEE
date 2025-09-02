document.addEventListener('DOMContentLoaded', function() {
	// Tab functionality
	const tabButtons = document.querySelectorAll('.tab-button');
	const tabContents = document.querySelectorAll('.tab-content');
    
	tabButtons.forEach(button => {
		button.addEventListener('click', () => {
			const tabId = button.getAttribute('data-tab');
            
			// Update active tab button
			tabButtons.forEach(btn => btn.classList.remove('active'));
			button.classList.add('active');
            
			// Update active tab content
			tabContents.forEach(content => content.classList.remove('active'));
			document.getElementById(`${tabId}-tab`).classList.add('active');
            
			// Update previews when switching tabs
			updatePreviews();
		});
	});
    
	// Initialize chapter content with sample data
	initializeChapterContent();
    
	// Set up event listeners for input changes to update previews
	document.querySelectorAll('input, textarea').forEach(element => {
		element.addEventListener('input', updatePreviews);
	});
    
	document.getElementById('chapterSelect').addEventListener('change', function() {
		updateChapterContent(this.value);
		updatePreviews();
	});

	// Add/remove chapter buttons
	const addBtn = document.getElementById('addChapterBtn');
	const removeBtn = document.getElementById('removeChapterBtn');
	if (addBtn) addBtn.addEventListener('click', (e) => { e.preventDefault(); addChapter(); });
	if (removeBtn) removeBtn.addEventListener('click', (e) => { e.preventDefault(); removeChapter(); });
    
	// Initial preview update
	updatePreviews();

	// --- Modal Functionality ---
	const htmlModal = document.getElementById('htmlModal');
	const pdfModal = document.getElementById('pdfModal');
	const closeHtmlModal = document.getElementById('closeHtmlModal');
	const closePdfModal = document.getElementById('closePdfModal');
	const generateBtn = document.getElementById('generateBtn');
	const compileBtn = document.getElementById('compileBtn');
	const downloadHtmlBtn = document.getElementById('downloadHtmlBtn');
	const downloadPdfBtn = document.getElementById('downloadPdfBtn');

	// Open modals
	generateBtn.addEventListener('click', () => htmlModal.style.display = 'block');
	compileBtn.addEventListener('click', () => pdfModal.style.display = 'block');

	// Close modals via 'x' button
	closeHtmlModal.addEventListener('click', () => htmlModal.style.display = 'none');
	closePdfModal.addEventListener('click', () => pdfModal.style.display = 'none');

	// Close modals by clicking outside
	window.addEventListener('click', (event) => {
		if (event.target == htmlModal) htmlModal.style.display = 'none';
		if (event.target == pdfModal) pdfModal.style.display = 'none';
	});

	// Handle download button clicks
	downloadHtmlBtn.addEventListener('click', () => {
		generateHTMLFiles();
		htmlModal.style.display = 'none';
	});

	downloadPdfBtn.addEventListener('click', () => {
		compileToPDF();
		pdfModal.style.display = 'none';
	});
});

// ...existing code... (The rest of the helper functions are already in the HTML file originally)

// Copy the helper functions here so scripts.js is self-contained

// Per-chapter storage and dynamic chapters
let chapters = [1,2,3,4,5,6];
let currentChapter = 1;
const chaptersData = {};
const chapterTitles = {
	1: "Chapter 1: Historical Foundations of Periodic Classification",
	2: "Chapter 2: The Atomic Number Revolution",
	3: "Chapter 3: Quantum Mechanical Periodicity",
	4: "Chapter 4: Modern Periodic Trends",
	5: "Chapter 5: Contemporary Applications",
	6: "Chapter 6: Future Directions"
};

function initializeChapterContent() {
	// Seed chaptersData with sample content (can be overwritten by user edits)
	chapters.forEach(i => {
		chaptersData[i] = `<!-- Chapter ${i} content placeholder -->\n<h2>Section Title</h2>\n<p>Write your content here for chapter ${i}.</p>`;
	});
	currentChapter = chapters[0] || 1;
	updateChapterContent(currentChapter);
}

function updateChapterContent(chapterNumber) {
	chapterNumber = Number(chapterNumber) || 1;
	// save previous chapter content
	if (currentChapter && document.getElementById('chapterContent')) {
		chaptersData[currentChapter] = document.getElementById('chapterContent').value;
		// also save title
		chapterTitles[currentChapter] = document.getElementById('chapterTitle').value || chapterTitles[currentChapter];
	}

	currentChapter = chapterNumber;
	document.getElementById('chapterTitle').value = chapterTitles[chapterNumber] || `Chapter ${chapterNumber}`;
	document.getElementById('chapterContent').value = chaptersData[chapterNumber] || '';
}

function addChapter() {
	const next = chapters.length ? Math.max(...chapters) + 1 : 1;
	chapters.push(next);
	chaptersData[next] = `<!-- Chapter ${next} content placeholder -->\n<h2>Section Title</h2>\n<p>Write your content here for chapter ${next}.</p>`;
	chapterTitles[next] = `Chapter ${next}: New Chapter`;
	const select = document.getElementById('chapterSelect');
	const opt = document.createElement('option');
	opt.value = next;
	opt.textContent = `Chapter ${next}: New Chapter`;
	select.appendChild(opt);
	select.value = next;
	updateChapterContent(next);
	updatePreviews();
}

function removeChapter() {
	if (chapters.length === 0) return;
	const select = document.getElementById('chapterSelect');
	const val = Number(select.value);
	// remove from chapters
	const idx = chapters.indexOf(val);
	if (idx !== -1) chapters.splice(idx,1);
	// remove option
	const option = select.querySelector(`option[value="${val}"]`);
	if (option) option.remove();
	// delete stored data
	delete chaptersData[val];
	delete chapterTitles[val];
	// select last chapter
	const newVal = chapters.length ? chapters[chapters.length-1] : null;
	if (newVal) select.value = newVal;
	updateChapterContent(Number(select.value) || 1);
	updatePreviews();
}

function updatePreviews() {
	const frontPreview = document.getElementById('frontPreview');
	frontPreview.innerHTML = `
		<h1>${document.getElementById('university').value || 'UNIVERSITY NAME IN FULL AND UPPERCASE WILL BE HERE'}</h1>
		<h1>${document.getElementById('faculty').value || 'FACULTY IN FULL AND UPPERCASE WILL BE HERE'}</h1>
		<h1>${document.getElementById('department').value || 'DEPARTMENT IN FULL AND UPPERCASE WILL BE HERE'}</h1>
		<br><br><br>
		<h2>COURSE: ${document.getElementById('courseCode').value || 'COURSE CODE WILL BE HERE'}</h2>
		<h2>${document.getElementById('courseTitle').value || 'COURSE TITLE WILL BE HERE'}</h2>
		<br><br>
		<h2>TOPIC: THE PERIODIC TABLE: FROM MENDELEEV TO MODERN QUANTUM THEORY</h2>
		<br><br><br>
		<h2>BY</h2>
		<h2>${document.getElementById('fullName').value || 'FULLNAME WILL BE HERE'}</h2>
		<h2>${document.getElementById('regNumber').value || 'REG NUMBER WILL BE HERE'}</h2>
		<br><br><br>
		<h2>SUPERVISOR</h2>
		<h2>${document.getElementById('lecturer').value || "LECTURER'S NAME WILL BE HERE"}</h2>
		<br><br><br>
		<h2>${document.getElementById('date').value || 'August, 2025'}</h2>
	`;

	const dedicationPreview = document.getElementById('dedicationPreview');
	dedicationPreview.innerHTML = `<h1>Dedication</h1><p>${document.getElementById('dedicationText').value.replace(/\n/g, '<br>')}</p>`;

	const acknowledgementPreview = document.getElementById('acknowledgementPreview');
	acknowledgementPreview.innerHTML = `<h1>Acknowledgements</h1><p>${document.getElementById('acknowledgementText').value.replace(/\n/g, '<br>')}</p>`;

	const chapterPreview = document.getElementById('chapterPreview');
	chapterPreview.innerHTML = `<h1>${document.getElementById('chapterTitle').value}</h1>${document.getElementById('chapterContent').value}`;

	const conclusionPreview = document.getElementById('conclusionPreview');
	conclusionPreview.innerHTML = `<h1>${document.getElementById('conclusionTitle').value}</h1>${document.getElementById('conclusionContent').value}`;

	const referencesPreview = document.getElementById('referencesPreview');
	const references = document.getElementById('referencesContent').value.split('\n');
	let referencesHTML = '<h1>References</h1><ol>';
	references.forEach(ref => { if (ref.trim()) referencesHTML += `<li>${ref}</li>`; });
	referencesHTML += '</ol>';
	referencesPreview.innerHTML = referencesHTML;

	// regenerate TOC live
	generateTOC();
}

function generateTOC() {
	const tocPreview = document.getElementById('tocPreview');
	if (!tocPreview) return;

	const entries = [];
	entries.push({level: 1, label: 'Dedication'});
	entries.push({level: 1, label: 'Acknowledgements'});

	// chapters
	for (let idx = 0; idx < chapters.length; idx++) {
		const i = chapters[idx];
		const title = chapterTitles[i] || `Chapter ${i}`;
		entries.push({level: 1, label: `Chapter ${i}: ${title}`});

		// Parse the raw chapter content for headings
		const raw = chaptersData[i] || document.getElementById('chapterContent') && Number(document.getElementById('chapterSelect').value) === i ? document.getElementById('chapterContent').value : '';

		// 1) markdown headings (#, ##)
		const mdMatches = Array.from(raw.matchAll(/^(#{1,2})\s*(.+)$/gim));
		mdMatches.forEach(m => {
			const level = m[1].length === 1 ? 2 : 3; // treat # as h2, ## as h3 inside chapter
			const text = m[2].trim();
			entries.push({level, label: text});
		});

		// 2) html headings <h2> <h3>
		const htmlMatches = Array.from(raw.matchAll(/<(h[2-3])[^>]*>(.*?)<\/\1>/gi));
		htmlMatches.forEach(m => {
			const level = m[1].toLowerCase() === 'h2' ? 2 : 3;
			const text = m[2].replace(/<[^>]+>/g, '').trim();
			entries.push({level, label: text});
		});

		// 3) plaintext numbered headings like '1.1 Title' or '2.1.3 Subtitle'
		const plainMatches = Array.from(raw.matchAll(/^(\d+(?:\.\d+)*)\s+(.+)$/gim));
		plainMatches.forEach(m => {
			const nums = m[1].split('.');
			const level = nums.length === 1 ? 2 : (nums.length === 2 ? 3 : 4);
			const text = m[2].trim();
			entries.push({level, label: `${m[1]} ${text}`});
		});
	}

	entries.push({level: 1, label: 'Conclusion'});
	entries.push({level: 1, label: 'References'});

	// Render
	const style = document.getElementById('tocStyle') ? document.getElementById('tocStyle').value : 'dots';
	let html = '<h1>TABLE OF CONTENTS</h1>';
	if (style === 'dots') {
		entries.forEach((e, idx) => {
			if (e.level === 1) html += `<div class="toc-level-1">${e.label}<span style="float:right">${idx+1}</span></div>`;
			else if (e.level === 2) html += `<div class="toc-level-2">${e.label}</div>`;
			else html += `<div class="toc-level-3">${e.label}</div>`;
		});
	} else {
		entries.forEach(e => html += `<div class="toc-level-${e.level}">${e.label}</div>`);
	}

	tocPreview.innerHTML = html;
}

// The generateHTMLFiles and compileToPDF implementations are kept in the HTML file earlier; if needed they can be moved here.
// Formatting state and application
const formatting = {
	textAlign: 'left',
	fontFamily: "Times New Roman, Times, serif",
	fontSize: 16,
	lineHeight: 1.8,
	accentColor: '#00688B'
};

function applyFormatting() {
	// Apply to all preview containers
	const previewContainers = document.querySelectorAll('.preview-container .chapter-content');
	previewContainers.forEach(pc => {
		pc.style.textAlign = formatting.textAlign;
		pc.style.fontFamily = formatting.fontFamily;
		pc.style.fontSize = formatting.fontSize + 'px';
		pc.style.lineHeight = formatting.lineHeight;
		// accent color affects headings
		pc.querySelectorAll('h1,h2,h3').forEach(h => { h.style.color = formatting.accentColor; });
	});
}

// Wire up formatting controls (safe to call even if tab isn't active)
document.addEventListener('DOMContentLoaded', () => {
	const textAlign = document.getElementById('textAlign');
	const fontFamily = document.getElementById('fontFamily');
	const fontSize = document.getElementById('fontSize');
	const lineHeight = document.getElementById('lineHeight');
	const accentColorPicker = document.getElementById('accentColorPicker');
	const applyFormattingBtn = document.getElementById('applyFormattingBtn');

	if (!textAlign) return; // guards in case DOM not fully loaded earlier

	// initialize controls from state
	textAlign.value = formatting.textAlign;
	fontFamily.value = formatting.fontFamily;
	fontSize.value = formatting.fontSize;
	lineHeight.value = formatting.lineHeight;
	accentColorPicker.value = formatting.accentColor;

	applyFormattingBtn.addEventListener('click', (e) => {
		e.preventDefault();
		formatting.textAlign = textAlign.value;
		formatting.fontFamily = fontFamily.value;
		formatting.fontSize = Number(fontSize.value) || 16;
		formatting.lineHeight = Number(lineHeight.value) || 1.6;
		formatting.accentColor = accentColorPicker.value || '#00688B';
		applyFormatting();
		updatePreviews();
	});
});

// Ensure generateHTMLFiles will embed formatting styles into each HTML doc
const _oldGenerateHTMLFiles = typeof generateHTMLFiles === 'function' ? generateHTMLFiles : null;
if (_oldGenerateHTMLFiles) {
	const original = generateHTMLFiles;
	generateHTMLFiles = function() {
		// wrap the createHtmlDoc to inject formatting
		const originalCreate = null; // placeholder - original function creates doc inside generateHTMLFiles
		// We'll simply call original, but before zipping, update the preview HTML to include a top-level style block with formatting
		// Inject style into previews temporarily
		const styleTag = `<style>body{font-family:${formatting.fontFamily};font-size:${formatting.fontSize}px;line-height:${formatting.lineHeight};text-align:${formatting.textAlign};} h1,h2,h3{color:${formatting.accentColor};}</style>`;
		// prepend style to each preview container innerHTML when creating files - original implementation reads preview.innerHTML directly, so we can temporarily prefix
		const previews = ['frontPreview','dedicationPreview','acknowledgementPreview','chapterPreview','conclusionPreview','referencesPreview'];
		const originalHTML = {};
		previews.forEach(id => {
			const el = document.getElementById(id);
			originalHTML[id] = el.innerHTML;
			el.innerHTML = styleTag + el.innerHTML;
		});

		// call original
		try {
			original();
		} finally {
			// restore
			previews.forEach(id => {
				const el = document.getElementById(id);
				el.innerHTML = originalHTML[id];
			});
		}
	};
}
function generateHTMLFiles() {
	console.log('Generating HTML files...');
	const statusMessage = document.getElementById('statusMessage');
	statusMessage.textContent = 'Generating HTML files...';
	statusMessage.className = 'status success';

	try {
		if (typeof JSZip === 'undefined') throw new Error('JSZip not loaded');
		const zip = new JSZip();

		// Include current formatting into generated HTML
		const formattingStyle = `<style>body { font-family: ${formatting.fontFamily}; font-size: ${formatting.fontSize}px; line-height: ${formatting.lineHeight}; text-align: ${formatting.textAlign}; margin: 2em; color: #222 } h1 { text-align: center; color: ${formatting.accentColor}; } h2 { color: ${formatting.accentColor}; }</style>`;
		const createHtmlDoc = (title, content) => `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>${title}</title>${formattingStyle}<style>ol { padding-left: 20px; }</style></head><body>${content}</body></html>`;

		// Front, dedication, acknowledgement, conclusion, references
		zip.file("01-Front-Matter.html", createHtmlDoc('Front Matter', document.getElementById('frontPreview').innerHTML));
		zip.file("02-Dedication.html", createHtmlDoc('Dedication', document.getElementById('dedicationPreview').innerHTML));
		zip.file("03-Acknowledgements.html", createHtmlDoc('Acknowledgements', document.getElementById('acknowledgementPreview').innerHTML));

		// Chapters -- use current chapterTitle/content values for each chapter index (user can edit per chapter by selecting)
		for (let i = 1; i <= 6; i++) {
			// try to restore per-chapter content by temporarily switching selection if available
			const chapterSelect = document.getElementById('chapterSelect');
			if (chapterSelect) chapterSelect.value = i;
			// call updateChapterContent so title updates (implementation keeps content untouched if user edited)
			try { updateChapterContent(i); } catch (e) {}
			updatePreviews();
			const title = document.getElementById('chapterTitle').value || `Chapter ${i}`;
			const body = document.getElementById('chapterContent').value || '<p>(No content)</p>';
			const html = `<h1>${title}</h1>${body}`;
			zip.file(`04-Chapter-${i}.html`, createHtmlDoc(title, html));
		}

		// Table of Contents (generated)
		const tocEl = document.getElementById('tocPreview');
		if (tocEl) zip.file("00-Table-of-Contents.html", createHtmlDoc('Table of Contents', tocEl.innerHTML));

		// Conclusion and References
		zip.file("05-Conclusion.html", createHtmlDoc('Conclusion', document.getElementById('conclusionPreview').innerHTML));
		zip.file("06-References.html", createHtmlDoc('References', document.getElementById('referencesPreview').innerHTML));

		zip.generateAsync({ type: 'blob' }).then(function(content) {
			const link = document.createElement('a');
			link.href = URL.createObjectURL(content);
			link.download = 'Academic_Paper_HTML.zip';
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			statusMessage.textContent = 'HTML files zipped and downloaded!';
			setTimeout(() => { statusMessage.className = 'status'; statusMessage.textContent = ''; }, 3000);
		});
	} catch (error) {
		console.error('Error generating HTML files:', error);
		const statusMessage = document.getElementById('statusMessage');
		const msg = 'Error generating HTML: ' + (error.message || String(error));
		statusMessage.textContent = msg;
		statusMessage.className = 'status error';

		// Attach a download link for the full error stack
		const details = document.createElement('div');
		details.style.marginTop = '8px';
		const btn = document.createElement('button');
		btn.textContent = 'Download error log';
		btn.style.marginTop = '6px';
		btn.onclick = () => {
			const blob = new Blob([error.stack || String(error)], { type: 'text/plain' });
			const a = document.createElement('a');
			a.href = URL.createObjectURL(blob);
			a.download = 'error-generating-html.txt';
			document.body.appendChild(a);
			a.click();
			a.remove();
		};
		details.appendChild(btn);
		// remove existing children and append
		while (statusMessage.firstChild) statusMessage.removeChild(statusMessage.firstChild);
		statusMessage.appendChild(document.createTextNode(msg));
		statusMessage.appendChild(details);
	}
}

async function compileToPDF() {
	console.log('Compiling PDF (two-pass)...');
	const statusMessage = document.getElementById('statusMessage');
	statusMessage.textContent = 'Compiling PDF (two-pass), please wait...';
	statusMessage.className = 'status success';

	try {
		if (!window.jspdf || !window.html2canvas) throw new Error('jsPDF or html2canvas not loaded');
		const { jsPDF } = window.jspdf;
		if (!jsPDF) throw new Error('jsPDF not available');

		// Create a PDF instance for measurement and final output
		const pdf = new jsPDF({ orientation: 'p', unit: 'pt', format: 'a4' });
		const pdfWidth = pdf.internal.pageSize.getWidth();
		const pdfHeight = pdf.internal.pageSize.getHeight();
		const margin = 40;

		// Helper: render a DOM element to a canvas snapshot
		const renderElementToCanvas = async (element) => {
			const originalWidth = element.style.width;
			// force full width to capture offscreen content
			element.style.width = element.scrollWidth + 'px';
			const canvas = await html2canvas(element, {
				scale: 1.3,
				useCORS: true,
				logging: false,
				width: element.scrollWidth,
				height: element.scrollHeight,
				windowWidth: element.scrollWidth,
				windowHeight: element.scrollHeight
			});
			element.style.width = originalWidth;
			return canvas;
		};

		// Helper: compute how many PDF pages a canvas will occupy
		const pagesForCanvas = (canvas) => {
			const renderWidth = pdfWidth - margin * 2; // points
			const fullWidthPx = canvas.width; // px
			const pxPerPt = fullWidthPx / renderWidth;
			const pageHeightPx = Math.floor((pdfHeight - margin * 2) * pxPerPt);
			const fullHeightPx = canvas.height;
			return Math.max(1, Math.ceil(fullHeightPx / pageHeightPx));
		};

		// First pass: render every logical section to canvases and count pages
		const sectionOrder = [];
		sectionOrder.push({ key: 'front', id: 'frontPreview', title: 'Front Matter' });
		sectionOrder.push({ key: 'dedication', id: 'dedicationPreview', title: 'Dedication' });
		sectionOrder.push({ key: 'ack', id: 'acknowledgementPreview', title: 'Acknowledgements' });

		// append chapters dynamically (only include chapters that exist in chapters array)
		for (let idx = 0; idx < chapters.length; idx++) {
			const i = chapters[idx];
			// ensure chapter content is loaded for rendering
			try { updateChapterContent(i); } catch (e) {}
			updatePreviews();
			sectionOrder.push({ key: `chapter-${i}`, id: 'chapterPreview', title: chapterTitles[i] || `Chapter ${i}`, chapterIndex: i });
		}

		sectionOrder.push({ key: 'conclusion', id: 'conclusionPreview', title: 'Conclusion' });
		sectionOrder.push({ key: 'references', id: 'referencesPreview', title: 'References' });

		const rendered = [];
		const errors = [];

		for (let s = 0; s < sectionOrder.length; s++) {
			const sec = sectionOrder[s];
			try {
				const el = document.getElementById(sec.id);
				if (!el) throw new Error('Missing element: ' + sec.id);
				const canvas = await renderElementToCanvas(el);
				const pages = pagesForCanvas(canvas);
				rendered.push({ sec, canvas, pages });
			} catch (err) {
				console.error('Error rendering section', sec.id, err);
				errors.push({ section: sec.id, message: err.message || String(err) });
				// still push a placeholder so offsets remain consistent
				rendered.push({ sec, canvas: null, pages: 0, error: err });
			}
		}

		// Compute start page numbers (1-based)
		const startPages = {};
		let currentPage = 1;
		for (let r = 0; r < rendered.length; r++) {
			const key = rendered[r].sec.key;
			startPages[key] = currentPage;
			currentPage += rendered[r].pages;
		}

		// Rebuild TOC to include start page numbers for main sections/chapters
		const tocPreview = document.getElementById('tocPreview');
		if (tocPreview) {
			// reuse generateTOC's parsing but inject page numbers for top-level entries
			const entries = [];
			entries.push({level: 1, label: 'Dedication', page: startPages['dedication'] || ''});
			entries.push({level: 1, label: 'Acknowledgements', page: startPages['ack'] || ''});

			for (let idx = 0; idx < chapters.length; idx++) {
				const i = chapters[idx];
				const key = `chapter-${i}`;
				const title = chapterTitles[i] || `Chapter ${i}`;
				entries.push({level:1, label: `Chapter ${i}: ${title}`, page: startPages[key] || ''});
				// For subheadings we keep existing behavior but assign the chapter start page (approximation)
				const raw = chaptersData[i] || '';
				const mdMatches = Array.from(raw.matchAll(/^(#{1,2})\s*(.+)$/gim));
				mdMatches.forEach(m => entries.push({level:2, label: m[2].trim(), page: startPages[key] || ''}));
				const htmlMatches = Array.from(raw.matchAll(/<(h[2-3])[^>]*>(.*?)<\/\1>/gi));
				htmlMatches.forEach(m => entries.push({level:2, label: m[2].replace(/<[^>]+>/g, '').trim(), page: startPages[key] || ''}));
				const plainMatches = Array.from(raw.matchAll(/^(\d+(?:\.\d+)*)\s+(.+)$/gim));
				plainMatches.forEach(m => entries.push({level:2, label: `${m[1]} ${m[2].trim()}`, page: startPages[key] || ''}));
			}

			entries.push({level:1, label: 'Conclusion', page: startPages['conclusion'] || ''});
			entries.push({level:1, label: 'References', page: startPages['references'] || ''});

			// render toc
			const style = document.getElementById('tocStyle') ? document.getElementById('tocStyle').value : 'dots';
			let html = '<h1>TABLE OF CONTENTS</h1>';
			if (style === 'dots') {
				entries.forEach((e, idx) => {
					if (e.level === 1) html += `<div class="toc-level-1">${e.label}<span style="float:right">${e.page || ''}</span></div>`;
					else if (e.level === 2) html += `<div class="toc-level-2">${e.label}<span style="float:right">${e.page || ''}</span></div>`;
					else html += `<div class="toc-level-3">${e.label}<span style="float:right">${e.page || ''}</span></div>`;
				});
			} else {
				entries.forEach(e => html += `<div class="toc-level-${e.level}">${e.label} ${e.page ? ('......... ' + e.page) : ''}</div>`);
			}
			tocPreview.innerHTML = html;
		}

		// Second pass: assemble PDF from rendered canvases and add styled page numbers
		const finalPdf = new jsPDF({ orientation: 'p', unit: 'pt', format: 'a4' });
		let pageCounter = 1;
		const renderWidth = pdfWidth - margin * 2;

		for (let r = 0; r < rendered.length; r++) {
			const item = rendered[r];
			if (!item.canvas || item.pages === 0) continue; // skip missing
			const canvas = item.canvas;
			const imgData = canvas.toDataURL('image/png');
			const imgProps = finalPdf.getImageProperties(imgData);
			const fullWidth = imgProps.width;
			const fullHeight = imgProps.height;
			const renderHeight = (fullHeight * renderWidth) / fullWidth;

			// If fits on one page
			if (renderHeight <= pdfHeight - margin * 2) {
				if (pageCounter > 1) finalPdf.addPage();
				finalPdf.addImage(imgData, 'PNG', margin, margin, renderWidth, renderHeight);
				// footer
				finalPdf.setFontSize(10);
				finalPdf.setTextColor(100);
				finalPdf.text(String(pageCounter), pdfWidth - margin, pdfHeight - 20, { align: 'right' });
				pageCounter++;
				continue;
			}

			// Slice into multiple pages
			const pxPerPt = fullWidth / renderWidth;
			const pageHeightPx = Math.floor((pdfHeight - margin * 2) * pxPerPt);
			let y = 0;
			let pageIndex = 0;
			while (y < fullHeight) {
				const sliceHeightPx = Math.min(pageHeightPx, fullHeight - y);
				const tmpCanvas = document.createElement('canvas');
				tmpCanvas.width = fullWidth;
				tmpCanvas.height = sliceHeightPx;
				const ctx = tmpCanvas.getContext('2d');
				ctx.drawImage(canvas, 0, y, fullWidth, sliceHeightPx, 0, 0, fullWidth, sliceHeightPx);
				const sliceData = tmpCanvas.toDataURL('image/png');
				const sliceRenderHeight = (sliceHeightPx * renderWidth) / fullWidth;
				if (!(pageCounter === 1 && r === 0 && pageIndex === 0)) finalPdf.addPage();
				finalPdf.addImage(sliceData, 'PNG', margin, margin, renderWidth, sliceRenderHeight);
				// footer
				finalPdf.setFontSize(10);
				finalPdf.setTextColor(100);
				finalPdf.text(String(pageCounter), pdfWidth - margin, pdfHeight - 20, { align: 'right' });
				pageCounter++;
				y += sliceHeightPx;
				pageIndex++;
			}
		}

		// If there were rendering errors, append a short errors page
		if (errors.length) {
			finalPdf.addPage();
			finalPdf.setFontSize(10);
			finalPdf.text('PDF generation completed with errors. See console for details.', 40, 60);
			errors.forEach((e, idx) => finalPdf.text(`${idx + 1}. ${e.section}: ${e.message}`, 40, 80 + idx * 12));
		}

		finalPdf.save('Academic_Paper.pdf');
		statusMessage.textContent = errors.length ? 'PDF compiled with warnings (check console).' : 'PDF compiled and downloaded!';
		statusMessage.className = errors.length ? 'status error' : 'status success';
		setTimeout(() => { statusMessage.className = 'status'; statusMessage.textContent = ''; }, 5000);
	} catch (error) {
		console.error('Error compiling PDF:', error);
		const msg = 'Error compiling PDF: ' + (error.message || String(error)) + ' (see console)';
		statusMessage.textContent = msg;
		statusMessage.className = 'status error';

		// provide downloadable stack trace
		const details = document.createElement('div');
		details.style.marginTop = '8px';
		const btn = document.createElement('button');
		btn.textContent = 'Download PDF error log';
		btn.style.marginTop = '6px';
		btn.onclick = () => {
			const blob = new Blob([error.stack || String(error)], { type: 'text/plain' });
			const a = document.createElement('a');
			a.href = URL.createObjectURL(blob);
			a.download = 'error-compiling-pdf.txt';
			document.body.appendChild(a);
			a.click();
			a.remove();
		};
		while (statusMessage.firstChild) statusMessage.removeChild(statusMessage.firstChild);
		statusMessage.appendChild(document.createTextNode(msg));
		statusMessage.appendChild(details);
		statusMessage.appendChild(btn);
	}
}
