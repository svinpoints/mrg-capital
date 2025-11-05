// Navigation functionality
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');
const navbar = document.getElementById('navbar');

// Toggle mobile menu
navToggle.addEventListener('click', () => {
  navMenu.classList.toggle('active');
});

// Page navigation
navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = link.getAttribute('href').substring(1);
    
    // Update active states
    navLinks.forEach(l => l.classList.remove('active'));
    link.classList.add('active');
    
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
      page.classList.remove('active');
    });
    
    // Show target page
    document.getElementById(targetId).classList.add('active');
    
    // Close mobile menu
    navMenu.classList.remove('active');
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// Scroll-based navigation highlighting
const sections = document.querySelectorAll('.page');
const navLinksArray = Array.from(navLinks);

const navigationObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && entry.target.classList.contains('active')) {
      const sectionId = entry.target.getAttribute('id');
      navLinksArray.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${sectionId}`) {
          link.classList.add('active');
        }
      });
    }
  });
}, {
  threshold: 0.3,
  rootMargin: '-20% 0px -20% 0px'
});

sections.forEach(section => {
  navigationObserver.observe(section);
});

// Animated counters for stats - Optimized with GPU acceleration
let hasAnimatedStats = false;

const animateCounter = (element, delay = 0) => {
  const target = parseFloat(element.getAttribute('data-target'));
  const isDecimal = element.getAttribute('data-decimal') === 'true';
  const duration = 2000;
  const startTime = performance.now();
  
  setTimeout(() => {
    element.classList.add('counting');
    
    const updateCounter = (currentTime) => {
      const elapsed = currentTime - startTime - delay;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const current = target * easeOutQuart;
      
      if (progress < 1) {
        if (isDecimal) {
          element.textContent = current.toFixed(2);
        } else {
          element.textContent = Math.floor(current);
        }
        requestAnimationFrame(updateCounter);
      } else {
        if (isDecimal) {
          element.textContent = target.toFixed(2);
        } else {
          element.textContent = target;
        }
        element.classList.remove('counting');
      }
    };
    
    requestAnimationFrame(updateCounter);
  }, delay);
};

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !hasAnimatedStats) {
      hasAnimatedStats = true;
      const statCards = entry.target.querySelectorAll('.stat-card');
      statCards.forEach((card, index) => {
        setTimeout(() => {
          card.classList.add('animate-in');
          const statNumber = card.querySelector('.stat-number');
          if (statNumber) {
            animateCounter(statNumber, 100);
          }
        }, index * 150);
      });
      statsObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.3,
  rootMargin: '0px'
});

const statsSection = document.querySelector('.stats-section');
if (statsSection) {
  statsObserver.observe(statsSection);
}

// Testimonials carousel
let currentTestimonial = 0;
const testimonials = document.querySelectorAll('.testimonial-card');
const testPrev = document.getElementById('testPrev');
const testNext = document.getElementById('testNext');

function showTestimonial(index) {
  testimonials.forEach((testimonial, i) => {
    testimonial.classList.remove('active');
    if (i === index) {
      testimonial.classList.add('active');
    }
  });
}

testPrev.addEventListener('click', () => {
  currentTestimonial = (currentTestimonial - 1 + testimonials.length) % testimonials.length;
  showTestimonial(currentTestimonial);
});

testNext.addEventListener('click', () => {
  currentTestimonial = (currentTestimonial + 1) % testimonials.length;
  showTestimonial(currentTestimonial);
});

// Auto-rotate testimonials
setInterval(() => {
  currentTestimonial = (currentTestimonial + 1) % testimonials.length;
  showTestimonial(currentTestimonial);
}, 5000);

// Team flip cards
const teamCards = document.querySelectorAll('.team-card');

teamCards.forEach(card => {
  const flipBtn = card.querySelector('.btn-flip');
  const flipBackBtn = card.querySelector('.btn-flip-back');
  
  if (flipBtn) {
    flipBtn.addEventListener('click', () => {
      card.classList.add('flipped');
    });
  }
  
  if (flipBackBtn) {
    flipBackBtn.addEventListener('click', () => {
      card.classList.remove('flipped');
    });
  }
});

// Optimized scroll handler with throttling
let scrollTimeout;
const throttledScroll = () => {
  if (scrollTimeout) return;
  
  scrollTimeout = setTimeout(() => {
    const activePage = document.querySelector('.page.active');
    if (!activePage) {
      scrollTimeout = null;
      return;
    }
    
    const subsections = activePage.querySelectorAll('[id]');
    subsections.forEach(section => {
      const rect = section.getBoundingClientRect();
      const inView = rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2;
      
      if (inView) {
        const sectionId = section.getAttribute('id');
        const matchingLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
        if (matchingLink && activePage.id === sectionId) {
          navLinksArray.forEach(l => l.classList.remove('active'));
          matchingLink.classList.add('active');
        }
      }
    });
    
    scrollTimeout = null;
  }, 100);
};

window.addEventListener('scroll', throttledScroll, { passive: true });

// Performance Chart with actual MRG Capital data
const performanceChart = document.getElementById('performanceChart');

if (performanceChart) {
  const ctx = performanceChart.getContext('2d');
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['May 2019', 'Dec 2019', '2020', '2021', '2022', '2023', 'Oct 2024'],
      datasets: [
        {
          label: 'Wealth Maximizer',
          data: [100, 105, 125, 142, 148, 175, 178],
          borderColor: '#C0A080',
          backgroundColor: 'rgba(192, 160, 128, 0.1)',
          borderWidth: 3,
          tension: 0.4,
          fill: true,
          pointRadius: 5,
          pointHoverRadius: 8,
          pointBackgroundColor: '#C0A080',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2
        },
        {
          label: 'Wealth Enhancer',
          data: [100, 103, 120, 135, 140, 165, 166],
          borderColor: '#98D8C8',
          backgroundColor: 'rgba(152, 216, 200, 0.1)',
          borderWidth: 3,
          tension: 0.4,
          fill: true,
          pointRadius: 5,
          pointHoverRadius: 8,
          pointBackgroundColor: '#98D8C8',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2
        },
        {
          label: 'Wealth Protector',
          data: [null, 100, 115, 128, 135, 152, 143],
          borderColor: '#6BB6D6',
          backgroundColor: 'rgba(107, 182, 214, 0.1)',
          borderWidth: 3,
          tension: 0.4,
          fill: true,
          pointRadius: 5,
          pointHoverRadius: 8,
          pointBackgroundColor: '#6BB6D6',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2
        },
        {
          label: 'Nifty 50 Benchmark',
          data: [100, 105, 112, 130, 140, 155, 165],
          borderColor: 'rgba(255, 255, 255, 0.5)',
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          borderWidth: 2,
          tension: 0.4,
          fill: false,
          borderDash: [5, 5],
          pointRadius: 3,
          pointHoverRadius: 6
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false
      },
      plugins: {
        legend: {
          labels: {
            color: '#ffffff',
            font: {
              size: 14,
              weight: 'bold'
            },
            padding: 15,
            usePointStyle: true
          },
          position: 'top'
        },
        tooltip: {
          backgroundColor: 'rgba(10, 37, 64, 0.95)',
          titleColor: '#C0A080',
          bodyColor: '#ffffff',
          borderColor: '#C0A080',
          borderWidth: 2,
          padding: 12,
          cornerRadius: 8,
          displayColors: true,
          callbacks: {
            label: function(context) {
              let label = context.dataset.label || '';
              if (label) {
                label += ': ';
              }
              if (context.parsed.y !== null) {
                label += '₹' + context.parsed.y.toFixed(2);
              }
              return label;
            }
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: '#ffffff',
            font: {
              size: 12
            }
          },
          grid: {
            color: 'rgba(255, 255, 255, 0.1)',
            drawBorder: false
          }
        },
        y: {
          ticks: {
            color: '#ffffff',
            font: {
              size: 12
            },
            callback: function(value) {
              return '₹' + value;
            }
          },
          grid: {
            color: 'rgba(255, 255, 255, 0.1)',
            drawBorder: false
          },
          beginAtZero: false
        }
      },
      animation: {
        duration: 2000,
        easing: 'easeInOutQuart'
      }
    }
  });
}

// Enhanced Fee Calculator with Performance Fee
const calculateFeeBtn = document.getElementById('calculateFee');
const investmentAmount = document.getElementById('investmentAmount');
const expectedReturn = document.getElementById('expectedReturn');
const feeResult = document.getElementById('feeResult');
const feeBreakdown = document.getElementById('feeBreakdown');

if (calculateFeeBtn) {
  calculateFeeBtn.addEventListener('click', () => {
    const amount = parseFloat(investmentAmount.value);
    const returnRate = parseFloat(expectedReturn.value);
    
    if (amount && amount >= 50 && returnRate >= 0) {
      const investmentInRupees = amount * 100000;
      const grossReturn = investmentInRupees * (returnRate / 100);
      const aumFee = investmentInRupees * 0.01; // 1% AUM fee
      
      let performanceFee = 0;
      if (returnRate > 10) {
        const excessReturn = investmentInRupees * ((returnRate - 10) / 100);
        performanceFee = excessReturn * 0.20; // 20% of returns above 10%
      }
      
      const totalFees = aumFee + performanceFee;
      const effectiveFeeRate = (totalFees / investmentInRupees) * 100;
      const netReturn = grossReturn - totalFees;
      const netReturnRate = (netReturn / investmentInRupees) * 100;
      
      feeResult.innerHTML = `
        <strong>Total Annual Fee: ₹${totalFees.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</strong><br>
        <span style="font-size: 0.95rem; opacity: 0.9;">Effective Fee Rate: ${effectiveFeeRate.toFixed(2)}%</span>
      `;
      feeResult.classList.add('show');
      
      feeBreakdown.innerHTML = `
        <div class="fee-breakdown-item">
          <span class="fee-breakdown-label">Investment Amount:</span>
          <span class="fee-breakdown-value">₹${investmentInRupees.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
        </div>
        <div class="fee-breakdown-item">
          <span class="fee-breakdown-label">Expected Return (${returnRate}%):</span>
          <span class="fee-breakdown-value">₹${grossReturn.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
        </div>
        <div class="fee-breakdown-item">
          <span class="fee-breakdown-label">AUM Fee (1%):</span>
          <span class="fee-breakdown-value">₹${aumFee.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
        </div>
        <div class="fee-breakdown-item">
          <span class="fee-breakdown-label">Performance Fee (20% above 10%):</span>
          <span class="fee-breakdown-value">₹${performanceFee.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
        </div>
        <div class="fee-breakdown-item">
          <span class="fee-breakdown-label">Net Return After Fees:</span>
          <span class="fee-breakdown-value" style="color: var(--success);">₹${netReturn.toLocaleString('en-IN', { maximumFractionDigits: 0 })} (${netReturnRate.toFixed(2)}%)</span>
        </div>
      `;
      feeBreakdown.classList.add('show');
    } else {
      feeResult.innerHTML = '<span style="color: var(--error);">Please enter valid amounts (minimum ₹50 lakhs investment)</span>';
      feeResult.classList.add('show');
      feeBreakdown.classList.remove('show');
    }
  });
}

// Blog category filter
const categoryBtns = document.querySelectorAll('.category-btn');
const blogCards = document.querySelectorAll('.blog-card');

categoryBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const category = btn.getAttribute('data-category');
    
    // Update active button
    categoryBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    // Filter blog cards
    blogCards.forEach(card => {
      if (category === 'all' || card.getAttribute('data-category') === category) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  });
});

// FAQ Accordion
const faqQuestions = document.querySelectorAll('.faq-question');

faqQuestions.forEach(question => {
  question.addEventListener('click', () => {
    const faqItem = question.parentElement;
    const isActive = faqItem.classList.contains('active');
    
    // Close all FAQ items
    document.querySelectorAll('.faq-item').forEach(item => {
      item.classList.remove('active');
    });
    
    // Open clicked item if it wasn't active
    if (!isActive) {
      faqItem.classList.add('active');
    }
  });
});

// Contact Form
const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);
    
    // Validate
    if (!data.name || !data.email || !data.message) {
      showFormMessage('Please fill in all required fields', 'error');
      return;
    }
    
    // Simulate form submission
    showFormMessage('Thank you for your message! We will get back to you soon.', 'success');
    contactForm.reset();
  });
}

// Newsletter Form
const newsletterForm = document.getElementById('newsletterForm');
const newsletterMessage = document.getElementById('newsletterMessage');

if (newsletterForm) {
  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = document.getElementById('newsletterEmail').value;
    
    if (email && validateEmail(email)) {
      showNewsletterMessage('Successfully subscribed to our newsletter!', 'success');
      newsletterForm.reset();
    } else {
      showNewsletterMessage('Please enter a valid email address', 'error');
    }
  });
}

function showFormMessage(message, type) {
  formMessage.textContent = message;
  formMessage.className = `form-message ${type} show`;
  
  setTimeout(() => {
    formMessage.classList.remove('show');
  }, 5000);
}

function showNewsletterMessage(message, type) {
  newsletterMessage.textContent = message;
  newsletterMessage.className = `form-message ${type} show`;
  
  setTimeout(() => {
    newsletterMessage.classList.remove('show');
  }, 5000);
}

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}



// Footer links navigation
const footerLinks = document.querySelectorAll('.footer-links a');

footerLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    if (href.startsWith('#')) {
      e.preventDefault();
      const targetId = href.substring(1);
      
      // Hide all pages
      document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
      });
      
      // Show target page
      document.getElementById(targetId).classList.add('active');
      
      // Update nav active state
      navLinks.forEach(l => l.classList.remove('active'));
      const matchingNavLink = document.querySelector(`.nav-link[href="${href}"]`);
      if (matchingNavLink) {
        matchingNavLink.classList.add('active');
      }
      
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
});

// Optimized scroll-triggered animations with GPU acceleration
const observeElements = () => {
  const elements = document.querySelectorAll('.pillar-card, .portfolio-card, .blog-card, .fee-card');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.willChange = 'transform, opacity';
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translate3d(0, 0, 0)';
          // Remove will-change after animation completes
          setTimeout(() => {
            entry.target.style.willChange = 'auto';
          }, 600);
        }, 50);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });
  
  elements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translate3d(0, 30px, 0)';
    el.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
    observer.observe(el);
  });
};

// Add smooth hover effects to all cards
const addCardEffects = () => {
  const cards = document.querySelectorAll('.glass, .card, .team-card, .blog-card');
  
  cards.forEach(card => {
    card.addEventListener('mouseenter', function(e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      this.style.setProperty('--mouse-x', `${x}px`);
      this.style.setProperty('--mouse-y', `${y}px`);
    });
  });
};

// Optimized parallax effect with GPU acceleration and throttling
let parallaxTimeout;
const throttledParallax = () => {
  if (parallaxTimeout) return;
  
  parallaxTimeout = requestAnimationFrame(() => {
    const scrolled = window.pageYOffset;
    
    // Hero parallax with GPU acceleration
    const heroContent = document.querySelector('.hero-content');
    if (heroContent && scrolled < window.innerHeight) {
      heroContent.style.transform = `translate3d(0, ${scrolled * 0.3}px, 0)`;
      heroContent.style.opacity = 1 - (scrolled / window.innerHeight * 0.5);
    }
    
    parallaxTimeout = null;
  });
};

window.addEventListener('scroll', throttledParallax, { passive: true });

// Add ripple effect to buttons
const addRippleEffect = () => {
  const buttons = document.querySelectorAll('.btn, .btn-primary, .btn-secondary');
  
  buttons.forEach(button => {
    button.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';
      ripple.classList.add('ripple');
      
      this.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });
};

// Add typing effect to hero title
const typeEffect = () => {
  const heroTitle = document.querySelector('.hero-title');
  if (heroTitle) {
    const text = heroTitle.textContent;
    heroTitle.textContent = '';
    let i = 0;
    
    const type = () => {
      if (i < text.length) {
        heroTitle.textContent += text.charAt(i);
        i++;
        setTimeout(type, 50);
      }
    };
    
    setTimeout(type, 500);
  }
};

// Asset Allocation Charts
function createAllocationCharts() {
  const createPieChart = (canvasId, data, labels) => {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: [
            'rgba(192, 160, 128, 0.8)',
            'rgba(152, 216, 200, 0.8)',
            'rgba(107, 182, 214, 0.8)'
          ],
          borderColor: [
            'rgba(192, 160, 128, 1)',
            'rgba(152, 216, 200, 1)',
            'rgba(107, 182, 214, 1)'
          ],
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: 'rgba(10, 37, 64, 0.95)',
            titleColor: '#C0A080',
            bodyColor: '#ffffff',
            borderColor: '#C0A080',
            borderWidth: 2,
            padding: 12,
            cornerRadius: 8,
            callbacks: {
              label: function(context) {
                return context.label + ': ' + context.parsed + '%';
              }
            }
          }
        }
      }
    });
  };
  
  createPieChart('allocationMaximizer', [40, 35, 25], ['Large Cap', 'Mid Cap', 'Small Cap']);
  createPieChart('allocationEnhancer', [50, 35, 15], ['Large Cap', 'Mid Cap', 'Small Cap']);
  createPieChart('allocationProtector', [65, 25, 10], ['Large Cap', 'Mid Cap', 'Small Cap']);
}

// Performance Chart Filters
const performanceFilters = document.querySelectorAll('.filter-btn');
if (performanceFilters.length > 0) {
  performanceFilters.forEach(btn => {
    btn.addEventListener('click', () => {
      performanceFilters.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const period = btn.getAttribute('data-period');
      // In a real application, this would update the chart data based on the selected period
      console.log('Filter changed to:', period);
    });
  });
}

// Initialize - show home page on load
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('home').classList.add('active');
  observeElements();
  addCardEffects();
  addRippleEffect();
  createAllocationCharts();
  // typeEffect(); // Uncomment for typing effect on hero title
  
  // Add smooth scroll behavior
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href !== '#' && href.length > 1) {
        e.preventDefault();
      }
    });
  });
});

/* ============================================
   PAGE UP BUTTON - SCROLL TO TOP FUNCTIONALITY
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    const pageUpBtn = document.getElementById('pageUpBtn');

    if (pageUpBtn) {
        // Handle click event to scroll to top
        pageUpBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth',
                duration: 800
            });
        });

        // Show/hide button based on scroll position
        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) {
                pageUpBtn.style.opacity = '1';
                pageUpBtn.style.pointerEvents = 'auto';
            } else {
                pageUpBtn.style.opacity = '0.3';
                pageUpBtn.style.pointerEvents = 'none';
            }
        }, { passive: true });

        // Initial state
        pageUpBtn.style.opacity = '0.3';
        pageUpBtn.style.pointerEvents = 'none';
        pageUpBtn.style.transition = 'opacity 0.3s ease';
    }
});





// ===== Documents Section Toggle Functionality =====
document.addEventListener('DOMContentLoaded', function() {
    const documentToggles = document.querySelectorAll('.document-toggle');

    documentToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const content = this.nextElementSibling;
            const isActive = content.classList.contains('active');

            // Close all other document sections in the same container
            const container = this.closest('.documents-container');
            if (container) {
                const allContents = container.querySelectorAll('.document-content');
                allContents.forEach(item => {
                    if (item !== content) {
                        item.classList.remove('active');
                        item.previousElementSibling.classList.remove('active');
                    }
                });
            }

            // Toggle current section
            if (isActive) {
                content.classList.remove('active');
                this.classList.remove('active');
            } else {
                content.classList.add('active');
                this.classList.add('active');
            }
        });
    });

    // Document Link Click Handler (for future implementation of actual document downloads)
    const documentLinks = document.querySelectorAll('.document-link');

    documentLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            // Add visual feedback
            this.style.opacity = '0.7';
            setTimeout(() => {
                this.style.opacity = '1';
            }, 200);

            // In a real implementation, this would trigger a download
            console.log('Document clicked: ' + this.textContent.trim());
        });
    });
});
