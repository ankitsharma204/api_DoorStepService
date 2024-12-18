const { ObjectId } = require("mongodb");
const db = require ("../config/connection");
const jwt = require('jsonwebtoken');

const jwt_secret= "abc@#$%&123456";

const nodemailer= require('nodemailer');

const userController = {}

// userController.AddNewUser = async (req, res) => {
//     try {
//         const collection = "userdata";
//         const email = req.body.email; // Assuming the email is passed in the request body

//         // Check if an user with the same email already exists
//         const existingUser = await db.collection(collection).findOne({ email: email });

//         if (existingUser) {
//             return res.json({ error: true, message: "User with this email already exists." });
//         }

//         // Proceed to create the new user
//         const result = await db.collection(collection).insertOne(req.body);
//         res.json({ error: false, message: "User created successfully." });

//     } catch (e) {
//         res.json({ error: true, message: e.message });
//     }
// }
userController.AddNewUser = async (req, res) => {
  try {
    const collection = "userdata"
    const { email } = req.body;
    const filter = { email: email };
    const document = {
      fullName: req.body.fullname,
      email: email,
      password: req.body.password,
      mobile: req.body.mobile,
      state: new ObjectId(req.body.state),
      city: new ObjectId(req.body.city),
      // pincode: req.body.pincode,
      address: req.body.address
    }
    console.log(document)
    const result = await db.collection(collection).find(filter).toArray();
    if (result.length > 0) {
      res.json({ error: true, message: 'Email Already Exists' });
    } else {
      await db.collection(collection).insertOne(document);
      res.json({ error: false, message: 'User Register Successfully' });

    }
  } catch (e) {
    res.json({ error: true, message: e.message });
  }
}



userController.userLogin = async (req,res)=>{
    try {
        const collection = "userdata";
        const{email,password}=req.body;
        const filter = {email:email,
            password:password
        }
        const result = await db.collection(collection).find(filter).toArray();
        if(result.length === 0){
            res.json({error:true,message:"failed"});
        }

        const payload = {
            id: result[0]._id,
            email: result[0].email,
            fullName: result[0].fullname
        };
            const token = jwt.sign(payload, jwt_secret, {expiresIn: '24h'});
            console.log(token);

            return res.json({error:false,message:"login successfully",token:token});
    
       
    } catch (e) {
        return res.json({error:false,message:e.message});
    }
}



userController.UserForgotPassword = async (req, res) => {
    try {
      const { email, otp } = req.body;
      const filter = { email: email };
      const collection = "userdata";
  
      const result = await db.collection(collection).find(filter).toArray();
  
      if (result.length > 0) {
        // Update the OTP in the database
        await db.collection(collection).updateOne(filter, { $set: { otp: otp, otpExpiresAt: new Date(Date.now() + 10 * 60 * 1000) } });
  
        // Setup the transporter for sending emails
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: 'ankitsharma204q@gmail.com',
            pass: 'xjwxemuyxwjsgbpo',  // Gmail app password (not the actual account password)
          },
        });
  
        // Email options
        const mailOptions = {
          from: 'ankitsharma204q@gmail.com',  // Sender address
          to: email,                    // Receiver's email address
          subject: 'OTP Verify',        // Subject of the email
          text: `Your OTP is: ${otp}`,  // Email body
        };
  
        // Send the email
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            // Return error if sending email fails
            return res.json({ error: true, message: error.message });
          }
  
          // Return success response when email is sent successfully
          return res.json({ error: false, message: 'OTP sent successfully', info: info.response });
        });
  
        // Important: Prevent further response after email sending
        return;
      }
  
      // If no user is found with the provided email
      return res.json({ error: true, message: 'Invalid Email' });
    } catch (e) {
      // Handle any other errors
      return res.json({ error: true, message: e.message });
    }
  }
  
userController.UserVerfiyOtp = async (req, res) => {
    try {
      const { email } = req.body;
      const otp = parseInt(req.body.otp); // Convert database OTP to string
      // console.log(typeof (otp))
      const filter = { email: email }
      const collection = 'userdata'
  
      const result = await db.collection(collection).find(filter).toArray();
      // console.log(typeof (result[0].otp))
      if (result.length > 0) {
        if (new Date() > result[0].otpExpiresAt) {
          return res.json({ error: true, message: 'OTP expired' })
        }
        if (result[0].otp === otp) {
          res.json({ error: false, message: 'OTP verify successfully' })
        } else {
          res.json({ error: true, message: 'Invalid OTP ' })
        }
      } else {
        res.json({ error: true, message: 'Invalid Email' })
      }
    } catch (error) {
      res.json({ error: true, message: error.message });
    }
  }
  
  userController.UserResetPassword = async (req, res) => {
    try {
      const { email, newpassword, confirmpassword } = req.body;
      const filter = { email: email }
      const collection = 'userdata'
  
      if (newpassword === confirmpassword) {
        await db.collection(collection).updateOne(filter, { $set: { password: newpassword } });
        await db.collection(collection).updateOne(filter, { $set: { otp: "", otpExpiresAt: "" } });
        res.json({ error: false, message: 'Password Updated successfully' });
      } else {
        res.json({ error: true, message: 'Confirm Password not matched' })
      }
    } catch (error) {
      res.json({ error: true, message: error.message });
    }
  }

  userController.UserChangePassword = async (req, res) => {
    try {
      console.log(req.body)
      const collection = "userdata"
      const filter = { _id: new ObjectId(req.userInfo.id) };
      console.log(filter);
      const result = await db.collection(collection).find(filter).toArray();
      // console.log(result[0].password);
      if (result[0].password !== req.body.currentpassword) {
        res.json({ error: true, message: 'Incorrect current password ' });
      } else {
        if (req.body.password !== req.body.confirmpassword) {
          res.json({ error: true, message: 'New Password & confirm password not same' });
        } else {
          await db.collection(collection).updateOne(filter, { $set: { password: req.body.password } })
          res.json({ error: false, message: 'Password updated successfully' });
        }
      }
    } catch (e) {
      res.json({ error: true, message: e.message });
    }
  }


//     const { date, email, mobile, state, city, pincode, address, slots, totalPrice } = req.body;
  
//     // Validate that slots were selected
//     if (!slots || slots.length === 0) {
//       return res.json({ error: true, message: "No slots selected. Please select at least one slot." });
//     }
  
//     const { id } = req.params;
//     const filter2 = { _id1: new ObjectId(id) };
//     const filter = { _id: new ObjectId(req.userInfo.id) };
  
//     try {
//       // Flatten start and end times from the selected slots
//       const start_time = slots.map(slot => slot.start);
//       const end_time = slots.map(slot => slot.end);
  
//       // Create the main booking document
//       const bookingData = {
//         date,
//         email,
//         mobile,
//         state,
//         city,
//         pincode,
//         address,
//         total: totalPrice,
//         userId: filter._id,
//         partnerId: filter2._id1,
//         status: 'Confirmed'
  
//       };
  
//       // Insert main booking data
//       const result = await db.collection("Booking").insertOne(bookingData);
  
  
//       const slotData = slots.map((slot) => ({
//         start_time: slot.start,
//         end_time: slot.end,
//         booking_id: result.insertedId, // Use the insertedId from the first result 
  
//       }));
  
//       await db.collection("Booking-Detail").insertMany(slotData);
  
//       res.json({ error: false, message: "Booking saved successfully." });
//     } catch (error) {
//       console.error("Error saving booking:", error);
//       res.json({ error: true, message: "Failed to save booking." });
//     }
//   } 
  
  userController.ViewUser = async (req, res) => {
    try {
      
      // console.log(req.body)
      const collection = "userdata"
      const filter = { 
        _id: new ObjectId(req.userInfo.id) };
      // const result = await db.collection(collection).find().toArray()
      // console.log(filter);
      //  const result = await db.collection(collection).find(filter).toArray();
  
      const result = await db.collection(collection).aggregate([
        {$match:filter},
        {
          $lookup: {
            from: "state",
            localField: "state",
            foreignField: "_id",
            as: "stateInfo",
          },
        },
        {
          $unwind: { path: "$stateInfo", preserveNullAndEmptyArrays: true },
        },
        {
          $lookup: {
            from: "city",
            localField: "city",
            foreignField: "_id",
            as: "cityInfo",
          },
        },
        {
          $unwind: { path: "$cityInfo", preserveNullAndEmptyArrays: true },
        },
        {
          $project: {
            fullName: 1,
            email: 1,
            mobile: 1,
            address:1,
            photo:1,
            stateInfo: "$stateInfo.name",
            cityInfo: "$cityInfo.city",
          },
        },
    ]).toArray();
    console.log(result);
    res.json({ error: false, message: 'Data fetched successfully', result: result });
    } catch (e) {
      res.json({ error: true, message: e.message });
    }
  }


userController.AddBookingDetails = async (req, res) => {
  const { date, email, mobile, state, city, address, slots, totalPrice, category, subcategory } = req.body;

  // Validate that slots were selected and are correctly structured
  if (!slots || slots.length === 0 || !slots.every(slot => slot.start && slot.end && slot.selected)) {
    return res.json({ error: true, message: "Invalid or no slots selected. Please select valid slots." });
  }

  const { id } = req.params;
  const filter2 = { _id1: new ObjectId(id) };
  const filter = { _id: new ObjectId(req.userInfo.id) };

  try {
    // Create the main booking document
    const bookingData = {
      date,
      email,
      mobile,
      state,
      city,
      address,
      total: totalPrice,
      userId: filter._id,
      partnerId: filter2._id1,
      status: 'Confirmed',
      category,
      subcategory,
    };

    // Insert main booking data
    const result = await db.collection("Booking").insertOne(bookingData);

    // Filter out unselected slots
    const selectedSlotData = slots
      .filter(slot => slot.selected) // Only keep selected slots
      .map(slot => ({
        start_time: slot.start,
        end_time: slot.end,
        booking_id: result.insertedId,
      }));

    // Insert only selected slots
    await db.collection("Booking-Detail").insertMany(selectedSlotData);

    res.json({ error: false, message: "Booking saved successfully." });
  } catch (error) {
    console.error("Error saving booking:", error);
    res.json({ error: true, message: "Failed to save booking." });
  }
}

userController.UserBookingData = async (req, res) => {
  try {
    const collection = "Booking";
    const filter = { userId: new ObjectId(req.userInfo.id) };

    let result = await db.collection(collection)
    // .find(filter).toArray()
    .aggregate([
      {
        $match: filter
      },
      {
        $lookup: {
          from: "userdata",
          localField: "userId",
          foreignField: "_id",
          as: "userInfo"
        }
      },
      { $unwind: "$userInfo" },
      {
        $lookup: {
          from: "provider",
          localField: "partnerId",
          foreignField: "_id",
          as: "partnerInfo"
        }
      },
      { $unwind: "$partnerInfo" },
      {
        $lookup: {
          from: "Booking-Detail",
          let: { bookingId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$booking_id", "$$bookingId"] }
              }
            }
          ],
          as: "bookingdetailsInfo"
        }
      },
      {
        $project: {
          total: 1,
          date: 1,
          mobile: 1,
          email: 1,
          state: 1,
          city: 1,
          pincode: 1,
          address: 1,
          status: 1,
          category: 1, 
          subcategory: 1,
          bookingdetailsInfo: 1,
          partnerName: "$partnerInfo.fullname",
          partnerMobile: "$partnerInfo.mobile",
          partnerEmail: "$partnerInfo.email",
          userName: "$userInfo.fullName",
          userEmail: "$userInfo.email",
          userMobile: "$userInfo.mobile",
          // subcategoryPhoto: "$subcategoryInfo.photo",
        }
      }
    ]).toArray();

    console.log(result);
    res.json({ error: false, message: 'Data fetched successfully', result });
  } catch (e) {
    console.error("Error fetching partner booking data:", e);  // Log error details
    res.json({ error: true, message: e.message });
  }
};

userController.DeleteUser = async (req, res) => {
  try {
    // const collection ="student" 
    const filter = { _id: new ObjectId(req.params._id) }
    // console.log(filter)
    collection = "userdata"
    let document = await db.collection(collection).deleteOne(filter);

    res.json({ error: false, message: "User deleted Successful" });


  }
  catch (e) {
    res.json({ error: true, message: e.message });

  }

}

userController.UpdatePhoto = async (req, res) => {
  try {
    // console.log(req.files)
    const filter = { _id: new ObjectId(req.userInfo.id) };
    const { photo } = req.files;
    const dbPath = '/images/' + photo.name;
    const serverPath = 'public/images/' + photo.name;


    photo.mv(serverPath, (e) => {
      if (e) {
        return res.json({ error: true, message: e.message });
      }
      const updatepath = db.collection("userdata").updateOne(filter, { $set: { photo: dbPath } })
      if (e) {
        return res.json({ error: true, message: e.message });
      }

      res.json({ error: false, message: 'photo uploaded successfully' })
    })

  } catch (e) {
    res.json({ error: true, message: e.message });
  }
}

userController.EditInfoUser = async (req, res) => {
  try {
    // console.log(req.body)
    const collection = "userdata"
    const filter = { _id: new ObjectId(req.userInfo.id) }
    // console.log(req.adminInfo.id)
    // console.log(filter)
    const document = {
      fullName: req.body.fullName,
      email: req.body.email,
      mobile: req.body.mobile,
      address: req.body.address
    }
    const result = await db.collection(collection).updateOne(filter, { $set: document });
    // console.log(result);
    res.json({ error: false, message: 'Info updated successfully', result: result });
  } catch (e) {
    res.json({ error: true, message: e.message });
  }
}

userController.UserAddReview = async (req, res) => {
  try {
    const collection = "Review"
    const document = {
      partnerId: new ObjectId(req.body.selectedPartnerId),
      userId: new ObjectId(req.body.selectedUserId),
      star: req.body.currentValue,
      comment: req.body.reviewText,
      date: new Date().toISOString().split('T')[0],
    }
    console.log(document)
    await db.collection(collection).insertOne(document);
    res.json({ error: false, message: 'Review added successfully' })
  } catch (e) {
    res.json({ error: true, message: e.message });
  }
}


module.exports = userController;