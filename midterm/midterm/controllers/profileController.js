const Profile = require('../models/Profile');
const User = require('../models/User');

exports.getProfile = async (req, res) => {
  const profileId = req.params.id;

  try {
    const profile = await Profile.findById(profileId);

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateProfile = async (req, res) => {
  const profileId = req.params.id;
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);

    if (user.profileId.toString() !== profileId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const updatedProfile = await Profile.findByIdAndUpdate(profileId, req.body, { new: true });

    res.status(200).json(updatedProfile);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
