/* ==========================================================================
   วันลอยกระทง (Loy Krathong) - Special Invitation Page Script
   Interactive Sweet & Playful Valentine Theme
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const invitationCard = document.getElementById('invitationCard');
  const celebrationView = document.getElementById('celebrationView');
  const finalView = document.getElementById('finalView');
  const btnYes = document.getElementById('btnYes');
  const btnNo = document.getElementById('btnNo');
  const cuteToast = document.getElementById('cuteToast');
  const moonBadge = document.getElementById('moonBadge');
  const bgmToggle = document.getElementById('bgmToggle');
  const bgmIcon = document.getElementById('bgmIcon');
  const coupleNamesInput = document.getElementById('coupleNames');
  const updateNamesBtn = document.getElementById('updateNamesBtn');
  const displayNames = document.getElementById('displayNames');
  const floatWishBtn = document.getElementById('floatWishBtn');
  const animatedKrathong = document.getElementById('animatedKrathong');
  const backToCardBtn = document.getElementById('backToCardBtn');
  const wishText = document.getElementById('wishText');

  // Final View Elements
  const finalTitle = document.getElementById('finalTitle');
  const finalNamesText = document.getElementById('finalNamesText');
  const finalWishContent = document.getElementById('finalWishContent');
  const shareMemoryBtn = document.getElementById('shareMemoryBtn');
  const restartFlowBtn = document.getElementById('restartFlowBtn');

  // Playful Decline Button Messages & Evasion State
  let declineAttempts = 0;
  let yesButtonScale = 1;

  const playfulMessages = [
    'งึมมม... คิดใหม่อีกทีน้าา 🥺',
    'อย่าใจร้ายจิ เค้าเตรียมกระทงไว้รอแล้วนะ 🌸',
    'ถ้าไม่ไป เค้าจะร้องไห้งอแงจริงๆ นะ ฮืออ 😭',
    'ปุ่มสีชมพูน่ากดกว่าตั้งเยอะ กดปุ่มซ้ายเถอะนะะ 💕',
    'ไม่ยอมให้กดหรอกก แบร่! 😜✨',
    'ไปกับเค้านะคะ ขอร้องงง น้าๆๆๆ 🥺💖'
  ];

  // ------------------------------------------------------------------------
  // Audio Synthesizer (Web Audio API - Cute Music Box & Chimes)
  // ------------------------------------------------------------------------
  let audioCtx = null;
  let isBgmPlaying = false;
  let bgmInterval = null;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  // Play cute musical chime notes
  function playChime(freq = 523.25, type = 'sine', duration = 0.4, delay = 0) {
    try {
      initAudio();
      setTimeout(() => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

        gain.gain.setValueAtTime(0.25, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start();
        osc.stop(audioCtx.currentTime + duration);
      }, delay * 1000);
    } catch (e) {
      console.warn('Audio not allowed yet:', e);
    }
  }

  // Play happy celebration arpeggio
  function playCelebrationFanfare() {
    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C5, E5, G5, C6, E6
    notes.forEach((freq, idx) => {
      playChime(freq, 'triangle', 0.5, idx * 0.12);
    });
  }

  // Play subtle cute squeak when dodging "No"
  function playDodgeSound() {
    playChime(784, 'sine', 0.15, 0);
    playChime(587, 'sine', 0.15, 0.08);
  }

  // Gentle Lo-Fi Music Box Melody
  function toggleMusicBox() {
    initAudio();
    isBgmPlaying = !isBgmPlaying;

    if (isBgmPlaying) {
      bgmIcon.textContent = '🔊';
      bgmToggle.style.background = '#ffebf2';
      showToast('เปิดเสียงเพลงกล่องดนตรีแล้วน้า 🎵✨');

      // Simple sweet pentatonic melody loop: C5 - D5 - E5 - G5 - A5
      const melody = [
        523.25, 659.25, 783.99, 659.25,
        880.00, 783.99, 659.25, 587.33,
        523.25, 587.33, 659.25, 783.99
      ];
      let noteIdx = 0;

      bgmInterval = setInterval(() => {
        if (!isBgmPlaying) return;
        const freq = melody[noteIdx % melody.length];
        playChime(freq, 'sine', 0.6, 0);
        noteIdx++;
      }, 700);

    } else {
      bgmIcon.textContent = '🎵';
      bgmToggle.style.background = 'rgba(255, 255, 255, 0.85)';
      if (bgmInterval) clearInterval(bgmInterval);
      showToast('ปิดเสียงเพลงแล้วจ้า 🔇');
    }
  }

  bgmToggle.addEventListener('click', toggleMusicBox);

  // ------------------------------------------------------------------------
  // Toast Notification
  // ------------------------------------------------------------------------
  let toastTimer = null;
  function showToast(text) {
    cuteToast.textContent = text;
    cuteToast.classList.add('show');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      cuteToast.classList.remove('show');
    }, 2400);
  }

  // ------------------------------------------------------------------------
  // Playful Decline Button "ไม่ไปง่ะ 🥺" Mechanism
  // ------------------------------------------------------------------------
  function dodgeButton() {
    playDodgeSound();
    declineAttempts++;

    // Random displacement within safe bounds
    const maxOffset = 65;
    const randomX = (Math.random() - 0.5) * (maxOffset * 2);
    const randomY = (Math.random() - 0.5) * (maxOffset * 1.5);
    const randomRotate = (Math.random() - 0.5) * 30;

    btnNo.style.transform = `translate(${randomX}px, ${randomY}px) rotate(${randomRotate}deg)`;

    // Make the YES button grow slightly bigger each time!
    yesButtonScale = Math.min(yesButtonScale + 0.08, 1.45);
    btnYes.style.transform = `scale(${yesButtonScale})`;

    // Show a cute playful message
    const msg = playfulMessages[(declineAttempts - 1) % playfulMessages.length];
    showToast(msg);
  }

  btnNo.addEventListener('mouseenter', dodgeButton);
  btnNo.addEventListener('click', (e) => {
    e.preventDefault();
    dodgeButton();
  });
  btnNo.addEventListener('touchstart', (e) => {
    e.preventDefault();
    dodgeButton();
  }, { passive: false });

  // ------------------------------------------------------------------------
  // Accept Button "ไปเยย! 💖" Click Handler
  // ------------------------------------------------------------------------
  btnYes.addEventListener('click', () => {
    initAudio();
    playCelebrationFanfare();

    // Trigger explosive confetti & hearts
    fireConfetti();

    // Switch view smoothly
    invitationCard.style.opacity = '0';
    invitationCard.style.transform = 'scale(0.9) translateY(-20px)';

    setTimeout(() => {
      invitationCard.style.display = 'none';
      celebrationView.classList.remove('hidden');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 400);

    showToast('เย้ๆๆ! นัดกันแล้วน้าาา 🥰💖');
  });

  // Back to Card Button
  backToCardBtn.addEventListener('click', () => {
    celebrationView.classList.add('hidden');
    invitationCard.style.display = 'flex';
    setTimeout(() => {
      invitationCard.style.opacity = '1';
      invitationCard.style.transform = 'scale(1) translateY(0)';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 50);
  });

  // ------------------------------------------------------------------------
  // Personalize Couple Names on Floating Krathong
  // ------------------------------------------------------------------------
  function updateCoupleNames() {
    const val = coupleNamesInput.value.trim();
    if (val) {
      displayNames.textContent = val + ' 💕';
      showToast(`บันทึกชื่อ "${val}" บนกระทงแล้วจ้า ✨`);
      playChime(659.25, 'triangle', 0.3);
    } else {
      displayNames.textContent = 'เราสองคน 💕';
    }
  }

  updateNamesBtn.addEventListener('click', updateCoupleNames);
  coupleNamesInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') updateCoupleNames();
  });

  // Float Wish Animation & Transition to Final Scene
  floatWishBtn.addEventListener('click', () => {
    initAudio();
    playChime(880, 'sine', 0.6);
    fireConfetti(true);

    const coupleNames = coupleNamesInput.value.trim() || 'เราสองคน';
    const wish = wishText.value.trim() || 'ขอให้เราสองคนมีความสุขและรักกันไปนานๆ นะ...';

    // Update Final Scene content
    finalNamesText.textContent = coupleNames;
    finalWishContent.textContent = `"${wish}"`;
    finalTitle.textContent = `${coupleNames} ลอยกระทงด้วยกันแล้วนะ 💕`;

    showToast('คำอธิษฐานส่งถึงดวงจันทร์แล้วน้า 🌕✨');

    // Animation: krathong gently drifts into the distance
    animatedKrathong.style.transition = 'transform 1.8s ease-in-out, opacity 1.8s ease-in-out';
    animatedKrathong.style.transform = 'translateY(-30px) translateX(60px) scale(0.65)';
    animatedKrathong.style.opacity = '0.7';

    // Transition smoothly to Final Scene (ชายหญิงลอยกระทงริมน้ำใต้แสงจันทร์และโคมลอย)
    setTimeout(() => {
      celebrationView.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      celebrationView.style.opacity = '0';
      celebrationView.style.transform = 'scale(0.92) translateY(-15px)';

      setTimeout(() => {
        celebrationView.classList.add('hidden');
        celebrationView.style.opacity = '';
        celebrationView.style.transform = '';
        
        // Reset floating krathong in background for next time
        animatedKrathong.style.transition = '';
        animatedKrathong.style.transform = 'translateY(0) translateX(0) scale(1)';
        animatedKrathong.style.opacity = '1';

        // Show Final Screen
        finalView.classList.remove('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        playCelebrationFanfare();
        fireConfetti();
      }, 400);
    }, 1200);
  });

  // Share Memory Button
  shareMemoryBtn.addEventListener('click', () => {
    initAudio();
    playChime(659.25, 'triangle', 0.3);

    const coupleNames = coupleNamesInput.value.trim() || 'เราสองคน';
    const textToCopy = `🌕 สุขสันต์วันลอยกระทงนะ! ลอยกระทงปีนี้ ${coupleNames} ได้ลอยกระทงด้วยกันแล้วนะ 💕 นัดกันแล้วห้ามเบี้ยวเด็ดขาด! 🥰 https://sirikorn123.github.io/loy-krathong/`;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(textToCopy).then(() => {
        showToast('คัดลอกข้อความแล้ว ส่งให้คนพิเศษได้เลยน้า 💌✨');
      }).catch(() => {
        showToast('นัดกันแล้วห้ามเบี้ยวนะคะ ♡ 🌸');
      });
    } else {
      showToast('นัดกันแล้วห้ามเบี้ยวนะคะ ♡ 🌸');
    }
  });

  // Restart flow button on final screen
  restartFlowBtn.addEventListener('click', () => {
    finalView.classList.add('hidden');
    invitationCard.style.display = 'flex';
    setTimeout(() => {
      invitationCard.style.opacity = '1';
      invitationCard.style.transform = 'scale(1) translateY(0)';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 50);
  });

  // Moon badge click
  moonBadge.addEventListener('click', () => {
    initAudio();
    playChime(659.25, 'sine', 0.3);
    showToast('คืนวันเพ็ญเดือน 12 พระจันทร์ยิ้มให้เราสองคนนะ 🌝✨');
  });

  // ------------------------------------------------------------------------
  // Particle & Confetti Canvas Engine
  // ------------------------------------------------------------------------
  const canvas = document.getElementById('confettiCanvas');
  const ctx = canvas.getContext('2d');
  let particles = [];

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  const pastelColors = [
    '#ff6b8b', '#ff4071', '#ff94b8', '#ffccd9',
    '#ffe082', '#ffca28', '#ffd54f', '#ffffff'
  ];

  class Particle {
    constructor(x, y, isHeartOnly = false) {
      this.x = x;
      this.y = y;
      this.size = Math.random() * 12 + 8;
      this.color = pastelColors[Math.floor(Math.random() * pastelColors.length)];
      this.speedX = (Math.random() - 0.5) * 12;
      this.speedY = (Math.random() - 1) * 14 - 3;
      this.gravity = 0.28;
      this.opacity = 1;
      this.rotation = Math.random() * 360;
      this.rotationSpeed = (Math.random() - 0.5) * 10;
      this.isHeart = isHeartOnly || Math.random() > 0.4;
    }

    update() {
      this.speedY += this.gravity;
      this.x += this.speedX;
      this.y += this.speedY;
      this.rotation += this.rotationSpeed;
      this.opacity -= 0.012;
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);
      ctx.globalAlpha = Math.max(this.opacity, 0);

      if (this.isHeart) {
        ctx.fillStyle = this.color;
        ctx.font = `${this.size * 1.5}px sans-serif`;
        ctx.fillText('💖', -this.size / 2, this.size / 2);
      } else {
        ctx.fillStyle = this.color;
        ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size * 0.6);
      }
      ctx.restore();
    }
  }

  function fireConfetti(heartShower = false) {
    const originX = window.innerWidth / 2;
    const originY = window.innerHeight * 0.6;
    for (let i = 0; i < 90; i++) {
      particles.push(new Particle(originX, originY, heartShower));
    }
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = particles.length - 1; i >= 0; i--) {
      particles[i].update();
      particles[i].draw();
      if (particles[i].opacity <= 0 || particles[i].y > canvas.height + 50) {
        particles.splice(i, 1);
      }
    }
    requestAnimationFrame(animateParticles);
  }
  animateParticles();

  // Create subtle floating background petals periodically
  setInterval(() => {
    if (particles.length < 25) {
      const x = Math.random() * canvas.width;
      const p = new Particle(x, -20, true);
      p.speedX = (Math.random() - 0.5) * 2;
      p.speedY = Math.random() * 1.5 + 0.8;
      p.gravity = 0;
      p.opacity = 0.85;
      particles.push(p);
    }
  }, 1200);
});

