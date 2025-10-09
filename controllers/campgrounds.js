const Campground = require('../models/campground');


module.exports.index=async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}

module.exports.renderNewForm=(req, res) => {
    res.render('campgrounds/new');
}

module.exports.createCampground=async (req, res,next) => {//new Campground
    
    const campground = new Campground(req.body.campground);
    campground.images= req.files.map(f=>({url:f.path,filename:f.filename}));//will add url and filename in campground->images Schema
    campground.author=req.user._id;

    await campground.save();
    console.log(campground);
    req.flash('success','Successfully made a new Campground!')
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.showCampground=async (req, res) => {//edit page
    const { id } = req.params;
    const campground = await Campground.findById(id).populate({
        path:'reviews',
        populate:{
            path:'author'
        }  
    
}).populate('author');
    if(!campground)
    {
        req.flash('error','Cannot find that Campground!');
        return res.redirect('/campgrounds');

    }

    res.render('campgrounds/show', { campground });
}

module.exports.renderEditForm=async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render('campgrounds/edit', { campground });
}

module.exports.updateCampground=async (req, res) => {
    const { id } = req.params;
    const campgroundData = req.body.campground;
    const camp=await Campground.findByIdAndUpdate(id, campgroundData, { runValidators: true });
    req.flash('success','Successfully updated campground')
    res.redirect(`/campgrounds/${id}`);
}

module.exports.deleteCampground=async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
     req.flash('success','Successfully deleted campground!');
    res.redirect('/campgrounds');
}
