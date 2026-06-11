let userEmail = '';
let resendTimer = null;
let resendCountdown = 0;

// Initialize OTP inputs
document.addEventListener('DOMContentLoaded', () => {
    setupOTPInputs();
});

function setupOTPInputs() {
    const inputs = document.querySelectorAll('.otp-input');
    
    inputs.forEach((input, index) => {
        input.addEventListener('input', (e) => handleOTPInput(e, index));
        input.addEventListener('keydown', (e) => handleOTPKeydown(e, index));
        input.addEventListener('paste', handleOTPPaste);
    });
}

function handleOTPInput(e, index) {
    const input = e.target;
    const value = input.value;

    if (!/^\d*$/.test(value)) {
        input.value = '';
        return;
    }

    input.classList.remove('error');
    const errorBox = document.getElementById('error-message');
    if (errorBox) {
        errorBox.classList.add('hidden');
    }

    if (value.length === 1) {
        input.classList.add('filled');
        const nextInput = document.querySelector(`[data-index="${index + 1}"]`);
        if (nextInput) {
            nextInput.focus();
        }
    } else {
        input.classList.remove('filled');
    }
}

function handleOTPKeydown(e, index) {
    const input = e.target;

    if (e.key === 'Backspace') {
        e.preventDefault();
        input.value = '';
        input.classList.remove('filled');
        
        const prevInput = document.querySelector(`[data-index="${index - 1}"]`);
        if (prevInput) {
            prevInput.focus();
        }
    } else if (e.key === 'ArrowLeft') {
        const prevInput = document.querySelector(`[data-index="${index - 1}"]`);
        if (prevInput) prevInput.focus();
    } else if (e.key === 'ArrowRight') {
        const nextInput = document.querySelector(`[data-index="${index + 1}"]`);
        if (nextInput) nextInput.focus();
    }
}

function handleOTPPaste(e) {
    e.preventDefault();
    const paste = (e.clipboardData || window.clipboardData).getData('text');
    const pasteData = paste.replace(/\D/g, '').slice(0, 6);

    const inputs = document.querySelectorAll('.otp-input');
    pasteData.split('').forEach((char, index) => {
        if (inputs[index]) {
            inputs[index].value = char;
            inputs[index].classList.add('filled');
        }
    });

    if (pasteData.length === 6) {
        inputs[5].focus();
    }
}

function handleGoogleLogin() {
    // Placeholder for Google OAuth integration
    console.log('Google login clicked');
    // window.location.href = '/auth/google';
}

function handleEmailContinue() {
    const emailInput = document.getElementById('email');
    const email = emailInput.value.trim();

    if (!email) {
        emailInput.style.borderColor = 'var(--error-color)';
        return;
    }

    if (!isValidEmail(email)) {
        emailInput.style.borderColor = 'var(--error-color)';
        return;
    }

    userEmail = email;
    showVerificationPage();
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showVerificationPage() {
    // Hide welcome page
    document.getElementById('welcome-page').classList.remove('active-page');

    // Show verification page
    document.getElementById('verification-page').classList.add('active-page');
    document.getElementById('email-display').textContent = userEmail;

    // Focus first OTP input
    setTimeout(() => {
        document.querySelector('[data-index="0"]').focus();
    }, 300);
}

function handleBackClick() {
    document.getElementById('verification-page').classList.remove('active-page');
    document.getElementById('welcome-page').classList.add('active-page');
    
    // Reset verification form
    clearOTPInputs();
    document.getElementById('error-message').classList.add('hidden');
    
    setTimeout(() => {
        document.getElementById('email').focus();
    }, 300);
}

function handleVerifyCode() {
    const inputs = document.querySelectorAll('.otp-input');
    const code = Array.from(inputs).map(input => input.value).join('');

    if (code.length !== 6) {
        showError('Please enter all 6 digits');
        shakeOTPInputs();
        return;
    }

    // Placeholder for verification logic
    console.log('Verifying code:', code);
    
    // Example: Check if code is correct
    if (code === '000000') {
        // Successful verification
        console.log('Verification successful');
        // window.location.href = '/dashboard';
    } else {
        showError('Invalid code. Please check the code and try again');
        shakeOTPInputs();
        clearOTPInputs();
    }
}

function clearOTPInputs() {
    document.querySelectorAll('.otp-input').forEach(input => {
        input.value = '';
        input.classList.remove('filled', 'error');
    });
}

function shakeOTPInputs() {
    document.querySelectorAll('.otp-input').forEach(input => {
        input.classList.add('error');
    });

    setTimeout(() => {
        document.querySelectorAll('.otp-input').forEach(input => {
            input.classList.remove('error');
        });
    }, 500);
}

function showError(message) {
    const errorBox = document.getElementById('error-message');
    errorBox.textContent = message;
    errorBox.classList.remove('hidden');
}

function handleResend() {
    const resendBtn = event.target;
    resendBtn.disabled = true;

    // Placeholder for resend logic
    console.log('Resending code to:', userEmail);

    // Start countdown
    startResendCountdown();
}

function startResendCountdown() {
    resendCountdown = 30;
    const timerEl = document.getElementById('resend-timer');
    const resendBtn = document.querySelector('.btn-resend');

    timerEl.classList.remove('hidden');
    timerEl.textContent = `Resend in ${resendCountdown}s`;

    resendTimer = setInterval(() => {
        resendCountdown--;
        
        if (resendCountdown <= 0) {
            clearInterval(resendTimer);
            timerEl.classList.add('hidden');
            resendBtn.disabled = false;
            resendCountdown = 0;
        } else {
            timerEl.textContent = `Resend in ${resendCountdown}s`;
        }
    }, 1000);
}
