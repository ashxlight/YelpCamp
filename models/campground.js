const mongoose=require('mongoose');
const review = require('./review');
const Schema=mongoose.Schema;

const CampGroundSchema=new Schema({
    title:String,
    price:Number,
    description:String,
    location:String,
    image:String,
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
})

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