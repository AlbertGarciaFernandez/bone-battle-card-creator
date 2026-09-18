export const buildEmailDiagnostics = ({ resendData, to, attachments }) => ({
  id: resendData?.id ?? null,
  to,
  attachments: attachments.map((attachment) => ({
    filename: attachment.filename,
    bytes: typeof attachment.content === 'string'
      ? Buffer.byteLength(attachment.content)
      : attachment.content.length,
  })),
});
