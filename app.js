const express = require('express');
const app = express();
const cors = require('cors');
const connDb = require ('./config/connection');
const indexController = require('./controllers/indexController');
const userController= require("./controllers/userController");
const {adminAuthMiddleware}= require("./middlewares/authMiddleware");
const {providerAuthMiddleware}= require("./middlewares/providerMiddleware");
const {userAuthMiddleware}= require("./middlewares/userMiddleware");
const fileUpload = require('express-fileupload')


app.use(cors());
app.use(express.json());
app.use(fileUpload());
app.use(express.static("public"));

    app.post("/AdminRegistration",adminAuthMiddleware,indexController.AddNewAdmin);
    app.get("/AdminRegistration",adminAuthMiddleware,indexController.ReadAdmin);
    app.delete("/AdminRegistration/:_id",adminAuthMiddleware,indexController.DeleteAdmin);
    app.post("/signin",indexController.signIn); 
    app.post("/AddCategory",indexController.AddCategory);
    app.delete("/AddCategory/:_id",indexController.DeleteCategory);
    app.get("/AddCategory",indexController.ReadCategory);
    app.post("/AddSubCategory",indexController.AddNewSubCategory);
    app.get("/AddSubCategory",indexController.ViewSubCategory);
    app.delete("/AddSubCategory/:_id",indexController.DeleteSubCategory);
    app.get("/Addprovider/:_id",indexController.readsubcat);
    app.post("/Addprovider",indexController.AddProvider);
    app.post("/providersignin",indexController.ProvidersignIn);
    app.put("/partner-change-password",providerAuthMiddleware,indexController.ProviderChangePassword);
    app.put("/admin-change-password",providerAuthMiddleware,indexController.AdminChangePassword);
    app.get("/ReadProvider",providerAuthMiddleware,indexController.ReadProvider);
    app.delete("/DeleteProvider/:_id",indexController.DeleteProvider);
    app.get("/ReadProviders",adminAuthMiddleware,indexController.ReadProviders);
    app.delete("/DeleteProviders/:id",adminAuthMiddleware,indexController.DeleteProviders);
    app.put("/provider-status/:_id", adminAuthMiddleware ,indexController.AdminStatusUpdate);
    app.post('/admin-forgot-password', indexController.AdminForgotPassword);
    app.post('/admin-verify-otp', indexController.AdminVerfiyOtp);
    app.post('/admin-reset-password', indexController.AdminResetPassword)
    app.post("/Addstate",indexController.AddState);
    app.delete("/Deletestate/:_id",indexController.DeleteState);
    app.get("/viewState",adminAuthMiddleware,indexController.ReadState);
    app.post("/AddCity",adminAuthMiddleware, indexController.AddCity);
    app.get("/viewcity",adminAuthMiddleware,indexController.ViewCity);
    app.delete("/deletecity/:_id",indexController.DeleteCity);
    app.get("/AddState",indexController.ReadState);
    app.get("/Addcity/:id",indexController.readcity);
    app.post("/UserRegistration",userController.AddNewUser);
    app.post("/userlogin",userController.userLogin);
    app.post('/user-forgot-password', userController.UserForgotPassword);
    app.post('/user-verify-otp', userController.UserVerfiyOtp);
    app.post('/user-reset-password', userController.UserResetPassword);
    app.post('/provider-forgot-password', indexController.ProviderForgotPassword);
    app.post('/provider-verify-otp', indexController.ProviderVerfiyOtp);
    app.post('/provider-reset-password', indexController.ProviderResetPassword);
    app.put("/user-change-password",userAuthMiddleware,userController.UserChangePassword);
    app.get("/view-particular-subcategory/:id",indexController.ViewParticularSubCategory);
    app.post("/category-photo-update/:id", adminAuthMiddleware, indexController.CategoryUpdatePhoto);
    app.get("/view-single-category/:id", adminAuthMiddleware, indexController.ViewSingleCategory);
    app.get("/view-single-provider/:id", providerAuthMiddleware, indexController.ViewSingleProvider);
    app.get("/view-single-subcategory/:id", adminAuthMiddleware, indexController.ViewSingleSubCategory);
    app.get("/view-particular-provider/:id",indexController.ViewParticularProvider);
    app.post('/check-available-slots', indexController.ReadAvailableSlots);
    app.post('/add-booking-details/:id', userAuthMiddleware,userController.AddBookingDetails);
    app.get('/manage-user',userAuthMiddleware, userController.ViewUser);
    app.delete('/manage-user/:_id', userAuthMiddleware, userController.DeleteUser);
    app.post('/user-manage-photo', userAuthMiddleware, userController.UpdatePhoto);
    app.put('/manage-user', userAuthMiddleware, userController.EditInfoUser);
    app.get('/admin-booking-data', indexController.AdminBookingData);
    app.get('/partner-booking-data', providerAuthMiddleware, indexController.PartnerBookingData);
    app.put('/change-status-complete/:id', providerAuthMiddleware, indexController.ChangeStatusCompleted);
    app.put('/change-status-cancle/:id', providerAuthMiddleware, indexController.ChangeStatusCanceled);
    app.get('/user-booking-data', userAuthMiddleware, userController.UserBookingData);
    app.post("/sub-category-photo-update/:id", adminAuthMiddleware, indexController.SubCategoryUpdatePhoto);
    app.post("/provider-photo-update/:id", providerAuthMiddleware, indexController.ProviderUpdatePhoto);
    app.post('/user-add-review', userAuthMiddleware, userController.UserAddReview);
    app.post('/add-contant-us', indexController.AddContactUs);
    app.post('/add-question-us', indexController.QuestionUs);




const port = 5000; // Define the port the server will listen on

// Start the server and listen on the specified port
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
