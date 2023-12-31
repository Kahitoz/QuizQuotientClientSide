import { useEffect, useState } from "react";
import { json, useNavigate } from "react-router-dom";
import { SaveAnswers } from "../../../Firebase/TestHandler";
import { GetPaymentAmount } from "../../../Firebase/PaymentCheck";
import { CheckIfPaymentExists } from "../../../Firebase/PaymentCheck";
import { CheckIfStatusIsConfirmed } from "../../../Firebase/PaymentCheck";

const TestInfoModal = ({ modalOpen, TestDetails }) => {
  const Navigate = useNavigate();
  const [name, setName] = useState("");
  const [totalQuestions, setTotalQuestions] = useState("");
  const [topic, setTopic] = useState("");
  const [duration, setDuration] = useState("");
  const [st, setSt] = useState("");
  const [et, setEt] = useState("");
  const [date, setDate] = useState("");
  const [amount, setAmount] = useState("");
  const [cost, setCost] = useState("");
  const [status, setStatus] = useState(5);
  const handleNavigation = async () => {
    if (status === 2) {
      Navigate("/PaymentGateway", { state: { name, cost } });
    } else if (status === 3) {
      alert("Your payment is under process");
    } else if (status === 1) {
      const check = check_date_and_time(st, et, date);
      if (check === false) {
        alert("Test not started yet");
      } else {
        const questions = parseInt(totalQuestions);
        let arr = {};
        for (let i = 0; i < questions; i++) {
          arr[i] = 5;
        }
        const data = JSON.stringify(arr);
        localStorage.setItem("Answer", data);
        localStorage.setItem("duration", duration);
        await SaveAnswers(name, data);
        Navigate("/quiz", { state: { name } });
      }
    }
  };
  useEffect(() => {
    const r_data = JSON.parse(TestDetails);

    const setFunction = async () => {
      if (typeof r_data === json) {
        const data = r_data;
        setName(data.test);
        setTotalQuestions(data.questions);
        setDuration(data.duration);
        setTopic(data.name);
        setSt(data.st);
        setEt(data.ed);
        setDate(data.date);
        const cost = await GetPaymentAmount(data.test);
        setCost(cost);
        const string = "Please Pay ₹" + cost + " to enroll";
        setAmount(string);
        setStatus(2);
      } else {
        try {
          const data = typeof r_data === "string" ? JSON.parse(r_data) : r_data;
          setName(data.test);
          setTotalQuestions(data.questions);
          setDuration(data.duration);
          setTopic(data.name);
          setSt(data.st);
          setEt(data.ed);
          setDate(data.date);
          const bool1 = await CheckIfPaymentExists(data.test);
          if (bool1 === false) {
            setStatus(2);
            const cost = await GetPaymentAmount(data.test);
            setCost(cost);
            const string = "Please Pay ₹" + cost + " to enroll";
            setAmount(string);
          } else if (bool1 === true) {
            const bool2 = await CheckIfStatusIsConfirmed(data.test);
            if (bool2 === true) {
              setStatus(1);
              setAmount("Start Now")
            } else {
              setStatus(3);
              setAmount("Awaiting Confirmation");
            }
          }
        } catch (error) {
          alert(" Retry Network Issue!!!!");
          console.log(error);
        }
      }
    };
    setFunction();
  }, []);

  return (
    <>
      {modalOpen && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-opacity-50 bg-gray-500 p-2">
          <div className="bg-blue-200 p-4 rounded-lg shadow-xl max-h-full overflow-y-auto">
            <button
              onClick={() => modalOpen(false)}
              className="flex bg-gray-100 p-1 rounded-sm font-bold"
            >
              X
            </button>
            <div className={`m-2 p-2`}>
              <p className={`font-bold`}>{name}</p>
            </div>
            <div className={`m-2 p-2`}>
              <p className={``}>Read the instructions carefully</p>
            </div>
            <div className={`m-2 p-2`}>
              <div>
                <p className={``}>Number of questions - {totalQuestions}</p>
                <p className={``}>Total Time - {duration} minutes</p>
                <p className={``}>Type - Objective</p>
                <p className={``}>Topics -{topic}</p>
              </div>
            </div>
            <div className={`m-2 p-2`}>
              <div className={`m-2 p-2`}>
                <p className={`font-bold`}>Test Date & Time: {date} </p>
                <p className={`font-bold`}>
                  {st} to {et}{" "}
                </p>
              </div>

              <div
                className="bg-blue-600 m-2 p-1 block rounded-lg cursor-pointer hover:bg-blue-400"
                onClick={() => handleNavigation()}
              >
                <p className="text-white">{amount}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default TestInfoModal;

function check_date_and_time(st, et, date) {
  // Get current date and time
  var currentDate = new Date();

  // Extract time components from start and end times
  var startTime = new Date(date + "T" + st);
  var endTime = new Date(date + "T" + et);

  // Compare current time with start and end times
  if (currentDate >= startTime && currentDate <= endTime) {
    return true;
  } else {
    return false;
  }
}
