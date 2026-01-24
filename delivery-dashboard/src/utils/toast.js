// Simple toast notification utility
export const showToast = (message, type = 'info', duration = 3000) => {
  // Remove existing toast if any
  const existingToast = document.getElementById('toast-notification');
  if (existingToast) {
    existingToast.remove();
  }

  // Create toast element
  const toast = document.createElement('div');
  toast.id = 'toast-notification';
  
  const colors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500',
    info: 'bg-blue-500'
  };

  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ'
  };

  toast.className = `fixed top-4 right-4 ${colors[type]} text-white px-6 py-4 rounded-xl shadow-2xl z-[9999] flex items-center gap-3 animate-fade-in max-w-md`;
  toast.innerHTML = `
    <span class="text-xl font-bold">${icons[type]}</span>
    <span class="font-semibold">${message}</span>
  `;

  document.body.appendChild(toast);

  // Auto remove after duration
  setTimeout(() => {
    toast.style.animation = 'fade-out 0.3s ease-out';
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }, duration);

  return toast;
};

// Add fade-out animation to CSS
const style = document.createElement('style');
style.textContent = `
  @keyframes fade-out {
    from {
      opacity: 1;
      transform: translateY(0);
    }
    to {
      opacity: 0;
      transform: translateY(-20px);
    }
  }
`;
if (!document.head.querySelector('#toast-styles')) {
  style.id = 'toast-styles';
  document.head.appendChild(style);
}
