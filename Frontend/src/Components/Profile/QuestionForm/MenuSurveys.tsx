import React, { useState } from "react";
import QuestionForm from "./QuestionForm";

interface Survey {
  title: string;
  component: React.ReactNode;
  data: any; // Dodatkowe pole przechowujące dane dla danej ankiety
}

const surveyList: Survey[] = [
  {
    title: "Ankieta 1",
    component: <QuestionForm />,
    data: [
        { question: "Czy lubisz programować?" },
        { question: "Czy preferujesz herbatę czy kawę?" },
        { question: "Czy wolisz psy czy koty?" },
        // Dodaj więcej pytań ankietowych...
      ],
  },
  {
    title: "Ankieta 2",
    component: <QuestionForm />,
    data: [
        { question: "PS4 czy xbox" },
        { question: "jabłko czy gruszka" },
        { question: "Sebek czy Madzia" },
        // Dodaj więcej pytań ankietowych...
      ],
  },
  {
    title: "Ankieta 3",
    component: <QuestionForm />,
    data: [
        { question: "Wilk czy dzik" },
        { question: "Siaknie na stojąco czy siedząco" },
        { question: "lewo czy prawo ręczyny" },
        // Dodaj więcej pytań ankietowych...
      ],
  },
  // Dodaj więcej ankiet...
];

const MenuSurveys: React.FC = () => {
  const [selectedSurvey, setSelectedSurvey] = useState<Survey | null>(null);

  const handleSurveySelection = (survey: Survey) => {
    setSelectedSurvey(survey);
  };

  return (
    <div>
      <h2>Menu wyboru ankiet</h2>
      <ul>
        {surveyList.map((survey) => (
          <li key={survey.title}>
            <button onClick={() => handleSurveySelection(survey)}>{survey.title}</button>
          </li>
        ))}
      </ul>
      {selectedSurvey && (
        <div>
          <h2>Wybrana ankieta</h2>
          {/* Przekazanie danych do komponentu QuestionForm */}
          <QuestionForm data={selectedSurvey.data} />
        </div>
      )}
    </div>
  );
};

export default MenuSurveys;
