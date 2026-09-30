import { describe, it, expect, vi } from 'vitest';
import { buildRequestMessage, buildReplyMessage } from '../services/messageTemplates.js';
import { sendNotification, setNotifier } from '../services/notifier.js';

describe('message templates and notifier', () => {
  it('builds a Hindi request message', () => {
    const message = buildRequestMessage({
      locale: 'hi',
      workerName: 'Mohan',
      farmerName: 'Ram',
      message: 'आज सुबह 6 बजे'
    });

    expect(message).toContain('Mohan');
    expect(message).toContain('Ram');
    expect(message).toContain('आज सुबह 6 बजे');
  });

  it('builds an English reply message', () => {
    const message = buildReplyMessage({
      locale: 'en',
      workerName: 'Mohan',
      farmerName: 'Ram',
      status: 'accepted'
    });

    expect(message).toContain('Mohan');
    expect(message).toContain('Ram');
    expect(message).toContain('accepted');
  });

  it('uses a replaceable notifier', async () => {
    const notifier = vi.fn(async ({ message }) => ({
      delivered: true,
      message
    }));

    setNotifier(notifier);

    const result = await sendNotification({
      to: '9876543210',
      message: 'hello'
    });

    expect(notifier).toHaveBeenCalledTimes(1);
    expect(result).toMatchObject({ delivered: true, message: 'hello' });

    setNotifier();
  });
});
