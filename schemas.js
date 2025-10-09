const Joi=require('joi');


module.exports.CampgroundSchema = Joi.object({
  campground: Joi.object({
    title: Joi.string().required(),
    price: Joi.number().required().min(0),
    description: Joi.string().required(),
    location: Joi.string().required(),
    image: Joi.array().items(Joi.string().uri()).min(1).optional()
  }).required()
});


    module.exports.reviewSchema=Joi.object({
       review:Joi.object({
           rating:Joi.number().required(),
           body:Joi.string().required()
       }).required()
    });
     