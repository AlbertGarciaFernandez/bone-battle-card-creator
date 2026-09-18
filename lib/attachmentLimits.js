export const MAX_EMAIL_IMAGE_BYTES = 4 * 1024 * 1024;
export const MAX_EMAIL_ATTACHMENTS_BYTES = 8 * 1024 * 1024;

export const addAttachmentBytes = (currentTotal, bytesToAdd, maxTotal = MAX_EMAIL_ATTACHMENTS_BYTES) => {
  const total = currentTotal + bytesToAdd;
  return {
    total,
    error: total > maxTotal ? 'Attachments exceed the total size limit.' : null,
  };
};
