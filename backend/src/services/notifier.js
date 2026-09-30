export const consoleNotifier = async ({ to, message, channel = 'console' }) => {
  const text = to ? `[${channel}] ${to}: ${message}` : `[${channel}] ${message}`;
  console.log(text);

  return {
    delivered: true,
    channel,
    to,
    message
  };
};

let activeNotifier = consoleNotifier;

export function setNotifier(notifier) {
  activeNotifier = notifier || consoleNotifier;
  return activeNotifier;
}

export function getNotifier() {
  return activeNotifier;
}

export async function sendNotification(payload) {
  return activeNotifier(payload);
}

export async function notifyRequest({ to, locale = 'hi', workerName, farmerName, message, buildMessage = true }) {
  const text = buildMessage
    ? message || `Notified ${workerName}`
    : message;

  return sendNotification({
    to,
    locale,
    message: text,
    channel: 'console'
  });
}
