const mongoose=require('mongoose');
const review = require('./review');
const Schema=mongoose.Schema;


const ImageSchema=new Schema({
     url:String,
     filename:String

})
//cloudinary thumbnail property to make images short
ImageSchema.virtual('thumbnail').get(function(){
   return this.url.replace('/upload/w_200')
})


const opts = { toJSON: { virtuals: true } };



const CampGroundSchema=new Schema({
    title:String,
    price:Number,
    description:String,
    location:String,
    image:[ImageSchema],

     geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },

    author:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:'Review'
        }
    ]
}, opts);// ← ← ← CHANGE THIS LINE!

CampGroundSchema.virtual('properties.popUpMarkup').get(function () {
    return `
    <strong><a href="/campgrounds/${this._id}">${this.title}</a></strong>
    <p>${this.description.substring(0, 20)}...</p>`
});

CampGroundSchema.post('findOneAndDelete',async function(doc)
{
   if(doc)
   {
    console.log(doc);
     await review.deleteMany({
        _id:{
            $in: doc.reviews
        }
     })
   }
})

module.exports=mongoose.model('Campground',CampGroundSchema);