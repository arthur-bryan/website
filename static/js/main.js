/**
 * Enhanced Terminal-Themed Interactions
 * Typing animation, scroll effects, and UI enhancements
 */

// ============================================
// Terminal Typing Effect
// ============================================

const typeText = (element, text, speed = 30) => {
  return new Promise((resolve) => {
    let i = 0;
    element.innerHTML = '';

    const type = () => {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
        setTimeout(type, speed);
      } else {
        // Add blinking cursor after typing completes
        const cursor = document.createElement('span');
        cursor.className = 'cursor';
        cursor.textContent = '|';
        element.appendChild(cursor);

        // Remove cursor after 2 seconds
        setTimeout(() => {
          if (cursor.parentNode) {
            cursor.remove();
          }
        }, 2000);

        resolve();
      }
    };

    type();
  });
};

// Initialize typing animation on hero section (homepage)
const initTypingAnimation = () => {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  const name = hero.querySelector('h1');
  const role = hero.querySelector('.title');
  const tagline = hero.querySelector('.tagline');

  if (!name || !role || !tagline) return;

  // Store original text
  const nameText = name.textContent;
  const roleText = role.textContent;
  const taglineText = tagline.textContent;

  // Hide elements initially
  role.style.opacity = '0';
  tagline.style.opacity = '0';

  // Type name first
  typeText(name, nameText, 30).then(() => {
    // Show and type role
    role.style.opacity = '1';
    return typeText(role, roleText, 30);
  }).then(() => {
    // Show and type tagline
    tagline.style.opacity = '1';
    return typeText(tagline, taglineText, 25);
  });
};

// Initialize typing animation for page titles (non-homepage)
const initPageTitleTyping = () => {
  // Skip if we're on the homepage (hero already handles it)
  if (document.querySelector('.hero')) return;

  // Find page headers and blog post titles
  const pageHeaderTitle = document.querySelector('.page-header h1');
  const pageHeaderSubtitle = document.querySelector('.page-header p');
  const postHeader = document.querySelector('article.post h1');

  const titleElement = pageHeaderTitle || postHeader;
  if (!titleElement) return;

  const titleText = titleElement.textContent;

  // Type the title first
  typeText(titleElement, titleText, 30).then(() => {
    // If there's a subtitle/description, type it too
    if (pageHeaderSubtitle) {
      const subtitleText = pageHeaderSubtitle.textContent;
      // Hide subtitle initially
      pageHeaderSubtitle.style.opacity = '0';

      // Small delay before typing subtitle
      setTimeout(() => {
        pageHeaderSubtitle.style.opacity = '1';
        typeText(pageHeaderSubtitle, subtitleText, 30);
      }, 100);
    }
  });
};

// ============================================
// Scroll-Triggered Fade-In Animations
// ============================================

const initScrollAnimations = () => {
  // Add fade-in class to elements we want to animate
  const animateElements = [
    '.project-card',
    '.blog-item',
    '.timeline-item',
    '.cert-item',
    '.edu-item'
  ];

  animateElements.forEach(selector => {
    document.querySelectorAll(selector).forEach(el => {
      el.classList.add('fade-in');
    });
  });

  // Create intersection observer
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Unobserve after animation to improve performance
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe all fade-in elements
  document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
  });
};

// ============================================
// Active Navigation State
// ============================================

const updateActiveNav = () => {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('nav a');

  navLinks.forEach(link => {
    const linkPath = new URL(link.href).pathname;

    // Remove active class from all links
    link.classList.remove('active');

    // Add active class to matching link
    if (currentPath === linkPath ||
        (linkPath !== '/' && currentPath.startsWith(linkPath))) {
      link.classList.add('active');
    }
  });
};

// ============================================
// Enhanced Header Scroll Effect
// ============================================

const initHeaderScroll = () => {
  const header = document.querySelector('body > header');
  if (!header) return;

  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    // Add shadow on scroll
    if (currentScroll > 10) {
      header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.5)';
    } else {
      header.style.boxShadow = 'none';
    }

    lastScroll = currentScroll;
  });
};

// ============================================
// Smooth Anchor Scrolling
// ============================================

const initSmoothScroll = () => {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');

      // Skip empty anchors
      if (href === '#') return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
};

// ============================================
// Copy Code Block (Future Enhancement)
// ============================================

const initCodeCopy = () => {
  document.querySelectorAll('pre code').forEach(block => {
    const pre = block.parentElement;

    // Create copy button
    const button = document.createElement('button');
    button.className = 'copy-code-btn';
    button.innerHTML = '<i class="fas fa-copy"></i>';
    button.setAttribute('aria-label', 'Copy code');
    button.style.cssText = `
      position: absolute;
      top: 0.5rem;
      right: 0.5rem;
      padding: 0.5rem;
      background: var(--bg-tertiary);
      border: 1px solid var(--border);
      border-radius: 4px;
      color: var(--text-secondary);
      cursor: pointer;
      opacity: 0;
      transition: all 0.3s ease;
    `;

    // Make pre relative for button positioning
    pre.style.position = 'relative';

    // Show button on hover
    pre.addEventListener('mouseenter', () => {
      button.style.opacity = '1';
    });

    pre.addEventListener('mouseleave', () => {
      button.style.opacity = '0';
    });

    // Show button on focus (keyboard navigation)
    button.addEventListener('focus', () => {
      button.style.opacity = '1';
    });

    button.addEventListener('blur', () => {
      button.style.opacity = '0';
    });

    // Copy functionality
    const copyCode = async () => {
      try {
        await navigator.clipboard.writeText(block.textContent);
        button.innerHTML = '<i class="fas fa-check"></i>';
        button.style.color = 'var(--accent-secondary)';

        setTimeout(() => {
          button.innerHTML = '<i class="fas fa-copy"></i>';
          button.style.color = 'var(--text-secondary)';
        }, 2000);
      } catch (err) {
        console.error('Failed to copy code:', err);
      }
    };

    button.addEventListener('click', copyCode);

    // Keyboard support (Enter or Space)
    button.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        copyCode();
      }
    });

    pre.appendChild(button);
  });
};

// ============================================
// Tech Badge Hover Effects
// ============================================

const initTechBadges = () => {
  document.querySelectorAll('.tech-badge').forEach(badge => {
    badge.addEventListener('mouseenter', function() {
      // Add subtle animation
      this.style.transform = 'translateY(-2px) scale(1.05)';
    });

    badge.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0) scale(1)';
    });
  });
};

// ============================================
// Initialize All Features
// ============================================

const init = () => {
  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Always initialize these
  updateActiveNav();
  initHeaderScroll();
  initSmoothScroll();
  initTechBadges();

  // Only add animations if user hasn't requested reduced motion
  if (!prefersReducedMotion) {
    // Small delay to ensure fonts are loaded before typing
    setTimeout(() => {
      // Run typing animation on homepage
      if (document.querySelector('.hero')) {
        initTypingAnimation();
      } else {
        // Run page title typing on other pages
        initPageTitleTyping();
      }
    }, 300);

    initScrollAnimations();
  } else {
    // If reduced motion, just make everything visible immediately
    document.querySelectorAll('.fade-in').forEach(el => {
      el.classList.add('visible');
    });
  }

  // Initialize code copy buttons if FontAwesome is loaded
  if (typeof FontAwesome !== 'undefined' || document.querySelector('[data-prefix="fas"]')) {
    initCodeCopy();
  }
};

// ============================================
// Run on DOM Ready
// ============================================

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// ============================================
// Page Visibility API - Pause animations when tab is hidden
// ============================================

document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    // Pause animations when tab is hidden
    document.body.style.animationPlayState = 'paused';
  } else {
    // Resume animations when tab is visible
    document.body.style.animationPlayState = 'running';
  }
});
