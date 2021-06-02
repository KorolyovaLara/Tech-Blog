const router = require("express").Router();
const { Post, User, Comment } = require("../models");
const withAuth = require("../utils/auth");

// Dashboard isdisplaying posts created by 1 logged in Users

// Get all post by User
router.get("/dashboard", withAuth, async (req, res) => {
  try {
    const postData = await Post.findAll({
      where: {
        user_id: req.session.user_id,
      },
      attributes: ["id", "title", "post_text", "date_created", "user_id"],
      include: [
        {
          model: Comment,
          attributes: [
            "id",
            "comment_text",
            "date_created",
            "user_id",
            "post_id",
          ],
          include: {
            model: User,
            attributes: ["username"],
          },
        },
        {
          model: User,
          attributes: ["username"],
        },
      ],
    });

    const posts = postData.map((post) => post.get({ plain: true }));

    res.render("dashboard", {
      posts,
      loggedIn: req.session.loggedIn,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Edit a post
router.get("/edit/:id", withAuth, (req, res) => {
  try {
    const userPost = await Post.findOne({
      where: {
        id: req.params.id,
      },
      attributes: ["id", "title", "post_text", "date_created", "user_id"],
      include: [
        {
          model: Comment,
          attributes: [
            "id",
            "comment_text",
            "date_created",
            "user_id",
            "post_id",
          ],
          include: {
            model: User,
            attributes: ["username"],
          },
        },
        {
          model: User,
          attributes: ["username"],
        },
      ],
    });

    const post = userPost.get({ plain: true });

    res.render("edit-posts", {
      ...post,
      loggedIn: true,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Create new post
router.get("/new-post", (req, res) => {
  res.render("create-post", {
    loggedIn: true,
  });
});

module.exports = router;
