// TABS IN TASKMANAGER //
document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.tm-tab');
    const panels = document.querySelectorAll('.tm-panel');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // activate tab
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            //activate matching panel
            const id = tab.dataset.panel;
            panels.forEach(p => p.classList.toggle('active', p.id === id));
        })
    })
});




//Move window

(() => {
    let zCounter = 10;
    let cmdTypedStarted = false;

    function pxToNum(v) {
        const n = parseFloat(v);
        return Number.isFinite(n) ? n : 0;
    }

    function getDocPos(el) {
        const r = el.getBoundingClientRect();
        return { left: r.left + window.scrollX, top: r.top + window.scrollY, width: r.width, height: r.height };
    }

    function ensureInitialPosition(win) {
        // If left/top not set on style, initialize from current layout box
        const { left, top } = getDocPos(win);
        if (!win.style.left) win.style.left = `${left}px`;
        if (!win.style.top) win.style.top = `${top}px`;
        // Ensure positioned
        const cs = getComputedStyle(win);
        if (cs.position === 'static') win.style.position = 'absolute';
    }

    function makeDraggable(win, handleSelector = '.titlebar-folder') {
        const handle = win.querySelector(handleSelector) || win;
        ensureInitialPosition(win);

        let startX = 0, startY = 0;
        let baseLeft = 0, baseTop = 0;
        let dragging = false;

        // If your titlebar contains buttons, don’t start a drag from them
        handle.addEventListener('pointerdown', (e) => {
            const target = e.target;
            if (target instanceof HTMLElement && (target.closest('button') || target.tagName === 'BUTTON')) {
                return; // clicking window controls shouldn't drag
            }
            if (e.button !== undefined && e.button !== 0) return; // only primary button

            dragging = true;

            // Bring to front
            zCounter += 1;
            win.style.zIndex = String(zCounter);

            // Cache start positions
            const { left, top } = getDocPos(win);
            baseLeft = pxToNum(win.style.left) || left;
            baseTop = pxToNum(win.style.top) || top;

            startX = e.clientX + window.scrollX;
            startY = e.clientY + window.scrollY;

            handle.setPointerCapture(e.pointerId);
            e.preventDefault(); // avoid text selection
        });

        handle.addEventListener('pointermove', (e) => {
            if (!dragging) return;

            const currX = e.clientX + window.scrollX;
            const currY = e.clientY + window.scrollY;

            let nextLeft = baseLeft + (currX - startX);
            let nextTop = baseTop + (currY - startY);

            // Clamp to viewport
            const { width, height } = getDocPos(win);
            const vw = document.documentElement.clientWidth;
            const vh = document.documentElement.clientHeight;

            nextLeft = Math.min(Math.max(0, nextLeft), Math.max(0, vw - width));
            nextTop = Math.min(Math.max(0, nextTop), Math.max(0, vh - height));

            win.style.left = `${nextLeft}px`;
            win.style.top = `${nextTop}px`;
        });

        function endDrag(e) {
            if (!dragging) return;
            dragging = false;
            try { handle.releasePointerCapture(e.pointerId); } catch { }
        }

        handle.addEventListener('pointerup', endDrag);
        handle.addEventListener('pointercancel', endDrag);
        handle.addEventListener('lostpointercapture', endDrag);
    }

    // Activate for all windows on the page
    document.addEventListener('DOMContentLoaded', () => {
        document.querySelectorAll('.window').forEach(w => makeDraggable(w));
    });

    document.getElementById("projects").ondblclick = () => {
        const win = document.getElementById('window-folder');
        centerWindow(win);
        win.hidden = false;
    }

   

    document.getElementById("cmd").ondblclick = () => {
        const win = document.getElementById('window-cmd');
        centerWindow(win);
        win.hidden = false;

        if (!cmdTypedStarted) {
            cmdTypedStarted = true;
            new Typed("#window-cmd .animated", {
                strings: ["Run-about-Jordy.exe"],
                typeSpeed: 150,
                backSpeed: 200,
                loop: false,
                onComplete: startAboutMe
            });
        }
    }

    const content = document.querySelector('#window-cmd .cmd-content');

    // put these helpers above startAboutMe()
    let rafId = null;
    function startStickBottom(content) {
        // keep it glued to the bottom every frame while typing
        const tick = () => {
            content.scrollTop = content.scrollHeight;
            rafId = requestAnimationFrame(tick);
        };
        if (!rafId) rafId = requestAnimationFrame(tick);
    }
    function stopStickBottom() {
        if (rafId) {
            cancelAnimationFrame(rafId);
            rafId = null;
        }
    }




    function startAboutMe() {
        let out = document.getElementById('about-me-out');
        if (!out) {
            out = document.createElement('div');
            out.id = 'about-me-out';
            content.appendChild(out);
        }



        // show it (keep #about-me hidden; it's just the source)
        out.style.display = 'block';

        // Optional: keep the area scrollable and auto-scroll as it types
        content.style.maxHeight = '320px';
        content.style.overflowY = 'auto';

        new Typed('#about-me-out', {
            stringsElement: '#about-me',   // read the <p> lines from the hidden div
            contentType: 'html',
            typeSpeed: 15,                 // fast terminal typing
            backSpeed: 0,
            smartBackspace: false,
            loop: false,
            onBegin: () => startStickBottom(content),          // start pinning
            onComplete: () => {
                stopStickBottom();               // stop pinning
                content.scrollTop = content.scrollHeight;} // final snap
        });
    };






    document.getElementById("skills").ondblclick = () => {
        const win = document.getElementById('window-taskmanager');
        centerWindow(win);
        win.hidden = false;
    }

    document.getElementById("library").ondblclick = () => {
        const win = document.getElementById('window-library');
        centerWindow(win);
        win.hidden = false;
    }

    document.getElementById("casino").ondblclick = () => {
        const win = document.getElementById('window-casino');
        centerWindow(win);
        win.hidden = false;
    }

    document.getElementById("portfolio").ondblclick = () => {
        const win = document.getElementById('window-portfolio');
        centerWindow(win);
        win.hidden = false;
    }


    ['cmd', 'folder', 'taskmanager', 'library', 'casino', 'portfolio'].forEach(name => {
        document.getElementById(`close-${name}`).onclick = () =>
            document.getElementById(`window-${name}`).hidden = true;
    });

    function centerWindow(win) {
        const workspace = document.getElementById('workspace') || document.body;
        const wsRect = workspace.getBoundingClientRect();

        // temporarily show to measure size
        const wasHidden = win.hidden;
        if (wasHidden) {
            win.hidden = false;
            win.style.visibility = 'hidden';
        }

        const left = (wsRect.width - win.offsetWidth) / 2;
        const top = (wsRect.height - win.offsetHeight) / 2;

        win.style.position = 'absolute';
        win.style.left = `${left}px`;
        win.style.top = `${top}px`;

        if (wasHidden) {
            win.hidden = true;
            win.style.visibility = '';
        }
    }

    document.getElementById("start").onclick = () => {
        const startPopUP = document.getElementById('startPopUp');
        if (startPopUP.hidden === true) {
            startPopUP.hidden = false;
        } else {
            startPopUP.hidden = true;
        }
    }












})();






