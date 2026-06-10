/* ════════════════════════════════════════════════════════
   BRITOL GROUP — Scheduling Modal Logic
   ════════════════════════════════════════════════════════ */

/* ── Scope of works data (from PDF quote sheets) ── */
const SM_SCOPES = {
  office: [
    'Entrance (36 sqm) — spot-clean glass doors, mop & vacuum floors, dust skirtings',
    'Reception (12 sqm) — dust desks & monitors, empty bins, sanitise switches',
    'Offices ×4 (Director / Kim / Anthony / Joe) — vacuum, empty bins, wipe surfaces',
    'Boardroom (30 sqm) — clean table & chairs, remove rubbish, vacuum',
    'Hallway (10 sqm) — vacuum & mop, dust surfaces',
    'Kitchenette (4 sqm) — clean appliances, wipe benches, mop & vacuum',
    'Bathrooms — full sanitisation (toilets, basins, mirrors), replenish consumables',
    'Kitchen (12 sqm) — clean appliances, wipe sinks & taps, mop',
    'Change rooms (6 sqm) — vacuum & mop',
    'Filing room (8 sqm) — vacuum floors, dust surfaces'
  ],
  bodycorp: [
    'Building entrance / lobby (36 sqm) — mop floors, spot-clean glass, vacuum',
    'Reception / lobby area (12 sqm) — dust furniture, empty bins, sanitise intercoms',
    'Corridors & hallways (10 sqm) — vacuum carpets / mop hard floors',
    'Lift area & common access points — clean doors & buttons, sanitise surfaces',
    'Common kitchen / kitchenette (4 sqm) — clean appliances, wipe benches, mop',
    'Shared bathrooms & amenities — full sanitisation, replenish consumables',
    'Waste & bin areas — empty bins, clean surrounds, deodorise',
    'Stairwells & emergency exits — sweep & mop stairs, dust handrails'
  ],
  medical: [
    'Consultation rooms — full sanitisation every clean',
    'Waiting area — vacuum, wipe surfaces, empty bins',
    'Reception — high-touch surface disinfection, sanitise phones & keyboards',
    'Bathrooms — clinical-grade full sanitisation',
    'Corridors & common areas — vacuum & mop',
    'Staff kitchen / tea room — appliances, benches, mop'
  ],
  restaurant: [
    'Kitchen & food prep areas — full clean & sanitisation',
    'Dining area — tables, chairs, floor clean',
    'Bar & counter surfaces — wipe & sanitise',
    'Bathrooms — full sanitisation, replenish consumables',
    'Entry & common areas — vacuum & mop',
    'Waste & bin areas — empty bins, deodorise'
  ],
  carpet: [
    'Pre-inspection & stain identification',
    'Deep steam or dry extraction cleaning',
    'Edge & corner extraction',
    'Post-clean deodorising & drying advice'
  ],
  childcare: [
    'Play areas — child-safe product clean & sanitise',
    'Toilets & nappy change stations — full sanitisation',
    'Kitchen / food prep area — appliances, benches, mop',
    'Entry & corridors — vacuum & mop',
    'Staff rooms & offices — dust, vacuum, empty bins'
  ]
};

const SM_LABELS = {
  office: 'Office Cleaning',
  bodycorp: 'Body Corporate & Strata',
  medical: 'Medical Centre',
  restaurant: 'Restaurant / Café',
  carpet: 'Carpet Cleaning',
  childcare: 'Childcare Centre'
};

let smSelected = 'office';

function initModal() {
  document.addEventListener('DOMContentLoaded', () => {
    /* ── Render scope list ── */
    function smRenderScope(svc) {
      document.getElementById('smScopeList').innerHTML =
        SM_SCOPES[svc].map(s => '✓ ' + s).join('<br>');
    }
    smRenderScope(smSelected);

    /* ── Service card click handler ── */
    document.querySelectorAll('.sm-svc-card').forEach(function(card) {
      card.addEventListener('click', function() {
        document.querySelectorAll('.sm-svc-card').forEach(function(c) {
          c.classList.remove('selected');
        });
        card.classList.add('selected');
        smSelected = card.dataset.svc;
        smRenderScope(smSelected);
      });
    });

    /* ── Step navigation ── */
    window.smGoStep = function(n) {
      for (var i = 1; i <= 5; i++) {
        var panel = document.getElementById('smStep' + i);
        var tab = document.getElementById('smTab' + i);
        if (panel) panel.classList.toggle('active', i === n);
        if (tab) tab.classList.toggle('active', i === n);
      }
      if (n === 4) smBuildSummary();
      document.getElementById('schedulingModal').scrollTop = 0;
    };

    /* ── Build confirmation summary ── */
    window.smBuildSummary = function() {
      var freq = document.getElementById('smFreq');
      var days = document.getElementById('smDays');
      var date = document.getElementById('smStartDate').value || 'TBC';
      var time = document.getElementById('smTime');
      var name = document.getElementById('smName').value || '—';
      var phone = document.getElementById('smPhone').value || '—';
      var email = document.getElementById('smEmail').value || '—';
      var addr = document.getElementById('smAddress').value || '—';

      var rows = [
        ['Service', SM_LABELS[smSelected]],
        ['Frequency', freq.options[freq.selectedIndex].text],
        ['Days', days.options[days.selectedIndex].text],
        ['Start date', date],
        ['Time', time.options[time.selectedIndex].text],
        ['Name', name],
        ['Phone', phone],
        ['Email', email],
        ['Address', addr]
      ];

      document.getElementById('smSummary').innerHTML = rows.map(function(r) {
        return '<div class="sm-summary-row">' +
               '<span>' + r[0] + '</span>' +
               '<span>' + r[1] + '</span>' +
               '</div>';
      }).join('');
    };

    /* ── Submit ── */
    window.smSubmit = async function() {
      var btn = document.getElementById('smSubmitBtn');
      btn.textContent = 'Submitting…';
      btn.disabled = true;

      var freq  = document.getElementById('smFreq');
      var days  = document.getElementById('smDays');
      var time  = document.getElementById('smTime');

      var payload = {
        service:   SM_LABELS[smSelected] || smSelected,
        frequency: freq.options[freq.selectedIndex].text,
        days:      days.options[days.selectedIndex].text,
        startDate: document.getElementById('smStartDate').value || 'To be confirmed',
        time:      time.options[time.selectedIndex].text,
        name:      document.getElementById('smName').value.trim(),
        phone:     document.getElementById('smPhone').value.trim(),
        email:     document.getElementById('smEmail').value.trim(),
        address:   document.getElementById('smAddress').value.trim(),
        notes:     document.getElementById('smNotes').value.trim()
      };

      try {
        await postToApi('/api/send-booking', payload);
        window.smGoStep(5);
      } catch (err) {
        btn.textContent = '✔ Confirm Booking';
        btn.disabled = false;
        alert('Sorry, there was a problem sending your booking.\nPlease call us on 0405 585 405.');
      }
    };

    /* ── Open / Close modal ── */
    window.openSchedulingModal = function() {
      window.smGoStep(1);
      document.getElementById('schedulingModalOverlay').classList.add('open');
      document.body.style.overflow = 'hidden';
    };

    window.closeSchedulingModal = function() {
      document.getElementById('schedulingModalOverlay').classList.remove('open');
      document.body.style.overflow = '';
    };

    /* Close on backdrop click */
    var overlay = document.getElementById('schedulingModalOverlay');
    if (overlay) {
      overlay.addEventListener('click', function(e) {
        if (e.target === this) window.closeSchedulingModal();
      });
    }

    /* Close on Escape key */
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') window.closeSchedulingModal();
    });
  });
}

initModal();
