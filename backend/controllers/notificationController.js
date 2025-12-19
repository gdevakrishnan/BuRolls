const Notification = require('../models/Notification');

exports.getUserNotifications = async (req, res) => {
  try{
    const userId = req.user?.id || req.user?._id || req.user;
    const notifications = await Notification.find({ user: userId }).sort({ createdAt: -1 }).lean();
    res.status(200).json({ notifications });
  }catch(err){ console.error(err); res.status(500).json({ msg: 'Server error' }); }
};

exports.markRead = async (req, res) => {
  try{
    const { id } = req.params;
    await Notification.findByIdAndUpdate(id, { read: true });
    res.status(200).json({ msg: 'Marked read' });
  }catch(err){ console.error(err); res.status(500).json({ msg: 'Server error' }); }
};
