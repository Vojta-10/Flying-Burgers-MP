const { BadRequestError, UnauthenticatedError } = require('../err');
const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const axios = require('axios');

const updateAddress = async (req, res) => {
  const { streetNo, postCity } = req.body;
  const houseNumber = streetNo.split(' ').at(-1);
  const postalCode = postCity.split(' ')[0];

  if (!streetNo || !postCity) {
    throw new BadRequestError('Fields cannot be empty');
  }

  if (!/^\d+$/.test(houseNumber)) {
    throw new BadRequestError('House number must be a number');
  }

  if (!/^\d+$/.test(postalCode)) {
    throw new BadRequestError('Post code must be a number');
  }

  if (postalCode.length !== 5) {
    throw new BadRequestError('Postal code must be 5 numbers');
  }

  const { userId } = req.user;

  const fullAddress = `${streetNo}, ${postCity}`;

  const mapboxToken = process.env.MAPBOX_TOKEN;

  const mapboxRes = await axios.get(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
      fullAddress
    )}.json`,
    {
      params: {
        access_token: mapboxToken,
        types: 'address',
        country: 'cz',
      },
    }
  );
  1;
  console.log(mapboxRes.data.features);

  if (
    mapboxRes.data.features.length === 0 ||
    mapboxRes.data.features[0].relevance < 0.9
  ) {
    throw new BadRequestError('Address could not be validated');
  }

  const user = await User.findOneAndUpdate(
    {
      _id: userId,
    },
    { address: fullAddress },
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(StatusCodes.OK).json({ msg: 'Address updated', user: user });
};

const getCurrentUser = async (req, res) => {
  const user = await User.findById(req.user.userId).select('-password');

  if (!user) {
    return res.status(StatusCodes.NOT_FOUND).json({ msg: 'User not found' });
  }

  res.status(StatusCodes.OK).json({ user });
};

module.exports = { updateAddress, getCurrentUser };
