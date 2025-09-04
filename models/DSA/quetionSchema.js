
const mongoose = require("mongoose");
const { type } = require("os");


const QuetionSchema = new mongoose.Schema(
    {
        questionType: {
            type: String,
            required: true,
        },   
        title: {
            type:String,
            required:true
        },            
        description: {
            type:String,
            required:true
        },  
        difficulty:{
            type:String,
            required:true
        },     
        tags: [String],         
        createdAt: Date,         
        // createdBy: ObjectId,      

        // MCQ Fields
        options: [String],         
        correctAnswer: Number,     

        // Coding Fields
        inputFormat:{
            type:String,
 
        },       
        outputFormat: {
            type:String,

        },    
        constraints: {
            type:String,

        },       
        testCases: [{
            input: String,          
            output: String,       
        }],
        timeLimit: {
            type:Number,

        },        
        memoryLimit: {
            type:Number,

        },       
        solution:{
            type: String,          
 
        }        
    }
)

module.exports=mongoose.model("Question",QuetionSchema);