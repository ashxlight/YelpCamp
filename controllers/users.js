const User=require('../models/user');


module.exports.renderRegister=(req,res,next)=>{
    res.render('user/register');
}

module.exports.register=async(req,res)=>{
    try{
    const {email,username,password}=req.body;
   const user=new User({email,username});
   const registeredUser=await User.register(user,password);//if user registers then no need to login 
   req.login(registeredUser,err=>{
    if(err)
    {
        return next(err);
    }//if user registers then no need to login 
    req.flash('success','Welcome to Yelp Camp');
    res.redirect('/campgrounds');
   })
    } catch(e){
        req.flash('error',e.message)
        res.redirect('/register')
    }

}

module.exports.renderLogin=(req,res)=>{
    res.render('user/login');
}

module.exports.login=(req,res)=>{
    req.flash('success',"Welcome  back!");
    res.redirect('/campgrounds');
}

module.exports.logout=(req,res)=>{
    req.logOut(function(err)
    {
        if(err)
        {
            return next(err);
        }
        req.flash('success','Goodbye..');
        res.redirect('/campgrounds');; 
    });
    }