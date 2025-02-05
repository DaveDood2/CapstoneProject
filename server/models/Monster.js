// Best practices for models:
// Name files a singular noun, PascalCase
import mongoose from "mongoose";

const monsterScheme = new mongoose.Schema({
  name0: {
    type: String,
    required: true,
    validate: /^[A-Za-z0-9! ]*$/
  },
  word0: {
    type: String,
    required: true,
    validate: /^[A-Za-z-]*$/
  },
  name1: {
    type: String,
    validate: /^[A-Za-z0-9! ]*$/
  },
  word1: {
    type: String,
    validate: /^[A-Za-z-]*$/
  },
  name2: {
    type: String,
    validate: /^[A-Za-z0-9! ]*$/
  },
  word2: {
    type: String,
    validate: /^[A-Za-z-]*$/
  },
  canvas: {
    type: Object,
    required: true
    // validate: /^[01]*$/
    // validate: {
    //   validator: function(canvas) {
    //     return true;
    //   },
    //   message: "Canvas is invalid!"
    // }
  },
  width: {
    type: Number,
    required: true,
    validate: {
      validator: function(width) {
        return width > 0 && Number.isInteger(width);
      }
    }
  },
  height: {
    type: Number,
    required: true,
    validate: {
      validator: function(height) {
        return height > 0 && Number.isInteger(height);
      }
    }
  },
  progress: {
    type: Number,
    required: true,
    validate: {
      validator: function(v) {
        if (v in [0, 1, 2] === false) {
          return false;
        }
        // if (v >= 1){
        //   if (!name1 || !word1){
        //     return false;
        //   }
        // }
        // if (v >= 2){
        //   if (!name1 || !word1){
        //     return false;
        //   }
        // }
        return true;
      },
      message: "{VALUE} is not a valid progress amount!"
    }
  }
});

const Monster = mongoose.model("Monster", monsterScheme);

export default Monster;
