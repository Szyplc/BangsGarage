import { useEffect, useState } from "react";
import './QuestionForm.css'

interface SurveyQuestion {
  question: string;
}

interface SurveyAnswer {
  question: string;
  answer: string;
}

let surveyQuestions: SurveyQuestion[] = []

const QuestionForm = ({ data = [] }) => {
  const [survey, setSurvey] = useState<SurveyAnswer[]>([]);
  surveyQuestions = data

  const handleAnswer = (question: string, answer: string) => {
    const updatedSurvey = survey.filter((item) => item.question !== question);
    updatedSurvey.push({ question, answer });
    setSurvey(updatedSurvey);
  };

  const isAnswerSelected = (question: string, answer: string) => {
    const selectedAnswer = survey.find((item) => item.question === question);
    return selectedAnswer && selectedAnswer.answer === answer;
  };

  return (
    <div className="survey-container">
      <h2>Ankieta</h2>
      <div className="survey-questions">
        {surveyQuestions.map((question) => (
          <div key={question.question} className="survey-question">
            <p>{question.question}</p>
            <div className="answer-buttons">
              <button
                onClick={() => handleAnswer(question.question, "Tak")}
                className={isAnswerSelected(question.question, "Tak") ? "selected" : ""}
              >
                Tak
              </button>
              <button
                onClick={() => handleAnswer(question.question, "Nie")}
                className={isAnswerSelected(question.question, "Nie") ? "selected" : ""}
              >
                Nie
              </button>
            </div>
          </div>
        ))}
      </div>
      <h2>Wyniki ankiety</h2>
      {survey.map((answer) => (
        <p key={answer.question}>
          {answer.question}: {answer.answer}
        </p>
      ))}
    </div>
  );
};

export default QuestionForm;
