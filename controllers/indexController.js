const { ObjectId } = require("mongodb");
const db = require ("../config/connection");
const jwt = require('jsonwebtoken');

const jwt_secret= "abc@#$%&123456";

const nodemailer= require('nodemailer');


const indexController = {}


indexController.ReadAdmin = async (req,res) => {
    try {
        const collection = "admindata";
        const result = await db.collection(collection).find().toArray();
        res.json({ error: false, message: "success", result:result});
    } catch (e) {
        res.json({ error: true, message:e.message });
    }
}

indexController.ReadProviders = async (req,res) => {
    try {
        const collection = "provider";
        const result = await db.collection(collection).find().toArray();
        res.json({ error: false, message: "success", result:result});
    } catch (e) {
        res.json({ error: true, message:e.message });
    }
}


indexController.DeleteProviders = async (req,res) =>{
    try {
        
        const {id} = req.params;
        // console.log(_id)
        const filter = {_id: new ObjectId(id)}
        const collection = "provider";
        const result = await db.collection(collection).deleteOne(filter);
        res.json({ error: false, message: 'Record deleted.' });
    } catch (e) {
        res.json({ error: true, message:e.message });
    }
}


indexController.ReadProvider = async (req, res) => {
    try {
      // console.log(req.body)
      const collection = "provider"
      const filter = { _id: new ObjectId(req.providerInfo.id) };
      // const result = await db.collection(collection).find().toArray()
      // console.log(filter);
      const result = await db.collection(collection).aggregate([
        {$match:filter},
        {
          $lookup: {
            from: "category",
            localField: "category",
            foreignField: "_id",
            as: "categoryInfo",
          },
        },
        {
          $unwind: { path: "$categoryInfo", preserveNullAndEmptyArrays: true },
        },
        {
          $lookup: {
           
            from: "subcategory",
            localField: "subcategory",
            foreignField: "_id",
            as: "subcategoryInfo",
          },
        },
        {
          $unwind: { path: "$subcategoryInfo", preserveNullAndEmptyArrays: true },
        },
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
            _id: 1,
            fullname: 1,
            email: 1,
            mobile: 1,
            address:1,
            SlotAmount:1,
            categoryInfo: "$categoryInfo.name",
            subcategoryInfo: "$subcategoryInfo.subcategory",
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




indexController.DeleteProvider = async (req,res) =>{
    try {
        
        const {_id} = req.params;
        console.log(_id)
        const filter = {_id: new ObjectId(_id)}
        const collection = "provider";
        const result = await db.collection(collection).deleteOne(filter);
        res.json({ error: false, message: 'Record deleted.' });
    } catch (e) {
        res.json({ error: true, message:e.message });
    }
}

indexController.AddNewAdmin = async (req,res) =>{
    try {
    
            const collection = "admindata";
            const result = await db.collection(collection).insertOne(req.body);
            res.json({ error: false, message: "success" });
        
    } catch (e) {
        res.json({ error: true, message:e.message });
    }
}

indexController.DeleteAdmin = async (req,res) =>{
    try {
        
        const {_id} = req.params;
        console.log(_id)
        const filter = {_id: new ObjectId(_id)}
        const collection = "admindata";
        const result = await db.collection(collection).deleteOne(filter);
        res.json({ error: false, message: 'Record deleted.' });
    } catch (e) {
        res.json({ error: true, message:e.message });
    }
}

// indexController.signIn = async (req,res)=>{
//     try {
//         const collection = "admindata";
//         const{email,password}=req.body;
//         const filter = {email:email,
//             password:password
//         }
//         const result = await db.collection(collection).find(filter).toArray();
//         if(result.length === 0){
//             res.json({error:true,message:"failed"});
//         }

//         const payload = {
//             id: result[0]._id,
//             email: result[0].email,
//             fullName: result[0].fullName
//         };
//             const token = jwt.sign(payload, jwt_secret, {expiresIn: '24h'});
//             console.log(token);

//             return res.json({error:false,message:"login successfully",token:token});
    
       
//     } catch (e) {
//         return res.json({error:false,message:e.message});
//     }
// }
indexController.signIn = async (req, res) => {
  try {
      const collection = "admindata";
      const { email, password } = req.body;
      const filter = { email: email, password: password };
      
      const result = await db.collection(collection).find(filter).toArray();
      
      if (result.length === 0) {
          return res.json({ error: true, message: "failed" }); // Ensure this returns and stops further execution
      }

      const payload = {
          id: result[0]._id,
          email: result[0].email,
          fullName: result[0].fullName
      };
      
      const token = jwt.sign(payload, jwt_secret, { expiresIn: '24h' });
      console.log(token);

      // Ensure this is the only response sent if everything is successful
      return res.json({ error: false, message: "login successfully", token: token });

  } catch (e) {
      // If an error occurs, send an error response and stop further execution
      return res.json({ error: true, message: e.message });
  }
};


indexController.AddCategory = async (req,res) =>{
    try {
    
            const collection = "category";
            const result = await db.collection(collection).insertOne(req.body);
            res.json({ error: false, message: "success" });
        
    } catch (e) {
        res.json({ error: true, message:e.message });
    }
}


indexController.DeleteCategory = async (req,res) =>{
    try {
        
        const {_id} = req.params;
        console.log(_id)
        const filter = {_id: new ObjectId(_id)}
        const collection = "category";
        const result = await db.collection(collection).deleteOne(filter);
        res.json({ error: false, message: 'Record deleted.' });
    } catch (e) {
        res.json({ error: true, message:e.message });
    }
}


indexController.ReadCategory = async (req,res) => {
    try {
        const collection = "category";
        const result = await db.collection(collection).find().toArray();
        res.json({ error: false, message: "success", result:result});
    } catch (e) {
        res.json({ error: true, message:e.message });
    }
}

indexController.AddNewSubCategory = async (req,res) =>{
    try {
            const document = {
                subcategory: req.body.subcategory,
                categoryId: new ObjectId(req.body.category)
            }
            const collection = "subcategory";
            const result = await db.collection(collection).insertOne(document);
            res.json({ error: false, message: "Sub-Category Added Successfully" });
        
    } catch (e) {
        res.json({ error: true, message:e.message });
    }
}


indexController.ViewSubCategory =async (req,res) => {

    try {
  
      const collections = "subcategory"
      let documents = await db.collection(collections).aggregate(
        [
          {
            $lookup : {
              from : "category",
              localField:"categoryId",
              foreignField:"_id",
              as:"categoryInfo"
  
            }
          },{
            $unwind : "$categoryInfo"
          },
          {
            $project : {
              _id:1,
              subcategory:1,
              categoryInfo:"$categoryInfo.name"
            }
          }
        ]
      ).toArray();
      res.json({ error: false, message: "Document Fetched Successfully",result:documents}); 
  
      
    } catch (error) {
  
      res.json({ error: true, message: error.message });
      
    }
    
  }

indexController.DeleteSubCategory = async (req,res) =>{
    try {
        
        const {_id} = req.params;
        console.log(_id)
        const filter = {_id: new ObjectId(_id)}
        const collection = "subcategory";
        const result = await db.collection(collection).deleteOne(filter);
        res.json({ error: false, message: 'Record deleted.' });
    } catch (e) {
        res.json({ error: true, message:e.message });
    }
}

indexController.readsubcat =async (req, res) => {
    try {
  
  
      const {_id} = req.params;
  
      const collections = "subcategory"
      let filter = {
        categoryId: new ObjectId(_id)
    }
      console.log(filter);
  
      let documents = await db.collection(collections).find(filter).toArray();
      console.log(documents);
      res.json({ error: false, message: "Document Fetched Successfully",result:documents}); 
  
      
    } catch (error) {
  
      res.json({ error: true, message: error.message });

  }
  
  }

  indexController.AddProvider = async (req,res) =>{
    try {
        const document = {
            fullname: req.body.fullname,
            email: req.body.email,
            password: req.body.password,
            mobile: req.body.mobile,
            state: new ObjectId(req.body.state),
            city: new ObjectId(req.body.city),
            category: new ObjectId(req.body.category),
            subcategory: new ObjectId(req.body.subcategory),
            status: req.body.status,
            address: req.body.address,
            starttime: req.body.start,
            endtime: req.body.end,
            SlotAmount:req.body.amount,
            otp: "00000",
              }
            const collection = "provider";
            const result = await db.collection(collection).insertOne(document);
            res.json({ error: false, message: "success" });
        
    } catch (e) {
        res.json({ error: true, message:e.message });
    }
}


indexController.ProvidersignIn = async (req,res)=>{
    try {
        const collection = "provider";
        const{email,password}=req.body;
        const filter = {email:email,
            password:password
        }
        console.log(filter)
        const result = await db.collection(collection).find(filter).toArray();
        console.log(result)
        if(result.length > 0){
            if(result[0].status === 'inactive'){
               return res.json({error:true,message:"Your account is in-active by admin"});
            }
           

        const payload = {
            id: result[0]._id,
            email: result[0].email,
            fullName: result[0].fullName
        };
            const token = jwt.sign(payload, jwt_secret, {expiresIn: '24h'});
            console.log(token);

            return res.json({error:false,message:"login successfully",token:token});
    }else{
        return res.json({error:true,message:"Invalid email or password"});
    }
    
       
    } catch (e) {
        return res.json({error:false,message:e.message});
    }
}

indexController.ProviderChangePassword = async (req, res) => {
    try {
      console.log(req.body)
      const collection = "provider"
      const filter = { _id: new ObjectId(req.providerInfo.id) };
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

  
indexController.AdminChangePassword = async (req, res) => {
  try {
    console.log(req.body)
    const collection = "admindata"
    const filter = { _id: new ObjectId(req.providerInfo.id) };
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
  

  indexController.AdminStatusUpdate = async (req, res) => {
    try {
      const filter = { _id: new ObjectId(req.params._id) }
      console.log(filter)
      const { status } = req.body; // Expecting new status in the request body
      console.log(status)
      collection = "provider"
  
      await db.collection(collection).updateOne(filter, { $set: { status: status } });
      res.json({ error: false, message:" Status updated to ${status}" });
    }
    catch (e) {
      res.json({ error: true, message: e.message });
  
    }
  
  }



indexController.AdminForgotPassword = async (req, res) => {
    try {
      const { email, otp } = req.body;
      const filter = { email: email };
      const collection = "admindata";
  
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
  
  indexController.AdminVerfiyOtp = async (req, res) => {
    try {
      const { email } = req.body;
      const otp = parseInt(req.body.otp); // Convert database OTP to string
      // console.log(typeof (otp))
      const filter = { email: email }
      const collection = 'admindata'
  
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
  
  indexController.AdminResetPassword = async (req, res) => {
    try {
      const { email, newpassword, confirmpassword } = req.body;
      const filter = { email: email }
      const collection = 'admindata'
  
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
  
//   indexController.AddState = async (req,res) =>{
//     try {
//             const filter = {name:req.body.name}
//             let document = await db.collection("state").find(filter).toArray();
//             if(document.length > 0){
//                return res.json({error:true,message:"State Already Exists"})
//             }
            

//             let result = await db.collection("state").insertOne(req.body)
//             console.log(result);
//             res.json({ error: false, messsage:"State Added Successfully"});
        
//     } catch (e) {
//         res.json({ error: true, message:e.message });
//     }
// }
indexController.AddState = async (req, res) => {
  try {
      const filter = { name: req.body.name };
      let document = await db.collection("state").find(filter).toArray();

      if (document.length > 0) {
          return res.json({ error: true, message: "State Already Exists" });
      }

      let result = await db.collection("state").insertOne(req.body);
      console.log(result);
      res.json({ error: false, message: "State Added Successfully" }); // Corrected key here

  } catch (e) {
      res.json({ error: true, message: e.message });
  }
};

  

indexController.DeleteState = async (req,res) =>{
    try {
        
        const {_id} = req.params;
        console.log(_id)
        const filter = {_id: new ObjectId(_id)}
        const collection = "state";
        const result = await db.collection(collection).deleteOne(filter);
        res.json({ error: false, message: 'Record deleted.' });
    } catch (e) {
        res.json({ error: true, message:e.message });
    }
}


indexController.ReadState = async (req,res) => {
    try {
        const collection = "state";
        const result = await db.collection(collection).find().toArray();
        res.json({ error: false, message: "success", result:result});
    } catch (e) {
        res.json({ error: true, message:e.message });
    }
}

indexController.AddCity = async (req,res) =>{
    try {
            const document = {
                city: req.body.city,
                stateId: new ObjectId(req.body.state)
            }
            const collection = "city";
            const result = await db.collection(collection).insertOne(document);
            res.json({ error: false, message: "City Added Successfully" });
        
    } catch (e) {
        res.json({ error: true, message:e.message });
    }
}

indexController.ViewCity =async (req,res) => {

    try {
  
      const collections = "city"
      let documents = await db.collection(collections).aggregate(
        [
          {
            $lookup : {
              from : "state",
              localField:"stateId",
              foreignField:"_id",
              as:"state"
  
            }
          },{
            $unwind : "$state"
          },
          {
            $project : {
              _id:1,
              city:1,
              state:"$state.name"
            }
          }
        ]
      ).toArray();
      res.json({ error: false, message: "Document Fetched Successfully",result:documents}); 
  
      
    } catch (error) {
  
      res.json({ error: true, message: error.message });
      
    }
    
  }

  indexController.DeleteCity = async (req,res) =>{
    try {
        
        const {_id} = req.params;
        console.log(_id)
        const filter = {_id: new ObjectId(_id)}
        const collection = "city";
        const result = await db.collection(collection).deleteOne(filter);
        res.json({ error: false, message: 'Record deleted.' });
    } catch (e) {
        res.json({ error: true, message:e.message });
    }
}


indexController.ReadState = async (req,res) => {
  try {
      const collection = "state";
      const result = await db.collection(collection).find().toArray();
      res.json({ error: false, message: "success", result:result});
  } catch (e) {
      res.json({ error: true, message:e.message });
  }
}

indexController.readcity =async (req, res) => {
  try {


    const {id} = req.params;

    const collections = "city"
    let filter = {
      stateId: new ObjectId(id)
  }
    console.log(filter);

    let documents = await db.collection(collections).find(filter).toArray();
    console.log(documents);
    res.json({ error: false, message: "Document Fetched Successfully",result:documents}); 

    
  } catch (error) {

    res.json({ error: true, message: error.message });

}

}

indexController.ViewParticularSubCategory =async (req,res) => {

  try {
    const { id } = req.params;
    const collections = "subcategory"
    let filter = { categoryId: new ObjectId(id) }
    let documents = await db.collection(collections).aggregate(
      [
        {$match:filter},
        {
          $lookup : {
            from : "category",
            localField:"categoryId",
            foreignField:"_id",
            as:"categoryInfo"

          }
        },{
          $unwind : "$categoryInfo"
        },
        {
          $project : {
            _id:1,
            subcategory:1,
            photo:1,
            categoryInfo:"$categoryInfo.name"
          }
        }
      ]
    ).toArray();
    res.json({ error: false, message: "Document Fetched Successfully",result:documents}); 

    
  } catch (error) {

    res.json({ error: true, message: error.message });
    
  }
  
}

indexController.ViewSingleCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const collection = "category"
    let filter = { _id: new ObjectId(id) }

    let result = await db.collection(collection).find(filter).toArray();
    // console.log(result)
    res.json({ error: false, message: 'Data fetched successfully', result: result });
  } catch (e) {
    res.json({ error: true, message: e.message });
  }
}

indexController.ViewSingleSubCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const collection = "subcategory"
    let filter = { _id: new ObjectId(id) }

    let result = await db.collection(collection).find(filter).toArray();
    // console.log(result)
    res.json({ error: false, message: 'Data fetched successfully', result: result });
  } catch (e) {
    res.json({ error: true, message: e.message });
  }
}

indexController.ViewSingleProvider = async (req, res) => {
  try {
    const { id } = req.params;
    const collection = "provider"
    let filter = { _id: new ObjectId(id) }

    let result = await db.collection(collection).find(filter).toArray();
    // console.log(result)
    res.json({ error: false, message: 'Data fetched successfully', result: result });
  } catch (e) {
    res.json({ error: true, message: e.message });
  }
}



indexController.CategoryUpdatePhoto = async (req, res) => {
  try {
    // console.log(req.files)
    const { id } = req.params;
    const filter = { _id: new ObjectId(id) };
    const { photo } = req.files;
    const dbPath = '/images/' + photo.name;
    const serverPath = 'public/images/' + photo.name;


    photo.mv(serverPath, (e) => {
      if (e) {
        return res.json({ error: true, message: e.message });
      }
      const updatepath = db.collection("category").updateOne(filter, { $set: { photo: dbPath } })
      if (e) {
        return res.json({ error: true, message: e.message });
      }

      res.json({ error: false, message: 'photo uploaded successfully' })
    })

  } catch (e) {
    res.json({ error: true, message: e.message });
  }
}


indexController.ViewParticularProvider = async (req, res) => {
  try {
    
    console.log(req.body)
    const collection = "provider"
    const filter = { 
      subcategory: new ObjectId(req.params.id) };
    // const result = await db.collection(collection).find().toArray()
    // console.log(filter);
    //  const result = await db.collection(collection).find(filter).toArray();

    const result = await db.collection(collection).aggregate([
      {$match:filter},
      {
        $lookup: {
          from: "category",
          localField: "category",
          foreignField: "_id",
          as: "categoryInfo",
        },
      },
      {
        $unwind: { path: "$categoryInfo", preserveNullAndEmptyArrays: true },
      },
      {
        $lookup: {
         
          from: "subcategory",
          localField: "subcategory",
          foreignField: "_id",
          as: "subcategoryInfo",
        },
      },
      {
        $unwind: { path: "$subcategoryInfo", preserveNullAndEmptyArrays: true },
      },
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
          fullname: 1,
          email: 1,
          mobile: 1,
          address:1,
          SlotAmount:1,
          photo:1,
          categoryInfo: "$categoryInfo.name",
          subcategoryInfo: "$subcategoryInfo.subcategory",
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

//   const { providerId, name, email, date } = req.body;
//   console.log('Request Body:', req.body);

//   const currentDate = new Date();
//   const selectedDate = new Date(date);

//   if (selectedDate - currentDate < 24 * 60 * 60 * 1000) {
//       return res.status(400).json({ error: true, message: "You cannot book a provider for the same day." });
//   }

//   try {
//       const collection = 'provider';
//       const provider = await db.collection(collection).findOne({ _id: new ObjectId(providerId) });
//       console.log('Received Provider ID:', providerId);
//       if (!provider) {
//           return res.status(404).json({ error: true, message: "Provider not found." });
//       }

//       const existingBooking = await db.collection('bookings').findOne({
//           providerId: new ObjectId(providerId),
//           date: {
//               $gte: selectedDate.setHours(0, 0, 0, 0),
//               $lt: selectedDate.setHours(23, 59, 59, 999)
//           }
//       });

//       if (existingBooking) {
//           return res.status(400).json({ error: true, message: "Provider is already booked for this date." });
//       }

//       const newBooking = {
//           providerId: new ObjectId(providerId),
//           name,
//           email,
//           date,
//       };

//       await db.collection('bookings').insertOne(newBooking);
//       res.json({ message: 'Booking successful!' });
//   } catch (error) {
//       res.json({ error: true, message: error.message });
//   }
// };





function generateHourlySlots(starttime, endtime) {
  const slots = [];
  let start = new Date(`1970-01-01T${starttime}Z`);
  const end = new Date(`1970-01-01T${endtime}Z`);

  while (start < end) {
      const nextHour = new Date(start);
      nextHour.setHours(start.getHours() + 1);

      slots.push({
          start: start.toISOString().substr(11, 8),
          end: nextHour.toISOString().substr(11, 8),
          available: true  // Initial availability set to true
      });

      start = nextHour;
  }

  return slots;
}

function markSlotAvailability(slots, bookedSlots) {
  return slots.map(slot => {
      // Check if this slot overlaps with any booked slot
      const isUnavailable = bookedSlots.some(bookedSlot =>
          (slot.start < bookedSlot.end_time && slot.end > bookedSlot.start_time) ||
          (slot.start >= bookedSlot.start_time && slot.end <= bookedSlot.end_time)
      );

      // Set availability based on overlap
      return {
          start: slot.start,
          end: slot.end,
          available: !isUnavailable
      };
    });
}

indexController.ReadAvailableSlots = async (req, res) => {
  try {
      let { serviceProviderId, bookingDate } = req.body;
      bookingDate = new Date(bookingDate).toISOString().split("T")[0]; // Ensure date is consistent

      const provider = await db.collection("provider").findOne({ _id: new ObjectId(serviceProviderId) });

      if (!provider) {
          return res.json({ error: true, message: "Provider not found" });
      }

      // Fetch bookings for the provider on the specified date
      const bookings = await db.collection("Booking").find({
          partnerId: new ObjectId(serviceProviderId),
          date: bookingDate
      }).toArray();

      // Extract booked slot IDs for further query
      const bookingIds = bookings.map(booking => booking._id);

      const bookedSlots = await db.collection("Booking-Detail").find({
          booking_id: { $in: bookingIds }
      }).toArray();

      // Generate hourly slots and mark availability based on `bookedSlots`
      const { starttime, endtime } = provider;
      const generatedSlots = generateHourlySlots(starttime, endtime);
      const availableSlots = markSlotAvailability(generatedSlots, bookedSlots);

      res.json({ error: false, message: 'Data Fetched Successfully.', slots: availableSlots });
  } catch (error) {
      console.error("Error in ReadAvailableSlots:", error);
      res.json({ error: true, message: error.message });
  }
};

indexController.AdminBookingData = async (req, res) => {
  try {
    const collection = "Booking"
    let result = await db.collection(collection)
      // find(filter).toArray();
      .aggregate([
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
            from: "Booking-Detail",  // Ensure the correct collection name
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
            bookingdetailsInfo: 1,
            category:1,
            subcategory:1,
            partnerName: "$partnerInfo.fullname",
            partnerMobile: "$partnerInfo.mobile",
            partnerEmail: "$partnerInfo.email",
            userName: "$userInfo.fullname",
            userEmail: "$userInfo.email",
            userMobile: "$userInfo.mobile",
          }
        }
      ]).toArray();

    console.log(result);  // Log the full structure of the result 
    res.json({ error: false, message: 'Data fetched successfully', result });
  }
  catch (e) {
    res.json({ error: true, message: e.message });
  }
}

indexController.PartnerBookingData = async (req, res) => {
  try {
    const collection = "Booking";
    const filter = { partnerId: new ObjectId(req.providerInfo.id) };
    console.log(filter)

    let result = await db.collection(collection)
    // find(filter).toArray();
    .aggregate([
      {$match:filter},
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
          from: "Booking-Detail",  // Ensure the correct collection name
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
          bookingdetailsInfo: 1,
          category:1,
          subcategory:1,
          partnerName: "$partnerInfo.fullname",
          partnerMobile: "$partnerInfo.mobile",
          partnerEmail: "$partnerInfo.email",
          userName: "$userInfo.fullname",
          userEmail: "$userInfo.email",
          userMobile: "$userInfo.mobile",
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

indexController.ChangeStatusCompleted = async (req, res) => {
  try {
    // console.log(req.body)
    const collection = "Booking"
    const filter = { _id: new ObjectId(req.params) };
    // console.log(filter);
    await db.collection(collection).updateOne(filter, { $set: { status: 'Completed' } })
    res.json({ error: false, message: 'Status updated successfully' });
  } catch (e) {
    res.json({ error: true, message: e.message });
  }
}

indexController.ChangeStatusCanceled = async (req, res) => {
  try {
    const bookingId = req.params.id; // Access the specific route parameter

    const filter = { _id: new ObjectId(bookingId) };
    const filter2 = { booking_id: new ObjectId(bookingId) };

    await db.collection('Booking').updateOne(filter, { $set: { status: 'Canceled' } });
    await db.collection('Booking-Detail').deleteMany(filter2);  // Ensure collection name matches exactly

    res.json({ error: false, message: 'Status updated and booking details deleted successfully' });

  } catch (e) {
    console.error("Error in ChangeStatusCanceled:", e);
    res.json({ error: true, message: e.message });
  }
}

indexController.SubCategoryUpdatePhoto = async (req, res) => {
  try {
    // console.log(req.files)
    const { id } = req.params;
    const filter = { _id: new ObjectId(id) };
    const { photo } = req.files;
    const dbPath = '/images/' + photo.name;
    const serverPath = 'public/images/' + photo.name;


    photo.mv(serverPath, (e) => {
      if (e) {
        return res.json({ error: true, message: e.message });
      }
      const updatepath = db.collection("subcategory").updateOne(filter, { $set: { photo: dbPath } })
      if (e) {
        return res.json({ error: true, message: e.message });
      }

      res.json({ error: false, message: 'photo uploaded successfully' })
    })

  } catch (e) {
    res.json({ error: true, message: e.message });
  }
}


indexController.ProviderUpdatePhoto = async (req, res) => {
  try {
    // console.log(req.files)
    const { id } = req.params;
    const filter = { _id: new ObjectId(id) };
    const { photo } = req.files;
    const dbPath = '/images/' + photo.name;
    const serverPath = 'public/images/' + photo.name;


    photo.mv(serverPath, (e) => {
      if (e) {
        return res.json({ error: true, message: e.message });
      }
      const updatepath = db.collection("provider").updateOne(filter, { $set: { photo: dbPath } })
      if (e) {
        return res.json({ error: true, message: e.message });
      }

      res.json({ error: false, message: 'photo uploaded successfully' })
    })

  } catch (e) {
    res.json({ error: true, message: e.message });
  }
}

indexController.AddContactUs = async (req, res) => {
  try {
    const collection = "Contact-us"

    await db.collection(collection).insertOne(req.body);

    res.json({ error: false, message: 'Contact-us Added Successfully', });
  } catch (e) {
    res.json({ error: true, message: e.message });
  }
}

indexController.QuestionUs = async (req, res) => {
  try {
    const collection = "Questions"

    await db.collection(collection).insertOne(req.body);

    res.json({ error: false, message: 'Contact-us Added Successfully', });
  } catch (e) {
    res.json({ error: true, message: e.message });
  }
}

indexController.ProviderForgotPassword = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const filter = { email: email };
    const collection = "provider";

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

indexController.ProviderVerfiyOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const otp = parseInt(req.body.otp); // Convert database OTP to string
    // console.log(typeof (otp))
    const filter = { email: email }
    const collection = 'provider'

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

indexController.ProviderResetPassword = async (req, res) => {
  try {
    const { email, newpassword, confirmpassword } = req.body;
    const filter = { email: email }
    const collection = 'provider'

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

module.exports = indexController;

