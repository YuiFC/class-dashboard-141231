const User = require('../models/User');

exports.getMe = async(req, res) =>{

    try{
        const user = await User.findById(req.user.id).select('-password');
        if(!user){
            return res.status(404).json({message: '用户不存在'});
        }
        res.status(200).json(user);
    }catch(error){
        console.error('获取用户信息失败:', error);
        res.status(500).json({message: '服务器错误'});
    }
};