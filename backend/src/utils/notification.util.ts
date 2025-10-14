export const sendNotification = (recipientId: string | undefined, message: string) => {
  // placeholder: in real system, hook email/SMS/push services
  if (!recipientId) return;
  console.log(`Notify ${recipientId}: ${message}`);
};
