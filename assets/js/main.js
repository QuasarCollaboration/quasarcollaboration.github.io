// --- State Management ---
const state = {
    model: null,
    venue: null,
    date: '2027-07-05',
    hwws: '',
    dinner: '',
    accom: null,
    prices: {
        // In-Person
        memEarly: 360, memLate: 500,
        stuEarly: 200, stuLate: 350,
        nonMem: 500, day: 150,
        // Events
        hwwsAccom: 600, hwwsNoAccom: 450,
        dinnerFull: 135, dinnerStu: 85
    },
    counts: {
        memEarly: 120, memLate: 30,
        stuEarly: 80, stuLate: 0,
        nonMem: 20, day: 10,
        hwwsAccom: 60, hwwsNoAccom: 10,
        dinnerFull: 150, dinnerStu: 80,
        sponsor: 15000
    },
    roadmap: [
        {
            phase: "Phase 1: Bid & Rights (Feb 2026)",
            items: [
                { text: "Agree on Lead Chair (UQ)", done: true, critical: false },
                { text: "Select Operating Model (In-House vs PCO)", done: false, critical: true },
                { text: "Secure Service Fee Waiver (if In-House)", done: false, critical: true },
                { text: "Submit Proposal to ASA Council", done: false, critical: true }
            ]
        },
        {
            phase: "Phase 2: Foundation (Mar - Nov 2026)",
            items: [
                { text: "Setup Banking (Cost Centre or Trust)", done: false, critical: false },
                { text: "Form LOC & SOC Committees", done: false, critical: false },
                { text: "Nov 2026: Progress Report & Website Launch", done: false, critical: true }
            ]
        },
        {
            phase: "Phase 3: Execution (2027)",
            items: [
                { text: "Feb 2027: Finalize Budget", done: false, critical: false },
                { text: "May 2027: Final Logistics Report", done: false, critical: false },
                { text: "July 2027: Event Delivery", done: false, critical: true }
            ]
        }
    ]
};

// --- Charts ---
let revenueChart = null;
let attendeeChart = null;

function initCharts() {
    Chart.defaults.color = '#475569';
    Chart.defaults.font.family = "'Inter', sans-serif";

    // 1. Revenue Doughnut
    const ctxRev = document.getElementById('revenueChart').getContext('2d');
    revenueChart = new Chart(ctxRev, {
        type: 'doughnut',
        data: {
            labels: ['ASM Reg', 'HWWS', 'Dinner', 'Sponsorship'],
            datasets: [{
                data: [0, 0, 0, 0],
                backgroundColor: ['#6366f1', '#10b981', '#f59e0b', '#3b82f6'],
                borderColor: '#ffffff', /* Match bg */
                borderWidth: 2,
                hoverOffset: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'right', labels: { boxWidth: 12, usePointStyle: true, padding: 20 } }
            },
            cutout: '70%',
            layout: { padding: 10 }
        }
    });

    // 2. Headcount Bar
    const ctxAtt = document.getElementById('attendeeChart').getContext('2d');
    attendeeChart = new Chart(ctxAtt, {
        type: 'bar',
        data: {
            labels: ['ASM', 'HWWS', 'Dinner'],
            datasets: [{
                label: 'Total Headcount',
                data: [0, 0, 0],
                backgroundColor: ['#94a3b8', '#10b981', '#f59e0b'],
                borderRadius: 6,
                barThickness: 40
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } },
                x: { grid: { display: false } }
            }
        }
    });

    calculateBudget();
}

// --- Core Logic ---
function calculateBudget() {
    // 1. Get Values
    const getVal = (id) => parseInt(document.getElementById(id).value) || 0;

    state.counts.memEarly = getVal('input-mem-early');
    state.counts.memLate = getVal('input-mem-late');
    state.counts.stuEarly = getVal('input-stu-early');
    state.counts.stuLate = getVal('input-stu-late');
    state.counts.nonMem = getVal('input-non-mem');
    state.counts.day = getVal('input-day');

    state.counts.hwwsAccom = getVal('count-hwwsAccom');
    state.counts.hwwsNoAccom = getVal('count-hwwsNoAccom');
    state.counts.dinnerFull = getVal('count-dinnerFull');
    state.counts.dinnerStu = getVal('count-dinnerStu');
    state.counts.sponsor = getVal('count-sponsor');

    // 2. Calculate Subtotals & Update DOM
    const updateSub = (id, count, price) => {
        const sub = count * price;
        document.getElementById(id).innerText = '$' + sub.toLocaleString();
        return sub;
    };

    const subMemEarly = updateSub('sub-mem-early', state.counts.memEarly, state.prices.memEarly);
    const subMemLate = updateSub('sub-mem-late', state.counts.memLate, state.prices.memLate);
    const subStuEarly = updateSub('sub-stu-early', state.counts.stuEarly, state.prices.stuEarly);
    const subStuLate = updateSub('sub-stu-late', state.counts.stuLate, state.prices.stuLate);
    const subNonMem = updateSub('sub-non-mem', state.counts.nonMem, state.prices.nonMem);
    const subDay = updateSub('sub-day', state.counts.day, state.prices.day);

    const subHwwsAccom = updateSub('sub-hwws-accom', state.counts.hwwsAccom, state.prices.hwwsAccom);
    const subHwwsNoAccom = updateSub('sub-hwws-noaccom', state.counts.hwwsNoAccom, state.prices.hwwsNoAccom);

    const subDinnerFull = updateSub('sub-dinner-full', state.counts.dinnerFull, state.prices.dinnerFull);
    const subDinnerStu = updateSub('sub-dinner-stu', state.counts.dinnerStu, state.prices.dinnerStu);

    document.getElementById('sub-sponsor').innerText = '$' + state.counts.sponsor.toLocaleString();

    // 3. Category Totals
    const totalASM = subMemEarly + subMemLate + subStuEarly + subStuLate + subNonMem + subDay;
    const totalHWWS = subHwwsAccom + subHwwsNoAccom;
    const totalDinner = subDinnerFull + subDinnerStu;
    const grandTotal = totalASM + totalHWWS + totalDinner + state.counts.sponsor;

    // 4. Update Big Total
    document.getElementById('total-revenue').innerText = '$' + grandTotal.toLocaleString();

    // 5. Update Charts
    if (revenueChart) {
        revenueChart.data.datasets[0].data = [totalASM, totalHWWS, totalDinner, state.counts.sponsor];
        revenueChart.update();
    }
    if (attendeeChart) {
        // Headcounts
        const countASM = state.counts.memEarly + state.counts.memLate + state.counts.stuEarly + state.counts.stuLate + state.counts.nonMem + state.counts.day;
        const countHWWS = state.counts.hwwsAccom + state.counts.hwwsNoAccom;
        const countDinner = state.counts.dinnerFull + state.counts.dinnerStu;
        attendeeChart.data.datasets[0].data = [countASM, countHWWS, countDinner];
        attendeeChart.update();
    }
}

// --- Roadmap Logic ---
function renderRoadmap() {
    const container = document.getElementById('roadmap-container');
    container.innerHTML = '';
    let totalItems = 0;
    let doneItems = 0;

    state.roadmap.forEach((phase, pIndex) => {
        const phaseDiv = document.createElement('div');
        phaseDiv.className = 'glass-card border border-indigo-100 rounded-xl p-6 shadow-sm';
        phaseDiv.innerHTML = `<h3 class="font-bold text-lg text-indigo-700 mb-4 border-b border-indigo-100 pb-2 font-display">${phase.phase}</h3>`;
        const ul = document.createElement('ul');
        ul.className = 'space-y-3';
        phase.items.forEach((item, iIndex) => {
            totalItems++;
            if (item.done) doneItems++;
            const li = document.createElement('li');
            li.className = 'flex items-center gap-3 group';
            li.innerHTML = `
                <input type="checkbox" onchange="toggleRoadmapItem(${pIndex}, ${iIndex})" class="roadmap-checkbox appearance-none w-5 h-5 rounded bg-white border border-slate-300 checked:bg-indigo-600 checked:border-indigo-600 cursor-pointer transition-colors relative shadow-sm" ${item.done ? 'checked' : ''}>
                <span class="text-sm text-slate-700 flex-grow transition-colors ${item.done ? 'line-through text-slate-500' : ''}">
                    ${item.text} ${item.critical ? '<span class="ml-2 text-[10px] uppercase font-bold text-red-700 bg-red-100 border border-red-300 px-1 py-0.5 rounded tracking-wide">Critical</span>' : ''}
                </span>
            `;
            ul.appendChild(li);
        });
        phaseDiv.appendChild(ul);

        // Add Task Button
        const addDiv = document.createElement('div');
        addDiv.className = 'mt-5 pt-3 border-t border-indigo-100 flex gap-2';
        addDiv.innerHTML = `
            <input type="text" id="new-task-${pIndex}" placeholder="Add custom task..." class="flex-grow text-sm p-2 glass-input rounded-lg placeholder-slate-400 focus:ring-1 focus:ring-indigo-500 outline-none transition-all">
            <button onclick="addRoadmapItem(${pIndex})" class="px-3 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 hover:text-indigo-800 border border-indigo-200 rounded-lg text-lg font-medium transition-colors leading-none pb-1.5 shadow-sm">+</button>
        `;
        phaseDiv.appendChild(addDiv);
        container.appendChild(phaseDiv);
    });
    const pct = Math.round((doneItems / totalItems) * 100);
    document.getElementById('roadmap-progress-bar').style.width = pct + '%';
    document.getElementById('roadmap-progress-text').innerText = pct + '% Complete';
    document.getElementById('roadmap-progress-text').className = "absolute -bottom-6 right-0 text-xs text-indigo-800 font-bold";
}

function toggleRoadmapItem(pIndex, iIndex) {
    state.roadmap[pIndex].items[iIndex].done = !state.roadmap[pIndex].items[iIndex].done;
    renderRoadmap();
}

function addRoadmapItem(pIndex) {
    const input = document.getElementById(`new-task-${pIndex}`);
    const text = input.value.trim();
    if (text) {
        state.roadmap[pIndex].items.push({ text: text, done: false, critical: false });
        renderRoadmap();
    }
}

// --- Navigation ---
function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');

    // Update sidebar buttons
    document.querySelectorAll('.nav-btn').forEach(el => {
        el.classList.remove('active', 'bg-indigo-600', 'text-white', 'shadow-lg');
        el.classList.add('text-slate-600', 'hover:bg-white/5');
    });
    const activeBtn = document.getElementById(`btn-${tabId}`);
    activeBtn.classList.add('active', 'bg-indigo-600', 'text-white', 'shadow-lg', 'shadow-indigo-500/20');
    activeBtn.classList.remove('text-slate-400', 'hover:bg-white/5');
}

// --- Bid Builder Update ---
function updateBid() {
    state.model = document.getElementById('modelSelect').value;
    state.venue = document.getElementById('venueSelect').value;
    state.date = document.getElementById('dateInput').value;
    state.hwws = document.getElementById('hwwsInput').value;
    state.dinner = document.getElementById('dinnerInput').value;
    state.accom = document.getElementById('accomSelect').value;

    const updateBadge = (id, val) => {
        const el = document.getElementById(id);
        if (!el) return;
        const isDecided = val && val !== 'none' && val !== '';
        el.textContent = isDecided ? 'Decided' : 'Pending';
        el.className = `px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${isDecided ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-amber-100 text-amber-800 border border-amber-200'}`;
    };

    updateBadge('status-model', state.model);
    updateBadge('status-venue', state.venue);
    updateBadge('status-date', state.date);
    updateBadge('status-dinner', state.dinner);
    updateBadge('status-accom', state.accom);

    // Model Hint
    const hint = document.getElementById('model-hint');
    if (state.model === 'inhouse') {
        hint.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4 text-amber-500"><path fill-rule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" /></svg> Warning: Must secure 15% Waiver. Saves ~25k.';
        hint.className = "text-xs text-amber-500 mt-2 font-bold flex items-center gap-1.5";
    } else if (state.model === 'pco') {
        hint.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4 text-emerald-500"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" /></svg> Safe choice. Higher cost, lower admin burden.';
        hint.className = "text-xs text-emerald-500 mt-2 font-bold flex items-center gap-1.5";
    } else {
        hint.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4 text-slate-500"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clip-rule="evenodd" /></svg> Select a model to see pros/cons.';
        hint.className = "text-xs text-slate-500 mt-2 italic flex items-center gap-1.5";
    }
    renderProposalText();
}

function renderProposalText() {
    const container = document.getElementById('proposal-output');
    const pitch = document.getElementById('strategic-pitch').value;
    const venueName = state.venue && state.venue !== 'none' ? document.getElementById('venueSelect').options[document.getElementById('venueSelect').selectedIndex].text : '[PENDING]';
    const modelName = state.model && state.model !== 'none' ? document.getElementById('modelSelect').options[document.getElementById('modelSelect').selectedIndex].text : '[PENDING]';
    const hwwsLoc = state.hwws || '[PENDING]';
    const dinnerLoc = state.dinner || '[PENDING]';
    const accomName = state.accom && state.accom !== 'none' ? state.accom : '[PENDING]';

    let dateStr = '[PENDING]';
    if (state.date) {
        const parts = state.date.split('-');
        const d = new Date(parts[0], parts[1] - 1, parts[2]);
        dateStr = "Week starting " + d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    }

    const proposalHTML = `
        <div class="mb-6 pb-6 border-b border-indigo-200">
            <strong class="text-indigo-800 block mb-1 uppercase text-xs tracking-wider">1. Reason to Host</strong>
            <div class="pl-4 border-l-2 border-indigo-600 italic text-slate-800">"${pitch}"</div>
        </div>
        <div class="mb-4">
            <strong class="text-indigo-800 block mb-1 uppercase text-xs tracking-wider">2. Proposed Venues</strong>
            <span class="text-slate-600">ASM Hub:</span> <span class="text-slate-900 font-bold">${venueName}</span><br>
            <span class="text-slate-600">HWWS Venue:</span> <span class="text-slate-900 font-bold">${hwwsLoc}</span>
        </div>
        <div class="mb-4">
            <strong class="text-indigo-800 block mb-1 uppercase text-xs tracking-wider">3. Proposed Dates</strong>
            <span class="text-slate-900 font-bold">${dateStr}</span>
        </div>
        <div class="mb-4">
            <strong class="text-indigo-800 block mb-1 uppercase text-xs tracking-wider">4. Themes</strong>
            <span class="text-slate-800">"QUASAR COLLABORATION" - Leveraging combined expertise in Theory, Observation, and Planetary Science.</span>
        </div>
        <div class="mb-4">
            <strong class="text-indigo-800 block mb-1 uppercase text-xs tracking-wider">5. Organization</strong>
            <span class="text-slate-900 font-bold">${modelName}</span>
        </div>
        <div class="mb-4">
            <strong class="text-indigo-800 block mb-1 uppercase text-xs tracking-wider">6. Preliminary Costings (2025 Benchmark)</strong>
            <ul class="list-disc pl-4 text-xs mt-1 space-y-1 text-slate-700">
                <li><strong>In-Person Member:</strong> Early $360 / Late $500</li>
                <li><strong>In-Person Student:</strong> Early $200 / Late $350</li>
                <li><strong>Dinner:</strong> Delegate $135 / Student $85</li>
                <li><strong>HWWS:</strong> $600 (Accom) / $450 (Day)</li>
            </ul>
        </div>
        <div class="mb-4">
            <strong class="text-indigo-800 block mb-1 uppercase text-xs tracking-wider">7. Accommodation</strong>
            <span class="text-slate-900 font-bold">${accomName}</span>
        </div>
        <div class="mb-4">
            <strong class="text-indigo-800 block mb-1 uppercase text-xs tracking-wider">8. Dinner Venue</strong>
            <span class="text-slate-900 font-bold">${dinnerLoc}</span>
        </div>
        <div class="mb-4">
            <strong class="text-indigo-800 block mb-1 uppercase text-xs tracking-wider">9. Satellite Meetings</strong>
            <span class="text-slate-700 font-medium">Dedicated rooms reserved for Council, Heads of Dept, and NCA meetings.</span>
        </div>
    `;
    container.innerHTML = proposalHTML;
}

function copyProposal() {
    const text = document.getElementById('proposal-output').innerText;
    const el = document.createElement('textarea');
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    // Fancy toast could go here, sticking to simple alert for now
    alert("✨ Proposal copied to clipboard!");
}

function downloadPlan() {
    const date = new Date().toLocaleDateString();
    const pitch = document.getElementById('strategic-pitch').value;
    let content = `ASA ASM 2027 JOINT BID - QUASAR COLLABORATION PLAN\nDate: ${date}\n\n`;

    content += `--- 1. CORE STRATEGY ---\n${pitch}\n\n`;
    content += `--- 2. CORE DECISIONS ---\n`;
    content += `Operating Model: ${state.model ? state.model.toUpperCase() : 'PENDING'}\n`;
    content += `Lead Venue: ${state.venue ? state.venue.toUpperCase() : 'PENDING'}\n`;
    content += `Start Date: ${state.date || 'PENDING'}\n`;
    content += `HWWS Location: ${state.hwws || 'PENDING'}\n`;
    content += `Dinner Venue: ${state.dinner || 'PENDING'}\n`;
    content += `Accommodation: ${state.accom || 'PENDING'}\n\n`;

    content += `--- 3. FINANCIAL PROJECTIONS (2025 RATES) ---\n`;
    content += `Total Estimated Revenue: ${document.getElementById('total-revenue').innerText}\n`;
    content += `Sponsorship: $${state.counts.sponsor.toLocaleString()}\n`;
    content += `Breakdown (Count x Price):\n`;
    content += ` - Mem Early: ${state.counts.memEarly} x $360\n`;
    content += ` - Mem Late: ${state.counts.memLate} x $500\n`;
    content += ` - Stu Early: ${state.counts.stuEarly} x $200\n`;
    content += ` - Stu Late: ${state.counts.stuLate} x $350\n`;
    content += ` - Non Mem: ${state.counts.nonMem} x $500\n`;
    content += ` - HWWS (Accom): ${state.counts.hwwsAccom} x $600\n`;
    content += ` - Dinner (Full): ${state.counts.dinnerFull} x $135\n\n`;

    content += `--- 4. PROPOSAL DRAFT ---\n`;
    content += document.getElementById('proposal-output').innerText + `\n\n`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ASA_ASM2027_Bid_Plan.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

// --- Init ---
window.onload = function () {
    // Force Tab switch to ensure UI state is correct
    switchTab('strategy');
    initCharts();
    renderRoadmap();
    updateBid(); // Initial sync
};
