/* ==========================================================================
   Sri Saraswathi Academy, Kukatpally
   Interactions: config, nav, header behaviour, tabs, accordion,
   scroll reveal, and enquiry form routed to WhatsApp.
   ========================================================================== */

/* ------------------------------------------------------------------
   SETTINGS. Edit these before launch.
   WHATSAPP_NUMBER uses the international format with country code and
   no plus sign, spaces or dashes (example: 919000000000).
   ------------------------------------------------------------------ */
var CONFIG = {
  WHATSAPP_NUMBER: "919000000000",     // placeholder, replace with real number
  PHONE_DISPLAY: "+91 90000 00000",    // shown to visitors
  PHONE_DIAL: "+919000000000",         // used in tel: links
  BUSINESS_NAME: "Sri Saraswathi Academy"
};

(function () {
  "use strict";

  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- apply phone config to links ---------- */
  function applyConfig() {
    var phoneLink = document.getElementById("phoneLink");
    if (phoneLink) {
      phoneLink.textContent = CONFIG.PHONE_DISPLAY;
      phoneLink.setAttribute("href", "tel:" + CONFIG.PHONE_DIAL);
    }
    var floatBtn = document.getElementById("whatsappFloat");
    if (floatBtn) {
      floatBtn.setAttribute(
        "href",
        "https://wa.me/" + CONFIG.WHATSAPP_NUMBER +
        "?text=" + encodeURIComponent("Hello, I would like to know more about your coaching programs.")
      );
      floatBtn.setAttribute("target", "_blank");
      floatBtn.setAttribute("rel", "noopener");
    }
    var year = document.getElementById("year");
    if (year) { year.textContent = String(new Date().getFullYear()); }
  }

  /* ---------- mobile nav ---------- */
  function initNav() {
    var toggle = document.getElementById("navToggle");
    var list = document.getElementById("navList");
    if (!toggle || !list) { return; }

    toggle.addEventListener("click", function () {
      var open = list.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    list.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        list.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------- header: solid on scroll, hide down, show up ---------- */
  function initHeader() {
    var header = document.querySelector("[data-header]");
    if (!header) { return; }
    var lastY = window.pageYOffset;
    var ticking = false;

    function update() {
      var y = window.pageYOffset;
      header.classList.toggle("is-solid", y > 10);

      // only hide once past the header area and when scrolling down a clear amount
      if (y > 200 && y > lastY + 4) {
        header.classList.add("is-hidden");
      } else if (y < lastY - 4) {
        header.classList.remove("is-hidden");
      }
      lastY = y;
      ticking = false;
    }

    window.addEventListener("scroll", function () {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });
    update();
  }

  /* ---------- tabs ---------- */
  function initTabs() {
    var group = document.querySelector("[data-tabs]");
    if (!group) { return; }
    var tabs = Array.prototype.slice.call(group.querySelectorAll("[role=tab]"));

    function select(tab) {
      tabs.forEach(function (t) {
        var selected = t === tab;
        t.setAttribute("aria-selected", selected ? "true" : "false");
        t.setAttribute("tabindex", selected ? "0" : "-1");
        var panel = document.getElementById(t.getAttribute("aria-controls"));
        if (panel) { panel.hidden = !selected; }
      });
    }

    tabs.forEach(function (tab, i) {
      tab.addEventListener("click", function () { select(tab); });
      tab.addEventListener("keydown", function (e) {
        var idx = null;
        if (e.key === "ArrowRight") { idx = (i + 1) % tabs.length; }
        else if (e.key === "ArrowLeft") { idx = (i - 1 + tabs.length) % tabs.length; }
        else if (e.key === "Home") { idx = 0; }
        else if (e.key === "End") { idx = tabs.length - 1; }
        if (idx !== null) {
          e.preventDefault();
          tabs[idx].focus();
          select(tabs[idx]);
        }
      });
    });
  }

  /* ---------- faq accordion ---------- */
  function initAccordion() {
    var root = document.querySelector("[data-accordion]");
    if (!root) { return; }
    var triggers = Array.prototype.slice.call(root.querySelectorAll(".faq-trigger"));

    triggers.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var expanded = btn.getAttribute("aria-expanded") === "true";
        var panel = document.getElementById(btn.getAttribute("aria-controls"));
        btn.setAttribute("aria-expanded", expanded ? "false" : "true");
        if (panel) { panel.hidden = expanded; }
      });
    });
  }

  /* ---------- scroll reveal ---------- */
  function initReveal() {
    var items = Array.prototype.slice.call(document.querySelectorAll(".reveal, .reveal-wipe"));
    if (!items.length) { return; }

    if (prefersReduced || !("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }

    // light stagger for grouped items
    document.querySelectorAll(".card-grid, .faculty-grid, .steps").forEach(function (grid) {
      Array.prototype.slice.call(grid.querySelectorAll(".reveal")).forEach(function (el, i) {
        el.style.setProperty("--d", (i * 0.08) + "s");
      });
    });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -8% 0px" });

    items.forEach(function (el) { io.observe(el); });
  }

  /* ---------- enquiry form, routed to WhatsApp ---------- */
  function initForm() {
    var form = document.getElementById("enquiryForm");
    if (!form) { return; }

    var name = form.querySelector("#name");
    var phone = form.querySelector("#phone");
    var program = form.querySelector("#program");
    var message = form.querySelector("#message");

    function setError(field, show) {
      var err = document.getElementById(field.id + "-error");
      if (err) { err.hidden = !show; }
      field.setAttribute("aria-invalid", show ? "true" : "false");
    }

    // accepts "98480 12345", "+91 98480-12345", "098480 12345" and returns 10 digits
    function cleanPhone(value) {
      var d = value.replace(/\D/g, "");
      if (d.length === 12 && d.indexOf("91") === 0) { d = d.slice(2); }
      if (d.length === 11 && d.charAt(0) === "0") { d = d.slice(1); }
      return d;
    }

    function validPhone(value) {
      return /^[6-9][0-9]{9}$/.test(cleanPhone(value));
    }

    // clear an error as the user corrects the field
    [name, phone, program].forEach(function (field) {
      field.addEventListener("input", function () { setError(field, false); });
      field.addEventListener("change", function () { setError(field, false); });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = true;

      if (!name.value.trim()) { setError(name, true); ok = false; }
      if (!validPhone(phone.value)) { setError(phone, true); ok = false; }
      if (!program.value) { setError(program, true); ok = false; }

      if (!ok) {
        var firstBad = form.querySelector('[aria-invalid="true"]');
        if (firstBad) { firstBad.focus(); }
        return;
      }

      var lines = [
        "New enquiry for " + CONFIG.BUSINESS_NAME,
        "Name: " + name.value.trim(),
        "Mobile: " + cleanPhone(phone.value),
        "Program: " + program.value
      ];
      if (message.value.trim()) {
        lines.push("Message: " + message.value.trim());
      }

      var url = "https://wa.me/" + CONFIG.WHATSAPP_NUMBER +
        "?text=" + encodeURIComponent(lines.join("\n"));
      // open WhatsApp in a new tab; if a popup blocker stops it, go there directly
      var win = window.open(url, "_blank");
      if (win) { win.opener = null; } else { window.location.href = url; }
    });
  }

  /* ---------- init ---------- */
  function ready(fn) {
    if (document.readyState !== "loading") { fn(); }
    else { document.addEventListener("DOMContentLoaded", fn); }
  }

  ready(function () {
    applyConfig();
    initNav();
    initHeader();
    initTabs();
    initAccordion();
    initReveal();
    initForm();
  });
})();

