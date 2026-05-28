import React, { useState, useEffect, useRef } from 'react'
import './App.css'
import Chart from './Chart'
export default function App() {
  const [count, setCount] = useState(10)
  const [havePunctuation,setHavePunctuation] = useState(false)
  const [haveNumbers,setHaveNumbers] = useState(false)
  const [time,setTime] = useState(10)
  const [promptTxt,setPrompt] = useState<string>('')
  const [userInput,setUserInput] = useState<string>('')
  const userInputRef = useRef<string>('')
  const [textColor,setTextColor] = useState('text-slate-900')
  const [punctuation,setPunctuation] = useState(['.',',','!','?',';','&#','@','$','%','&','(',')'])
  const [numbers,setNumbers] = useState(['0','1','2','3','4','5','6','7','8','9'])
  const [start,setStart] = useState(false)
  const [remainingTime,setRemainingTime] = useState(time)
  const [page,setPage] = useState<string>('test')
  const [userWPM,setUserWPM] = useState<Number>(0)
  const [chartData,setChartData] = useState<any>([[],[]])
  const [wordsTyped,setWordsTyped] = useState<Number>(0)
  const [correct,setCorrect] = useState<any>([0,0])
  async function generateWords(amount:number,havePunctuation:boolean,haveNumbers:boolean){
    setPrompt('')
    let tmp:string[] = []
    for(let i = 0; i < amount; i++){
      const res = await fetch(`https://random-words-api.kushcreates.com/api?language=en&words=${count}`)
      const data = await res.json()
      for(let x = 0; x < data.length; x++){
        if(havePunctuation === true){
          const randomPunctuation = punctuation[Math.floor(Math.random() * punctuation.length)]
          data[x].word = data[x].word + randomPunctuation
        }
        if(haveNumbers === true){
          const randomNumber = numbers[Math.floor(Math.random() * numbers.length)]
          data[x].word = data[x].word + ' ' + randomNumber
        }
        if(tmp.length < amount){
          tmp.push(data[x].word)
        }
      }
    }
    setPrompt(tmp.join(' '))
  }
  function calculateResults(){
    let score = 0
    const trimmedInput = (userInputRef.current || '').trim()
    if(trimmedInput === '') return 0
    const userInp: string[] = trimmedInput.split(/\s+/).filter(Boolean)
    const ansInput: string[] = promptTxt.split(/\s+/).filter(Boolean)
    const len = Math.min(userInp.length, ansInput.length)
    for(let i = 0; i < len; i++){
      if(ansInput[i] === userInp[i]){
        score++
      }
    }
    const wpm = Number(((score / time) * 60).toFixed(0))
    setUserWPM(wpm)
    setWordsTyped(userInp.length)
    setCorrect([score, userInp.length])
    return score
  }
  function countdown(){
    let timeLeft = time
    const interval = setInterval(()=>{
      if(timeLeft <= 0){
        clearInterval(interval)
        calculateResults()
        setPage('results')
        setStart(false)
      }
      timeLeft--;
      setRemainingTime(timeLeft)
    },1000)
  }
  function reset(){
    setPage('test')
    setPrompt('')
    setUserInput('')
    setRemainingTime(time)
    generateWords(count,havePunctuation,haveNumbers)
  }
  function changeChartData(timestamp:Number){
    const inp = userInputRef.current.split(' ')
    const x = time - Number(timestamp)
    setChartData((prev:any) => {
      if(prev[0].includes(x)) return prev
      return [[...prev[0], x],[...prev[1], Number(((inp.length / time) * 60).toFixed(0))]]
    })
  }
  function returnChart(){
    let d:any = {
      labels:[],
      datasets:[
        {
          label:"WPM",
          data:[],
          borderColor:'rgb(75,192,75)',
          fill:true
        }
      ]
    }
    d.datasets[0].data = chartData[1]
    d['labels'] = chartData[0]
    return d
  }
  useEffect(()=>{
    generateWords(count,havePunctuation,haveNumbers)
    setNumbers(numbers)
    setPunctuation(punctuation)
    setTextColor(textColor)
  },[])
  useEffect(()=>{
    userInputRef.current = userInput
  },[userInput])
  return (
    <div>
      {page === 'test' && (
        <div className={`${textColor} min-h-screen bg-slate-50 p-6`}>
        <h1 className='text-xl text-center'>TYpE</h1>
      <div className='max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6'>
        <div className={`bg-white ${textColor} p-2 rounded-2xl shadow flex flex-col`}>
    <h1 className='text-sm text-slate-500 text-center'>Time (1-60seconds)</h1>
    <input type='number' value={time} onChange={(e) => {
      setTime(parseInt(e.target.value) || 0)
      setRemainingTime(parseInt(e.target.value)||0)
      }} className={`[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none text-center mt-1 block w-full rounded-md border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400`} required placeholder='1-60'/>
    </div>
    <div className={`bg-white ${textColor} p-2 rounded-2xl shadow flex flex-col`}>
    <h1 className='text-sm text-slate-500 text-center'>Word count(1-100)</h1>
    <input type='number' value={count} onChange={(e) => {
      setCount(parseInt(e.target.value) || 0)
      generateWords(parseInt(e.target.value) || 0, havePunctuation, haveNumbers)
    }} className={`[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none text-center mt-1 block w-full rounded-md border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400`} required placeholder='1-100'/>
    </div>
    <div className={`bg-white ${textColor} p-4 rounded-2xl shadow flex flex-col`}>
    <h1 className='text-sm text-slate-500 text-center mb-2'>Include punctuation</h1>
    <label className="inline-flex items-center cursor-pointer self-center">
      <input
        type="checkbox"
        checked={havePunctuation}
        onChange={(e) => setHavePunctuation(e.target.checked)}
        className="sr-only peer"
        aria-label="Include punctuation"
      />
      <div className="w-6 h-6 rounded-md border border-gray-300 flex items-center justify-center mr-2
                      peer-checked:bg-indigo-500 peer-checked:border-indigo-500 transition-colors">
        <svg className="hidden w-4 h-4 text-white peer-checked:block" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
          <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </label>
    </div>
    <div className={`bg-white ${textColor} p-4 rounded-2xl shadow flex flex-col`}>
    <h1 className='text-sm text-slate-500 text-center mb-2'>Include numbers</h1>
    <label className="inline-flex items-center cursor-pointer self-center">
      <input
        type="checkbox"
        checked={haveNumbers}
        onChange={(e) => setHaveNumbers(e.target.checked)}
        className="sr-only peer"
        aria-label="Include numbers"
      />
      <div className="w-6 h-6 rounded-md border border-gray-300 flex items-center justify-center mr-2
                      peer-checked:bg-indigo-500 peer-checked:border-indigo-500 transition-colors">
        <svg className="hidden w-4 h-4 text-white peer-checked:block" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
          <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      </label>
    </div>
    </div>
    <div className={`p-6 ${textColor}`}>
      <button onClick={()=>reset()}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-repeat text-center" viewBox="0 0 16 16">
  <path d="M11 5.466V4H5a4 4 0 0 0-3.584 5.777.5.5 0 1 1-.896.446A5 5 0 0 1 5 3h6V1.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384l-2.36 1.966a.25.25 0 0 1-.41-.192m3.81.086a.5.5 0 0 1 .67.225A5 5 0 0 1 11 13H5v1.466a.25.25 0 0 1-.41.192l-2.36-1.966a.25.25 0 0 1 0-.384l2.36-1.966a.25.25 0 0 1 .41.192V12h6a4 4 0 0 0 3.585-5.777.5.5 0 0 1 .225-.67Z"/>
</svg></button>
      <h2 className='text-xl text-center'>{remainingTime}s remaining. {start === false? 'Type to start!':''}</h2>
      <h1 className='text-xl'>{promptTxt.split(' ').length !== count? 'Generating...' : promptTxt}</h1>
    </div>
    <div className={`p-6 ${textColor}`}>
      <textarea value={userInput} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>{ 
        const val = e.target.value
        setUserInput(val)
        changeChartData(remainingTime)
        if(!start){
          countdown()
          setStart(true)
        }
      }} className="text-xl resize-none border border-black mt-1 block w-full rounded-md border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-400" required rows={8} />
    </div>
    </div>
      )}
      {page === 'results' && (
        <main className='lg:col-span-3 space-y-6 p-6'>
          <section className='grid grid-cols-1 sm:grid-cols-4 gap-4'>
            <div className='bg-white p-4 rounded-2xl shadow flex flex-col'>
              <div className="text-sm text-slate-500">WPM</div>
              <div className="mt-2 text-xl font-semibold">{String(userWPM)} words/minute</div>
            </div>
            <div className='bg-white p-4 rounded-2xl shadow flex flex-col'>
              <div className="text-sm text-slate-500">Words typed</div>
              <div className="mt-2 text-xl font-semibold">{String(wordsTyped)} words</div>
            </div>
            <div className='bg-white p-4 rounded-2xl shadow flex flex-col'>
              <div className="text-sm text-slate-500">Accuracy</div>
              <div className="mt-2 text-xl font-semibold">{String(Math.round((correct[0] / correct[1]) * 100))}%<br></br>{correct[1] - correct[0]} wrong</div>
            </div>
            <div className='bg-white p-4 rounded-2xl shadow flex flex-col'>
              <div className="text-sm text-slate-500">Test settings</div>
              <div className="mt-2 text-xl font-semibold">{havePunctuation === true? 'Punctuation✅':'Punctuation❌'}<br></br>{haveNumbers === true? "Numbers✅":'Numbers❌'}<br></br>{String(time)} seconds</div>
            </div>
          </section>
          <div className="mt-6 h-auto rounded-lg flex items-center justify-center text-slate-400">
                <Chart data={returnChart()}/>
          </div>
          <div className="mt-6 h-auto rounded-lg flex items-center justify-center text-slate-400">
                <button onClick={()=>reset()}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-repeat" viewBox="0 0 16 16">
  <path d="M11 5.466V4H5a4 4 0 0 0-3.584 5.777.5.5 0 1 1-.896.446A5 5 0 0 1 5 3h6V1.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384l-2.36 1.966a.25.25 0 0 1-.41-.192m3.81.086a.5.5 0 0 1 .67.225A5 5 0 0 1 11 13H5v1.466a.25.25 0 0 1-.41.192l-2.36-1.966a.25.25 0 0 1 0-.384l2.36-1.966a.25.25 0 0 1 .41.192V12h6a4 4 0 0 0 3.585-5.777.5.5 0 0 1 .225-.67Z"/>
</svg></button>
          </div>
        </main>
      )}
    </div>
  )
}