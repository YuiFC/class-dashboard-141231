// server/controllers/postController.js
const Post = require('../models/Post');
const User = require('../models/User'); // 导入User，可能用于populate
const Comment = require('../models/Comment');


// 1. 创建一个新帖子 (受保护的)
exports.createPost = async (req, res) => {
  try {
    const { title, content } = req.body;

    // req.user.id 来自哪里？ 
    // 来自我们的 auth “门卫”中间件！
    const newPost = new Post({
      title: title,
      content: content,
      author: req.user.id // 将帖子的作者设置为当前登录的用户
    });

    const savedPost = await newPost.save();
    res.status(201).json(savedPost); // 201 Created

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: '服务器内部错误' });
  }
};

// 2. 获取所有帖子 (公开的)
exports.getAllPosts = async (req, res) => {
  try {
    // .populate('author', 'name') 是一个强大的功能
    // 它会查找 author 字段的 id，
    // 然后去 User 集合中把这个作者的信息抓取出来，
    // 并且只返回 'name' 字段 (我们不希望泄露邮箱或密码)
    const posts = await Post.find()
      .populate('author', 'name')
      .sort({ createdAt: -1 }); // 按创建时间倒序排列 (最新的在最前面)
      
    res.status(200).json(posts);

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: '服务器内部错误' });
  }
};

exports.getPostById = async (req, res) => {
    try{
        const postId = req.params.id;
        const post = await Post.findById(postId)

        if(!post){
            return res.status(404).json({message: '帖子不存在'});
        }
        
        const comments = await Comment.find({post: postId})
        .populate('author', 'name')
        .sort({createdAt: 'asc'});

        res.status(200).json({
            post: post,
            comments: comments
        });

    }catch(error){
        console.error(error.message);
        if(error.kind === 'ObjectId'){
            return res.status(404).json({message: '帖子不存在'});
        }
        res.status(500).json({ message: '服务器内部错误' });
    }
};