const inviteData = {
  pageTitle: "서린이의 첫 번째 생일",
  brand: "One Happy Babe",

  // 첫 화면 동화책 오프닝 영상 1개만 사용합니다.
  // assets 폴더에 intro.mp4 파일을 넣고 아래 파일명만 맞춰주세요.
  openingVideo: "https://blog.naver.com/bandlshop/222140599530",
  openingPoster: "https://placehold.co/430x620/fde9e6/777?text=Opening+Video",

  event: {
    dateText: "2026년 12월 12일 토요일 오후 5시",
    monthTitle: "12월",
    day: "12",
    placeName: "더블유 파티",
    address: "서울 성북구 동소문로 284 더블유파티"
  },

  parents: {
    father: "이아빠",
    mother: "장엄마"
  },

  baby: {
    name: "서린"
  },

  introMessage: `
    맑은 눈빛 하나, 작은 손짓 하나로<br>
    온 세상을 행복으로 가득 채우는 사랑스러운<br>
    서린이가 어느덧 첫 생일을 맞이하였습니다.<br>
    그동안 서린이가 건강하게 잘 자랄 수 있도록<br>
    늘 따뜻한 마음으로 함께 지켜봐 주신<br>
    소중한 분들께 감사의 마음을 전하고자 합니다.<br>
    부디 참석하시어 더 넓은 세상으로 한걸음 내딛는<br>
    서린이에게 기쁨과 행복을 나누어 주시기 바랍니다.
  `,

  familyPhoto: "./assets/family.jpg",
  babyPhoto: "./assets/baby.jpg",
  endingPhoto: "./assets/ending.jpg",

  timeline: [
    { title: "처음 만난 서린", desc: "작고 소중했던 순간", image: "./assets/first.jpg" },
    { title: "50일의 서린", desc: "방긋 웃던 날", image: "./assets/50day.jpg" },
    { title: "100일의 서린", desc: "매일매일 성장 중", image: "./assets/100day.jpg" },
    { title: "첫 번째 생일", desc: "우리의 가장 큰 선물", image: "./assets/1sthbd.jpg" }
  ],

  gallery: [
    "./assets/photo01.jpg",
    "./assets/photo02.jpg",
    "./assets/photo03.jpg",
    "./assets/photo04.jpg",
    "./assets/photo05.jpg",
    "./assets/photo06.jpg"
  ],

  mapLinks: {
    kakao: "https://map.kakao.com/link/search/경남 창원시 ○○구 ○○로 123",
    naver: "https://map.naver.com/p/search/경남 창원시 ○○구 ○○로 123"
  },

  attendance: {
    phone: "01000000000",
    message: "안녕하세요. 서린이 돌잔치 참석 여부 전달드립니다.\n\n성함 : \n참석인원 : "
  },

  contactPhone: "01000000000",

  accounts: [
    { label: "아빠", bank: "하나은행", number: "123-456-7890", holder: "이아빠" },
    { label: "엄마", bank: "두리은행", number: "987-654-3210", holder: "장엄마" }
  ]
};

let lightboxImages = [];
let currentLightboxIndex = 0;

document.addEventListener('DOMContentLoaded', () => {
  renderInvite(inviteData);
  setupEvents(inviteData);
  setupLightboxEvents();
  setupScrollAnimation();
});

function renderInvite(data) {
  document.title = data.pageTitle || '돌잔치 모바일 초대장';

  const video = document.getElementById('openingVideo');
  video.poster = data.openingPoster || '';
  video.innerHTML = `<source src="${data.openingVideo}" type="video/mp4" />`;

  document.getElementById('brand').textContent = data.brand || '';
  document.getElementById('heroDate').innerHTML = `${data.event.dateText}<br>${data.event.placeName}`;
  document.getElementById('introMessage').innerHTML = data.introMessage;
  document.getElementById('familyPhoto').src = data.familyPhoto;
  document.getElementById('familyText').innerHTML = `아빠 ${data.parents.father} · 엄마 ${data.parents.mother}<br>그리고 사랑스러운 ${data.baby.name}`;
  document.getElementById('eventInfo').innerHTML = `${data.event.dateText}<br>${data.event.placeName}`;
  document.getElementById('babyPhoto').src = data.babyPhoto;
  document.getElementById('monthTitle').textContent = data.event.monthTitle;
  document.getElementById('calendarWrap').innerHTML = createCalendar(data.event.day);

  renderTimeline(data.timeline || []);
  renderGallery(data.gallery || []);
  prepareLightboxImages(data);

  document.getElementById('locationText').innerHTML = `${data.event.placeName}<br>${data.event.address}`;
  document.getElementById('kakaoMap').href = data.mapLinks.kakao;
  document.getElementById('naverMap').href = data.mapLinks.naver;

  document.getElementById('smsBtn').href = makeSmsLink(data.attendance.phone, data.attendance.message);

  document.getElementById('accounts').innerHTML = (data.accounts || []).map((account) => {
    const text = `${account.bank} ${account.number} ${account.holder}`;
    return `
      <div class="account">
        <div class="acc-row">
          <span>${account.label ? account.label + ' : ' : ''}${text}</span>
          <button class="btn" type="button" onclick="copyText('${escapeForSingleQuote(text)}')">복사</button>
        </div>
      </div>
    `;
  }).join('');

  document.getElementById('endingPhoto').src = data.endingPhoto;
}

function renderTimeline(items) {
  document.getElementById('timeline').innerHTML = items.map((item, index) => {
    const text = `
<p>
<strong>${item.title}</strong>
<span>${item.desc}</span>
</p>
`;
    const image = `<img class="js-lightbox" data-lightbox-type="timeline" data-lightbox-index="${index}" src="${item.image}" alt="${item.title}">`;
    return index % 2 === 0
      ? `<div class="item">${image}<div class="dot"></div>${text}</div>`
      : `<div class="item">${text}<div class="dot"></div>${image}</div>`;
  }).join('');
}

function renderGallery(images) {
  document.getElementById('gallery').innerHTML = images
    .map((src, index) => `<img class="js-lightbox" data-lightbox-type="gallery" data-lightbox-index="${index}" src="${src}" alt="갤러리 사진 ${index + 1}">`)
    .join('');
}

function createCalendar(activeDay) {
  const weeks = [
    ['', '1', '2', '3', '4', '5', '6'],
    ['7', '8', '9', '10', '11', '12', '13'],
    ['14', '15', '16', '17', '18', '19', '20'],
    ['21', '22', '23', '24', '25', '26', '27'],
    ['28', '29', '30', '31', '', '', '']
  ];

  const rows = weeks.map((week) => `<tr>${week.map((day) => {
    if (!day) return '<td></td>';
    return day === String(activeDay) ? `<td><span class="on">${day}</span></td>` : `<td>${day}</td>`;
  }).join('')}</tr>`).join('');

  return `<table class="calendar"><tr><th>SUN</th><th>MON</th><th>TUE</th><th>WED</th><th>THU</th><th>FRI</th><th>SAT</th></tr>${rows}</table>`;
}

function makeSmsLink(phone, message) {
  const encoded = encodeURIComponent(message || '');
  const separator = /iPhone|iPad|iPod/i.test(navigator.userAgent) ? '&' : '?';
  return `sms:${phone}${separator}body=${encoded}`;
}


function prepareLightboxImages(data) {
  const timelineImages = (data.timeline || []).map((item) => ({
    src: item.image,
    alt: item.title || '성장 이야기 사진',
    caption: item.desc ? `${item.title} · ${item.desc}` : item.title || ''
  }));

  const galleryImages = (data.gallery || []).map((src, index) => ({
    src,
    alt: `갤러리 사진 ${index + 1}`,
    caption: `갤러리 ${index + 1}`
  }));

  lightboxImages = [...timelineImages, ...galleryImages];
}

function setupLightboxEvents() {
  document.addEventListener('click', (event) => {
    const target = event.target.closest('.js-lightbox');
    if (!target) return;

    const type = target.dataset.lightboxType;
    const index = Number(target.dataset.lightboxIndex || 0);
    const timelineCount = inviteData.timeline.length;
    const lightboxIndex = type === 'gallery' ? timelineCount + index : index;
    openLightbox(lightboxIndex);
  });

  document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
  document.getElementById('lightboxPrev').addEventListener('click', showPrevImage);
  document.getElementById('lightboxNext').addEventListener('click', showNextImage);

  document.getElementById('photoLightbox').addEventListener('click', (event) => {
    if (event.target.id === 'photoLightbox') closeLightbox();
  });

  document.addEventListener('keydown', (event) => {
    const lightbox = document.getElementById('photoLightbox');
    if (!lightbox.classList.contains('open')) return;

    if (event.key === 'Escape') closeLightbox();
    if (event.key === 'ArrowLeft') showPrevImage();
    if (event.key === 'ArrowRight') showNextImage();
  });
}

function openLightbox(index) {
  if (!lightboxImages.length) return;
  currentLightboxIndex = Math.max(0, Math.min(index, lightboxImages.length - 1));
  updateLightboxImage();

  const lightbox = document.getElementById('photoLightbox');
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.classList.add('lightbox-lock');
}

function closeLightbox() {
  const lightbox = document.getElementById('photoLightbox');
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('lightbox-lock');
}

function showPrevImage() {
  if (currentLightboxIndex <= 0) return;
  currentLightboxIndex -= 1;
  updateLightboxImage();
}

function showNextImage() {
  if (currentLightboxIndex >= lightboxImages.length - 1) return;
  currentLightboxIndex += 1;
  updateLightboxImage();
}

function updateLightboxImage() {
  const item = lightboxImages[currentLightboxIndex];
  const image = document.getElementById('lightboxImage');
  const caption = document.getElementById('lightboxCaption');

  image.src = item.src;
  image.alt = item.alt || '크게 보기 사진';
  caption.textContent = item.caption || '';

  document.getElementById('lightboxPrev').disabled = currentLightboxIndex === 0;
  document.getElementById('lightboxNext').disabled = currentLightboxIndex === lightboxImages.length - 1;
}

function setupEvents(data) {
  document.getElementById('topBtn').addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));
  document.getElementById('callBtn').addEventListener('click', () => { location.href = `tel:${data.contactPhone}`; });
  document.getElementById('shareBtn').addEventListener('click', sharePage);
  document.getElementById('musicBtn').addEventListener('click', () => alert('배경음악 파일을 연결하면 ON/OFF 기능으로 바꿀 수 있어요.'));

  const openingVideo = document.getElementById('openingVideo');
const startBtn = document.getElementById('startBtn');
const heroCover = document.getElementById('heroCover');

startBtn.addEventListener('click', () => {
  heroCover.classList.add('hide');

  openingVideo.muted = false;
  openingVideo.play();
});

openingVideo.addEventListener('ended', () => {
  const nextSection = document.querySelector('.hero').nextElementSibling;

  if (nextSection) {
    setTimeout(() => {
      nextSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }, 800);
  }
});

function setupScrollAnimation() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('show');
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.fade').forEach((el) => io.observe(el));
}

function copyText(text) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => alert('계좌번호가 복사되었습니다.'));
  } else {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    textarea.remove();
    alert('계좌번호가 복사되었습니다.');
  }
}

function sharePage() {
  if (navigator.share) {
    navigator.share({ title: document.title, url: location.href });
  } else if (navigator.clipboard) {
    navigator.clipboard.writeText(location.href).then(() => alert('초대장 주소가 복사되었습니다.'));
  } else {
    alert('브라우저 공유 기능을 지원하지 않습니다. 주소창의 링크를 복사해 주세요.');
  }
}

function escapeForSingleQuote(text) {
  return String(text).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}
