const {
  getUserConversations,
  getConversationById,
  sendMessage
} = require('./messages.service');

const { validateMessage } = require('./messages.validator');

const index = async (req, res) => {
  const conversations = await getUserConversations(req.user.id);

  return res.render('messages/conversations', {
    title: 'Mensajes',
    conversations
  });
};

const show = async (req, res) => {
  const conversation = await getConversationById({
    conversationId: req.params.id,
    userId: req.user.id
  });

  if (!conversation) {
    return res.status(404).render('errors/404', {
      title: 'Conversación no encontrada'
    });
  }

  return res.render('messages/chat', {
    title: 'Conversación',
    conversation
  });
};

const store = async (req, res) => {
  try {
    const errors = validateMessage(req.body);

    if (errors.length > 0) {
      return res.redirect(`/messages/${req.params.id}`);
    }

    await sendMessage({
      conversationId: req.params.id,
      senderId: req.user.id,
      content: req.body.content
    });

    return res.redirect(`/messages/${req.params.id}`);
  } catch (error) {
    return res.redirect('/messages');
  }
};

module.exports = {
  index,
  show,
  store
};