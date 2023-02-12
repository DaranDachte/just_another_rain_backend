import express, { request, Router } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import emailService from "./services/emailService.js";

const { Schema, model } = mongoose;

dotenv.config();
const PORT = process.env.PORT || 3002;

const app = express();

app.use(express.json());
app.use(cors());
mongoose.set("strictQuery", true);

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/${process.env.DB_NAME}?retryWrites=true&w=majority`
  )
  .then(() => {
    console.log("we are connected to the database.");
  })
  .catch((error) => {
    console.log("an error occurred while connecting ot the db", error);
  });

app.listen(PORT, (req, res) => {
  console.log(`the server listening on port ${PORT}`);
});

// Schema
const questionsSchema = new Schema({
  topic: {
    type: String,
    required: true,
    enum: {
      values: [
        "I have depression",
        "Question for a lawyer",
        "Social help",
        "Work in Germany",
        "Education",
        "Medicine and health",
        "Violence in family",
        "Other",
      ],
    },
  },
  name: { type: String, required: true },
  text: { type: String, required: true },
});

// Model
const Question = model("Question", questionsSchema);

// Routing
const router = Router();
router.post("/questions", async (req, res) => {
  const { topic, name, text, email } = req.body;

  try {
    const question = await Question.create({ topic, name, text });
    // emailService.sendEmail(email);
    res.json(question);
  } catch (error) {
    console.log("Error Message", error.message);
    res.status(500).json({ message: "Something went wrong!" });
  }
});

app.use("/", router);
