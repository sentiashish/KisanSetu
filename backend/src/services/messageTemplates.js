export const messageTemplates = {
  hi: {
    request: 'नमस्कार {workerName}, {farmerName} ने {message} के लिए काम पूछने के लिए संदेश भेजा है। कृपया जवाब दें: हाँ या नहीं।',
    replyAccepted: 'नमस्कार {farmerName}, {workerName} ने काम के लिए हाँ कहा है।',
    replyDeclined: 'नमस्कार {farmerName}, {workerName} ने काम के लिए नहीं कहा है।'
  },
  en: {
    request: 'Hello {workerName}, {farmerName} is asking about work for: {message}. Please reply YES or NO.',
    replyAccepted: 'Hello {farmerName}, {workerName} has accepted the work request.',
    replyDeclined: 'Hello {farmerName}, {workerName} has declined the work request.'
  }
};

export function buildRequestMessage({ locale = 'hi', workerName = 'worker', farmerName = 'farmer', message = '' }) {
  const template = messageTemplates[locale]?.request || messageTemplates.en.request;
  return template
    .replace('{workerName}', String(workerName))
    .replace('{farmerName}', String(farmerName))
    .replace('{message}', String(message));
}

export function buildReplyMessage({ locale = 'hi', workerName = 'worker', farmerName = 'farmer', status = 'accepted' }) {
  const map = status === 'declined' ? 'replyDeclined' : 'replyAccepted';
  const template = messageTemplates[locale]?.[map] || messageTemplates.en[map];
  return template
    .replace('{workerName}', String(workerName))
    .replace('{farmerName}', String(farmerName));
}
