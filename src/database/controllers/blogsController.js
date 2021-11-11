import {validationResult} from "express-validator";
import createHttpError from "http-errors";
import { pipeline } from "stream";
import getPDFReadableStream from "../../lib/pdf-tools.js";
import axios from "axios";
import striptags from "striptags";
import sendAuthorEmail from "../../lib/email-tools.js";
import BlogModel from "../models/blogsModel.js";
import query2mongo from "query-to-mongo";

export async function getAllPosts(req,res,next) {
  try {
    console.log(query2mongo(req.query));
    const mongoQuery = query2mongo(req.query);

    const total = await BlogModel.countDocuments(mongoQuery.criteria);
    const results = await BlogModel.find(mongoQuery.criteria, {
      createdAt: 0,
      updatedAt: 0,
      __v: 0,
    })
      .limit(mongoQuery.options.limit)
      .skip(mongoQuery.options.offset)
      .sort(mongoQuery.options.sort);

    if(results.length) {
      res.send({
        ...(mongoQuery.options.limit && {links: mongoQuery.links("/blogPosts", total)}),
        ...(mongoQuery.options.limit && {pageTotal: Math.ceil(total / mongoQuery.options.limit)}),
        total: total,
        results: results,
      });
    } else {
      res.send({message: "No results found."});
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
}

export async function getPostById(req,res,next) {
  try {
    const blogPost = await BlogModel.findById(req.params.id, {
      updatedAt: 0,
      __v: 0,
    });
    if (blogPost) {
      res.send(blogPost);
    } else {
      next(
        createHttpError(404, `No blog post found with an id: ${req.params.id}`)
      );
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
}

export async function downloadPDF(req,res,next) {
  try {
    res.setHeader("Content-Disposition", `attachment; filename=Blog_${req.params.id}.pdf`);
    const blogPost = BlogModel.findById(req.params.id);
    
    if(blogPost.cover) {
     

    
      const response = await axios.get(blogPost.cover, {
        responseType: "arraybuffer",
      })
      const blogCoverURLParts = blogPost.cover.split("/");
      const fileName = blogCoverURLParts[blogCoverURLParts.length - 1];
      const extension = fileName.slice(fileName.indexOf(".")+1);
      const base64 = response.data.toString("base64");
      const base64image = `data:image/${extension};base64,${base64}`;

      blogPostImage = {image: base64image, width: 500};
    }

    const content = [
      blogPostImage,
      {text: blogPost.title, fontSize: 20, bold: true, margin: [0,0,0,40]},
      {text: striptags(blogPost.content), lineHeight: 4}, 
      {text: `Author - ${blogPost.author.name}`}, 
      {text: `Read time: ${blogPost.readTime.value} ${blogPost.readTime.unit}`},
      {text: `Date: ${blogPost.createdAt.slice(0,10)}`}
    ];

    const source = getPDFReadableStream(content);
    const destination = res;

    pipeline(source, destination, (error) => {
      if (error) {
        next(error);}
    });

  } catch (error) {
    next(error);
  }
}

export async function postBlogPost(req,res,next) {
  try {
    const errorsList = validationResult(req);
    if (!errorsList.isEmpty()) {
      console.log('Inside IF')
      next(createHttpError(400, { errorsList }));
      
    } else {
      // if there' isn't no error create the blogpost and send back to the front end
      console.log(`else`)
      
      // res.status(200).send(newBlogPost);
      const newBlogPost = new BlogModel(req.body);
      const {_id} = await newBlogPost.save();
      console.log('Line 116')
      res.status(201).send({_id});
  
    }
 
  } catch (error) {
    console.log(error);
    next(error);
  }
}

export async function getComments(req,res,next) {
  try {
    const blogPost = await BlogModel.findById(req.params.id);

    if (blogPost) {
      if(blogPost.comments.length) {
        res.send({total: blogPost.comments.length, comments: blogPost.comments});
      } else {
        res.send({message: "No comments available for blog post."});
      }
    } else {
      next(
        createHttpError(404, `No blog post found with an id:${req.params.id}`)
      );
    }
  } catch (error) {
    console.log(error);
    next(error);
  } 
}

export async function addComment(req,res,next) {
  try {
    const errorsList = validationResult(req);
    if (!errorsList.isEmpty()) {
      next(createHttpError(400, { errorsList }));
    }
    const blogPost = await BlogModel.findById(req.params.id, { _id: 0 });
    if (blogPost) {
      const commentToInsert = { ...req.body, commentDate: new Date() };

      const updatedBlogPost = await BlogModel.findByIdAndUpdate(
        req.params.id,
        { $push: { comments: commentToInsert } },
        { new: true }
      );

      if (updatedBlogPost) {
        res.send(updatedBlogPost);
      } else {
        next(createHttpError(500));
      }
      res.send();
    } else {
      next(
        createHttpError(404, `No blog post found with an id:${req.params.id}`)
      );
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
}

export async function getComment(req,res,next) {
  try {
    const blogPost = await BlogModel.findById(req.params.id);

    if(blogPost) {
      const comment = blogPost.comments.find(
        (comment) => comment._id.toString() === req.params.commentId
      );
      if (comment) {
        res.send(comment);
      } else {
        next(
          createHttpError(
            404,
            `No comment found with comment id: ${req.params.commentId}`
          )
        );
      }
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
}

export async function updateComment(req,res,next) {
  try {
    const blogPost = await BlogModel.findById(req.params.id);
    const index = blogPost.comments.findIndex(comment => comment._id.toString() === req.params.commentId);

    blogPost.comments[index] = {...blogPost.comments[index].toObject(), ...req.body};

    await blogPost.save();
    res.send(blogPost.comments[index]);
  } catch (error) {
    console.log(error);
    next(error);
  }
}


export async function deleteComment(req,res,next) {
  try {
    const modifiedBlog = await BlogModel.findByIdAndUpdate(
      req.params.id,
      {$pull: {comments: {_id: req.params.commentId}}},
      {new: true} 
    )
    if (modifiedBlog) {
      res.status(204).send();
    } else {
      next(
        createHttpError(404, `No blog post found with an id:${req.params.id}`)
      );
    }
  } catch (error) {
    console.log(error);
    next(error);
  } 
}

export async function updateBlogCover(req,res,next) {
  try {
    const imageUrl = req.file.path;
    const editedBlogPost = await BlogModel.findByIdAndUpdate(
      req.params.id,
      {cover: imageUrl},
      {new: true}
    )
    if(editedBlogPost) {
      res.status(201).send({ status: "Blog post cover uploaded successfully."});
    } else {
      next(createHttpError(400, `Blog not found by id: ${req.params.id}`));
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
}

export async function updateBlogPost(req,res,next) {
  try {
    const id = req.params.id;
    const informationToUpdate = req.body;
    const updatedUser = await BlogModel.findByIdAndUpdate(id, informationToUpdate, {new: true});

    if(updatedUser) {
      res.send(updatedUser);
    } else {
      next(createHttpError(404, `Blog post with id: ${id} not found.`));
    }
  } catch (error) {
    console.log(error);
    next(error)
  }
}

export async function deleteBlogPost(req,res,next) {
  try {
    const deletedBlogPost = await BlogModel.findByIdAndDelete(req.params.id);
    if(deletedBlogPost) {
      res.status(204).send();
    } else {
      next(createHttpError(404, "Blog post not found."))
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
}