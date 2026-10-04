// import React, { useState, useEffect } from "react";
// import { words } from "../component/word";

// import correctSound from "./sounds/correct.mp3";
// import wrongSound from "./sounds/wrong.mp3";
// import clickSound from "./sounds/click.mp3";

// const correctAudio = new Audio(correctSound);
// const wrongAudio = new Audio(wrongSound);
// const clickAudio = new Audio(clickSound);

// export default function WordQuiz() {

//   const [index, setIndex] = useState(0);
//   const [score, setScore] = useState(0);
//   const [selected, setSelected] = useState(null);
//   const [time, setTime] = useState(15);
//   const [finished, setFinished] = useState(false);

//   const question = words[index];

//   useEffect(() => {

//     if(finished) return;

//     if(time === 0){
//       nextQuestion();
//       return;
//     }

//     const timer = setTimeout(()=>{
//       setTime(time-1);
//     },1000);

//     return ()=>clearTimeout(timer);

//   },[time]);

//   const handleAnswer=(answer)=>{

//     if(selected) return;

//     clickAudio.play();

//     setSelected(answer);

//     if(answer===question.correct){
//       correctAudio.play();
//       setScore(score+1);
//     }else{
//       wrongAudio.play();
//     }

//     setTimeout(()=>{
//       nextQuestion();
//     },1000);

//   }

//   const nextQuestion=()=>{

//     if(index===words.length-1){
//       setFinished(true);
//       return;
//     }

//     setIndex(index+1);
//     setSelected(null);
//     setTime(15);

//   }

//   const restart=()=>{
//     setIndex(0);
//     setScore(0);
//     setSelected(null);
//     setTime(15);
//     setFinished(false);
//   }

//   if(finished){

//     return(

//       <div className="flex h-screen items-center justify-center bg-slate-900 text-white">

//         <div className="rounded-xl bg-slate-800 p-8 text-center">

//           <h1 className="text-4xl font-bold">Quiz Finished 🎉</h1>

//           <p className="mt-5 text-2xl">

//             Score: {score}/{words.length}

//           </p>

//           <button

//             onClick={restart}

//             className="mt-6 rounded-lg bg-blue-600 px-6 py-3 hover:bg-blue-700"

//           >

//             Restart

//           </button>

//         </div>

//       </div>

//     )

//   }

//   return (

//     <div className="flex h-screen items-center justify-center bg-gradient-to-r from-blue-600 to-purple-700">

//       <div className="w-[500px] rounded-xl bg-white p-8 shadow-xl">

//         <div className="mb-4 flex justify-between">

//           <h2 className="font-bold">

//             Question {index+1}/{words.length}

//           </h2>

//           <h2>

//             Score : {score}

//           </h2>

//         </div>

//         <div className="mb-4 h-3 rounded bg-gray-200">

//           <div

//             style={{

//               width:`${(time/15)*100}%`

//             }}

//             className="h-full rounded bg-green-500 duration-1000"

//           />

//         </div>

//         <h1 className="mb-6 text-3xl font-bold">

//           {question.word}

//         </h1>

//         <p className="mb-4">

//           What does this word mean?

//         </p>

//         <div className="grid gap-4">

//           {question.options.map((option)=>(

//             <button

//               key={option}

//               onClick={()=>handleAnswer(option)}

//               className={`rounded-lg border p-4 text-left transition-all

//               ${
//                 selected===option

//                 ?option===question.correct

//                 ?"bg-green-500 text-white"

//                 :"bg-red-500 text-white"

//                 :"hover:bg-blue-100"

//               }

//               `}

//             >

//               {option}

//             </button>

//           ))}

//         </div>

//         <div className="mt-6 text-center font-bold">

//           ⏰ {time}s

//         </div>

//       </div>

//     </div>

//   );

// }



import React, { useState, useEffect } from "react";
import { words } from "../component/word";

const CLICK_SOUND_URL = "https://www.soundjay.com/buttons/sounds/button-16.mp3";
const CORRECT_SOUND_URL = "https://www.soundjay.com/buttons/sounds/button-4.mp3";
const WRONG_SOUND_URL = "https://www.soundjay.com/buttons/sounds/button-10.mp3";

const playSound = (url) => {
  if (typeof Audio === "undefined") return;

  const audio = new Audio(url);
  audio.volume = 0.5;
  audio.play().catch(() => {});
};

export default function WordQuiz() {
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [time, setTime] = useState(15);
  const [finished, setFinished] = useState(false);

  const question = words[index];

  useEffect(() => {
    if (finished) return;

    if (time === 0) {
      nextQuestion();
      return;
    }

    const timer = setTimeout(() => {
      setTime((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [time, finished]);

  const handleAnswer = (answer) => {
    if (selected) return;

    playSound(CLICK_SOUND_URL);
    setSelected(answer);

    if (answer === question.correct) {
      playSound(CORRECT_SOUND_URL);
      setScore((prev) => prev + 1);
    } else {
      playSound(WRONG_SOUND_URL);
    }

    setTimeout(() => {
      nextQuestion();
    }, 1000);
  };

  const nextQuestion = () => {
    if (index === words.length - 1) {
      setFinished(true);
      return;
    }

    setIndex((prev) => prev + 1);
    setSelected(null);
    setTime(15);
  };

  const restart = () => {
    setIndex(0);
    setScore(0);
    setSelected(null);
    setTime(15);
    setFinished(false);
  };

  if (finished) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-900 text-white">
        <div className="rounded-xl bg-slate-800 p-8 text-center">
          <h1 className="text-4xl font-bold">Quiz Finished 🎉</h1>

          <p className="mt-5 text-2xl">
            Score: {score}/{words.length}
          </p>

          <button
            onClick={restart}
            className="mt-6 rounded-lg bg-blue-600 px-6 py-3 hover:bg-blue-700"
          >
            Restart
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-r from-blue-600 to-purple-700">
      <div className="w-[500px] rounded-xl bg-white p-8 shadow-xl">
        <div className="mb-4 flex justify-between">
          <h2 className="font-bold">
            Question {index + 1}/{words.length}
          </h2>

          <h2>Score: {score}</h2>
        </div>

        <div className="mb-4 h-3 rounded bg-gray-200">
          <div
            style={{
              width: `${(time / 15) * 100}%`,
            }}
            className="h-full rounded bg-green-500 transition-all duration-1000"
          />
        </div>

        <h1 className="mb-6 text-3xl font-bold">{question.word}</h1>

        <p className="mb-4">What does this word mean?</p>

        <div className="grid gap-4">
          {question.options.map((option) => (
            <button
              key={option}
              onClick={() => handleAnswer(option)}
              className={`rounded-lg border p-4 text-left transition-all ${
                selected === option
                  ? option === question.correct
                    ? "bg-green-500 text-white"
                    : "bg-red-500 text-white"
                  : "hover:bg-blue-100"
              }`}
            >
              {option}
            </button>
          ))}
        </div>

        <div className="mt-6 text-center font-bold">
          ⏰ {time}s
        </div>
      </div>
    </div>
  );
}