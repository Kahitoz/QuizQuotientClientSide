import { useEffect, useState } from "react";
import Navbar from "../Components/Navbar";
import QuestionStatusHolder from "./Components/QuestionStatusHolder";
import QuestionHolder from "./Components/QuestionHolder";
import { Reterieve_question } from "../../Firebase/TestHandler";
import { useLocation, useNavigate } from "react-router-dom";
import { SaveAnswers } from "../../Firebase/TestHandler";

const QuizScreen = () => {
  let stateVal = localStorage.getItem("web_state");
  if (stateVal === null) {
    stateVal = "0";
  }
  const [state, setState] = useState(parseInt(stateVal));
  const [background, setBackGround] = useState("bg-black");
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [time, setTime] = useState("");
  const [total, setTotal] = useState(0);
  const [selectBox, setSelectedBox] = useState(null);
  const [Question, AddQuestion] = useState([]);
  const [OptionHandler, SetOptionHandler] = useState({});

  const location = useLocation();
  const testName = location.state?.name || "No Name"; 

  const handleSelectBox = (boxNumber) => {
    setSelectedBox(boxNumber);
  };

  const HandleOptionChange = (boxNumber, option) => {
    SetOptionHandler((prevOption) => ({
      ...prevOption,
      [boxNumber]: option,
    }));
  };

  const updateState = (state) => {
    if (state === 0) {
      setState(1);
    }
    if (state === 1) {
      setState(0);
    }
  };

  useEffect(() => {
    if (state === 0) {
      setBackGround("bg-white");
    }
    if (state === 1) {
      setBackGround("bg-sky-900");
    }
  }, [state]);

  useEffect(() => {
    const getQuestions = async () => {
      const data = await Reterieve_question(testName);
      const duration = data.duration;
      setTime(duration);
      const question = data.Question;
      const QuestionData = [];
      for (let i = 0; i < question.length; i++) {
        QuestionData.push(JSON.parse(question[i]));
      }
      AddQuestion(QuestionData);
      const totalQuestion = data.total;
      console.log("These are the total Qutestions = ",data);
      setTotal(QuestionData.length);
    };
    getQuestions();
  }, []);

  const startTimer = (initialMinutes) => {
    setMinutes(initialMinutes);
    setSeconds(0);
  };

  useEffect(() => {
    let timer;
    if (minutes > 0 || seconds > 0) {
      timer = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            clearInterval(timer);
            alert("Time is up!");
          } else {
            setMinutes((prevMinutes) => prevMinutes - 1);
            setSeconds(59);
          }
        } else {
          setSeconds((prevSeconds) => prevSeconds - 1);
        }
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [minutes, seconds]);

  useEffect(() => {
    startTimer(time);
  }, []);

  const handleSubmission = () => {
    const userConfirmed = window.confirm("Are you sure you want to submit?");
    
    if (userConfirmed) {
      // User clicked "Yes"
      alert("Submitting data...");
      handleSubmit();
      // Perform your submit logic here
    } else {
      // User clicked "No" or closed the dialog
      alert("Submission canceled.");
      // Handle the cancellation or perform other actions
    }
  };

  const navigate = useNavigate();

async function handleSubmit(){
  const selectedOptions = JSON.stringify(OptionHandler);
  await SaveAnswers(testName, selectedOptions);
  navigate('/home');
  }


  return (
    <>
      <div className={`border border-black ${background} h-screen`}>
        <div>
          <Navbar updateState={updateState} />
        </div>
        <div className="text-2xl mb-4 text-white">
          {" "}
          Time left -{String(minutes).padStart(2, "0")}:
          {String(seconds).padStart(2, "0")}
        </div>
        <div className={`flex justify-evenly`}>
          <div>
            <QuestionStatusHolder
              state={state}
              total={total}
              onSelectBox={handleSelectBox}
            />
          </div>
          <div className={`w-full`}>
            <QuestionHolder
              state={state}
              selected={selectBox}
              QuestionDetails={Question[selectBox - 1]}
              option={OptionHandler}
              onOptionChange={HandleOptionChange}
            />
          </div>
        </div>
        <div>
          <button className="bg-red-600 text-white p-2 rounded-xl"
          onClick={()=>handleSubmission()}>
            Finish Attempt
          </button>
        </div>
      </div>
    </>
  );
};
export default QuizScreen;
