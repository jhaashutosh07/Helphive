const HelpRequest = require('../models/HelpRequest');

exports.createHelp = async (req, res) => {
  const { title, description, lat, lng } = req.body;

  try {
    const newHelp = new HelpRequest({
      title,
      description,
      requester: req.user.id,
      location: {
        type: 'Point',
        coordinates: [lng, lat]
      }
    });
    await newHelp.save();
    res.status(201).json(newHelp);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

exports.getNearbyHelp = async (req, res) => {
  const { lat, lng } = req.query;

  try {
    const helps = await HelpRequest.find({
      location: {
        $near: {
          $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: 5000 // meters
        }
      },
      status: 'open'
    }).populate('requester', 'name email');
    res.json(helps);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};
exports.acceptHelp = async (req, res) => {
  try {
    const helpRequest = await HelpRequest.findById(req.params.id);

    if (!helpRequest) {
      return res.status(404).json({ msg: 'Help request not found' });
    }

    if (helpRequest.status !== 'open') {
      return res.status(400).json({ msg: 'Help request already claimed or closed' });
    }

    helpRequest.status = 'claimed';
    helpRequest.helper = req.user.id;

    // Update helper's karma
    const User = require('../models/User');
    const helper = await User.findById(req.user.id);
    helper.karma += 10;

    await helpRequest.save();
    await helper.save();

    res.json({ msg: 'Help request accepted successfully', helpRequest });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};
