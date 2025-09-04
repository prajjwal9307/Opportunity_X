const Joi = require('joi');
const placementDriveSchema = Joi.object({
    companyname: Joi.string().min(2).max(100).required(),
    companydetail: Joi.string().min(10).required(),
    jobrole: Joi.string().min(2).required(),
    eligibility: Joi.string().required(),
    applicationdeadline: Joi.date().greater('now').required(),
    package: Joi.number().positive().required(),
    processofround: Joi.string().required(),
    drivedate: Joi.date().required(),
    venue: Joi.string().required(),
    skills: Joi.string().required(),
});




const applicationSchema = Joi.object({
    fullName: Joi.string().required().min(3).max(50)
        .messages({
            'string.empty': 'Full name is required',
            'string.min': 'Full name must be at least 3 characters',
            'string.max': 'Full name must be less than 50 characters'
        }),
    universityId: Joi.string().required().pattern(/^[A-Za-z0-9]+$/)
        .messages({
            'string.empty': 'University ID is required',
            'string.pattern.base': 'University ID must be alphanumeric'
        }),
    email: Joi.string().required().email().lowercase().trim()
        .messages({
            'string.email': 'Valid email is required',
            'string.empty': 'Email is required'
        }),
    phone: Joi.string().required().pattern(/^[0-9]{10}$/)
        .messages({
            'string.empty': 'Phone number is required',
            'string.pattern.base': 'Valid 10-digit phone number is required'
        }),
    degreeProgram: Joi.string().required().valid('B.Tech', 'B.E', 'MCA', 'M.Tech', 'Other')
        .messages({
            'any.only': 'Select a valid degree program',
            'string.empty': 'Degree program is required'
        }),
    branch: Joi.string().required().trim()
        .messages({
            'string.empty': 'Branch is required'
        }),
    cgpa: Joi.number().required().min(0).max(10)
        .messages({
            'number.base': 'CGPA must be a number',
            'number.min': 'CGPA must be at least 0',
            'number.max': 'CGPA must be at most 10',
            'any.required': 'CGPA is required'
        }),
    activeBacklogs: Joi.number().integer().min(0).default(0)
        .messages({
            'number.base': 'Active backlogs must be a number',
            'number.integer': 'Active backlogs must be an integer',
            'number.min': 'Active backlogs cannot be negative'
        }),
    passingYear: Joi.number().integer().min(new Date().getFullYear())
        .messages({
            'number.base': 'Passing year must be a number',
            'number.min': 'Passing year must be current or future year',
            'any.required': 'Passing year is required'
        }),
    technicalSkills: Joi.string().required().min(2).max(500)
        .messages({
            'string.empty': 'Technical skills are required',
            'string.min': 'Technical skills must be at least 2 characters',
            'string.max': 'Technical skills must be at most 500 characters'
        }),
    certifications: Joi.string().allow('').max(500)
        .messages({
            'string.max': 'Certifications must be at most 500 characters'
        }),
    declaration: Joi.boolean().valid(true).required()
        .messages({
            'any.only': 'You must accept the declaration',
            'any.required': 'Declaration is required'
        })
});



// Interview Experiance

// Validation for individual rounds
const roundSchema = Joi.object({
  roundType: Joi.string().valid('Online Assessment', 'Technical', 'HR', 'Coding Test', 'System Design').required(),
  duration: Joi.string(),
  questions: Joi.array().items(
    Joi.object({
      questionText: Joi.string().required()
    })
  ),
  experience: Joi.string().allow('')
});

// Main Interview Experience validation
const interviewExperienceSchema = Joi.object({
  company: Joi.string().required(),
  role: Joi.string().required(),
  jobType: Joi.string().valid('Full-time', 'Internship', 'Contract', 'Part-time').required(),
  interviewDate: Joi.date(),
  rounds: Joi.array().items(roundSchema).min(1).required(),
  overallAdvice: Joi.string().allow(''),
  upvotes: Joi.number().default(0),
  comments: Joi.array().items(Joi.string()), 
  createdAt: Joi.date().default(Date.now),
  updatedAt: Joi.date().default(Date.now)
});



const hackathonSchema=Joi.object({
    title:Joi.string().required(),
    date:Joi.date().required(),
    type:Joi.string().valid('Online','Offline').required(),
    theme:Joi.string().required(),
    skills:Joi.string().required(),

    venue: Joi.when('type', {
    is: 'Offline',
    then: Joi.string().required().messages({
      'string.empty': 'Venue is required for offline hackathons',
      'any.required': 'Venue is required for offline hackathons'
    }),
    otherwise: Joi.string().allow('')
  }),
  group_member:Joi.number().required(),
  regiterteam: Joi.array().items(Joi.string()),
  createdAt: Joi.date()
})

module.exports = {
  placementDriveSchema,
  applicationSchema,
  roundSchema, 
  interviewExperienceSchema,
  hackathonSchema
};

