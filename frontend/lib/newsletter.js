export const subscribeToNewsletter = async (email, name) => {
  const formData = new window.FormData();
  formData.set('name', name);
  formData.set('email', email);
  formData.set('l', process.env.newsletter.listId);
  const response = await window.fetch(`${process.env.newsletter.listmonkUrl}/subscription/form`, {
    method: 'POST',
    body: formData,
  });

  return response.ok;
};

export default { subscribeToNewsletter };
