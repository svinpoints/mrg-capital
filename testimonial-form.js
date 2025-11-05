// ============================
// TESTIMONIAL FORM FUNCTIONALITY
// ============================

const testimonialForm = document.getElementById('testimonialForm');
const successMessageOverlay = document.getElementById('successMessageOverlay');
const ratingStars = document.getElementById('ratingStars');
const ratingInput = document.getElementById('rating');
const charCountSpan = document.getElementById('charCount');
const testimonialInput = document.getElementById('testimonial');
const fullNameInput = document.getElementById('fullName');
const designationInput = document.getElementById('designation');
const companyInput = document.getElementById('company');
const initialsSpan = document.getElementById('initials');
const uploadBtn = document.getElementById('uploadBtn');
const removeBtn = document.getElementById('removeBtn');
const pictureInput = document.getElementById('pictureInput');
const profilePicture = document.getElementById('profilePicture');
const initialsPlaceholder = document.getElementById('initialsPlaceholder');
const picturePreview = document.getElementById('picturePreview');
const navbar = document.getElementById('navbar');

const STORAGE_KEY = 'mrg_testimonials';

// ============================
// NAVBAR SCROLL EFFECT
// ============================

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ============================
// PICTURE UPLOAD FUNCTIONALITY
// ============================

function updateInitials() {
    const fullName = fullNameInput.value.trim();
    if (fullName.length > 0) {
        const names = fullName.split(' ');
        let initials = names[0].charAt(0).toUpperCase();
        if (names.length > 1) {
            initials += names[names.length - 1].charAt(0).toUpperCase();
        }
        initialsSpan.textContent = initials;
    } else {
        initialsSpan.textContent = 'AB';
    }
}

fullNameInput.addEventListener('input', updateInitials);

uploadBtn.addEventListener('click', (e) => {
    e.preventDefault();
    pictureInput.click();
});

pictureInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            picturePreview.src = event.target.result;
            picturePreview.style.display = 'block';
            initialsPlaceholder.style.display = 'none';
            removeBtn.style.display = 'flex';
            uploadBtn.textContent = 'Change Photo';
        };
        reader.readAsDataURL(file);
    }
});

removeBtn.addEventListener('click', (e) => {
    e.preventDefault();
    pictureInput.value = '';
    picturePreview.style.display = 'none';
    picturePreview.src = '';
    initialsPlaceholder.style.display = 'flex';
    removeBtn.style.display = 'none';
    uploadBtn.textContent = '📷 Upload Photo';
});

// ============================
// RATING SYSTEM
// ============================

function setupRating() {
    const stars = ratingStars.querySelectorAll('.star');

    stars.forEach(star => {
        star.addEventListener('click', (e) => {
            const rating = parseInt(e.target.getAttribute('data-value'));
            ratingInput.value = rating;

            stars.forEach(s => {
                const starValue = parseInt(s.getAttribute('data-value'));
                if (starValue <= rating) {
                    s.classList.add('active');
                } else {
                    s.classList.remove('active');
                }
            });

            clearError('ratingError');
        });

        star.addEventListener('mouseover', (e) => {
            const rating = parseInt(e.target.getAttribute('data-value'));
            stars.forEach(s => {
                const starValue = parseInt(s.getAttribute('data-value'));
                if (starValue <= rating) {
                    s.style.color = 'rgba(192, 160, 128, 1)';
                } else {
                    s.style.color = 'rgba(192, 160, 128, 0.3)';
                }
            });
        });
    });

    ratingStars.addEventListener('mouseleave', () => {
        const currentRating = parseInt(ratingInput.value);
        stars.forEach(s => {
            const starValue = parseInt(s.getAttribute('data-value'));
            if (starValue <= currentRating) {
                s.classList.add('active');
                s.style.color = 'rgba(192, 160, 128, 1)';
            } else {
                s.classList.remove('active');
                s.style.color = 'rgba(192, 160, 128, 0.3)';
            }
        });
    });
}

// ============================
// CHARACTER COUNTER
// ============================

testimonialInput.addEventListener('input', (e) => {
    charCountSpan.textContent = e.target.value.length;
});

// ============================
// FORM VALIDATION
// ============================

function clearError(elementId) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = '';
    }
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validateForm() {
    let isValid = true;
    const fullName = document.getElementById('fullName').value.trim();
    const designation = document.getElementById('designation').value.trim();
    const email = document.getElementById('email').value.trim();
    const rating = document.getElementById('rating').value;
    const testimonial = document.getElementById('testimonial').value.trim();
    const agree = document.getElementById('agree').checked;

    // Clear previous errors
    document.querySelectorAll('.error-message').forEach(el => el.textContent = '');

    // Validate Full Name
    if (!fullName) {
        document.getElementById('fullNameError').textContent = 'Full name is required';
        isValid = false;
    }

    // Validate Designation
    if (!designation) {
        document.getElementById('designationError').textContent = 'Designation is required';
        isValid = false;
    }

    // Company is OPTIONAL - no validation needed

    // Validate Email
    if (!email) {
        document.getElementById('emailError').textContent = 'Email is required';
        isValid = false;
    } else if (!validateEmail(email)) {
        document.getElementById('emailError').textContent = 'Please enter a valid email';
        isValid = false;
    }

    // Validate Rating
    if (!rating || rating === '0') {
        document.getElementById('ratingError').textContent = 'Please select a rating';
        isValid = false;
    }

    // Validate Testimonial
    if (!testimonial) {
        document.getElementById('testimonialError').textContent = 'Please write your testimonial';
        isValid = false;
    } else if (testimonial.length < 50) {
        document.getElementById('testimonialError').textContent = 'Testimonial must be at least 50 characters';
        isValid = false;
    }

    // Validate Agreement
    if (!agree) {
        document.getElementById('agreeError').textContent = 'You must agree to share this testimonial';
        isValid = false;
    }

    return isValid;
}

// ============================
// FORM SUBMISSION
// ============================

testimonialForm.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!validateForm()) {
        return;
    }

    let pictureData = null;
    if (picturePreview.style.display !== 'none' && picturePreview.src) {
        pictureData = picturePreview.src;
    }

    const formData = {
        id: Date.now(),
        fullName: document.getElementById('fullName').value.trim(),
        designation: document.getElementById('designation').value.trim(),
        company: document.getElementById('company').value.trim(),
        email: document.getElementById('email').value.trim(),
        rating: document.getElementById('rating').value,
        testimonial: document.getElementById('testimonial').value.trim(),
        picture: pictureData,
        submittedAt: new Date().toISOString()
    };

    try {
        const testimonials = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
        testimonials.push(formData);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(testimonials));
        showCenteredSuccessMessage();
        // MODAL CANNOT BE CLOSED - NO FORM RESET
    } catch (error) {
        console.error('Error saving testimonial:', error);
        alert('Error submitting testimonial. Please try again.');
    }
});

// ============================
// CENTERED SUCCESS MESSAGE (cannot be closed)
// ============================
function showCenteredSuccessMessage() {
    successMessageOverlay.classList.add('show');
    // Modal stays open; no close event
}

// Do NOT add overlay click or Escape handlers (modal stays open)

// ============================
// INITIALIZATION
// ============================

document.addEventListener('DOMContentLoaded', () => {
    setupRating();
    updateInitials();
});
const style = document.createElement('style');
style.textContent = `
    @keyframes checkmarkStroke {
        to {
            stroke-dashoffset: 0;
        }
    }
`;
document.head.appendChild(style);
