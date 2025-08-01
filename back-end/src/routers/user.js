const express = require('express');
const User = require('../models/user');
const verifyToken = require('../middleware/verifyToken');
const bcryptjs = require('bcryptjs');
const generateTokenAndSetCookie = require('../middleware/generateTokenAndSetCookie');
const router = express.Router();

////////////////////post users///////////////////////////////////////////////////////////////////////
router.post('/users', async (req, res) => {
    const { username, password , email } = req.body;

    try {
        if (!password || !username) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const userAlreadyExists = await User.findOne({ username });
        if (userAlreadyExists) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        const user = new User({ username, password , email});

        await user.save();

        const token = await user.generateToken();
        generateTokenAndSetCookie(res, user._id);

        res.status(201).json({
            success: true,
            message: "User created successfully",
            user: { ...user._doc, password: undefined },
            token
        });
    } catch (error) {
        console.error("Signup error:", error);
        res.status(400).json({ success: false, message: error.message });
    }
});
//////////////////// get user /////////////////////////////////////////////////////////////////////////
router.get('/users' , verifyToken ,(req, res) => {
	User.find({}).then((users) => {
		res.status(200).send(users)
	}).catch((e) => {
		res.status(500).send(e)
	})
})
//////////////get count users//////////////////////////////////  
router.get('/users/count',  verifyToken , async (req, res) => {  
	try {  
	  const users = await User.find();
	  const previousUserCount = 100;
	  const count = users.length;  
	  const diff = ((count - previousUserCount) / previousUserCount) * 100;   
	  res.status(200).json({ count, diff });  
	} catch (error) {  
	  res.status(500).json({ error: "Error fetching user count" });  
	}  
  });
/////////////////// to get by id ///////////////////////////////////////////////////////////////////////////
router.get('/users/:id',verifyToken ,(req, res) => {
//	console.log(req.params)
	const _id = req.params.id
	User.findById(_id).then((user) => {
		if (!user) {
			return res.status(404).send('Unable to find user')
		}
		res.status(200).send(user)
	}).catch((e) => {
		res.status(500).send(e)
	})
})
///////////////// patch user/////////////////////////////////////////////////////////////////////////////
router.patch('/users/:id', verifyToken ,async (req, res) => {
	try {
		const updates = Object.keys(req.body)
		const _id = req.params.id

		const user = await User.findById(_id)
		if (!user) {
			return res.status(404).send('No user is found')
		}

		updates.forEach((ele) => (user[ele] = req.body[ele]))
		await user.save()
		res.status(200).send(user)
	}
	catch (error) {
		res.status(400).send(error)
	}
})
////////////////// delete user/////////////////////////////////////////////////////////////////////////////
router.delete('/users/:id',verifyToken ,async (req, res) => {
	try {
		const _id = req.params.id
		const user = await User.findByIdAndDelete(_id)
		if (!user) {
			return res.status(404).send('Unable to find user')
		}
		res.status(200).send(user)
	}
	catch (e) {
		res.status(500).send(e)
	}
})

//////////////////login//////////////////////////////////
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        const isPasswordValid = await bcryptjs.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        const token = await user.generateToken();
        generateTokenAndSetCookie(res, user._id);

        user.lastLogin = new Date();
        await user.save();

        res.status(200).json({
            success: true,
            message: "Logged in successfully",
            user: { ...user._doc, password: undefined },
            token
        });
    } catch (error) {
        console.error("Error during login:", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
}); 
//////////////////logout///////////////////////////
router.post('/logout', async (req, res) => {
	res.clearCookie("token");
	res.status(200).json({ success: true, message: "Logged out successfully" });
}
)
//////////////checkAuth/////////////////
router.get("/check-auth", verifyToken , async (req, res) => {
	try {
		const user = await User.findById(req.userId).select("-password");
		if (!user) {
			return res.status(400).json({ success: false, message: "User not found" });
		}

		res.status(200).json({ success: true, user });
	} catch (error) {
		console.log("Error in checkAuth ", error);
		res.status(400).json({ success: false, message: error.message });
	}
});


module.exports = router 
