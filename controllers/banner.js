const Banners = require('../model/bannerSchema');
const { bannerValidationSchema } = require('../validation/bannerValidation'); // Import the validation schema

// POST: Upload a banner based on the type
exports.uploadBanner = async (req, res) => {
  const { bannerType } = req.body; // Expecting 'spotlightBanners', 'topPlansBanners', or 'bestOffersBanners'
  
  // Validate banner type
  if (!['spotlightBanners', 'topPlansBanners', 'bestOffersBanners'].includes(bannerType)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid banner type. Valid types are spotlight, topPlans, and bestOffers'
    });
  }

  // Validate request body (without image)
  const { error } = bannerValidationSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      error: error.details[0].message
    });
  }

  try {
    // Check if the image file is uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Image is required'
      });
    }

    // Determine the banner field to update
    const bannerField = `${bannerType}`;
    const imagePath = `${process.env.host_name}/banners/${req.file.filename}`; // Include host name for full path

    // Create a new banner instance
    const newBanner = new Banners({
      [bannerField]: imagePath
    });

    // Save the new banner document
    const savedBanner = await newBanner.save();

    res.status(201).json({
      success: true,
      message: `${bannerType} banner uploaded successfully`,
      data: savedBanner
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to upload banner',
      error: error.message
    });
  }
};


// Controller for getting banner data
exports.getBanners = async (req, res) => {
    try {
      // Fetch all banner documents
      const banners = await Banners.find().select('spotlightBanners topPlansBanners bestOffersBanners -_id');
  
      // Check if banners exist
      if (banners.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'No banners found'
        });
      }
  
      // Return the relevant banner sections
      res.status(200).json({
        success: true,
        data: banners
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch banners',
        error: error.message
      });
    }
  };
  
  

  
