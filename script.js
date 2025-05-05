document.addEventListener('DOMContentLoaded', function() {
  // Инициализация EmailJS
  emailjs.init('BUaN8bmP-EjEZ9Uek');

  // Элементы DOM
  const messageForm = document.getElementById('message-form');
  const toEmailInput = document.getElementById('to_email');
  const messageTextarea = document.getElementById('message');
  const showEmailCheckbox = document.getElementById('show-email');
  const senderEmailField = document.getElementById('sender-email-field');
  const senderEmailInput = document.getElementById('sender-email');
  const submitBtn = document.getElementById('submit-btn');
  const charCounter = document.getElementById('char-counter');
  const planeAnimation = document.getElementById('plane-animation');
  const notification = document.getElementById('notification');
  const notificationMessage = document.getElementById('notification-message');
  const themeToggle = document.getElementById('theme-toggle');
  
  // Константы
  const MAX_MESSAGE_LENGTH = 1000;
  const EMAILJS_SERVICE_ID = 'service_49kksl6';
  const EMAILJS_TEMPLATE_ID = 'template_nykzdqa';

  // Обработчики событий
  messageTextarea.addEventListener('input', updateCharCounter);
  showEmailCheckbox.addEventListener('change', toggleSenderEmailField);
  messageForm.addEventListener('submit', handleFormSubmit);
  themeToggle.addEventListener('click', toggleTheme);

  // Функции
  function updateCharCounter() {
    const remaining = MAX_MESSAGE_LENGTH - messageTextarea.value.length;
    charCounter.textContent = `Осталось: ${remaining}/${MAX_MESSAGE_LENGTH} символов`;
    charCounter.className = remaining < 0 ? 'char-counter error' :
                          remaining < 50 ? 'char-counter warning' : 'char-counter';
  }

  function toggleSenderEmailField() {
    senderEmailField.style.display = this.checked ? 'block' : 'none';
    if (!this.checked) senderEmailInput.value = '';
  }

  async function handleFormSubmit(e) {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      submitBtn.disabled = true;
      showSendingAnimation();
      
      const templateParams = {
        to_email: toEmailInput.value.trim(),
        message: messageTextarea.value.trim(),
        reply_to: showEmailCheckbox.checked ? senderEmailInput.value.trim() : undefined,
        from_name: showEmailCheckbox.checked ? 'Пользователь сайта' : 'Анонимный отправитель'
      };

      console.log('Отправляемые данные:', templateParams);
      
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
      
      showSuccess();
      setTimeout(resetForm, 2000);
    } catch (error) {
      console.error('Ошибка отправки:', error);
      showError(error.text || 'Ошибка при отправке. Попробуйте позже.');
      resetForm(false);
    }
  }

  function validateForm() {
    if (!toEmailInput.value.trim()) {
      showError('Пожалуйста, введите email получателя');
      return false;
    }
    
    if (!validateEmail(toEmailInput.value.trim())) {
      showError('Пожалуйста, введите корректный email получателя');
      return false;
    }
    
    if (!messageTextarea.value.trim()) {
      showError('Пожалуйста, введите сообщение');
      return false;
    }
    
    if (messageTextarea.value.length > MAX_MESSAGE_LENGTH) {
      showError(`Сообщение слишком длинное. Максимум ${MAX_MESSAGE_LENGTH} символов`);
      return false;
    }
    
    if (showEmailCheckbox.checked && !validateEmail(senderEmailInput.value.trim())) {
      showError('Пожалуйста, введите корректный ваш email');
      return false;
    }
    
    return true;
  }

  function showSendingAnimation() {
    planeAnimation.style.display = 'flex';
    setTimeout(() => planeAnimation.classList.add('show'), 10);
  }

  function showSuccess() {
    planeAnimation.classList.add('success-animation');
    showNotification('Сообщение успешно отправлено!', 'success');
  }

  function showError(message) {
    showNotification(message, 'error');
  }

  function resetForm(success = true) {
    if (success) {
      messageForm.reset();
      updateCharCounter();
    }
    planeAnimation.style.display = 'none';
    planeAnimation.classList.remove('show', 'success-animation');
    submitBtn.disabled = false;
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function showNotification(message, type) {
    notificationMessage.textContent = message;
    notification.className = `notification ${type} show`;
    setTimeout(() => notification.classList.remove('show'), 5000);
  }

  function toggleTheme() {
    const isDark = !document.body.classList.contains('dark-theme');
    document.body.classList.toggle('dark-theme');
    
    // Обновляем иконку и текст кнопки
    const icon = themeToggle.querySelector('i');
    if (isDark) {
      icon.classList.replace('fa-moon', 'fa-sun');
      themeToggle.textContent = 'Светлая тема';
      themeToggle.insertBefore(icon, themeToggle.firstChild);
    } else {
      icon.classList.replace('fa-sun', 'fa-moon');
      themeToggle.textContent = 'Тёмная тема';
      themeToggle.insertBefore(icon, themeToggle.firstChild);
    }
    
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }

  // Проверка темы при загрузке
  function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const isDark = savedTheme === 'dark';
    
    if (isDark) {
      document.body.classList.add('dark-theme');
      const icon = themeToggle.querySelector('i');
      icon.classList.replace('fa-moon', 'fa-sun');
      themeToggle.textContent = 'Светлая тема';
      themeToggle.insertBefore(icon, themeToggle.firstChild);
    }
  }

  initTheme();
});