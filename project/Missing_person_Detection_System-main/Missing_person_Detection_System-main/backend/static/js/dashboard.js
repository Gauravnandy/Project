/* ============================================
   dashboard.js — Shared utilities
   ============================================ */
const API_BASE_URL = window.location.origin;
let socket = null;

// ---- SOCKET ----
function initSharedSocket() {
    if (typeof io === 'undefined') { console.warn('SocketIO not loaded'); return; }
    socket = io(API_BASE_URL, {
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 10,
        reconnectionDelay: 1000
    });
    socket.on('connect', () => console.log('[SOCKET] Connected'));
    socket.on('disconnect', () => console.log('[SOCKET] Disconnected'));

    // Global alert listener — shows toast on ANY page
    socket.on('alert_triggered', function (data) {
        const name = (data && data.person_name) || 'Unknown';
        const conf = (data && data.confidence) || 'N/A';
        showToast(
            `🚨 ${name} Detected`,
            `Confidence: ${conf} — ${data.camera_source || 'Camera'}`,
            'danger',
            8000
        );
        playAlertSound();
    });
}

// ---- TOAST NOTIFICATIONS ----
let toastCounter = 0;
function showToast(title, message, type, duration) {
    type = type || 'info';
    duration = duration || 5000;
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const id = 'toast-' + (++toastCounter);
    const icons = { danger: '🚨', success: '✅', info: 'ℹ️', warning: '⚠️' };
    const toast = document.createElement('div');
    toast.className = 'toast toast-' + type;
    toast.id = id;
    toast.innerHTML =
        '<span class="toast-icon">' + (icons[type] || 'ℹ️') + '</span>' +
        '<div class="toast-body">' +
        '<div class="toast-title">' + escapeHtml(title) + '</div>' +
        '<div class="toast-message">' + escapeHtml(message) + '</div>' +
        '</div>' +
        '<button class="toast-close" onclick="removeToast(\'' + id + '\')">&times;</button>';
    container.appendChild(toast);

    setTimeout(function () { removeToast(id); }, duration);
}

function removeToast(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.add('removing');
    setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 300);
}

// ---- ALERT SOUND ----
function playAlertSound() {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        osc.frequency.setValueAtTime(660, ctx.currentTime + 0.1);
        osc.frequency.setValueAtTime(880, ctx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.25, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.5);
    } catch (e) { /* silent */ }
}

// ---- CLOCK ----
function updateClock() {
    const el = document.getElementById('liveClock');
    if (!el) return;
    const now = new Date();
    el.textContent = now.toLocaleTimeString('en-US', { hour12: false }) + ' · ' +
        now.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
}

// ---- HELPERS ----
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ---- SIDEBAR ACTIVE STATE & TOGGLE ----
function initSidebar() {
    const layout = document.querySelector('.layout');
    const path = window.location.pathname;

    // Set active link
    document.querySelectorAll('.sidebar-link').forEach(function (link) {
        const href = link.getAttribute('href');
        if (path === href || (href !== '/' && path.startsWith(href))) {
            link.classList.add('active');
        } else if (href === '/' && path === '/') {
            link.classList.add('active');
        }
    });

    // Sidebar collapse toggle
    const sidebarToggle = document.getElementById('sidebarToggle');
    if (sidebarToggle && layout) {
        // Restore saved state
        if (localStorage.getItem('sidebarCollapsed') === 'true') {
            layout.classList.add('sidebar-collapsed');
        }
        sidebarToggle.addEventListener('click', function () {
            layout.classList.toggle('sidebar-collapsed');
            localStorage.setItem('sidebarCollapsed', layout.classList.contains('sidebar-collapsed'));
        });
    }

    // Mobile toggle
    const mobileToggle = document.getElementById('mobileToggle');
    const sidebar = document.querySelector('.sidebar');
    if (mobileToggle && sidebar) {
        mobileToggle.addEventListener('click', function () {
            sidebar.classList.toggle('open');
        });
    }
}

// ---- NOTIFICATION PERMISSION ----
function requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }
}

// ---- INIT ----
document.addEventListener('DOMContentLoaded', function () {
    initSharedSocket();
    initSidebar();
    updateClock();
    setInterval(updateClock, 1000);
    requestNotificationPermission();
});
