import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Get_given_tests } from "../../../Firebase/GivenTestHandler";

const TestGiven = ({ getState }) => {
  let myList = ["bg-blue-600", "bg-red-500", "bg-pink-400", "bg-orange-500"];
  const [state, setState] = useState(getState);
  const [bgColor, setbgColor] = useState("bg-white");
  const [text, setText] = useState("text-black");
  const [shadow, setShadow] = useState("shadow-sky-500");
  const [Tests, setTests] = useState([]);
  useEffect(() => {
    setState(getState);
  }, [getState]);

  useEffect(() => {
    if (state === 0) {
      setbgColor("bg-white");
      setText("text-black");
      setShadow("shadow-sky-500");
    } else if (state === 1) {
      setbgColor("bg-black");
      setText("text-white");
      setShadow("shadow-purple-500");
    }
  }, [state]);

  useEffect(() => {
    const get_given_tests = async () => {
      const data = await Get_given_tests();
      setTests(data);
    };
    get_given_tests();
  }, []);

  const Navigate = useNavigate();

  const HandleNavigaton = (test_id) =>{
    Navigate('/quiz/result', {state: test_id});
  }

  return (
    <>
      <div
        className={`inline-block p-4 m-2 shadow-2xl ${shadow} rounded-xl ${bgColor}`}
      >
        <div>
          <p className={`font-bold ${text}`}>Tests Given</p>
        </div>
        <div className="grid grid-cols-2 gap-12 p-2">
          {Tests.length === 0 ? (
            <div
              className={`${myList.at(
                1
              )} w-32 h-32 flex items-center justify-center shadow-lg rounded-xl relative shadow-red-500 hover:shadow-red-600 hover:cursor-pointer`}
            >
              <div className="absolute inset-0 bg-opacity-50 bg-gray-500 rounded-xl"></div>
              <p className="font-bold text-white">No Tests Given</p>
            </div>
          ) : (
            Tests.map((test, index) => (
              <div
                key={index}
                className={`${myList.at(
                  index % myList.length
                )} w-32 h-32 flex items-center justify-center shadow-lg rounded-xl relative shadow-red-500 hover:shadow-red-600 hover:cursor-pointer`}
              >
                <div className="absolute inset-0 bg-opacity-50 bg-gray-500 rounded-xl" onClick={()=>HandleNavigaton(test)}></div>
                <p className="font-bold text-white">{test}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default TestGiven;
