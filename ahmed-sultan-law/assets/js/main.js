/**
 * سلطان الجنايات - مكتب الأستاذ أحمد إبراهيم سلطان المحامي
 * المؤثرات التفاعلية والبرمجة الحركية (Pure Vanilla JavaScript)
 */

document.addEventListener('DOMContentLoaded', () => {
  // تهيئة جميع العناصر والوظائف
  initNavbar();
  initMobileDrawer();
  initCounterOnScroll();
  initPracticeFilters();
  initFaqAccordion();
  initWhatsAppConsultationForm();
  initFloatingElements();
  initVideoModal();
  initMediaFilters();
});

/* ==========================================================================
   1. شريط التنقل والتثبيت (Navbar & Scroll Effects)
   ========================================================================== */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    // تأثير الزجاج الداكن عند التمرير
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // تفعيل الرابط النشط طبقاً لمكان التمرير الحالي
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   2. القائمة المنبثقة للجوال (Mobile Drawer)
   ========================================================================== */
function initMobileDrawer() {
  const toggleBtn = document.querySelector('.menu-toggle');
  const drawer = document.querySelector('.mobile-drawer');
  const overlay = document.querySelector('.drawer-overlay');
  const closeBtn = document.querySelector('.drawer-close');
  const mobileLinks = document.querySelectorAll('.mobile-links a');

  if (!toggleBtn || !drawer || !overlay) return;

  const openDrawer = () => {
    drawer.classList.add('open');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    drawer.classList.remove('open');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  };

  toggleBtn.addEventListener('click', openDrawer);
  closeBtn?.addEventListener('click', closeDrawer);
  overlay.addEventListener('click', closeDrawer);

  mobileLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });
}

/* ==========================================================================
   3. عدادات إحصائيات الثقة التفاعلية (Stats Counter)
   ========================================================================== */
function initCounterOnScroll() {
  const statNumbers = document.querySelectorAll('.stat-count');
  if (!statNumbers.length) return;

  let hasRun = false;

  const runCounters = () => {
    statNumbers.forEach(counter => {
      const target = +counter.getAttribute('data-target');
      const duration = 2000; // مدة الحركة بالميلي ثانية
      const startTime = performance.now();

      const updateCount = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // دالة حركة سلسة (Ease-out Quart)
        const ease = 1 - Math.pow(1 - progress, 4);
        const currentCount = Math.floor(ease * target);

        counter.textContent = currentCount.toLocaleString('ar-EG');

        if (progress < 1) {
          requestAnimationFrame(updateCount);
        } else {
          counter.textContent = target.toLocaleString('ar-EG');
        }
      };

      requestAnimationFrame(updateCount);
    });
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasRun) {
        hasRun = true;
        runCounters();
        observer.disconnect();
      }
    });
  }, { threshold: 0.35 });

  const statsSection = document.querySelector('.stats-section');
  if (statsSection) {
    observer.observe(statsSection);
  }
}

/* ==========================================================================
   4. فلاتر مجالات التخصص القانونية (Practice Area Filters)
   ========================================================================== */
function initPracticeFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.practice-card');

  if (!filterBtns.length || !cards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      cards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue || category.includes(filterValue)) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 20);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });
}

/* ==========================================================================
   5. قائمة الأسئلة الشائعة القابلة للطي (Accordion FAQ)
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question-btn');
    const answerPanel = item.querySelector('.faq-answer-panel');

    questionBtn?.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // إغلاق كل العناصر المفتوحة الأخرى للحفاظ على الترتيب
      faqItems.forEach(otherItem => {
        otherItem.classList.remove('active');
        const otherPanel = otherItem.querySelector('.faq-answer-panel');
        if (otherPanel) otherPanel.style.maxHeight = null;
      });

      // فتح أو إغلاق العنصر الحالي
      if (!isActive) {
        item.classList.add('active');
        answerPanel.style.maxHeight = answerPanel.scrollHeight + 35 + 'px';
      } else {
        item.classList.remove('active');
        answerPanel.style.maxHeight = null;
      }
    });
  });

  // فتح السؤال الأول تلقائياً كمعاينة
  if (faqItems.length > 0) {
    const firstItem = faqItems[0];
    const firstPanel = firstItem.querySelector('.faq-answer-panel');
    firstItem.classList.add('active');
    if (firstPanel) {
      firstPanel.style.maxHeight = firstPanel.scrollHeight + 35 + 'px';
    }
  }
}

/* ==========================================================================
   6. نموذج حجز الاستشارة التفاعلي والربط الفوري مع واتساب (WhatsApp Form)
   ========================================================================== */
function initWhatsAppConsultationForm() {
  const form = document.getElementById('consultationForm');
  if (!form) return;

  const LAWYER_WHATSAPP = '201201432139'; // رقم الأستاذ أحمد سلطان

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const fullName = document.getElementById('clientName')?.value.trim();
    const phone = document.getElementById('clientPhone')?.value.trim();
    const caseType = document.getElementById('caseType')?.value;
    const urgency = document.getElementById('caseUrgency')?.value;
    const details = document.getElementById('caseDetails')?.value.trim();

    if (!fullName || !phone) {
      alert('يرجى كتابة الاسم ورقم الهاتف للتواصل معك');
      return;
    }

    // صياغة رسالة احترافية منظمة يتم فتحها مباشرة في واتساب
    let message = `⚖️ *طلب استشارة قانونية جديدة - مكتب سلطان الجنايات*\n`;
    message += `──────────────────\n`;
    message += `👤 *اسم الموكل:* ${fullName}\n`;
    message += `📱 *رقم الهاتف:* ${phone}\n`;
    message += `📂 *نوع القضية:* ${caseType}\n`;
    message += `🚨 *درجة الاستعجال:* ${urgency}\n`;
    if (details) {
      message += `📝 *موجز الموضوع:* \n${details}\n`;
    }
    message += `──────────────────\n`;
    message += `📍 *مرسل من موقع المكتب الرسمي*`;

    // ترميز الرابط وفتحه
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${LAWYER_WHATSAPP}?text=${encodedMessage}`;

    window.open(whatsappUrl, '_blank');
  });
}

/* ==========================================================================
   7. العناصر العائمة وزر الصعود (Floating Elements)
   ========================================================================== */
function initFloatingElements() {
  const backToTopBtn = document.querySelector('.back-to-top-btn');
  const whatsappTooltip = document.querySelector('.floating-whatsapp-tooltip');

  // إظهار زر الصعود عند التمرير
  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backToTopBtn?.classList.add('visible');
    } else {
      backToTopBtn?.classList.remove('visible');
    }
  });

  backToTopBtn?.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  // إظهار التلميح الترحيبي لزر الواتساب بعد 2.5 ثانية لجذب انتباه الموكل
  setTimeout(() => {
    if (whatsappTooltip) {
      whatsappTooltip.classList.add('show');
      setTimeout(() => {
        whatsappTooltip.classList.remove('show');
      }, 5000);
    }
  }, 2500);
}

/* ==========================================================================
   8. مشغل الفيديوهات المنبثق (Video Modal Player)
   ========================================================================== */
function initVideoModal() {
  const modal = document.getElementById('videoModal');
  if (!modal) return;

  const closeBtn = modal.querySelector('.video-modal-close-btn');
  const videoTitleEl = modal.querySelector('.modal-video-title');
  const playerWrapper = modal.querySelector('.video-player-frame-wrapper');
  const videoCards = document.querySelectorAll('[data-video-url]');

  const openModal = (title, url) => {
    if (videoTitleEl) videoTitleEl.textContent = title || 'فيديو قانوني - سلطان الجنايات';
    
    // إنشاء مشغل الفيديو إما يوتيوب أو فيديو HTML5
    if (playerWrapper) {
      if (url.includes('youtube.com') || url.includes('youtu.be')) {
        // تحويل روابط يوتيوب إلى صيغة التضمين embed مع autoplay
        let embedUrl = url;
        if (url.includes('watch?v=')) {
          embedUrl = url.replace('watch?v=', 'embed/') + '?autoplay=1';
        } else if (url.includes('youtu.be/')) {
          const videoId = url.split('youtu.be/')[1];
          embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
        }
        playerWrapper.innerHTML = `<iframe src="${embedUrl}" title="${title}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
      } else {
        // مشغل HTML5 أنيق افتراضي مع لوحة تحكم
        playerWrapper.innerHTML = `
          <video controls autoplay style="width: 100%; height: 100%; background: #000;">
            <source src="${url}" type="video/mp4">
            عذراً، متصفحك لا يدعم تشغيل هذا الفيديو مباشرة.
          </video>
        `;
      }
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    // إيقاف تشغيل الفيديو عند الإغلاق
    if (playerWrapper) {
      playerWrapper.innerHTML = '';
    }
  };

  videoCards.forEach(card => {
    card.addEventListener('click', () => {
      const title = card.getAttribute('data-video-title');
      const url = card.getAttribute('data-video-url');
      openModal(title, url);
    });
  });

  closeBtn?.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   9. فلاتر الفيديوهات وقضايا سابقة الأعمال (Media & Cases Filters)
   ========================================================================== */
function initMediaFilters() {
  // فلترة الفيديوهات
  const videoFilterBtns = document.querySelectorAll('.video-filter-btn');
  const videoCards = document.querySelectorAll('.video-item-card');

  videoFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      videoFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-video-filter');

      videoCards.forEach(card => {
        const cat = card.getAttribute('data-video-category');
        if (filter === 'all' || cat === filter || cat.includes(filter)) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 20);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });

  // فلترة سابقة الأعمال
  const caseFilterBtns = document.querySelectorAll('.case-filter-btn');
  const caseCards = document.querySelectorAll('.case-record-card');

  caseFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      caseFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-case-filter');

      caseCards.forEach(card => {
        const cat = card.getAttribute('data-case-category');
        if (filter === 'all' || cat === filter || cat.includes(filter)) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 20);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });
}

