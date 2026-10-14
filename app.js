/* ==========================================================================
   SHENDY LIFE CALENDAR — app.js
   عرض ثابت لجدول أسبوعي متكرر.
   لا CRUD، لا Backend، لا قاعدة بيانات، لا تواريخ حيّة، لا تتبّع.
   ========================================================================== */
(function () {
  "use strict";

  var D = window.SHENDY_DATA;
  if (!D) { return; }

  var state = { cycle: "A", day: "sun", showTimes: true };

  function esc(s) {
    return String(s === null || s === undefined ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  var LTR_RE = /[A-Za-z][A-Za-z0-9+&.\-_/]*(?:[ \t]+[A-Za-z0-9&][A-Za-z0-9+&.\-_/]*)*/g;

  function fmt(s) {
    if (s === null || s === undefined) { return ""; }
    var str = String(s);
    var out = "";
    var last = 0;
    var m;
    LTR_RE.lastIndex = 0;
    while ((m = LTR_RE.exec(str)) !== null) {
      if (m[0].length === 0) { LTR_RE.lastIndex++; continue; }
      if (m.index > last) { out += esc(str.slice(last, m.index)); }
      out += "<bdi dir=\"ltr\">" + esc(m[0]) + "</bdi>";
      last = m.index + m[0].length;
    }
    out += esc(str.slice(last));
    return out;
  }

  function dur(min) {
    if (!min) { return ""; }
    var h = Math.floor(min / 60);
    var m = min % 60;
    if (h && m) { return h + " س " + m + " د"; }
    if (h) { return h + " س"; }
    return m + " د";
  }

  function addMin(hhmm, mins) {
    var parts = String(hhmm).split(":");
    var total = (parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10) + mins) % 1440;
    if (total < 0) { total += 1440; }
    var h = Math.floor(total / 60);
    var m = total % 60;
    return (h < 10 ? "0" : "") + h + ":" + (m < 10 ? "0" : "") + m;
  }

  var ICONS = {
    moon: '<path d="M20.6 13.3A8.6 8.6 0 1 1 10.7 3.4a7 7 0 0 0 9.9 9.9z"/>',
    pulse: '<polyline points="3 12 7 12 10 5 14 19 17 12 21 12"/>',
    list: '<rect x="4" y="4" width="16" height="16" rx="2.5"/><path d="M8 9h8M8 13h8M8 17h5"/>',
    book: '<path d="M12 6.6C10.5 5.1 8.5 4.6 4 4.6v13c4.5 0 6.5.5 8 2 1.5-1.5 3.5-2 8-2v-13c-4.5 0-6.5.5-8 2z"/><path d="M12 6.6v13"/>',
    case: '<rect x="3" y="7" width="18" height="13" rx="2.5"/><path d="M9 7V5.6A1.6 1.6 0 0 1 10.6 4h2.8A1.6 1.6 0 0 1 15 5.6V7"/><path d="M3 12h18"/>',
    cap: '<path d="M2.6 8.6 12 4l9.4 4.6L12 13.2z"/><path d="M6.6 10.8V16c0 1.4 2.4 2.6 5.4 2.6s5.4-1.2 5.4-2.6v-5.2"/>',
    layers: '<path d="M12 3.6 20.4 8 12 12.4 3.6 8z"/><path d="M3.6 13 12 17.4 20.4 13"/>',
    dots: '<circle cx="6" cy="12" r="1.5" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none"/><circle cx="18" cy="12" r="1.5" fill="currentColor" stroke="none"/>'
  };

  function icon(name) {
    var body = ICONS[name] || ICONS.dots;
    return '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
      'stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" ' +
      'aria-hidden="true" focusable="false">' + body + '</svg>';
  }

  function trackInfo(track) {
    if (track === "BUSINESS") { return { ar: "بزنس", en: "BUSINESS" }; }
    if (track === "TECHNOLOGY") { return { ar: "تقنية وهندسة", en: "TECHNOLOGY / ENGINEERING" }; }
    return { ar: "علم", en: "SCIENCE" };
  }

  function findDay(id) {
    for (var i = 0; i < D.days.length; i++) {
      if (D.days[i].id === id) { return D.days[i]; }
    }
    return null;
  }

  function buildDay(dayId, cycleKey) {
    var day = findDay(dayId);
    if (!day) { return []; }
    var cycle = D.cycles[cycleKey] || D.cycles.A;
    var tpl = day.focused ? D.templates.focused : D.templates.light;
    var out = [];
    var i, j;

    for (i = 0; i < tpl.length; i++) {
      var b = tpl[i];

      if (b.pillar === "college" && day.collegeParts) {
        var cursor = b.start;
        for (j = 0; j < day.collegeParts.length; j++) {
          var part = day.collegeParts[j];
          var endT = addMin(cursor, part.minutes);
          out.push({
            pillar: "college",
            start: cursor,
            end: endT,
            min: part.minutes,
            title: part.title,
            meta: "كلية — " + dur(part.minutes),
            chip: ""
          });
          cursor = endT;
        }
        continue;
      }

      var block = {
        pillar: b.pillar,
        start: b.start,
        end: b.end,
        min: b.min,
        title: b.title,
        meta: b.meta || "",
        chip: ""
      };

      if (b.pillar === "college") {
        block.title = day.college;
        block.meta = "كلية — " + dur(b.min) + " حسب الجدول الرسمي";
      }

      if (b.pillar === "science") {
        var track = cycle.tracks[dayId];
        var info = trackInfo(track);
        block.title = info.ar;
        block.meta = info.en + " — " + dur(b.min);
        if (track === "BUSINESS") {
          var fn = cycle.business[dayId];
          block.chip = fn ? "وظيفة الجلسة: " + fn : "جلسة بزنس — وظيفة واحدة فقط";
        } else {
          block.chip = "مسار واحد فقط في الجلسة";
        }
      }

      if (b.pillar === "project") {
        block.title = D.activeProject.name;
        block.meta = "عمل عميق — " + dur(b.min);
      }

      if (b.pillar === "work") {
        block.meta = "عمل يومي — " + dur(b.min);
      }

      out.push(block);
    }
    return out;
  }

  function renderPillars() {
    var host = document.getElementById("pillarsSummary");
    if (!host) { return; }
    var keys = ["faith", "health", "admin", "science", "work", "college", "project"];
    var h = '<h2 class="panel__title" id="pillars-title">المحاور اليومية السبعة — بترتيب الأولوية</h2>';
    h += '<ul class="pillar-list">';
    for (var i = 0; i < keys.length; i++) {
      var p = D.pillars[keys[i]];
      h += '<li class="pillar-item">' + icon(p.icon) +
        '<span class="pillar-item__name">' + esc(p.label) + '</span>' +
        '<span class="pillar-item__desc">' + fmt(p.desc) + '</span></li>';
    }
    h += '</ul>';
    h += '<ul class="base-list">';
    for (i = 0; i < D.dailyBase.length; i++) {
      var b = D.dailyBase[i];
      h += '<li>' + icon(D.pillars[b.pillar].icon) + '<span>' + fmt(b.text) + '</span></li>';
    }
    h += '</ul>';
    h += '<p class="panel__note">' + fmt(D.app.timeNotice) + '</p>';
    host.innerHTML = h;
  }

  function renderCycleControl() {
    var host = document.getElementById("cycleControl");
    if (!host) { return; }
    var keys = ["A", "B", "C"];
    var h = '<h2 class="panel__title" id="cycle-title">دورة العلم — تتكرر كل ثلاثة أسابيع</h2>';
    h += '<div class="segmented" role="group" aria-label="اختيار دورة العلم">';
    for (var i = 0; i < keys.length; i++) {
      var k = keys[i];
      h += '<button type="button" class="seg-btn" data-cycle="' + k + '" aria-pressed="' +
        (state.cycle === k ? "true" : "false") + '">' + esc(D.cycles[k].label) + '</button>';
    }
    h += '</div>';
    h += '<p class="panel__note">' + fmt(D.cycles[state.cycle].summary) + '</p>';
    host.innerHTML = h;
    var buttons = host.querySelectorAll("[data-cycle]");
    for (i = 0; i < buttons.length; i++) {
      buttons[i].addEventListener("click", onCycleClick);
    }
  }

  function onCycleClick(e) {
    setCycle(e.currentTarget.getAttribute("data-cycle"));
  }

  function setCycle(key) {
    if (!D.cycles[key]) { return; }
    state.cycle = key;
    var host = document.getElementById("cycleControl");
    if (host) {
      var buttons = host.querySelectorAll("[data-cycle]");
      for (var i = 0; i < buttons.length; i++) {
        buttons[i].setAttribute("aria-pressed",
          buttons[i].getAttribute("data-cycle") === key ? "true" : "false");
      }
      var note = host.querySelector(".panel__note");
      if (note) { note.innerHTML = fmt(D.cycles[key].summary); }
    }
    renderGrid();
  }

  function renderDayStrip() {
    var strip = document.getElementById("dayStrip");
    if (!strip) { return; }
    var h = "";
    for (var i = 0; i < D.days.length; i++) {
      var d = D.days[i];
      h += '<button type="button" class="day-chip" data-day="' + d.id + '" aria-pressed="' +
        (state.day === d.id ? "true" : "false") + '">' + esc(d.name) + '</button>';
    }
    strip.innerHTML = h;
    var chips = strip.querySelectorAll("[data-day]");
    for (i = 0; i < chips.length; i++) {
      chips[i].addEventListener("click", onDayClick);
    }
  }

  function onDayClick(e) {
    setDay(e.currentTarget.getAttribute("data-day"));
  }

  function setDay(id) {
    if (!findDay(id)) { return; }
    state.day = id;
    var strip = document.getElementById("dayStrip");
    if (strip) {
      var chips = strip.querySelectorAll("[data-day]");
      for (var i = 0; i < chips.length; i++) {
        chips[i].setAttribute("aria-pressed",
          chips[i].getAttribute("data-day") === id ? "true" : "false");
      }
    }
    var grid = document.getElementById("weekGrid");
    if (grid) {
      var cols = grid.querySelectorAll(".day-column");
      for (i = 0; i < cols.length; i++) {
        if (cols[i].getAttribute("data-day") === id) {
          cols[i].classList.add("is-active");
        } else {
          cols[i].classList.remove("is-active");
        }
      }
    }
  }

  function dayTags(day) {
    var cycle = D.cycles[state.cycle];
    var h = "";
    if (day.focused) {
      var track = cycle.tracks[day.id];
      var info = trackInfo(track);
      h += "<li>علم: <b>" + esc(info.ar) + '</b> · <bdi dir="ltr">' + esc(info.en) + "</bdi></li>";
      if (track === "BUSINESS" && cycle.business[day.id]) {
        h += "<li>وظيفة البزنس: " + fmt(cycle.business[day.id]) + "</li>";
      }
      h += "<li>كلية: " + fmt(day.college) + " · " + dur(120) + "</li>";
      h += "<li>مشروع: عمل عميق · " + dur(120) + "</li>";
    } else {
      h += "<li>لا جلسات علم أو كلية أو مشاريع مجدولة</li>";
      h += "<li>أسس الله والصحة/الإدارة والعمل اليومية مستمرة</li>";
    }
    return h;
  }

  function blockHTML(b) {
    var pillar = D.pillars[b.pillar] || D.pillars.margin;
    var h = '<article class="block block--' + b.pillar + '">';
    h += '<div class="block__row">';
    h += '<span class="block__pillar">' + icon(pillar.icon) + esc(pillar.label) + '</span>';
    h += '<span class="block__time" dir="ltr">' + esc(b.start) + "–" + esc(b.end) + '</span>';
    h += '<span class="block__dur">' + esc(dur(b.min)) + '</span>';
    h += '</div>';
    h += '<h4 class="block__title">' + fmt(b.title) + '</h4>';
    if (b.meta) { h += '<p class="block__meta">' + fmt(b.meta) + '</p>'; }
    if (b.chip) { h += '<p class="block__chip">' + fmt(b.chip) + '</p>'; }
    h += '</article>';
    return h;
  }

  function dayColumnHTML(day) {
    var blocks = buildDay(day.id, state.cycle);
    var scheduled = 0;
    var i;
    for (i = 0; i < blocks.length; i++) {
      if (blocks[i].pillar !== "margin") { scheduled += blocks[i].min; }
    }

    var h = '<section class="day-column" data-day="' + day.id + '" aria-labelledby="dc-' + day.id + '">';
    h += '<header class="day-column__head">';
    h += '<h3 class="day-column__title" id="dc-' + day.id + '">' + esc(day.name) + '</h3>';
    h += '<p class="day-column__sub">' +
      (day.focused ? "يوم مركّز · الأحد – الخميس" : "يوم خفيف · بلا علم أو كلية أو مشاريع") +
      " · " + dur(scheduled) + " مجدولة</p>";
    h += '</header>';
    h += '<ul class="day-tags">' + dayTags(day) + '</ul>';
    h += '<div class="day-column__blocks">';
    for (i = 0; i < blocks.length; i++) { h += blockHTML(blocks[i]); }
    h += '</div></section>';
    return h;
  }

  function renderGrid() {
    var grid = document.getElementById("weekGrid");
    if (!grid) { return; }
    var h = "";
    for (var i = 0; i < D.days.length; i++) { h += dayColumnHTML(D.days[i]); }
    grid.innerHTML = h;
    grid.classList.toggle("no-times", !state.showTimes);

    var cols = grid.querySelectorAll(".day-column");
    for (i = 0; i < cols.length; i++) {
      if (cols[i].getAttribute("data-day") === state.day) {
        cols[i].classList.add("is-active");
      } else {
        cols[i].classList.remove("is-active");
      }
    }
  }

  function renderLegend() {
    var host = document.getElementById("legend");
    if (!host) { return; }
    var h = '<h2 class="panel__title" id="legend-title">وظائف البزنس السبع — ترتيب متسلسل مستمر</h2>';
    h += '<ol class="fn-list">';
    for (var i = 0; i < D.businessFunctions.length; i++) {
      var f = D.businessFunctions[i];
      h += '<li><span class="fn-list__num">' + (i + 1) + '</span>' +
        '<span class="fn-list__name">' + fmt(f.name) + '</span>' +
        '<span class="fn-list__desc">' + fmt(f.desc) + '</span></li>';
    }
    h += '</ol>';
    h += '<p class="panel__note">' + fmt(D.businessNote) + '</p>';

    h += '<h2 class="panel__title" style="margin-top:18px">افتراضات التنفيذ وملاحظات المصدر</h2>';
    h += '<ul class="base-list">';
    for (i = 0; i < D.assumptions.length; i++) {
      h += '<li>' + icon("dots") + '<span>' + fmt(D.assumptions[i]) + '</span></li>';
    }
    h += '</ul>';
    h += '<ul class="base-list">';
    for (i = 0; i < D.conflicts.length; i++) {
      h += '<li>' + icon("dots") + '<span>' + fmt(D.conflicts[i]) + '</span></li>';
    }
    h += '</ul>';
    h += '<p class="panel__note">المصدر: <bdi dir="ltr">README_SCHEDULE.txt</bdi> و <bdi dir="ltr">WEEKLY_SCHEDULE.txt</bdi>. ' +
      'لتعديل أي وقت أو اسم مشروع، افتح <bdi dir="ltr">schedule-data.js</bdi> وعدّل القيم ثم أعد رفع الموقع.</p>';
    host.innerHTML = h;
  }

  function initTimesToggle() {
    var btn = document.getElementById("timesToggle");
    if (!btn) { return; }
    btn.addEventListener("click", function () {
      state.showTimes = !state.showTimes;
      btn.setAttribute("aria-pressed", state.showTimes ? "true" : "false");
      btn.textContent = state.showTimes ? "الأوقات المقترحة: ظاهرة" : "الأوقات المقترحة: مخفية";
      var grid = document.getElementById("weekGrid");
      if (grid) { grid.classList.toggle("no-times", !state.showTimes); }
    });
  }

  function initPWA() {
    var installBtn = document.getElementById("installBtn");
    var deferred = null;

    if ("serviceWorker" in navigator && location.protocol !== "file:") {
      window.addEventListener("load", function () {
        navigator.serviceWorker.register("./sw.js").catch(function (e) {
          if (window.console && console.warn) { console.warn("تعذّر تسجيل Service Worker:", e); }
        });
      });
    }

    window.addEventListener("beforeinstallprompt", function (e) {
      e.preventDefault();
      deferred = e;
      if (installBtn) { installBtn.hidden = false; }
    });

    if (installBtn) {
      installBtn.addEventListener("click", function () {
        if (!deferred) { return; }
        deferred.prompt();
        deferred.userChoice.then(function () {
          deferred = null;
          installBtn.hidden = true;
        });
      });
    }

    window.addEventListener("appinstalled", function () {
      if (installBtn) { installBtn.hidden = true; }
    });
  }

  function init() {
    renderPillars();
    renderCycleControl();
    renderDayStrip();
    renderGrid();
    renderLegend();
    initTimesToggle();
    initPWA();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
